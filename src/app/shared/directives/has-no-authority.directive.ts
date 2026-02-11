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

@Directive({
  standalone: true,
  selector: '[hasNoAuthority]',
})
export default class HasNoAuthorityDirective {
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
