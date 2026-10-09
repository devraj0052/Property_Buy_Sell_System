import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const countrySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
});

const stateSchema = z.object({
  name: z.string().min(2),
  countryId: z.number().int(),
});

const citySchema = z.object({
  name: z.string().min(2),
  stateId: z.number().int(),
});

const locationSchema = z.object({
  name: z.string().min(2),
  cityId: z.number().int(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany();
    res.status(200).json({ status: 'success', data: countries });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCountry = async (req: Request, res: Response) => {
  try {
    const parsed = countrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const country = await prisma.country.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: country });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  try {
    const parsed = countrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const country = await prisma.country.update({ where: { id: Number(req.params.id) }, data: parsed.data });
    res.status(200).json({ status: 'success', data: country });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteCountry = async (req: Request, res: Response) => {
  try {
    await prisma.country.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getStates = async (req: Request, res: Response) => {
  try {
    const { countryId } = req.query;
    const where = countryId ? { countryId: Number(countryId) } : {};
    const states = await prisma.state.findMany({ where, include: { country: true } });
    res.status(200).json({ status: 'success', data: states });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createState = async (req: Request, res: Response) => {
  try {
    const parsed = stateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const state = await prisma.state.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: state });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateState = async (req: Request, res: Response) => {
  try {
    const parsed = stateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const state = await prisma.state.update({ where: { id: Number(req.params.id) }, data: parsed.data });
    res.status(200).json({ status: 'success', data: state });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteState = async (req: Request, res: Response) => {
  try {
    await prisma.state.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const { stateId } = req.query;
    const where = stateId ? { stateId: Number(stateId) } : {};
    const cities = await prisma.city.findMany({ where, include: { state: true } });
    res.status(200).json({ status: 'success', data: cities });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCity = async (req: Request, res: Response) => {
  try {
    const parsed = citySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const city = await prisma.city.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: city });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const parsed = citySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const city = await prisma.city.update({ where: { id: Number(req.params.id) }, data: parsed.data });
    res.status(200).json({ status: 'success', data: city });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    await prisma.city.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const { cityId } = req.query;
    const where = cityId ? { cityId: Number(cityId) } : {};
    const locations = await prisma.location.findMany({ where, include: { city: true } });
    res.status(200).json({ status: 'success', data: locations });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createLocation = async (req: Request, res: Response) => {
  try {
    const parsed = locationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const location = await prisma.location.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: location });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const parsed = locationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const location = await prisma.location.update({ where: { id: Number(req.params.id) }, data: parsed.data });
    res.status(200).json({ status: 'success', data: location });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    await prisma.location.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
