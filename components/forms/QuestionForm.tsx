"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";

import { AskQuestionSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });
  const handleCreateQuestion = () => {};
  return (
    <Form {...form}>
      <form
        className="mt-8 flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-medium text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  required
                  type="text"
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you’re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-medium text-dark400_light800">
                Detailed explanation of your problem?{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-medium text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    required
                    type="text"
                    {...field}
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags"
                  />
                  tags
                </div>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 5 tags to describe what your question is about. Start
                typing to see suggestions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
          >
            Ask A Question
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
