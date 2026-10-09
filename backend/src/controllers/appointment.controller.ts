import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const appointmentSchema = z.object({
  propertyId: z.number().int(),
  date: z.string().datetime(),
  time: z.string(),
  message: z.string().optional(),
});

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const parsed = appointmentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const userId = (req as any).user.userId;
    const appointment = await prisma.appointment.create({
      data: { ...parsed.data, date: new Date(parsed.data.date), userId }
    });
    res.status(201).json({ status: 'success', data: appointment, message: 'Appointment requested successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { date: 'asc' }
    });
    res.status(200).json({ status: 'success', data: appointments });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { property: true, user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { date: 'asc' }
    });
    res.status(200).json({ status: 'success', data: appointments });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // expected: 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.status(200).json({ status: 'success', data: appointment });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    // Check if appointment belongs to user
    const appointment = await prisma.appointment.findUnique({ where: { id: Number(req.params.id) } });
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Not found' });
    if (appointment.userId !== userId && (req as any).user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const cancelled = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status: 'CANCELLED' }
    });
    res.status(200).json({ status: 'success', data: cancelled });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
