import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SignInModel } from "app/authentication/sign-in/sign-in.model";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { StateStorageService } from "./state-storage.service";

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: "root" })
export class AuthServerProvider {
  private http = inject(HttpClient);
  private stateStorageService = inject(StateStorageService);
  private applicationConfigService = inject(ApplicationConfigService);

  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? "";
  }

  signIn(credentials: SignInModel): Observable<void> {
    return this.http
      .post<JwtToken>(
        this.applicationConfigService.getEndpointFor("auth/authenticate"),
        credentials
      )
      .pipe(
        map(({ id_token }) => {
          this.stateStorageService.storeAuthenticationToken(
            id_token,
            credentials.rememberMe
          );
        })
      );
  }

  signOut(): Observable<void> {
    return new Observable((observer) => {
      this.stateStorageService.clearAuthenticationToken();
      observer.complete();
    });
  }
}
