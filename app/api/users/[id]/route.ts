import { NextRequest, NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError, NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

// GET api/users/[id]
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
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}

// DELETE api/users/[id]

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
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
}

// PUT api/users/[id]

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
    const validatedData = UserSchema.partial().safeParse(body);

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api");
  }
}
