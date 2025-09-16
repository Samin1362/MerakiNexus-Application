import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { nexusService } from "./nexus.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createNexus = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await nexusService.createNexus(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Nexus created successfully",
    data,
  });
});

const getAllNexus = catchAsync(async (req: Request, res: Response) => {
  const data = await nexusService.getAllNexus();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Nexus retrieved successfully",
    data,
  });
});

const getNexusById = catchAsync(async (req: Request, res: Response) => {
  const nexusId = req.params.nexusId;
  const data = await nexusService.getNexusById(nexusId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "retrieved nexus by id successfully",
    data,
  });
});

const updateNexusById = catchAsync(async (req: Request, res: Response) => {
  const nexusId = req.params.nexusId;
  const body = req.body;
  const data = await nexusService.updateNexusById(nexusId, body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "successfully updated nexus by id",
    data,
  });
});

const deleteNexusById = catchAsync(async (req: Request, res: Response) => {
  const nexusId = req.params.nexusId;
  const data = await nexusService.deleteNexusById(nexusId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "deleted nexus by id",
    data,
  });
});

export { createNexus, getAllNexus, getNexusById, updateNexusById };
