import express from 'express';
import { doctroController } from './doctor.controller';

const router = express.Router();

router.patch('/:id', doctroController.updateSingleDoctr);

export const doctorRoutes = router;
