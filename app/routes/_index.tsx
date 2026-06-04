import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSearchParams, useNavigate } from '@remix-run/react';
import { useState, useEffect, useCallback, memo } from 'react';
import { getPublicBooks } from '~/api';
import AKlogo from '~/assets/AKlogo';
import { BookCard } from '~/components/BookCard';
import { useDebounce } from '~/hooks/useDebounce';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import { Separator } from '~/components/ui/separator';
import { Alert, AlertDescription } from '~/components/ui/alert';
import {
  Search,
  MapPin,
  Phone,
  Truck,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const BookCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm">
    <Skeleton className="h-56 w-full" />
    <div className="p-4 space-y-2.5">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-2.5 border-t border-stone-100 mt-1">
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  </div>
);


const BookGrid = memo(({ books }: { books: Book[] }) => {
  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-full py-20 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-5 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-stone-700 mb-2">
          هیچ کتێبێک نەدۆزرایەوە
        </h3>
        <p className="text-stone-400 text-sm max-w-xs mx-auto">
          تکایە وشەیەکی تر تاقی بکەوە یان فلتەرەکان پاک بکەوە
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10"
    >
      <AnimatePresence>
        {books.map((book: Book, index) => (
          <motion.div key={book.id} variants={fadeInUp} custom={index} layout>
            <BookCard book={book} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

BookGrid.displayName = 'BookGrid';

const LocationSection = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="my-16"
  >
    <div className="text-center mb-10">
      <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-300 text-sm font-medium px-4 py-2 rounded-full mb-4">
        <MapPin className="w-4 h-4" />
        شوێنی کتێبخانەکە
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
        سەردانی کتێبخانەکەمان بکە
      </h2>
      <p className="text-stone-500 text-base max-w-xl mx-auto">
        بەخێربێیت بۆ کتێبخانەی ئەحمەد کۆیی، شوێنێکی ئارام بۆ خوێندنەوە و کڕینی کتێب
      </p>
    </div>

    <div className="relative max-w-5xl mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/30 to-amber-400/15 rounded-2xl blur-xl opacity-70" />
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200">
        <div className="aspect-video w-full">
          <iframe
            title="Bookstore Location"
            width="100%"
            height="100%"
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=36.25563583877866,44.8832864024485&hl=en&z=16&output=embed"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">زانیاری پەیوەندی</h3>
            <Separator className="w-16 h-0.5 bg-amber-500 rounded mb-5" />

            <div className="space-y-3">
              <div className="flex items-start gap-4 p-3.5 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                <div className="bg-amber-100 p-2.5 rounded-lg shrink-0">
                  <Phone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-1">ژمارەی پەیوەندی</p>
                  <div className="flex gap-3 flex-wrap">
                    <span dir="ltr" className="font-bold text-stone-800 text-sm">0770 158 0442</span>
                    <span className="text-stone-300">|</span>
                    <span dir="ltr" className="font-bold text-stone-800 text-sm">0750 112 3555</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                <div className="bg-emerald-100 p-2.5 rounded-lg shrink-0">
                  <Truck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">گواستنەوە</p>
                  <p className="font-semibold text-stone-800 text-sm">
                    گەیاندنی کتێب بۆ هەموو ناوچەکانی کوردستان
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 bg-stone-50 rounded-xl hover:bg-amber-50 transition-colors">
                <div className="bg-amber-100 p-2.5 rounded-lg shrink-0">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">کاتی کارکردن</p>
                  <p className="font-semibold text-stone-800 text-sm">٩:٠٠ بەیانی — تا بانگی ئێوارە</p>
                  <p className="text-xs text-stone-400 mt-0.5">هەموو ڕۆژێک جگە لە هەینی</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">پەیوەندی بکە</h3>
            <Separator className="w-16 h-0.5 bg-amber-500 rounded mb-5" />

            <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl mb-4">
              <h4 className="font-bold text-stone-800 mb-2">پرسیارێکت هەیە؟</h4>
              <p className="text-stone-500 text-sm mb-4">
                ئێمە ئامادەین بۆ وەڵامدانەوەی پرسیارەکانت و ڕێنمایکردنت لە هەڵبژاردنی کتێب
              </p>
              <div className="flex gap-2.5">
                <span className="inline-flex items-center bg-stone-900 text-amber-200 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-stone-800 transition-colors">
                  پەیوەندی بکە
                </span>
                <span className="inline-flex items-center border border-stone-300 text-stone-600 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                  واتساپ
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-stone-800 mb-1.5">شوێن</h4>
              <p className="text-stone-500 text-sm">دووسایدی سەرەکی ناوبازار تەنیشت بیتوێن مۆڵ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

LocationSection.displayName = 'LocationSection';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') ?? '';
  const page = Number(url.searchParams.get('page')) || 1;

  try {
    const books = await getPublicBooks(search, page);

    return json({
      books: books.data ?? [],
      current_page: page,
      last_page: books.last_page ?? 1,
      initialSearch: search,
      error: null,
    });
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return json({
      books: [],
      current_page: 1,
      last_page: 1,
      initialSearch: search,
      error: 'سیستەمەکە تازە ناخەملێنێت، تکایە کاتێکی تر هەوڵ بدەوە',
    });
  }
}

export default function Index() {
  const { books, current_page, last_page, initialSearch, error } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialSearch || '');
  const [page, setPage] = useState(current_page);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsNavigating(false);
  }, [books]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= last_page && !isNavigating) {
        setIsNavigating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          setPage(newPage);
          const params = new URLSearchParams(searchParams);
          params.set('page', newPage.toString());
          navigate(`?${params.toString()}`, { replace: true });
        }, 800);
      }
    },
    [last_page, navigate, searchParams, isNavigating],
  );

  const isPreviousDisabled = page === 1 || isNavigating;
  const isNextDisabled = page === last_page || isNavigating;

  const debouncedSearch = useDebounce(searchInput, 500);

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
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [debouncedSearch, searchParams, navigate, initialSearch]);

  useEffect(() => {
    setPage(current_page);
  }, [current_page]);

  if (isNavigating) {
    return (
      <main className="min-h-screen" dir="rtl">
        <div className="bg-stone-900 py-14 px-4 flex flex-col items-center">
          <AKlogo className="w-24 h-24 mb-5 animate-pulse opacity-80" />
          <Skeleton className="h-8 w-64 mb-3 rounded-xl bg-stone-700" />
          <Skeleton className="h-5 w-48 mb-6 rounded-lg bg-stone-800" />
          <Skeleton className="h-14 w-full max-w-2xl rounded-xl bg-stone-800" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
      dir="rtl"
    >
      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden bg-stone-900">
        {/* Subtle warm top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        {/* Corner decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 pb-12">
          {/* Logo + Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center mb-9"
          >
            <div className="relative mb-5">
              <div className="absolute -inset-5 bg-amber-400/10 rounded-full blur-3xl" />
              <AKlogo className="relative w-24 h-24 sm:w-28 sm:h-28" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-50 mb-3 tracking-wide">
              کتێبخانەی ئەحمەد کۆیی
            </h1>
            <p className="text-stone-400 text-base sm:text-lg max-w-md">
              گەورەترین کۆمەڵگەی کتێبخوێنان لە کوردستان
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5 pointer-events-none" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="گەڕان بۆ کتێب، نووسەر، وەرگێڕ..."
                className="w-full pr-12 pl-12 h-14 text-base rounded-xl border-2 border-stone-700 bg-stone-800/70 text-stone-100 placeholder:text-stone-500 focus-visible:border-amber-500 focus-visible:ring-0"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <AnimatePresence>
              {searchInput && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-2.5 text-sm text-stone-500"
                >
                  گەڕان بۆ:{' '}
                  <span className="font-semibold text-amber-400">{searchInput}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* Bottom edge fade */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
      </div>

      {/* ═══ BOOKS SECTION ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-stone-500 text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-stone-700">{books.length}</span>
            کتێب بەدەستهێنا
          </p>
          {last_page > 1 && (
            <span className="text-stone-400 text-sm">
              پەڕەی {page} لە {last_page}
            </span>
          )}
        </motion.div>

        {/* Books Grid */}
        <BookGrid books={books} />

        {/* Pagination */}
        {last_page > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mt-4 mb-16"
          >
            <button
              onClick={() => !isNextDisabled && handlePageChange(page + 1)}
              disabled={isNextDisabled}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 hover:bg-stone-900 hover:text-amber-300 hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              دواتر
            </button>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-amber-300 rounded-xl text-sm select-none shadow-sm">
              <span className="font-bold">{page}</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400">{last_page}</span>
            </div>

            <button
              onClick={() => !isPreviousDisabled && handlePageChange(page - 1)}
              disabled={isPreviousDisabled}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 hover:bg-stone-900 hover:text-amber-300 hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              پێشوو
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Location */}
        <LocationSection />
      </div>
    </motion.main>
  );
}

export function ErrorBoundary() {
  return (
    <main
      className="min-h-screen bg-stone-900 flex items-center justify-center p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full"
      >
        <div className="bg-stone-800 rounded-2xl shadow-2xl overflow-hidden border border-stone-700">
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-1.5" />
          <div className="pt-10 pb-8 px-8 text-center">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>

            <h1 className="text-2xl font-bold text-amber-50 mb-3">
              سیستەمەکەمان لەسەر نوێکردنەوەیە 🔧
            </h1>

            <p className="text-stone-400 mb-8">
              ئێمە لەسەر باشترکردنی سیستەمەکە کاردەکەین، کاتێکیتر دووبارە هەوڵبدەوە
            </p>

            <Separator className="mb-8 bg-stone-700" />

            <p className="text-stone-500 text-sm mb-4">
              تکایە پەیوەندی بکەن لە ڕێگەی ئەم ژمارانە بۆ زانیاری زیاتر
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex items-center gap-3 p-3 bg-stone-900/60 rounded-xl border border-stone-700">
                <Phone className="w-4 h-4 text-amber-500" />
                <span dir="ltr" className="font-bold text-amber-100 text-sm">0770 158 0442</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-stone-900/60 rounded-xl border border-stone-700">
                <Phone className="w-4 h-4 text-amber-500" />
                <span dir="ltr" className="font-bold text-amber-100 text-sm">0750 112 3555</span>
              </div>
            </div>

            <p className="mt-8 text-xs text-stone-600">
              دەتوانیت دوای ٣٠ خولەکی تر هەوڵبدەیتەوە
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
