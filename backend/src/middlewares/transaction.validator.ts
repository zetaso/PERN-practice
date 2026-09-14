import { Request, Response, NextFunction } from "express";
import { param, body, validationResult, query } from 'express-validator';

export const idValidation =
    param('id').isInt({min: 0}).withMessage('id must be a non negative integer');

export const transactionFilterValidationRules = [
    query('status')
    .optional()
    .isIn(['PENDING', 'COMPLETED', 'REJECTED'])
    .withMessage("status can be PENDING, COMPLETED or REJECTED")
];

export const updateStatusValidationRules = [
    idValidation,
    body('status')
        .notEmpty().withMessage("status must be provided")
        .isIn(['PENDING', 'COMPLETED', 'REJECTED'])
        .withMessage("status can be PENDING, COMPLETED or REJECTED")
]

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation errors',
            details: errors.array()
        })
    }

    next();
}