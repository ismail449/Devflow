import { z } from "zod";

import { InteractionActionEnums } from "@/database/interaction.model";

export const SignInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),

  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long.",
    })
    .max(100, {
      message: "Password cannot exceed 100 characters long.",
    }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  content: z.string().min(1, { message: "Body is required." }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required." })
        .max(30, { message: "Tag cannot exceed 30 characters." })
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "Cannot add more than 5 tags." }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z.string().optional(),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    image: z
      .string()
      .url({ message: "Please provide a valid URL." })
      .optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question id is required" }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question id is required" }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required" }),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required" }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(100, { message: "Answer has to have more than a 100 characters." }),
});

export const CreateAnswerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question Id is required" }),
});

export const GetQuestionAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question Id is required" }),
});

export const AiAnswerSchema = z.object({
  question: z
    .string()
    .min(3, { message: "Question is required" })
    .max(130, { message: "Question cannot exceed 130 characters." }),
  content: z
    .string()
    .min(100, { message: "Answer has to have more than 100 characters." }),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "target id is required" }),
  targetType: z.enum(["question", "answer"], {
    message: "invalid target type",
  }),
  voteType: z.enum(["upvote", "downvote"], { message: "invalid vote type" }),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().max(1).min(-1),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question id is required." }),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: "User id is required" }),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.omit({
  filter: true,
  query: true,
  sort: true,
}).extend({
  userId: z.string().min(1, { message: "User id is required." }),
});

export const GetUserAnswersSchema = PaginatedSearchParamsSchema.omit({
  filter: true,
  query: true,
  sort: true,
}).extend({
  userId: z.string().min(1, { message: "User id is required." }),
});

export const GetUserTopTagsSchema = z.object({
  userId: z.string().min(1, { message: "User id is required." }),
});

export const DeleteItemSchema = z.object({
  itemId: z.string().min(1, { message: "Item id is required." }),
});

export const CreateInteractionSchema = z.object({
  actionId: z.string().min(1, { message: "Action id is required." }),
  actionType: z.enum(["question", "answer"]),
  action: z.enum(InteractionActionEnums),
  authorId: z.string().min(1),
});

export const GetUserStatsSchema = z.object({
  userId: z.string().min(1, { message: "User id is required." }),
});

export const GetJobsParamsSchema = PaginatedSearchParamsSchema.extend({
  country: z
    .string()
    .min(2, { message: "Country code should be two characters" })
    .max(2, { message: "Country code should be two characters" })
    .optional(),
  numberOfPages: z
    .number()
    .min(1, { message: "Number of pages should not be less than 1" })
    .optional(),
});
