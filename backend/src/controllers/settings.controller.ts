import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  description: z.string().optional(),
});

export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findMany();
    // Convert array to key-value object for easier frontend consumption
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.status(200).json({ status: 'success', data: settingsMap, raw: settings });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getSettingsByGroup = async (req: Request, res: Response) => {
  // Not supported by schema directly, but kept for compatibility - returns all
  try {
    const settings = await prisma.settings.findMany();
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.status(200).json({ status: 'success', data: settingsMap });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settingsToUpdate = req.body; // Expects an array of { key, value }
    if (!Array.isArray(settingsToUpdate)) {
      return res.status(400).json({ status: 'error', message: 'Expected array of settings' });
    }

    const updatePromises = settingsToUpdate.map(async (setting: any) => {
      const parsed = settingSchema.safeParse(setting);
      if (parsed.success) {
        return prisma.settings.upsert({
          where: { key: parsed.data.key },
          update: { value: parsed.data.value, description: parsed.data.description },
          create: { 
            key: parsed.data.key, 
            value: parsed.data.value,
            description: parsed.data.description,
          }
        });
      }
    });

    await Promise.all(updatePromises);
    res.status(200).json({ status: 'success', message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
