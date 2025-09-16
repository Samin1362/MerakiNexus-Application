import { Router } from "express";
import userRoute from "../user/user.route";
import authRouter from "../auth/auth.route";
import { nexusRoute } from "../nexus/nexus.route";

const routes = Router();
routes.use("/user", userRoute);
routes.use("/auth", authRouter);
routes.use("/nexus", nexusRoute);

export default routes;
