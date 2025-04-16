"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { LoaderIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";

import TagCard from "../cards/TagCard";
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

type Props = {
  isEdit?: boolean;
  question?: Question;
};

const QuestionForm = ({ isEdit = false, question }: Props) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });
  const handleTagRemove = (
    tag: string,
    field: {
      value: string[];
    }
  ) => {
    const filteredTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", filteredTags);

    if (filteredTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();
      if (
        tagInput &&
        tagInput.length < 15 &&
        !field.value.some(
          (value) => value.toLowerCase() === tagInput.toLowerCase()
        )
      ) {
        const tags = field.value;
        if (tags.length < 5) {
          form.setValue("tags", [...field.value, tagInput]);
          e.currentTarget.value = "";
          form.clearErrors("tags");
        }
      } else if (tagInput.length >= 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag length must be less than 15 characters",
        });
      } else if (
        field.value.some(
          (value) => value.toLowerCase() === tagInput.toLowerCase()
        )
      ) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already added",
        });
      }
    }
  };
  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>
  ) => {
    startTransition(async () => {
      let result;
      if (isEdit && question) {
        result = await editQuestion({
          ...data,
          questionId: question._id,
        });
      } else {
        result = await createQuestion(data);
      }

      if (result.success) {
        toast({
          title: isEdit
            ? "Question edited successfully"
            : "Question created successfully",
        });
        if (result.data)
          router.push(ROUTES.QUESTIONS(result.data._id as string));
      } else {
        toast({
          title: `Error: ${result.status}`,
          description: result.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };
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
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 ? (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {field.value.map((tag: string) => {
                        return (
                          <TagCard
                            _id={tag}
                            key={tag}
                            name={tag}
                            isCompact
                            remove
                            isButton
                            handleRemove={() => handleTagRemove(tag, field)}
                          />
                        );
                      })}
                    </div>
                  ) : null}
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
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>{isEdit ? "Edit" : "Ask A Question"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
