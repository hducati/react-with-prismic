// eslint-disable-next-line no-use-before-define
import React from 'react';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination,
}: HomeProps): React.ReactElement {
  return (
    <main className={commonStyles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.headerContent}>
          <img src="/Logo.svg" alt="logo" />
        </div>
        <div className={styles.postsContent}>
          {postsPagination.results.map(post => (
            <div
              className={styles.postContent}
              key={`${post.data.title}-${post.data.subtitle}`}
            >
              <Link href={`/post/${post.uid}`}>
                <h1>{post.data.title}</h1>
              </Link>
              <span className={styles.subtitle}>{post.data.subtitle}</span>
              <div className={styles.postDetails}>
                <div>
                  <FiCalendar className={styles.calendarIcon} />
                  <span>{post.first_publication_date}</span>
                </div>
                <div>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 6,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.slugs[0],
      first_publication_date: new Date(post.first_publication_date)
        .toLocaleString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(/de/g, '')
        .replace('.', '')
        .replace(/\s+/g, ' '),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        nextPage: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
