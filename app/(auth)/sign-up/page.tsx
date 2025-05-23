"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ username: "", email: "", name: "", password: "" }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;
