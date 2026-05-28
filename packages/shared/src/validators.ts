import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(128),
});

export const chatMessageSchema = z.object({
  message: z.string().min(3, 'Mensaje demasiado corto').max(2000, 'Mensaje demasiado largo'),
});

export const syllabusUpdateSchema = z.object({
  completed: z.boolean({ required_error: 'completed es requerido' }),
});

export const candidateSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  title: z.string().min(2).max(255).optional(),
  institution: z.string().min(2).max(255).optional(),
  expYears: z.number().int().min(0).max(50).optional(),
  certified: z.boolean().optional(),
});
