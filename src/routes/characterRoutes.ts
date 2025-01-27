import { Router } from 'express';
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacterPut,
  updateCharacterPatch,
  deleteCharacter,
} from '../controllers/characterController';

const router = Router();

router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);
router.post('/', createCharacter);
router.put('/:id', updateCharacterPut);
router.patch('/:id', updateCharacterPatch);
router.delete('/:id', deleteCharacter);

export default router;