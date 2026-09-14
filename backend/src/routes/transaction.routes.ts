import { Router, type Request, type Response } from 'express';
import TransactionService from '../services/transaction.service';
import { Transaction } from '../types/transaction.type';
import { idValidation, transactionFilterValidationRules, updateStatusValidationRules, validateRequest } from '../middlewares/transaction.validator';
import { param } from 'express-validator';

const router = Router();

router.get(
    '/',
    transactionFilterValidationRules,
    validateRequest,
    async (req: Request, res: Response) => {
        const status = req.query.status as string | undefined;

        let transactions = [];

        if(status)
            transactions = await TransactionService.filterTransactions(status);
        else
            transactions = await TransactionService.getTransactions();
        
        res.status(200).json(transactions);
});

router.get(
    '/:id',
    idValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const idString = Array.isArray(id) ? id[0] : id;
        const numericId = parseInt(idString, 10);
        const transaction = await TransactionService.getTransaction(numericId);
        res.status(200).json(transaction);
});

router.put(
    '/:id/status',
    updateStatusValidationRules,
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string, 10);
            const status = req.body.status;
            
            const transaction = await TransactionService.updateTransaction({id, status});
            
            if(transaction)
                res.status(200).json(transaction);
            else
                res.status(400).json({error: `Transaction with id ${id} not found`});
        }
        catch {
            res.status(500).json({error: 'Internal server error'});
        }
    }
);

export default router;