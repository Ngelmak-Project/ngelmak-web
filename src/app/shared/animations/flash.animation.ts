import { trigger, transition, animate, keyframes, style } from "@angular/animations";


export function flashBoxShadowAnimation(timing: number) {
  return trigger('flashBoxShadow', [
    transition('true <=> false', [
      animate(`${timing}ms`,
        keyframes([
          style({ boxShadow: '0 0 2px 2px rgba(0, 255, 0, 0.5)', offset: 0 }), // green
          style({ boxShadow: '0 0 2px 2px rgba(255, 255, 0, 0.5)', offset: .33 }), // yellow
          style({ boxShadow: '0 0 2px 2px rgba(255, 0, 0, 0.5)', offset: .66 }), // red
          style({ boxShadow: '0 0 2px 2px rgba(0, 255, 0, 0.5)', offset: 1 }), // green
        ])
      ),
    ]),
    transition('* => null', [ animate(`${timing}ms`, style({ boxShadow: 'none' })) ]),
  ]);
}

export const flashBoxShadow1000ms = flashBoxShadowAnimation(1000);
export const flashBoxShadow2000ms = flashBoxShadowAnimation(2000);
export const flashBoxShadow3000ms = flashBoxShadowAnimation(3000);
