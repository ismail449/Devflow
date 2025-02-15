import React from "react";

import QuestionForm from "@/components/forms/QuestionForm";

const AskQuestion = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Ask a Question</h1>
      <QuestionForm />
      <div className="mt-9"></div>
    </>
  );
};

export default AskQuestion;
