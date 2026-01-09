import {
  computed,
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";

import { AuthenticationService } from "app/core/auth/auth.service";

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *nkHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *nkHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  standalone: true,
  selector: "[nkHasAnyAuthority]",
})
export default class HasAnyAuthorityDirective {
  public authorities = input<string | string[]>([], {
    alias: "nkHasAnyAuthority",
  });

  private templateRef = inject(TemplateRef<any>);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    const accountService = inject(AuthenticationService);
    const currentAccount = accountService.trackCurrentAuthentication();
    const hasPermission = computed(
      () =>
        currentAccount()?.authorities &&
        accountService.hasAnyAuthority(this.authorities())
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
