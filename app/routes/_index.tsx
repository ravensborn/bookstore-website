import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSearchParams, useNavigate } from '@remix-run/react';
import { useState, useEffect, useCallback } from 'react';
import { getPublicBooks } from '~/api';
import AKlogo from '~/assets/AKlogo';
import classNames from 'classnames';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '~/components/ui/pagination';
import { BookCard } from '~/components/BookCard';
import { useDebounce } from '~/hooks/useDebounce';
import { Input } from '~/components/ui/input';

type Category = {
  id: number;
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
  const [page, setPage] = useState(current_page);
  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= last_page) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          setPage(page);
          const params = new URLSearchParams(searchParams);
          params.set('page', page.toString());
          navigate(`?${params.toString()}`);
        }, 800);
      }
    },
    [last_page, navigate, searchParams],
  );

  const isPreviousDisabled = page === 1;
  const isNextDisabled = page === last_page;

  const debouncedSearch = useDebounce(searchInput, 1000);

  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      const params = new URLSearchParams(searchParams);
      const trimmedInput = debouncedSearch.trim();

      if (trimmedInput) {
        params.set('search', trimmedInput);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      navigate(`?${params.toString()}`);
    }
  }, [debouncedSearch, searchParams, navigate, initialSearch]);

  useEffect(() => {
    setPage(current_page);
  }, [current_page]);

  return (
    <main className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex items-center justify-center mb-8">
        <AKlogo
          style={{
            width: 'clamp(80px, 15vw, 120px)',
            height: 'clamp(80px, 15vw, 120px)',
          }}
        />
        <h1
          className="font-bold text-gray-800 mr-4"
          style={{ fontSize: 'clamp(1.25rem, 5vw, 2.5rem)' }}
        >
          کتێبخانەی ئەحمەد کۆیی
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center">
        <Input
          type="text"
          name="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="گەڕان بۆ کتێب، ناوی کتێب یان نوسەر"
          className="w-full sm:w-80"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 mb-10">
        {books.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            هیچ کتێبێک نیە.
          </p>
        ) : (
          books.map((book: Book) => <BookCard key={book.id} book={book} />)
        )}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => !isPreviousDisabled && handlePageChange(page - 1)}
              className={classNames('cursor-pointer hover:bg-transparent', {
                'opacity-50 cursor-not-allowed': isPreviousDisabled,
              })}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="font-semibold text-l sm:text-2xl">
              لەپەڕە {page}
            </span>
            <span className="mx-2 text-l sm:text-2xl">لە</span>
            <span className="font-bold text-x sm:text-2xl">{last_page}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => !isNextDisabled && handlePageChange(page + 1)}
              className={classNames('cursor-pointer hover:bg-transparent', {
                'opacity-50 cursor-not-allowed': isNextDisabled,
              })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="my-10 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
          شوێنی کتێبخانەکە
        </h2>
        <div className="flex justify-center mb-6">
          <iframe
            title="Bookstore Location"
            width="100%"
            height="400"
            className="max-w-full sm:max-w-3xl md:max-w-4xl rounded-lg shadow-md"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=36.25563583877866,44.8832864024485&hl=en&z=16&output=embed"
          />
        </div>
        <div className="text-center text-gray-700 space-y-2">
          <p className="text-xl sm:text-2xl">
            📞 :{' '}
            <span className="font-bold block sm:inline" dir="ltr">
              0770 158 0442
            </span>
            <span className="hidden sm:inline-block mx-2">||</span>
            <span className="font-bold block sm:inline" dir="ltr">
              0750 112 3555
            </span>
          </p>
          <p className="text-lg sm:text-xl">
            🚚 : گەیاندنی کتێب بۆ هەموو ناوچەکانی کوردستان.
          </p>
        </div>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <main
      className="p-8 bg-gray-100 min-h-screen flex items-center justify-center"
      dir="rtl"
    >
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          سیستەمەکەمان لەسەر نوێکردنەوەیە 🔧
        </h1>
        <p className="text-gray-600 text-lg">
          ئێمە لەسەر باشترکردنی سیستەمەکە کاردەکەین، کاتێکیتر دووبارە هەوڵبدەوە
        </p>
        <p className="text-gray-500 text-sm">
          تکایە پەیوەندی بکەن لە ڕێگەی ئەم ژمارانە بۆ زانیاری زیاتر
        </p>
        <div className="text-center text-gray-700 space-y-2">
          <p className="text-lg sm:text-base">
            📞 :{' '}
            <span className="font-bold block sm:inline" dir="ltr">
              0770 158 0442
            </span>
            <span className="hidden sm:inline-block mx-2">||</span>
            <span className="font-bold block sm:inline" dir="ltr">
              0750 112 3555
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
