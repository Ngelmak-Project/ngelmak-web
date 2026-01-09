import { animate, style, transition, trigger } from '@angular/animations';

export function fadeInOutRightAnimation(duration: number) {
  return trigger('fadeInOutRight', [
    transition(':enter', [
      style({
        transform: 'translateX(-20px)',
        opacity: 0,
      }),
      animate(
        `${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`,
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
    ]),
    transition(':leave', [
      style({
        transform: 'translateX(0px)',
        opacity: 1,
      }),
      animate(
        `${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`,
        style({
          transform: 'translateX(-20px)',
          opacity: 0,
        })
      ),
    ]),
  ]);
}

export const fadeInOutRight400ms = fadeInOutRightAnimation(400);
