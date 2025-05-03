// app/api/books.ts

const BASE_URL = process.env.PUBLIC_API_BASE_URL;

export const getPublicBooks = async (search: string, page: number) => {
  const url = new URL('/api/books', BASE_URL);
  if (search) {
    url.searchParams.set('search', search);
  }
  if (page) {
    url.searchParams.set('page', page.toString());
  }
  url.searchParams.set('per_page', '20');

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }

  const data = await res.json();
  return data;
};
