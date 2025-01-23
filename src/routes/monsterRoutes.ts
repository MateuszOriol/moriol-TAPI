import { Router } from 'express';
import {
  getAllMonsters,
  getMonsterById,
  createMonster,
  updateMonster,
  deleteMonster,
} from '../controllers/monsterController';

const router = Router();

router.get('/', getAllMonsters);
router.get('/:id', getMonsterById);
router.post('/', createMonster);
router.put('/:id', updateMonster);
router.delete('/:id', deleteMonster);

export default router;
