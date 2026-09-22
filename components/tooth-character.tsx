'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

// The character is drawn straight into the page: no video file to decode, so
// it shows up everywhere and the eyes can follow the cursor frame by frame.
const TOOTH =
  'M660 460 C660 300 750 230 880 230 C925 230 945 252 960 252 C975 252 995 230 1040 230 ' +
  'C1170 230 1260 300 1260 460 C1260 540 1245 572 1230 620 C1205 700 1180 830 1150 900 ' +
  'C1130 946 1080 950 1055 905 C1030 860 1010 760 990 712 C978 684 942 684 930 712 ' +
  'C910 760 890 860 865 905 C840 950 790 946 770 900 C740 830 715 700 690 620 ' +
  'C675 572 660 540 660 460 Z';
const LEFT_ARM = 'M706 556 C676 640 760 716 878 706';
const RIGHT_ARM = 'M1214 556 C1244 640 1160 716 1042 706';
const HEART =
  'M50 88 C22 66 4 50 4 32 C4 18 15 8 28 8 C38 8 46 14 50 22 C54 14 62 8 72 8 ' +
  'C85 8 96 18 96 32 C96 50 78 66 50 88 Z';

const EYES = [
  { id: 'left', x: 858, y: 418 },
  { id: 'right', x: 1038, y: 418 },
];
const ORBIT = 27;

export function ToothCharacter({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupils = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let frame = 0;
    let idleFrame = 0;
    let idleTimer = 0;
    let pointer: { x: number; y: number } | null = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const place = (index: number, dx: number, dy: number) => {
      const pupil = pupils.current[index];
      if (pupil) pupil.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
    };

    // Each pupil aims at the cursor on its own, which reads more alive than
    // moving both from one point.
    const aim = () => {
      frame = 0;
      const matrix = svg.getScreenCTM();
      if (!matrix || !pointer) return;
      EYES.forEach((eye, index) => {
        const point = new DOMPoint(eye.x, eye.y).matrixTransform(matrix);
        const dx = pointer!.x - point.x;
        const dy = pointer!.y - point.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 1) return place(index, 0, 0);
        // Ease the pupils home when the cursor sits right on the eye.
        const reach = ORBIT * Math.min(1, distance / 70);
        place(index, (dx / distance) * reach, (dy / distance) * reach);
      });
    };

    // With the cursor still, the eyes keep wandering so the character never
    // looks frozen.
    const idle = (time: number) => {
      const angle = (time / 2600) % (Math.PI * 2);
      const dx = Math.cos(angle) * ORBIT;
      const dy = Math.sin(angle) * ORBIT;
      EYES.forEach((_, index) => place(index, dx, dy));
      idleFrame = requestAnimationFrame(idle);
    };
    const stopIdle = () => {
      cancelAnimationFrame(idleFrame);
      idleFrame = 0;
    };
    const armIdle = () => {
      window.clearTimeout(idleTimer);
      if (reducedMotion.matches) return;
      idleTimer = window.setTimeout(() => {
        if (!idleFrame) idleFrame = requestAnimationFrame(idle);
      }, 2200);
    };

    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      stopIdle();
      armIdle();
      if (!frame) frame = requestAnimationFrame(aim);
    };
    const follow = () => {
      if (!idleFrame && !frame) frame = requestAnimationFrame(aim);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', follow);
    armIdle();

    return () => {
      cancelAnimationFrame(frame);
      stopIdle();
      window.clearTimeout(idleTimer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', follow);
      window.removeEventListener('resize', follow);
    };
  }, []);

  return (
    <div className={cn('tooth-character', className)}>
      <svg
        ref={svgRef}
        viewBox="620 190 680 830"
        role="img"
        aria-label="Зуб с сердечком, который следит за курсором"
      >
        <ellipse cx="960" cy="958" rx="245" ry="42" fill="#ddd8ef" opacity=".5" />

        {/* A slightly larger, paler body behind the main one stands in for the
            soft fur edge without an expensive filter. */}
        <path
          d={TOOTH}
          fill="#f1eefb"
          transform="translate(960 565) scale(1.022) translate(-960 -565)"
        />
        <path d={LEFT_ARM} stroke="#f1eefb" strokeWidth="58" strokeLinecap="round" fill="none" />
        <path d={RIGHT_ARM} stroke="#f1eefb" strokeWidth="58" strokeLinecap="round" fill="none" />

        <path d={TOOTH} fill="#fdfdff" stroke="#e3def3" strokeWidth="4" />

        <path d={HEART} transform="translate(880 612) scale(1.6)" fill="#ff9cc0" />
        <path
          d={HEART}
          transform="translate(880 612) scale(1.6)"
          fill="none"
          stroke="#f57ba7"
          strokeWidth="3.5"
        />
        <path
          d="M60 30 C48 41 42 52 42 62"
          transform="translate(880 612) scale(1.6)"
          stroke="#ffc4d9"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        <g>
          <path d={LEFT_ARM} stroke="#e9e4f7" strokeWidth="52" strokeLinecap="round" fill="none" />
          <path d={RIGHT_ARM} stroke="#e9e4f7" strokeWidth="52" strokeLinecap="round" fill="none" />
          <path d={LEFT_ARM} stroke="#f7f5fd" strokeWidth="44" strokeLinecap="round" fill="none" />
          <path d={RIGHT_ARM} stroke="#f7f5fd" strokeWidth="44" strokeLinecap="round" fill="none" />
          <circle cx="884" cy="702" r="36" fill="#f7f5fd" stroke="#e9e4f7" strokeWidth="4" />
          <circle cx="1036" cy="702" r="36" fill="#f7f5fd" stroke="#e9e4f7" strokeWidth="4" />
        </g>

        <ellipse cx="762" cy="508" rx="46" ry="27" fill="#ffb9d0" opacity=".6" />
        <ellipse cx="1148" cy="508" rx="46" ry="27" fill="#ffb9d0" opacity=".6" />

        {EYES.map((eye) => (
          <ellipse
            key={eye.id}
            cx={eye.x}
            cy={eye.y}
            rx="60"
            ry="64"
            fill="#f4f2fc"
            stroke="#ded9f0"
            strokeWidth="3"
          />
        ))}

        {EYES.map((eye, index) => (
          <g key={eye.id} transform={`translate(${eye.x} ${eye.y})`}>
            <g
              className="tooth-pupil"
              ref={(node) => {
                pupils.current[index] = node;
              }}
            >
              <circle r="26" fill="#191828" />
              <circle cx="-9" cy="-10" r="8" fill="#ffffff" opacity=".9" />
            </g>
          </g>
        ))}

        <path
          d="M906 522 Q948 572 990 522"
          stroke="#191828"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
