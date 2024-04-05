import express, { NextFunction, Request, Response } from 'express';
import { specilitesController } from './specitilities.controller';
import { upload } from '../../../helpers/file-uploader';
import { specilityValidation } from './specilities.validation';

const router = express.Router();

router
  .get('/', specilitesController.getAllSepcilities)
  .delete('/:id', specilitesController.deleteSepecilities)
  .post(
    '/',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = specilityValidation.createASpecility.parse(
        JSON.parse(req.body.data)
      );
      return specilitesController.createASpecility(req, res, next);
    }
  );

export const SpecilitiesRoutes = router;
