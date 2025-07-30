// schemas.ts
import { z } from "zod";

const AnswerSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  question_id: z.number().optional(),
  message: z.string().max(255).optional(),
  image: z.string().nullable().optional(),
  audio: z.string().nullable().optional(),
  status: z.coerce.number().optional(),
  sort: z.coerce.number().min(1),
  is_correct: z.coerce.number(),
});

const QuestionSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  status: z.coerce.number().optional(),
  message: z.string().min(1).max(255),
  image: z.string().nullable().optional(),
  audio: z.string().nullable().optional(),
  sort: z.coerce.number().min(1).optional(),
  score: z.coerce.number().min(1).optional(),
  prompt: z.string().optional(),
  question_set_id: z.coerce.number().min(1).optional(),
  answers: z.array(AnswerSchema).min(1, "ต้องมีคำตอบอย่างน้อยหนึ่ง"),
});

const FullSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  passage: z.string().optional(),
  image: z.string().nullable().optional(),
  audio: z.string().nullable().optional(),
  exam_id: z.number().optional(),
  question_type_id: z.coerce.number().min(1),
  sort: z.coerce.number().min(1),
  questions: z.array(QuestionSchema).min(1, "ต้องมีคำถามอย่างน้อยหนึ่ง"),
});

export type FullFormValues = z.infer<typeof FullSchema>;
export { FullSchema };
