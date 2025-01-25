"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

import useUpdateUrlQuery from "@/hooks/useUpdateUrlQuery";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const filters = [
  { name: "React", value: "react" },
  { name: "JavaScript", value: "javascript" },

  // { name: "Newest", value: "newest" },
  // { name: "Popular", value: "popular" },
  // { name: "Unanswered", value: "unanswered" },
  // { name: "Recommeded", value: "recommended" },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");
  const { updateUrlQuery } = useUpdateUrlQuery("filter");
  const handleFilterClick = (filterValue: string) => {
    if (filterValue === active) {
      setActive("");
      updateUrlQuery("");
    } else {
      setActive(filterValue);
      updateUrlQuery(filterValue);
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          className={cn(
            `body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
            active === filter.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleFilterClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
