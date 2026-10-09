import { Router } from 'express';
import {
  getRoles, createRole, updateRole, deleteRole,
  getPermissions, createPermission, deletePermission
} from '../controllers/role.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize(['ADMIN'])); // Only Admin can manage Roles/Permissions

// Roles
router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

// Permissions
router.get('/permissions', getPermissions);
router.post('/permissions', createPermission);
router.delete('/permissions/:id', deletePermission);

export default router;
