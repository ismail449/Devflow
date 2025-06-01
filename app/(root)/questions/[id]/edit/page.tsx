import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";

const EditQuestion = async (parma: RouteParams) => {
  const session = await auth();

  if (!session) {
    redirect(ROUTES.SIGNIN);
  }
  const { id } = await parma.params;

  if (!id) return notFound();

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success || !question) return notFound();

  if (question?.author._id.toString() !== session.user?.id)
    redirect(ROUTES.QUESTION(id));
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Edit a Question</h1>
      <QuestionForm question={question} isEdit />
    </>
  );
};

export default EditQuestion;
