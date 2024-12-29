"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { SignInShema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      defaultValues={{ email: "", passord: "" }}
      schema={SignInShema}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignIn;
