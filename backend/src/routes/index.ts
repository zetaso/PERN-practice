import { Router } from "express";
import transactionRouter from './transaction.routes'

const router = Router();

router.use('/transaction', transactionRouter)

export default router;