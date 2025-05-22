"user server";

import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Collection, Question } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { CollectionBaseSchema } from "../validations";

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
      await Collection.findOneAndDelete({
        author: userId,
        question: questionId,
      });
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
