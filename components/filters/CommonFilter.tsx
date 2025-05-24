"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

type Props = {
  filters: { name: string; value: string }[];
  otherClasses: string;
  containerClasses: string;
};

const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={cn("relative", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
            otherClasses
          )}
          aria-label="Filter options"
        >
          <div className="line-clamp-1 flex-1 text-start">
            <SelectValue placeholder="select a filter" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => {
              return (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
