import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import {
  createLeadValidation,
  updateLeadValidation,
  leadIdValidation,
} from '../validators/lead';
import { handleValidation } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// CSV Export - must be BEFORE /:id route to avoid conflict
router.get('/export/csv', exportLeadsCSV);

// Stats
router.get('/stats/overview', getLeadStats);

// CRUD Routes
router.get('/', getLeads);
router.get('/:id', leadIdValidation, handleValidation, getLeadById);
router.post('/', createLeadValidation, handleValidation, createLead);
router.put('/:id', updateLeadValidation, handleValidation, updateLead);
router.delete(
  '/:id',
  leadIdValidation,
  handleValidation,
  authorize(UserRole.ADMIN),
  deleteLead
);

export default router;
