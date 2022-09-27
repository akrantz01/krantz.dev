import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

const Comments = (): JSX.Element => {
  const { resolvedTheme } = useTheme();

  return (
    <Giscus
      repo={process.env.NEXT_PUBLIC_GISCUS_REPO}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID}
      category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID}
      mapping="title"
      reactionsEnabled="1"
      emitMetadata="0"
      theme={resolvedTheme}
    />
  );
};

export default Comments;
