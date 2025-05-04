import { json, LoaderFunctionArgs } from '@remix-run/node';
import {
  useLoaderData,
  Form,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import { useState } from 'react';
import { getPublicBooks } from '~/api';
import AKlogo from '~/assets/AKlogo';
import classNames from 'classnames';
import BookCover from '~/assets/BookCover';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '~/components/ui/pagination';

type Category = {
  name: string;
};

type Book = {
  id: string;
  name: string;
  author: string;
  translator: string;
  price: number;
  category: Category;
  cover: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') ?? '';
  const page = Number(url.searchParams.get('page')) || 1;

  const books = await getPublicBooks(search, page);

  return json({
    books: books.data,
    current_page: page,
    last_page: books.last_page,
    initialSearch: search,
  });
}

export default function Index() {
  const { books, current_page, last_page, initialSearch } =
    useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialSearch || '');
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= last_page) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      navigate(`?${params.toString()}`);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    navigate(`?${params.toString()}`);
  };

  const isPreviousDisabled = current_page === 1;
  const isNextDisabled = current_page === last_page;

  return (
    <main className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex items-center justify-center mb-8">
        <AKlogo height={100} width={100} />
        <h1 className="text-3xl font-bold text-gray-800 mr-4">
          کتێبخانەی ئەحمەد کۆی
        </h1>
      </div>

      <Form
        method="get"
        className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center"
        onSubmit={(e) => {
          if (!searchInput.trim()) {
            e.preventDefault();
          }
        }}
      >
        <input
          type="text"
          name="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="گەڕان بۆ کتێب، ناوی کتێب یان نوسەر"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            گەڕان
          </button>
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
            >
              پاککردنەوە
            </button>
          )}
        </div>
      </Form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {books.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            هیچ کتێبێک نیە.
          </p>
        ) : (
          books.map((book: Book) => (
            <Card
              key={book.id}
              className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 py-1 rounded-2xl overflow-hidden"
            >
              <CardHeader className="p-0">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`${book.name} cover`}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <BookCover
                    title={book.name}
                    className="w-full h-64 object-cover"
                    width="100%"
                    height="100%"
                  />
                )}
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{book.name}</h3>
                <div className="flex flex-col text-sm text-gray-600">
                  <span>✍ نووسەر: {book.author}</span>
                  <span>🔄 وەرگێڕ: {book.translator}</span>
                  <span>📚 بابەت: {book.category.name}</span>
                </div>
                <div className="mt-2 text-right">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    نرخ: {book.price.toLocaleString('en-US')} دینار{' '}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                !isPreviousDisabled && handlePageChange(current_page - 1)
              }
              className={classNames('cursor-pointer hover:bg-transparent', {
                'opacity-50 cursor-not-allowed': isPreviousDisabled,
              })}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="font-semibold">لەپەڕە {current_page}</span>
            <span className="mx-2">لە</span>
            <span className="font-bold">{last_page}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                !isNextDisabled && handlePageChange(current_page + 1)
              }
              className={classNames('cursor-pointer hover:bg-transparent', {
                'opacity-50 cursor-not-allowed': isNextDisabled,
              })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="my-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          شوێنی کتێبخانەکە
        </h2>
        <div className="flex justify-center">
          <iframe
            title="Bookstore Location"
            width="100%"
            height="400"
            className="max-w-4xl rounded-lg shadow-md"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=36.25563583877866,44.8832864024485&hl=ku&z=16&output=embed`}
          ></iframe>
        </div>
      </div>
    </main>
  );
}
