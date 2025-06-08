"use server";
import mongoose from "mongoose";

import { Interaction, User } from "@/database";
import { InteractionDoc } from "@/database/interaction.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateInteractionSchema } from "../validations";

async function updateReputation(params: UpdateReputationParams) {
  const { authorId, interaction, performerId, session } = params;
  const { action, actionType } = interaction as InteractionDoc;

  let authorPoints = 0;
  let performerPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      break;
  }

  if (performerId === authorId) {
    return await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: authorPoints } },
      { session }
    );
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session }
  );
}

export async function createInteraction(
  params: CreateInteractionParams
): Promise<ActionResponse<InteractionDoc>> {
  const validationResult = await action({
    authorize: true,
    params,
    schema: CreateInteractionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;

  const {
    action: interactionAction,
    actionId,
    actionType,
    authorId,
  } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          actionId,
          actionType,
          action: interactionAction,
        },
      ],
      { session }
    );

    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
