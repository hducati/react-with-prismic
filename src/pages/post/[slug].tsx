import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): React.ReactElement {
  const router = useRouter();

  if (router.isFallback)
    return (
      <main className={commonStyles.container}>
        <div className={styles.loadingText}>Carregando...</div>
      </main>
    );

  return (
    <main className={commonStyles.container}>
      <h1>teste</h1>
    </main>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const postsResponse = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: postsResponse.slugs[0],
    first_publication_date: new Date(postsResponse.first_publication_date)
      .toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(/de/g, '')
      .replace('.', '')
      .replace(/\s+/g, ' '),
    data: {
      title: postsResponse.data.title,
      author: postsResponse.data.author,
      banner: {
        url: postsResponse.data.banner.url,
      },
      content: {
        body: {
          heading: postsResponse.data.content[0].heading,
          text: postsResponse.data.content[0].body[0].text,
        },
      },
    },
  };

  return {
    props: {
      post,
    },
  };
};
