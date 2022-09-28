namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    /**
     * The name of the GitHub repo to add discussions to
     */
    NEXT_PUBLIC_GISCUS_REPO: `${string}/${string}`;
    /**
     * The ID of the GitHub repo to add discussions to
     */
    NEXT_PUBLIC_GISCUS_REPO_ID: string;
    /**
     * The name of the discussion category
     */
    NEXT_PUBLIC_GISCUS_CATEGORY: string;
    /**
     * The ID of the discussion category
     */
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: string;
  }
}
