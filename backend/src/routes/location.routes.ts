import { Router } from 'express';
import {
  getCountries, createCountry, updateCountry, deleteCountry,
  getStates, createState, updateState, deleteState,
  getCities, createCity, updateCity, deleteCity,
  getLocations, createLocation, updateLocation, deleteLocation
} from '../controllers/location.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Country Routes
router.get('/countries', getCountries);
router.post('/countries', authenticate, authorize(['ADMIN']), createCountry);
router.put('/countries/:id', authenticate, authorize(['ADMIN']), updateCountry);
router.delete('/countries/:id', authenticate, authorize(['ADMIN']), deleteCountry);

// State Routes
router.get('/states', getStates);
router.post('/states', authenticate, authorize(['ADMIN']), createState);
router.put('/states/:id', authenticate, authorize(['ADMIN']), updateState);
router.delete('/states/:id', authenticate, authorize(['ADMIN']), deleteState);

// City Routes
router.get('/cities', getCities);
router.post('/cities', authenticate, authorize(['ADMIN']), createCity);
router.put('/cities/:id', authenticate, authorize(['ADMIN']), updateCity);
router.delete('/cities/:id', authenticate, authorize(['ADMIN']), deleteCity);

// Location Routes
router.get('/locations', getLocations);
router.post('/locations', authenticate, authorize(['ADMIN']), createLocation);
router.put('/locations/:id', authenticate, authorize(['ADMIN']), updateLocation);
router.delete('/locations/:id', authenticate, authorize(['ADMIN']), deleteLocation);

export default router;
