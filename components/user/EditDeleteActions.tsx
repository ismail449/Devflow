"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";

type Props = {
  type: "Question" | "Answer";
  itemId: string;
};

const EditDeleteActions = ({ itemId, type }: Props) => {
  const router = useRouter();

  const handleEdit = async () => {
    router.push(ROUTES.EDIT_QUESTION(itemId));
  };

  const handleDelete = async () => {
    if (type === "Question") {
      const { success, error } = await deleteQuestion({ itemId });

      if (!success) {
        return toast({
          title: "Could not delete question",
          description:
            error?.message || "There was a problem with deleting your question",
          variant: "destructive",
        });
      }

      toast({
        title: "Question deleted",
        description: "Your question has been deleted successfully.",
      });
    } else if (type === "Answer") {
      const { success, error } = await deleteAnswer({ itemId });

      if (!success) {
        return toast({
          title: "Could not delete answer",
          description:
            error?.message || "There was a problem with deleting your answer",
          variant: "destructive",
        });
      }

      toast({
        title: "Answer deleted",
        description: "Your answer has been deleted successfully.",
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "justify-center gap-0"}`}
    >
      {type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image
            src="/icons/trash.svg"
            alt="delete"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "Question" ? "question" : "answer"} and remove your data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-100 !bg-primary-500 !text-light-800"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteActions;
