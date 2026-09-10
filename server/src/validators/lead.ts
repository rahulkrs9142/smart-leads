import { body, param } from 'express-validator';
import { LeadStatus, LeadSource } from '../types';
import mongoose from 'mongoose';

export const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Lead email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .notEmpty()
    .withMessage('Lead source is required')
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
];

export const updateLeadValidation = [
  param('id')
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid lead ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),
  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
];

export const leadIdValidation = [
  param('id')
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid lead ID format'),
];
