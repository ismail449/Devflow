"use server";

import mongoose, { PipelineStage } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Collection, Question } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    authorize: true,
    params,
    schema: CollectionBaseSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question");
    }
    const existingCollection = await Collection.findOne({
      author: userId,
      question: questionId,
    });
    if (existingCollection) {
      await Collection.findByIdAndDelete(existingCollection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      return { success: true, data: { saved: false } };
    }
    const [collection] = await Collection.create([
      {
        author: userId,
        question: questionId,
      },
    ]);
    if (!collection) throw new Error("Could not create collection");
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: { saved: true },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    authorize: true,
    params,
    schema: CollectionBaseSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return { success: true, data: { saved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collection: Collection[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { filter, page = 1, pageSize = 10, query } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostRecent: {
      "question.createdAt": -1,
    },
    oldest: {
      "question.createdAt": 1,
    },
    mostVoted: {
      "question.upvotes": -1,
    },
    mostViewed: {
      "question.views": -1,
    },
    mostAnswered: {
      "question.answers": -1,
    },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  };

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions", // Changed from "question"
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $unwind: "$question",
      },
      {
        $lookup: {
          from: "users", // Changed from "user"
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      {
        $unwind: "$question.author",
      },
      {
        $lookup: {
          from: "tags", // Changed from "tag"
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            {
              "question.title": { $regex: query, $options: "i" },
            },
            {
              "question.content": { $regex: query, $options: "i" },
            },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push({ $sort: sortCriteria }, { $limit: limit }, { $skip: skip });
    pipeline.push({ $project: { question: 1, author: 1 } });

    const questions = await Collection.aggregate(pipeline);

    const isNext = totalCount.count > skip + questions.length;

    return {
      success: true,
      data: { collection: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
