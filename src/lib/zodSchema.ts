import z from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  subject: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(5000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
