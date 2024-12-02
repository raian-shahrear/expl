import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/user.auth';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { EventValidation } from './events.validation';
import { EventControllers } from './events.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...JSON.parse(req?.body?.data),
      eventImage: req?.file?.path,
    };
    next();
  },
  validateRequest(EventValidation.createEventValidationSchema),
  EventControllers.createEvent,
);

router.patch(
  '/create-host/:id',
  auth('admin'),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...JSON.parse(req?.body?.data),
      logo: req?.file?.path,
    };
    next();
  },
  validateRequest(EventValidation.createEventHostValidationSchema),
  EventControllers.createEventHost,
);

router.patch(
  '/create-guest/:id',
  auth('admin'),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = {
      ...JSON.parse(req?.body?.data),
      profile: req?.file?.path,
    };
    next();
  },
  validateRequest(EventValidation.createEventGuestValidationSchema),
  EventControllers.createEventGuest,
);

router.get('/', EventControllers.getAllEvents);
router.get('/:id', EventControllers.getSingleEvent);

router.patch(
  '/:id',
  auth('admin'),
  multerUpload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    const data = JSON.parse(req?.body?.data);
    req.body = {
      ...data,
      eventImage: req?.file?.path ? req?.file?.path : data?.eventImage,
    };
    next();
  },
  validateRequest(EventValidation.updateEventValidationSchema),
  EventControllers.updateEvent,
);

router.delete('/:id', auth('admin'), EventControllers.deleteEvent);
router.patch(
  '/delete-host/:id',
  auth('admin'),
  EventControllers.deleteEventHost,
);
router.patch(
  '/delete-guest/:id',
  auth('admin'),
  EventControllers.deleteEventGuest,
);

export const EventRoutes = router;
