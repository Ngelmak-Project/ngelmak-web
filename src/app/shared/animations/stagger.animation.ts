import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Creates a reusable stagger animation trigger that applies staggered
 * child animations to elements using Angular's animation system.
 *
 * This animation listens for any state change (`* => *`) and then
 * queries for child animations such as `@fadeInUp`, `@fadeInRight`,
 * and `@scaleIn`. Each matched child animation is executed with a
 * staggered delay, producing a cascading entrance effect.
 *
 * @param timing - The delay (in milliseconds) applied between each
 *                 child animation. Higher values create a slower,
 *                 more pronounced stagger; lower values make the
 *                 sequence faster and tighter.
 *
 * @returns An Angular animation trigger named `"stagger"`.
 *
 * @example
 * // ly a 150ms stagger between child animations
 * export const stagger150ms = staggerAnimation(150);
 *
 * // ly a faster 200ms stagger
 * export const stagger200ms = staggerAnimation(200);
 *
 * // Usage in a component:
 * @Component({
 *   animations: [stagger150ms]
 * })
 *
 * // Usage on html element
 * <div [@stagger]="items.length">
 *   <div *ngFor="let item of items" @fadeInUp>
 *     {{ item }}
 *   </div>
 * </div>
 */
function staggerAnimation(timing: number) {
  return trigger('stagger', [
    transition('* => *', [
      query('@fadeInUp, @fadeInRight, @scaleIn', stagger(timing, animateChild()), {
        optional: true,
      }),
    ]),
  ]);
}

export const stagger150ms = staggerAnimation(150);
export const stagger200ms = staggerAnimation(200);

/**
 * Creates a reusable scale-in / scale-out animation trigger.
 *
 * This animation applies a smooth scaling effect to elements as they
 * enter or leave the DOM. Entering elements start slightly smaller
 * (`scale(0.7)`) and fade/scale up to full size. Leaving elements
 * shrink back down while fading out.
 *
 * A stagger is applied so that multiple entering or leaving elements
 * animate one after another, creating a cascading effect.
 *
 * @param timing - Duration (in milliseconds) of the scale animation
 *                 applied to each element.
 *
 * @returns An Angular animation trigger named `"scaleInOutAnimation"`.
 *
 * @example
 * // Create a 150ms version
 * export const scaleInOutAnimation150ms = scaleInOutAnimation(150);
 *
 * // Create a 200ms version
 * export const scaleInOutAnimation200ms = scaleInOutAnimation(200);
 *
 * // Usage in a component:
 * // @Component({
 * //   animations: [scaleInOutAnimation150ms]
 * // })
 */
function scaleInOutAnimation(timing: number) {
  return trigger('scaleInOutAnimation', [
    transition('* <=> *', [
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'scale(0.7)' }),
          stagger(100, [
            animate(`${timing}ms ease-in`, style({ opacity: 1, transform: 'scale(1)' })),
          ]),
        ],
        { optional: true },
      ),
      query(
        ':leave',
        [
          style({ opacity: 1, transform: 'scale(1)' }),
          stagger(-100, [
            animate(`${timing}ms ease-in`, style({ opacity: 0, transform: 'scale(0.7)' })),
          ]),
        ],
        { optional: true },
      ),
    ]),
  ]);
}

export const scaleInOutAnimation150ms = scaleInOutAnimation(150);
export const scaleInOutAnimation200ms = scaleInOutAnimation(200);

