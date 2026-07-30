import { Router } from 'express';
import { ExerciseController } from './exercise.controller';

const router = Router();
const controller = new ExerciseController();

router.get('/', controller.getExercises);
router.get('/alternatives', controller.getAlternatives);
router.get('/:id', controller.getById);

export const exerciseRouter = router;
