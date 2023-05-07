/* eslint-disable jsx-a11y/no-static-element-interactions */
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Router from 'next/router';
import { getPrismicClient } from '../services/prismic';

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

export default function Home({ postsPagination }: HomeProps) {
  function formatDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy', {
      locale: ptBR,
    });
  }

  function handlePostClick(uid: string): void {
    console.log(uid);
    Router.push(`/posts/${uid}`);
  }

  return (
    <main className={styles.home}>
      <img className={styles.logo} src="Logo.png" alt="" />
      <div className={styles.postsContainer}>
        {postsPagination.results.map(post => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            key={post.uid}
            className={styles.postItem}
            onClick={() => handlePostClick(post.uid)}
          >
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <div className={styles.metadata}>
              <div className={styles.content}>
                <FiCalendar />
                <span>{formatDate(post.first_publication_date)}</span>
              </div>
              <div className={styles.content}>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
  // TODO
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post');

  console.log(postsResponse.results);

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title as string,
        subtitle: post.data.subtitulo as string,
        author: post.data.author as string,
      },
    };
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
