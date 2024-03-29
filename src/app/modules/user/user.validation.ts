import { Gender } from '@prisma/client';
import z from 'zod';

const createAdminValidate = z.object({
  password: z.string({
    required_error: 'Password is required',
  }),
  admin: z.object({
    name: z.string(),
    email: z.string(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string(),
  }),
});
const createDoctor = z.object({
  password: z.string({
    required_error: 'Password is required',
  }),
  doctor: z.object({
    name: z.string(),
    email: z.string().email(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string(),
    address: z.string().optional(),
    registrationNumber: z.string(),
    experience: z.number().int().default(0),
    gender: z.enum([Gender.FEMALE, Gender.MALE]),
    appointmentFee: z.number().int(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  }),
});
export const userValidation = {
  createAdminValidate,
  createDoctor,
};
