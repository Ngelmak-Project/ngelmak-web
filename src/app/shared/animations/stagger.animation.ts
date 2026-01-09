import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';

export function staggerAnimation(timing: number) {
  return trigger('stagger', [
    transition('* => *', [
      // each time the binding value changes
      query('@fadeInUp, @fadeInRight, @scaleIn', stagger(timing, animateChild()), { optional: true }),
    ]),
  ]);
}

export const stagger80ms = staggerAnimation(80);
export const stagger60ms = staggerAnimation(60);
export const stagger40ms = staggerAnimation(40);
export const stagger20ms = staggerAnimation(20);


export function scaleInOutAnimation(timing: number) {
  return trigger('scaleInOutAnimation', [
    transition('* <=> *', [
      query(':enter', [
        style({ opacity: 0, transform: 'scale(0.7)' }),
        stagger(100, [
          animate(`${timing}ms ease-in`, style({ opacity: 1, transform: 'scale(1)' }))
        ])
      ], { optional: true }),
      query(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        stagger(-100, [
          animate(`${timing}ms ease-in`, style({ opacity: 0, transform: 'scale(0.7)' }))
        ])
      ], { optional: true })
    ])
  ]);
};

export const scaleInOutAnimation150ms = scaleInOutAnimation(150);
export const scaleInOutAnimation200ms = scaleInOutAnimation(200);
