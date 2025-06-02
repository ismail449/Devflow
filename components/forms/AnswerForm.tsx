"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { AnswerSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage,
} from "../ui/form";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

type Props = {
  questionId: string;
  questionTitle: string;
  questionContent: string;
};

const AnswerForm = ({ questionId, questionContent, questionTitle }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);

  const session = useSession();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const {
        data: answer,
        success,
        error,
        status,
      } = await createAnswer({
        ...data,
        questionId,
      });
      if (success) {
        form.reset();
        toast({
          title: "Success",
          description: "Your answer has been posted successfully",
        });
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast({
          title: `Error: ${status}`,
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };
  const generateAiAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast({
        title: "Please login.",
        description: "You need to be logged in to use this feature.",
      });
    }
    setIsAiSubmitting(true);
    const userAnswer = editorRef.current?.getMarkdown();
    try {
      const { success, error, data } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success) {
        return toast({
          title: "Error",
          description: error.message || "There was a problem with your request",
          variant: "destructive",
        });
      }
      const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();
      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);
        form.setValue("content", formattedAnswer);
        form.trigger("content");
      }
      toast({
        title: "Success",
        description: "AI generated answer has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsAiSubmitting(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAiSubmitting}
          onClick={generateAiAnswer}
        >
          {isAiSubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isAnswering}
            >
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
