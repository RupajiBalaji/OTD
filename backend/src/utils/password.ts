import crypto from 'node:crypto';

let argon2Module: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  argon2Module = require('argon2');
} catch (e) {
  console.warn('[PasswordUtil] Native argon2 unavailable, using Node crypto fallback:', e);
}

export class PasswordUtil {
  public static async hash(password: string): Promise<string> {
    if (argon2Module) {
      try {
        return await argon2Module.hash(password, {
          type: argon2Module.argon2id,
          memoryCost: 2 ** 16,
          timeCost: 3,
        });
      } catch (err) {
        console.warn('[PasswordUtil] argon2.hash failed, falling back to scrypt:', err);
      }
    }

    // High-security pure Node.js fallback (zero native compilation dependencies)
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`scrypt$${salt}$${derivedKey.toString('hex')}`);
      });
    });
  }

  public static async compare(candidate: string, hash: string): Promise<boolean> {
    try {
      if (hash.startsWith('$argon2id$') && argon2Module) {
        return await argon2Module.verify(hash, candidate);
      }

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

      if (argon2Module) {
        return await argon2Module.verify(hash, candidate);
      }

      return false;
    } catch {
      return false;
    }
  }
}
