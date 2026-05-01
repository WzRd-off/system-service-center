import { reportsService } from '../services/reports.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const reportsController = {
  requestsByStatus: asyncHandler(async (req, res) => {
    res.json(await reportsService.requestsByStatus());
  }),

  technicianActivity: asyncHandler(async (req, res) => {
    res.json(await reportsService.technicianActivity());
  }),

  businessClientActivity: asyncHandler(async (req, res) => {
    res.json(await reportsService.businessClientActivity());
  })
};
