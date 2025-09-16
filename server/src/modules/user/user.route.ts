import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { userZodSchema } from "./user.validate";
import {
  deleteUserById,
  getAllUser,
  getUserById,
  loginUser,
  refreshToken,
  registerUser,
  updateUserById,
} from "./user.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "./user.constrain";
const userRoute = Router();

userRoute.post(
  "/",
  validateRequest(userZodSchema.userCreateZodSchema),
  registerUser
);

userRoute.post(
  "/login",
  validateRequest(userZodSchema.userLoginZodSchema),
  loginUser
);

userRoute.post("/refresh-token", refreshToken);

userRoute.get(
  "/:userId",
  auth([UserRole.Admin, UserRole.Artist, UserRole.User]),
  getUserById
);

userRoute.get("/", auth([UserRole.Admin]), getAllUser);

userRoute.patch(
  "/:userId",
  auth([UserRole.Admin, UserRole.User, UserRole.Artist]),
  updateUserById
);

userRoute.delete(
  "/:userId",
  auth([UserRole.Admin, UserRole.User, UserRole.Artist]),
  deleteUserById
);

export default userRoute;
