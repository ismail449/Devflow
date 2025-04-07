"use server";
import mongoose, { Types } from "mongoose";

import Question, { IQuestion, QuestionDoc } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { TagDoc } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";
export async function createQuestion(
  params: CreateQuestion
): Promise<ActionResponse<QuestionDoc>> {
  const validateResult = await action({
    authorize: true,
    params,
    schema: AskQuestionSchema,
  });
  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }
  const { title, content, tags } = validateResult.params!;
  const userId = validateResult.session?.user?.id;
  const lowercaseTags = tags.map((tag) => tag.toLowerCase());

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingTags: TagDoc[] = await Tag.find({
      name: { $in: lowercaseTags },
    }).session(session);
    console.log("existingTags", existingTags);
    await Tag.updateMany(
      {
        _id: { $in: existingTags.map((tag) => tag._id) },
      },
      { $inc: { questions: 1 } },
      { session }
    );

    const tagsToCreate = lowercaseTags.filter(
      (tag) => !existingTags.map((tag) => tag.name).includes(tag)
    );
    console.log("tagsToCreate", tagsToCreate);
    const createdTags: TagDoc[] = await Tag.create(
      tagsToCreate.map((tag) => {
        return { name: tag, questions: 1 };
      }),
      { session, ordered: true }
    );

    const companiedTags = [...existingTags, ...createdTags];
    const newQuestion: IQuestion = {
      title,
      content,
      tags: companiedTags.map((tag) => tag._id as Types.ObjectId),
      authorId: new mongoose.Types.ObjectId(userId),
    };

    const [question]: QuestionDoc[] = await Question.create([newQuestion], {
      session,
      ordered: true,
    });

    await TagQuestion.create(
      companiedTags.map((tag) => {
        return { tag: tag._id, question: question._id };
      }),
      { session, ordered: true }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    } as SuccessResponse<QuestionDoc>;
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
