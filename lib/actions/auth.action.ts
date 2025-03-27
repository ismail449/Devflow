"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User, { UserDoc } from "@/database/user.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse<UserDoc>> {
  const validateResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { email, name, password, username } = validateResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const [createdUser] = (await User.create([{ email, name, username }], {
      session,
    })) as UserDoc[];

    await Account.create(
      [
        {
          userId: createdUser._id,
          name,
          password: hashedPassword,
          provider: "credentials",
          providerAccountId: email,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
