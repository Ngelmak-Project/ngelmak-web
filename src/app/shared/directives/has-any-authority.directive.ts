import {
  computed,
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { AuthenticationService } from 'app/core/auth/auth.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *hasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *hasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[hasAnyAuthority]',
})
export class HasAnyAuthorityDirective {
  public authorities = input<string | string[]>([], {
    alias: 'hasAnyAuthority',
  });

  private templateRef = inject(TemplateRef<any>);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    const authService = inject(AuthenticationService);
    const currentAccount = authService.authentication;
    const hasPermission = computed(
      () => currentAccount()?.authorities && authService.hasAnyAuthority(this.authorities())
    );

    effect(
      () => {
        if (hasPermission()) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainerRef.clear();
        }
      },
      { allowSignalWrites: true }
    );
  }
}


@Directive({
  standalone: true,
  selector: '[hasNoAuthority]',
})
export class HasNoAuthorityDirective {
  public authorities = input<string | string[]>([], {
    alias: 'hasNoAuthority',
  });

  private templateRef = inject(TemplateRef<any>);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    const authService = inject(AuthenticationService);
    const currentAccount = authService.authentication;
    const hasPermission = computed(
      () => currentAccount()?.authorities && authService.hasAnyAuthority(this.authorities()),
    );

    effect(
      () => {
        if (!hasPermission()) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainerRef.clear();
        }
      },
      { allowSignalWrites: true },
    );
  }
}
