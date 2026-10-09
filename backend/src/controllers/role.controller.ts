import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const roleSchema = z.object({
  name: z.string().min(2),
  permissionIds: z.array(z.number().int()).optional()
});

const permissionSchema = z.object({
  name: z.string().min(2),
});

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: { permissions: true }
    });
    res.status(200).json({ status: 'success', data: roles });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const role = await prisma.role.create({
      data: {
        name: parsed.data.name.toUpperCase(),
        permissions: parsed.data.permissionIds ? {
          connect: parsed.data.permissionIds.map(id => ({ id }))
        } : undefined
      },
      include: { permissions: true }
    });

    res.status(201).json({ status: 'success', data: role });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const role = await prisma.role.update({
      where: { id: Number(req.params.id) },
      data: {
        name: parsed.data.name.toUpperCase(),
        permissions: parsed.data.permissionIds ? {
          set: parsed.data.permissionIds.map(id => ({ id }))
        } : undefined
      },
      include: { permissions: true }
    });

    res.status(200).json({ status: 'success', data: role });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    await prisma.role.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Role deleted' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.status(200).json({ status: 'success', data: permissions });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const parsed = permissionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const permission = await prisma.permission.create({
      data: { name: parsed.data.name.toUpperCase() }
    });

    res.status(201).json({ status: 'success', data: permission });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    await prisma.permission.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Permission deleted' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
