import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { nexusUpdateSchema } from "./nexus.validate";
import {
  createNexus,
  getAllNexus,
  getNexusById,
  updateNexusById,
} from "./nexus.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../user/user.constrain";

export const nexusRoute = Router();

nexusRoute.post(
  "/",
  validateRequest(nexusUpdateSchema),
  auth([UserRole.Admin, UserRole.Artist]),
  createNexus
);
nexusRoute.get(
  "/",
  auth([UserRole.Admin, UserRole.Artist, UserRole.User]),
  getAllNexus
);
nexusRoute.get(
  "/:nexusId",
  auth([UserRole.Admin, UserRole.Artist, UserRole.User]),
  getNexusById
);

nexusRoute.patch(
  "/:nexusId",
  auth([UserRole.Admin, UserRole.Artist]),
  updateNexusById
);

nexusRoute.delete(
  "/:nexusId",
  auth([UserRole.Admin, UserRole.Artist]),
  updateNexusById
);
