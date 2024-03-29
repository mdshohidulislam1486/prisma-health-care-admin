import { z } from 'zod';

export const adminDataupdate = z.object({
  body: z.object({
    name: z.string(),
    profilePhoto: z.string(),
    contactNumber: z.string(),
  }),
});

export const adminValidatioan = {
  adminDataupdate,
};
