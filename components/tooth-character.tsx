'use client';

import { useEffect, useRef } from 'react';

import gazeFrames from './gaze-frames.json';
import { cn } from '@/lib/utils';

const TAU = Math.PI * 2;
const wrappedAngle = (angle: number) => (angle % TAU + TAU) % TAU;

// Midpoint between the character's pupils, as a fraction of the clip's frame,
// so the maths holds whatever resolution the clip is encoded at.
const EYE = { x: 948 / 1920, y: 418 / 1080 };

// These angles come from the pupil positions in the clip: the pupils travel one
// full orbit across it, so matching direction means picking the right frame.
function timeForAngle(angle: number) {
  const target = wrappedAngle(angle);
  let nearestTime = gazeFrames[0][1];
  let nearestDistance = Infinity;
  for (const [sampleAngle, time] of gazeFrames) {
    const difference = Math.abs(target - sampleAngle);
    const distance = Math.min(difference, TAU - difference);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTime = time;
    }
  }
  return nearestTime + 1 / 240;
}

/**
 * The tooth. On a pointer device the clip stays paused and each cursor move
 * seeks to the frame whose pupils point that way; on touch it just loops.
 */
export function ToothCharacter({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current!;
    let frame = 0;
    let desiredTime = 0;
    let pointer: { x: number; y: number } | null = null;
    let onScreen = true;
    let disposed = false;
    let idleTimer = 0;
    let idling = false;
    const coarse = window.matchMedia('(pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scrubs = () => !coarse.matches && !reducedMotion.matches;

    // With the cursor still, the character keeps looking around on its own, so
    // it reads as alive rather than frozen.
    const startIdle = () => {
      if (disposed || idling || !onScreen || !scrubs()) return;
      idling = true;
      video.loop = true;
      video.playbackRate = 0.45;
      void video.play().catch(() => { /* A paused frame is fine. */ });
    };
    const stopIdle = () => {
      if (!idling) return;
      idling = false;
      video.pause();
    };
    const restartIdleTimer = () => {
      window.clearTimeout(idleTimer);
      if (scrubs() && onScreen) idleTimer = window.setTimeout(startIdle, 2200);
    };

    const seek = () => {
      frame = 0;
      if (disposed || !scrubs() || video.readyState < 2 || video.seeking) return;
      if (Math.abs(video.currentTime - desiredTime) > 1 / 48) {
        video.currentTime = Math.min(desiredTime, video.duration - 1 / 24);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(seek);
    };
    const updateTarget = () => {
      if (!onScreen || !pointer || !scrubs()) return;
      const rect = video.getBoundingClientRect();
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      // Mirror object-fit: cover to find where the eyes ended up on screen.
      const scale = Math.max(rect.width / width, rect.height / height);
      const eyeX = rect.left + rect.width / 2 + (EYE.x - 0.5) * width * scale;
      const eyeY = rect.top + rect.height / 2 + (EYE.y - 0.5) * height * scale;
      const dx = pointer.x - eyeX;
      const dy = pointer.y - eyeY;
      // Ignore the dead zone right between the eyes, where the angle is noisy.
      if (Math.hypot(dx, dy) > 8) {
        desiredTime = timeForAngle(Math.atan2(dy, dx));
        schedule();
      }
    };
    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      stopIdle();
      restartIdleTimer();
      updateTarget();
    };
    const ready = () => {
      const loops = !scrubs();
      video.loop = loops;
      if (loops && !reducedMotion.matches && onScreen) {
        video.playbackRate = 1;
        void video.play().catch(() => { /* Keep the first frame if autoplay is unavailable. */ });
      } else {
        stopIdle();
        video.pause();
        updateTarget();
        schedule();
        restartIdleTimer();
      }
    };

    // Nothing to compute while the character is scrolled out of view.
    const watcher = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          ready();
        } else {
          stopIdle();
          window.clearTimeout(idleTimer);
          video.pause();
        }
      },
      { rootMargin: '200px' },
    );
    watcher.observe(video);

    video.addEventListener('seeked', schedule);
    video.addEventListener('loadeddata', ready);
    coarse.addEventListener('change', ready);
    reducedMotion.addEventListener('change', ready);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, { passive: true });
    if (video.readyState >= 2) ready();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      watcher.disconnect();
      video.removeEventListener('seeked', schedule);
      video.removeEventListener('loadeddata', ready);
      coarse.removeEventListener('change', ready);
      reducedMotion.removeEventListener('change', ready);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget);
    };
  }, []);

  return (
    <div className={cn('tooth-character', className)} aria-hidden="true">
      {/* The poster keeps the character on screen even where the clip cannot
          be decoded or autoplay is refused. */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        poster="/tooth-poster.webp"
        src="/tooth-scrub.mp4"
      />
    </div>
  );
}
