"use server";
import { Model, PipelineStage } from "mongoose";

import { Answer, Question, Tag, User } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { GlobalSearchSchema } from "../validations";

const modelsAndTypes: {
  model: Model<unknown, object, object, object, unknown, unknown>;
  searchField: string;
  type: GlobalSearchTypes;
}[] = [
  { model: Question, searchField: "title", type: "Question" },
  { model: User, searchField: "name", type: "User" },
  { model: Answer, searchField: "content", type: "Answer" },
  { model: Tag, searchField: "name", type: "Tag" },
];

export async function globalSearch(
  params: GlobalSearchParams
): Promise<ActionResponse<{ title: string; _id: string }[]>> {
  const validationResult = await action({
    params,
    schema: GlobalSearchSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { query, searchTypes } = validationResult.params!;

  try {
    const searchResults: { title: string; _id: string }[] = [];

    for (const { model, searchField, type } of modelsAndTypes) {
      if (searchTypes?.length && !searchTypes?.includes(type)) {
        continue;
      }

      const pipeline: PipelineStage[] = [
        { $match: { [searchField]: { $regex: query, $options: "i" } } },
        { $project: { title: `$${searchField}`, type: `${type}` } },
      ];

      const searchResult = await model.aggregate(pipeline);
      searchResults.push(...searchResult);
    }

    return { success: true, data: JSON.parse(JSON.stringify(searchResults)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
