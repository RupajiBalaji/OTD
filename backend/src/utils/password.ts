import crypto from 'node:crypto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { argon2id } = require('@noble/hashes/argon2.js');

export class PasswordUtil {
  /**
   * Hashes a password using pure JavaScript / WebAssembly Argon2id.
   * Produces RFC 9106 PHC-formatted strings ($argon2id$v=19$m=...,t=...,p=...$salt$hash).
   * 100% portable with zero native C++ binaries, completely immune to SIGSEGV.
   */
  public static async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const m = 4096; // 4096 KB (4MB), cloud container safe
    const t = 2;    // 2 iterations
    const p = 1;    // 1 parallelism thread
    const dkLen = 32;

    const hashBytes = argon2id(password, salt, { t, m, p, dkLen });

    const saltB64 = salt.toString('base64').replace(/=/g, '');
    const hashB64 = Buffer.from(hashBytes).toString('base64').replace(/=/g, '');

    return `$argon2id$v=19$m=${m},t=${t},p=${p}$${saltB64}$${hashB64}`;
  }

  /**
   * Verifies a candidate password against an Argon2id (or scrypt) hash.
   */
  public static async compare(candidate: string, hash: string): Promise<boolean> {
    try {
      if (!candidate || !hash) return false;

      // Handle Argon2id PHC format
      if (hash.startsWith('$argon2id$')) {
        const parts = hash.split('$');
        // Format: ["", "argon2id", "v=19", "m=4096,t=2,p=1", saltB64, hashB64]
        if (parts.length < 6) return false;

        const paramString = parts[3];
        const params: Record<string, number> = {};
        for (const pair of paramString.split(',')) {
          const [k, v] = pair.split('=');
          if (k && v) params[k] = parseInt(v, 10);
        }

        const salt = Buffer.from(parts[4], 'base64');
        const expectedHash = Buffer.from(parts[5], 'base64');

        const computedHash = argon2id(candidate, salt, {
          t: params.t || 2,
          m: params.m || 4096,
          p: params.p || 1,
          dkLen: expectedHash.length,
        });

        if (expectedHash.length !== computedHash.length) return false;
        return crypto.timingSafeEqual(expectedHash, Buffer.from(computedHash));
      }

      // Handle scrypt fallback format
      if (hash.startsWith('scrypt$')) {
        const parts = hash.split('$');
        if (parts.length !== 3) return false;
        const salt = parts[1];
        const originalHex = parts[2];

        return new Promise((resolve) => {
          crypto.scrypt(candidate, salt, 64, (err, derivedKey) => {
            if (err) return resolve(false);
            resolve(crypto.timingSafeEqual(Buffer.from(originalHex, 'hex'), derivedKey));
          });
        });
      }

      return false;
    } catch {
      return false;
    }
  }
}
