export class SignInModel {
  constructor(
    public username: string,
    public password: string,
    public rememberMe: boolean,
  ) {}
}
