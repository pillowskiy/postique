import { importJWK, JWK, jwtVerify } from 'jose';

export type KeyLike = { type: string } | Uint8Array;

export class JWTService {
  static async importJWK(
    key: string | Buffer,
    algorithm: string,
  ): Promise<KeyLike> {
    switch (algorithm) {
      case 'Ed25519':
        return await JWTService.importEd25519JWK(key);
      default:
        throw new Error(`Cannot import JWK for algorithm ${algorithm}`);
    }
  }

  static async importEd25519JWK(pem: string | Buffer): Promise<KeyLike> {
    const jwk: JWK = {
      kty: 'OKP',
      crv: 'Ed25519',
      // Note: For some reason, the createPublicKey method from the crypto module assumes the PEM format
      // generated by other cryptographic engines (e.g., Go or OpenSSL) is invalid.
      // Therefore, I am using hardcoded parsing of the PEM for now. This should be fixed in the future.
      x: pem
        .toString('utf8')
        .replace(/--.*--/g, '')
        .replace(/\n/g, ''),
    };

    return importJWK(jwk, 'EdDSA');
  }

  static async verify<P = unknown>(
    token: string,
    key: KeyLike,
    algorithm: string,
  ): Promise<P> {
    const { payload } = await jwtVerify<P>(token, key, {
      algorithms: [algorithm],
    });
    return payload;
  }
}
