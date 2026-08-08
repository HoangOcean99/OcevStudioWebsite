import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { authService } from '../services/authService';
import User from '../models/User';



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
      age: user.age,
      shirtSize: user.shirtSize,
      pantsSize: user.pantsSize,
      shoeSize: user.shoeSize,
      token: authService.generateToken(user._id.toString(), user.role),
    });
  } catch (error: any) {
    if (error.message === 'Invalid Google token') {
      res.status(400);
      throw new Error(error.message);
    }
    if (error.message.includes('khóa')) {
      res.status(403);
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
    if (req.body.age !== undefined) user.age = req.body.age;
    if (req.body.shirtSize !== undefined) user.shirtSize = req.body.shirtSize;
    if (req.body.pantsSize !== undefined) user.pantsSize = req.body.pantsSize;
    if (req.body.shoeSize !== undefined) user.shoeSize = req.body.shoeSize;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      address: updatedUser.address,
      age: updatedUser.age,
      shirtSize: updatedUser.shirtSize,
      pantsSize: updatedUser.pantsSize,
      shoeSize: updatedUser.shoeSize,
      token: authService.generateToken(updatedUser._id.toString(), updatedUser.role),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
