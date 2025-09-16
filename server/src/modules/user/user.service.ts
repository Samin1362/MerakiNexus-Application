import { IUser } from "./user.interface";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import User from "./user.model";
import AppError from "../../error/AppError";
import config from "../../config";

const registerUser = async (payload: IUser) => {
  payload.password = await bcrypt.hash(payload.password, 10);
  const user = new User(payload);
  const data = await user.save();
  return data;
};

const loginUser = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (!isUserExist) throw new AppError(404, "User Not Found");

  const checkPassword = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  if (!checkPassword) throw new AppError(403, "Password not matched");

  const jwtPayload = {
    email: payload.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    { expiresIn: config.jwt.jwt_access_expires } as SignOptions
  );

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt.jwt_refresh_secret as string,
    { expiresIn: config.jwt.jwt_refresh_expires } as SignOptions
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const verifyRefreshToken = jwt.verify(
    refreshToken,
    config.jwt.jwt_refresh_secret as string
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifyRefreshToken.email });
  if (!isUserExist) throw new AppError(404, "User Not Found");

  const jwtPayload = {
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    { expiresIn: config.jwt.jwt_access_expires } as SignOptions
  );

  return { accessToken };
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not Found");
  }
  return user;
};

const getAllUser = async () => {
  const users = await User.find();
  if (!users) {
    throw new AppError(404, "Users not Found");
  }
  return users;
};

const updateUserById = async (userId: string, body: any) => {
  const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });
  if (!updatedUser) {
    throw new AppError(404, "User not found to update");
  }
  return updatedUser;
};

const deleteUserById = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new AppError(404, "User not found to update");
  }
  return deletedUser;
};

// const deleteUserById = async ( userId:string)

export const userService = {
  registerUser,
  loginUser,
  getUserById,
  getAllUser,
  updateUserById,
  deleteUserById,
  refreshToken,
};
