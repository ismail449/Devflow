import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import Account from "@/database/account.model";
import User, { UserDoc } from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Received data:", data);
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse(data);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, username, email, image } = validatedData.data.user;

    const clearedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser: UserDoc = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: clearedUsername,
            email,
            image,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
          },
        ],
        { session }
      );
    } else {
      const updatedUserData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedUserData.name = name;
      if (existingUser.image !== image) updatedUserData.image = image;

      if (Object.keys(updatedUserData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedUserData },
          {
            session,
          }
        );
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name: clearedUsername,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            image,
          },
        ],
        { session }
      );
    }
    await session.commitTransaction();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error("Error signing in with OAuth", error);
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
