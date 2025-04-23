"use client";

import Image from "next/image";
import React from "react";

import useUpdateUrlQuery from "@/hooks/useUpdateUrlQuery";

import { Input } from "../ui/input";

type Props = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  imgSrc?: string;
  route: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
};

const LocalSearch = ({
  placeholder,
  imgSrc,
  otherClasses,
  iconPosition = "left",
}: Props) => {
  const { searchQuery, setSearchQuery } = useUpdateUrlQuery("query", 600);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center rounded-[10px] p-4 ${otherClasses ?? ""}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc || "./icons/search.svg"}
          alt="search icon"
          width={20}
          height={20}
        />
      )}
      <Input
        type="search"
        placeholder={placeholder ?? ""}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        onChange={handleSearch}
        value={searchQuery}
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc || "./icons/search.svg"}
          alt="search icon"
          width={15}
          height={15}
        />
      )}
    </div>
  );
};

export default LocalSearch;
