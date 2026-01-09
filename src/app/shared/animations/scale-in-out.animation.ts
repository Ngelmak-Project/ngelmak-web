import { animate, style, transition, trigger } from '@angular/animations';

export function scaleInOut(duration: number) {
  return trigger('scaleInOut', [
    transition(':enter', [
      style({
        transform: 'scale(0)',
        opacity: 0,
      }),
      animate(
        `${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`,
        style({
          transform: 'scale(1)',
          opacity: 1,
        })
      ),
    ]),
    transition(':leave', [
      style({
        transform: 'scale(1)',
        opacity: 1,
      }),
      animate(
        `${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`,
        style({
          transform: 'scale(0)',
          opacity: 0,
        })
      ),
    ]),
  ]);
}

export const scaleInOut150ms = scaleInOut(150);
export const scaleInOut400ms = scaleInOut(400);
