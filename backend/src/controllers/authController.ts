import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { authService } from '../services/authService';
import User from '../models/User';

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      token: authService.generateToken(user._id as string, user.role),
    });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      res.status(400);
      throw new Error(error.message);
    }
    throw error;
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await authService.loginUser(req.body);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      token: authService.generateToken(user._id as string, user.role),
    });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      res.status(401);
      throw new Error(error.message);
    }
    throw error;
  }
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token, name, avatar } = req.body;
    if (!token) {
      res.status(400);
      throw new Error('Google token is required');
    }

    const user = await authService.googleLogin(token, name, avatar);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      token: authService.generateToken(user._id as string, user.role),
    });
  } catch (error: any) {
    if (error.message === 'Invalid Google token') {
      res.status(400);
      throw new Error(error.message);
    }
    throw error;
  }
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    if (req.body.sizingPreferences) {
      user.sizingPreferences = req.body.sizingPreferences;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      address: updatedUser.address,
      sizingPreferences: updatedUser.sizingPreferences,
      token: authService.generateToken(updatedUser._id as string, updatedUser.role),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
