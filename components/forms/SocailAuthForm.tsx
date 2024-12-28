"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

import { Button } from "../ui/button";

const SocailAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  const handleSingIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME, redirect: false });
    } catch (error) {
      console.log(error);

      toast({
        title: "Sing-in failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occured while sing-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button onClick={() => handleSingIn("github")} className={buttonClass}>
        <Image
          src="/icons/github.svg"
          width={20}
          height={20}
          alt="github logo"
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with Github</span>
      </Button>
      <Button onClick={() => handleSingIn("google")} className={buttonClass}>
        <Image
          src="/icons/google.svg"
          width={20}
          height={20}
          alt="google logo"
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocailAuthForm;
