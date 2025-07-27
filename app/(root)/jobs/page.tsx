import React from "react";

import JobCard from "@/components/cards/JobCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_JOBS } from "@/constants/states";
import { api } from "@/lib/api";

const Jobs = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const userLocationInfo = await api.ip.getCurrentUserCountry();

  const countryCode = filter || userLocationInfo.countryCode;

  const [{ success, data, error }, countryInfo, countiesNames] =
    await Promise.all([
      api.jobs.getJobs({
        numberOfPages: Number(pageSize) || 1,
        page: Number(page) || 1,
        query: query || "dev jobs",
        country: countryCode,
      }),
      api.countries.getCountryDataUsingCode(countryCode),
      api.countries.getCountriesNames(),
    ]);

  const countryFlags = countryInfo[0].flags;

  const { jobs, isNext } = data || {};

  const JobPageFilters = countiesNames.map((country) => ({
    name: country.name.common,
    value: country.cca2,
  }));

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Jobs</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.JOBS}
          placeholder="Job Title, Company, or Keywords"
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={JobPageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses=""
          defaultValue={countryCode}
        />
      </section>
      <DataRenderer
        empty={EMPTY_JOBS}
        render={(jobs) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                countryFlagInfo={countryFlags}
              />
            ))}
          </div>
        )}
        success={success}
        data={jobs}
        error={error}
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Jobs;
