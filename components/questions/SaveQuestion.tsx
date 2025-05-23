"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast({
        title: "You need to be logged in to save a question",
        variant: "destructive",
      });

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || "An error occurred");

      toast({
        title: `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error saving question",
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Image
        src="/icons/star-filled.svg"
        width={18}
        height={18}
        alt="save"
        className={`cursor-pointer ${isLoading && "opacity-50"}`}
        aria-label="Save Question"
        onClick={handleSave}
      />
    </div>
  );
};

export default SaveQuestion;
