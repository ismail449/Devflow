import { NextRequest, NextResponse } from "next/server";
import queryString from "query-string";

import handleError from "@/lib/handlers/error";
import { GetJobsParamsSchema } from "@/lib/validations";

const J_SEARCH_BASE_URL = process.env.J_SEARCH_BASE_URL || "";
const RAPID_API_KEY = process.env.RAPID_API_KEY || "";
const RAPID_API_HOST = process.env.RAPID_API_HOST || "";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const numberOfPages = Number(searchParams.get("pageSize")) || 1;
    const query = searchParams.get("query");
    const country = searchParams.get("country");

    GetJobsParamsSchema.parse({ page, numberOfPages, query, country });

    const urlSearchParams = queryString.stringify({
      query,
      page,
      num_pages: numberOfPages,
      country,
    });

    const headers = {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": RAPID_API_HOST,
    };

    const response = await fetch(
      `${J_SEARCH_BASE_URL}/search?${urlSearchParams}`,
      {
        headers,
      }
    );

    const jobs = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: { jobs: jobs.data, isNext: jobs.data && jobs.data.length },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
