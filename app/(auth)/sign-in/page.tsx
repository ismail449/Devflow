"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      defaultValues={{ email: "", password: "" }}
      schema={SignInSchema}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;
