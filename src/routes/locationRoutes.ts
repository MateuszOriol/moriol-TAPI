import { Router } from 'express';
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocationPatch,
  updateLocationPut,
  deleteLocation,
} from '../controllers/locationController';

const router = Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.post('/', createLocation);
router.put('/:id', updateLocationPut);
router.patch('/:id', updateLocationPatch);
router.delete('/:id', deleteLocation);

export default router;
