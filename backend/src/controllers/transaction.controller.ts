import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.string(), // e.g., 'SUBSCRIPTION', 'PROPERTY_FEATURE'
  description: z.string().optional(),
});

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const parsed = transactionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const userId = (req as any).user.userId;
    // Mocking transaction ID for now since we don't have a real payment gateway
    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: parsed.data.amount,
        type: parsed.data.type,
        status: 'COMPLETED',
        transactionId,
      }
    });

    res.status(201).json({ status: 'success', data: transaction });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMyTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: transactions });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: transactions });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // expected: 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    const transaction = await prisma.transaction.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.status(200).json({ status: 'success', data: transaction });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
