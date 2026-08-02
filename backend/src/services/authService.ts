import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  generateToken(id: string, role: string) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d',
    });
  }

  async registerUser(data: Partial<IUser>) {
    const { name, email, password } = data;
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }

  async loginUser(data: Partial<IUser>) {
    const { email, password } = data;
    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password as string, user.password))) {
      return user;
    }
    throw new Error('Invalid email or password');
  }

  async googleLogin(token: string, clientName?: string, clientAvatar?: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }
    const { email, sub: googleId } = payload;
    const name = payload.name || clientName || 'Google User';
    const avatar = payload.picture || clientAvatar;
    let user = await User.findOne({ email });

    if (user) {
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isUpdated = true;
      }
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        isUpdated = true;
      }
      if (isUpdated) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        avatar,
      });
    }
    return user;
  }
}

export const authService = new AuthService();
