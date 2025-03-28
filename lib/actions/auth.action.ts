"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User, { UserDoc } from "@/database/user.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { SignInSchema, SignUpSchema } from "../validations";

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

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse<UserDoc>> {
  const validateResult = await action({
    params,
    schema: SignInSchema,
  });

  if (validateResult instanceof Error) {
    return handleError(validateResult) as ErrorResponse;
  }

  const { email, password } = validateResult.params!;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) {
      throw new NotFoundError("Account");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingAccount.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
