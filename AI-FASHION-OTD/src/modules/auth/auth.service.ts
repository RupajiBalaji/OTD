import { User, IUser } from '../../models/User';
import { RefreshToken } from '../../models/RefreshToken';
import { ApiError } from '../../utils/ApiError';
import { PasswordUtil } from '../../utils/password';
import { JwtUtil } from '../../utils/jwt';

export class AuthService {
  public static async register(data: { name: string; email: string; password: string }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const hashedPassword = await PasswordUtil.hash(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const tokens = await this.generateAuthTokens(user);
    return {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      tokens,
    };
  }

  public static async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await PasswordUtil.compare(data.password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokens = await this.generateAuthTokens(user);
    return {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      tokens,
    };
  }

  public static async refreshToken(token: string) {
    const stored = await RefreshToken.findOne({ token });
    if (!stored) {
      throw new ApiError(401, 'Invalid or revoked refresh token');
    }

    try {
      const payload = JwtUtil.verifyRefreshToken(token);
      const user = await User.findById(payload.userId);
      if (!user) {
        throw new ApiError(401, 'User no longer exists');
      }

      await RefreshToken.deleteOne({ _id: stored._id });
      return this.generateAuthTokens(user);
    } catch {
      await RefreshToken.deleteOne({ _id: stored._id });
      throw new ApiError(401, 'Expired refresh token');
    }
  }

  public static async logout(token: string) {
    await RefreshToken.deleteOne({ token });
  }

  private static async generateAuthTokens(user: IUser) {
    const payload = { userId: (user._id as any).toString(), email: user.email, role: user.role };
    const accessToken = JwtUtil.signAccessToken(payload);
    const refreshToken = JwtUtil.signRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}
