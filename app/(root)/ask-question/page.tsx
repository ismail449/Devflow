import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";

const AskQuestion = async () => {
  const session = await auth();

  if (!session) {
    redirect(ROUTES.SIGNIN);
  }
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Ask a Question</h1>
      <QuestionForm />
      <div className="mt-9"></div>
    </>
  );
};

export default AskQuestion;
