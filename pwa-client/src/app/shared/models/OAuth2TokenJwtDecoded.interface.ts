export interface OAuth2TokenJwtDecoded {
  active: boolean;
  sub?: string;
  aud?: Array<string>;
  nbf?: string;
  scope?: string;
  iss?: string;
  exp?: number;
  iat?: number;
  client_id?: string;
  token_type?: string;
}
