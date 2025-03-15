import { NextRequest, NextResponse } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ValidationError, NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

// GET api/account/[id]
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new ValidationError({ id: ["required"] });
    }
    await dbConnect();
    const account = await Account.findById(id);
    if (!account) {
      throw new NotFoundError("Account");
    }
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE api/account/[id]

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new ValidationError({ id: ["required"] });
    }
    await dbConnect();
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      throw new NotFoundError("Account");
    }
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT api/account/[id]

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string }>; body: Promise<Record<string, string>> }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new ValidationError({ id: ["required"] });
    }
    const body = await request.json();
    const validatedData = AccountSchema.partial().safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    await dbConnect();

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      validatedData.data,
      {
        new: true,
      }
    );

    if (!updatedAccount) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
