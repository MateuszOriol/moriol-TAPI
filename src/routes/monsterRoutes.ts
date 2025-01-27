import { Router } from 'express';
import {
  getAllMonsters,
  getMonsterById,
  createMonster,
  updateMonsterPatch,
  updateMonsterPut,
  deleteMonster,
} from '../controllers/monsterController';

const router = Router();

router.get('/', getAllMonsters);
router.get('/:id', getMonsterById);
router.post('/', createMonster);
router.put('/:id', updateMonsterPut);
router.patch('/:id', updateMonsterPatch);
router.delete('/:id', deleteMonster);

export default router;
