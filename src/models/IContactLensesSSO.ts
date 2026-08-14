export interface IContactLensesSSO {
  username: string;
  expirationTime: number;
  issuer: string;
  targetUrl: string;
}

export interface JWTToken {
  sub: string;
  exp: number;
  iss: string;
  iat?: number;
}

export interface SSOConfig {
  contactLensesPrivateKeyPath?: string;
  contactLensesPublicKeyPath?: string;
  tokenExpiration: number;
  issuer: string;
}
