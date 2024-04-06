import express from 'express';
import { patientController } from './patient.controller';

const router = express.Router();

router
  .patch('/:id', patientController.updateSinglePatient)
  .delete('/:id', patientController.deletePatient);

export const PatientRouter = router;
