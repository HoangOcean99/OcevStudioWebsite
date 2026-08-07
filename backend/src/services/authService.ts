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
      if (user.isBanned) {
        throw new Error('Tài khoản của bạn đã bị khóa');
      }
      
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isUpdated = true;
      }
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        isUpdated = true;
      }
      if (user.name === 'Google User' && clientName) {
        user.name = clientName;
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
