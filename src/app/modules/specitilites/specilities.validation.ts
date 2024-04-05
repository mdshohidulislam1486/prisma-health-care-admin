import { string, z } from 'zod';

const createASpecility = z.object({
  title: z.string(),
});

export const specilityValidation = {
  createASpecility,
};
