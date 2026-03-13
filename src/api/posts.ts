import { Elysia } from 'elysia'

const postsData = [
  {
    id: 1,
    title: 'BunnyX 0.0.5 Released',
    slug: 'bunnyx-1-0-released',
    excerpt: 'The bridge between Elysia and B.E.R.T.U.I. is now stable and ready for production.',
    author: 'Ernest',
    date: '2026-03-15',
    category: 'Release',
    image: '/logomain.svg',
    content: 'Support of open api that is powerd by elysia',
  },
  {
    id: 2,
    title: 'Elysia 1.2 Adds Better Types',
    slug: 'elysia-1-2-better-types',
    excerpt: 'Faster validation and improved type inference across the board.',
    author: 'saltyaom',
    date: '2026-03-10',
    category: 'Update',
    image: 'https://elysiajs.com/assets/elysia.svg',
    content: 'The latest Elysia release brings significant improvements to type inference and runtime validation speed. Eden treaty users will notice immediate benefits.',
  },
  {
    id: 3,
    title: 'B.E.R.T.U.I. Hits 2.0',
    slug: 'bertui-2-0',
    excerpt: 'File-based routing and zero config by default — the fastest React framework just got faster.',
    author: 'Ernest',
    date: '2026-03-05',
    category: 'Release',
    image: '/b.svg',
    content: 'B.E.R.T.U.I. 2.0 ships with file-based routing, zero config HMR, and dramatically faster build times. If you were waiting for stable — this is it.',
  },
] as const;

type Post = typeof postsData[number];
type Slug = Post['slug'];

export const postsRoutes = new Elysia({ prefix: '/api/posts' })
  .get('/', () => ({ posts: postsData }))
  .get('/:slug', ({ params }) => {
    const post = postsData.find(p => p.slug === params.slug);
    return {
      post: post ?? { title: 'Not found', content: 'Post does not exist', author: '', date: '', image: '', category: '', slug: '' }
    };
  });