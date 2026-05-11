import { reportsService } from '../services/reports.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const period = (req) => ({
  dateFrom: req.query.dateFrom || undefined,
  dateTo: req.query.dateTo || undefined,
});

export const reportsController = {
  requestsByStatus: asyncHandler(async (req, res) => {
    res.json(await reportsService.requestsByStatus(period(req)));
  }),

  technicianActivity: asyncHandler(async (req, res) => {
    res.json(await reportsService.technicianActivity(period(req)));
  }),

  businessClientActivity: asyncHandler(async (req, res) => {
    res.json(await reportsService.businessClientActivity(period(req)));
  }),

  technicianWorkload: asyncHandler(async (req, res) => {
    res.json(await reportsService.technicianWorkload());
  }),
};
