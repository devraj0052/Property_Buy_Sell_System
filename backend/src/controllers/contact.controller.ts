import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const contactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

const inquirySchema = z.object({
  propertyId: z.number().int(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().min(5),
});

// --- Contact Message ---
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const parsed = contactMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const message = await prisma.contactMessage.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: message, message: 'Message sent successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: messages });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateContactMessageStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // expected: 'UNREAD', 'READ', 'REPLIED'
    const message = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.status(200).json({ status: 'success', data: message });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// --- Inquiry ---
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const inquiry = await prisma.inquiry.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: inquiry, message: 'Inquiry submitted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({ 
      include: { property: true },
      orderBy: { createdAt: 'desc' } 
    });
    res.status(200).json({ status: 'success', data: inquiries });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // expected: 'PENDING', 'CONTACTED', 'RESOLVED'
    const inquiry = await prisma.inquiry.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.status(200).json({ status: 'success', data: inquiry });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    await prisma.inquiry.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
