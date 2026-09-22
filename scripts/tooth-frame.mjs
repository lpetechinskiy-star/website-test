// Source of truth for the footer character clip.
//
// The frame is 1920x1080 so the page can keep the object-fit: cover math in
// app/footer-background.tsx untouched. The midpoint between the two pupils is
// exactly (948, 418) — the coordinates that component subtracts from the
// pointer position.

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 24;
export const FRAMES = 169; // 169 / 24 = 7.041667s, one full pupil orbit.
export const BACKGROUND = '#f0eefa';

export const LEFT_EYE = { x: 858, y: 418 };
export const RIGHT_EYE = { x: 1038, y: 418 };
export const EYE_MIDPOINT = {
  x: (LEFT_EYE.x + RIGHT_EYE.x) / 2, // 948
  y: (LEFT_EYE.y + RIGHT_EYE.y) / 2, // 418
};
export const PUPIL_ORBIT = 27;

// Angle of the pupils for a given frame: one complete clockwise-on-screen
// orbit across the clip, so frame FRAMES lines up with frame 0 and the mobile
// loop is seamless. SVG y grows downward, so 0 is right, PI/2 is down.
export const angleForFrame = (index) => (index / FRAMES) * Math.PI * 2;

// Crown with two lobes and a dip in the middle, then two roots splayed around
// a deep notch — the silhouette has to read as a tooth at a glance.
const TOOTH_PATH = [
  'M660 460',
  'C660 300 750 230 880 230',
  'C925 230 945 252 960 252',
  'C975 252 995 230 1040 230',
  'C1170 230 1260 300 1260 460',
  'C1260 540 1245 572 1230 620',
  'C1205 700 1180 830 1150 900',
  'C1130 946 1080 950 1055 905',
  'C1030 860 1010 760 990 712',
  'C978 684 942 684 930 712',
  'C910 760 890 860 865 905',
  'C840 950 790 946 770 900',
  'C740 830 715 700 690 620',
  'C675 572 660 540 660 460',
  'Z',
].join(' ');

const LEFT_ARM = 'M706 556 C676 640 760 716 878 706';
const RIGHT_ARM = 'M1214 556 C1244 640 1160 716 1042 706';

const HEART_PATH =
  'M50 88 C22 66 4 50 4 32 C4 18 15 8 28 8 C38 8 46 14 50 22 C54 14 62 8 72 8 C85 8 96 18 96 32 C96 50 78 66 50 88 Z';

function eye({ x, y }) {
  return `
      <ellipse cx="${x}" cy="${y}" rx="60" ry="64" fill="#f4f2fc" stroke="#ded9f0" stroke-width="3" />`;
}

function pupil(eyeCenter, angle, id) {
  const cx = eyeCenter.x + Math.cos(angle) * PUPIL_ORBIT;
  const cy = eyeCenter.y + Math.sin(angle) * PUPIL_ORBIT;
  return `
      <g id="${id}" transform="translate(${cx.toFixed(3)} ${cy.toFixed(3)})">
        <circle r="26" fill="#191828" />
        <circle cx="-9" cy="-10" r="8" fill="#ffffff" opacity=".9" />
      </g>`;
}

/** Complete SVG markup for one frame, with the pupils pointing at `angle`. */
export function frameSvg(angle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <filter id="fuzz" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="3" seed="7" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="halo" x="-14%" y="-14%" width="128%" height="128%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" result="rough" />
      <feGaussianBlur in="rough" stdDeviation="5" />
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BACKGROUND}" />

  <ellipse cx="960" cy="948" rx="250" ry="46" fill="#ddd8ef" opacity=".5" />

  <g filter="url(#halo)" opacity=".75">
    <path d="${TOOTH_PATH}" fill="#ffffff" transform="translate(960 565) scale(1.012) translate(-960 -565)" />
    <path d="${LEFT_ARM}" stroke="#ffffff" stroke-width="54" stroke-linecap="round" fill="none" />
    <path d="${RIGHT_ARM}" stroke="#ffffff" stroke-width="54" stroke-linecap="round" fill="none" />
  </g>

  <g filter="url(#fuzz)">
    <path d="${TOOTH_PATH}" fill="#fdfdff" stroke="#e3def3" stroke-width="4" />
  </g>

  <path d="${HEART_PATH}" transform="translate(880 612) scale(1.6)" fill="#ff9cc0" />
  <path d="${HEART_PATH}" transform="translate(880 612) scale(1.6)" fill="none" stroke="#f57ba7" stroke-width="3.5" />
  <path d="M60 30 C48 41 42 52 42 62" transform="translate(880 612) scale(1.6)" stroke="#ffc4d9" stroke-width="5" stroke-linecap="round" fill="none" />

  <g filter="url(#fuzz)">
    <path d="${LEFT_ARM}" stroke="#e9e4f7" stroke-width="52" stroke-linecap="round" fill="none" />
    <path d="${RIGHT_ARM}" stroke="#e9e4f7" stroke-width="52" stroke-linecap="round" fill="none" />
    <path d="${LEFT_ARM}" stroke="#f7f5fd" stroke-width="44" stroke-linecap="round" fill="none" />
    <path d="${RIGHT_ARM}" stroke="#f7f5fd" stroke-width="44" stroke-linecap="round" fill="none" />
    <circle cx="884" cy="702" r="36" fill="#f7f5fd" stroke="#e9e4f7" stroke-width="4" />
    <circle cx="1036" cy="702" r="36" fill="#f7f5fd" stroke="#e9e4f7" stroke-width="4" />
  </g>

  <ellipse cx="762" cy="508" rx="46" ry="27" fill="#ffb9d0" opacity=".6" />
  <ellipse cx="1148" cy="508" rx="46" ry="27" fill="#ffb9d0" opacity=".6" />

  <g>
${eye(LEFT_EYE)}
${eye(RIGHT_EYE)}
${pupil(LEFT_EYE, angle, 'pupil-left')}
${pupil(RIGHT_EYE, angle, 'pupil-right')}
    <path d="M906 522 Q948 572 990 522" stroke="#191828" stroke-width="11" stroke-linecap="round" fill="none" />
  </g>
</svg>`;
}
