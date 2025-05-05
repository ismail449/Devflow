"use server";

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Answer, Question } from "@/database";
import { AnswerDoc } from "@/database/answer.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { CreateAnswerSchema, GetQuestionAnswersSchema } from "../validations";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<AnswerDoc>> {
  const validationResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, content } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      throw new NotFoundError("Question");
    }
    const [answer] = await Answer.create(
      [
        {
          questionId,
          content,
          author: userId,
        },
      ],
      { session }
    );

    if (!answer) {
      throw new Error("Failed to create answer");
    }
    question.answerCount += 1;
    await question.save({ session });
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(answer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getQuestionAnswers(
  params: GetQuestionAnswersParams
): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetQuestionAnswersSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    questionId,
    filter,
  } = validationResult.params!;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  const filterQuery: FilterQuery<typeof Answer> = { questionId };
  try {
    const totalAnswers = await Answer.countDocuments(filterQuery);
    const answers = await Answer.find(filterQuery)
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .lean()
      .skip(skip)
      .limit(limit);
    const isNext = totalAnswers > skip + answers.length;
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
