import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSearchParams, useNavigate } from '@remix-run/react';
import { useState, useEffect, useCallback, memo } from 'react';
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
import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  Search,
  MapPin,
  Phone,
  Truck,
  BookOpen,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Library,
  Award,
  Clock,
  Star,
  Bookmark,
  TrendingUp,
  Sparkles,
  Menu,
  Heart,
  Share2,
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Book Card Skeleton
const BookCardSkeleton = () => (
  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
    <div className="relative">
      <Skeleton className="w-full h-48" />
      <Badge className="absolute top-2 right-2" variant="secondary">
        <Skeleton className="w-16 h-4" />
      </Badge>
    </div>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

// Featured Categories
const categories = [
  { id: 1, name: 'ڕۆمان', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
  {
    id: 2,
    name: 'شیعر',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-600',
  },
  { id: 3, name: 'مێژوو', icon: Library, color: 'bg-amber-100 text-amber-600' },
  { id: 4, name: 'فەلسەفە', icon: Award, color: 'bg-green-100 text-green-600' },
  { id: 5, name: 'هونەر', icon: Heart, color: 'bg-rose-100 text-rose-600' },
  {
    id: 6,
    name: 'زانست',
    icon: TrendingUp,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

// Memoized book grid
const BookGrid = memo(({ books }: { books: Book[] }) => {
  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center col-span-full py-16"
      >
        <Card className="max-w-md mx-auto border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="bg-primary/5 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-primary/40" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              هیچ کتێبێک نەدۆزرایەوە
            </h3>
            <p className="text-gray-500 mb-6">
              تکایە وشەیەکی تر تاقی بکەوە یان فلتەرەکان پاک بکەوە
            </p>
            <Badge variant="outline" className="text-sm py-2 px-4">
              پێشنیار: ڕۆمان، شیعر، مێژوو
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 mb-10"
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

// Enhanced Location Section
const LocationSection = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="my-16 px-4 sm:px-6 md:px-8"
  >
    <div className="text-center mb-10">
      <Badge variant="outline" className="mb-4 px-4 py-2 text-base">
        <MapPin className="w-4 h-4 ml-2" />
        شوێنی کتێبخانەکە
      </Badge>
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        سەردانی کتێبخانەکەمان بکە
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        بەخێربێیت بۆ کتێبخانەی ئەحمەد کۆیی، شوێنێکی ئارام بۆ خوێندنەوە و کڕینی
        کتێب
      </p>
    </div>

    <div className="relative max-w-6xl mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl blur-xl opacity-75" />
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
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

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              زانیاری پەیوەندی
            </h3>
            <Separator className="w-20 h-1 bg-primary rounded" />

            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ژمارەی پەیوەندی</p>
                  <div className="flex gap-4 mt-1">
                    <span dir="ltr" className="font-bold text-lg">
                      0770 158 0442
                    </span>
                    <span className="text-gray-300">|</span>
                    <span dir="ltr" className="font-bold text-lg">
                      0750 112 3555
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="bg-green-100 p-3 rounded-full">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">گواستنەوە</p>
                  <p className="font-bold text-lg">
                    گەیاندنی کتێب بۆ هەموو ناوچەکانی کوردستان
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">کاتی کارکردن</p>
                  <p className="font-bold text-lg">
                    ٩:٠٠ بەیانی - تا بانگی ئێوارە
                  </p>
                  <p className="text-sm text-gray-500">
                    هەموو ڕۆژێک جگە لە هەینی
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">پەیوەندی بکە</h3>
            <Separator className="w-20 h-1 bg-primary rounded" />

            <div className="bg-gradient-to-br from-primary/5 to-blue-600/5 p-6 rounded-lg mt-6">
              <h4 className="font-bold text-lg mb-3">پرسیارێکت هەیە؟</h4>
              <p className="text-gray-600 mb-4">
                ئێمە ئامادەین بۆ وەڵامدانەوەی پرسیارەکانت و ڕێنمایکردنت لە
                هەڵبژاردنی کتێب
              </p>
              <div className="flex gap-3">
                <Badge className="py-2 px-4 cursor-pointer hover:bg-primary/90 transition-colors">
                  پەیوەندی بکە
                </Badge>
                <Badge
                  variant="outline"
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                >
                  واتساپ
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-lg mb-3">شوێن</h4>
              <p className="text-gray-600">
                دووسایدی سەرەکی ناوبازار تەنیشت بیتوێن مۆڵ
              </p>
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
      books: books.data,
      current_page: page,
      last_page: books.last_page,
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
      error: 'Failed to load books. Please try again.',
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
      <main
        className="p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen"
        dir="rtl"
      >
        <div className="flex items-center justify-center mb-8 animate-pulse">
          <AKlogo className="w-[clamp(80px,15vw,120px)] h-[clamp(80px,15vw,120px)]" />
          <h1 className="font-bold text-gray-800 mr-4 text-[clamp(1.25rem,5vw,2.5rem)]">
            کتێبخانەی ئەحمەد کۆیی
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center">
          <Skeleton className="w-full sm:w-80 h-10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 mb-10">
          {[...Array(8)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-blue-600/10">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur-xl opacity-30" />
              <AKlogo className="relative w-[clamp(80px,15vw,120px)] h-[clamp(80px,15vw,120px)]" />
            </div>
            <h1 className="font-bold text-gray-800 mr-4 text-[clamp(1.25rem,5vw,2.5rem)] bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              کتێبخانەی ئەحمەد کۆیی
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-8"
          >
            گەورەترین کۆمەڵگەی کتێبخوێنان لە کوردستان
          </motion.p>

          {/* Search Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-2 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="گەڕان بۆ کتێب، ناوی کتێب یان نوسەر..."
                      className="w-full pr-10 h-12 text-lg"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 h-12 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    فلتەر
                  </button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Badge
                            key={cat.id}
                            variant={
                              selectedCategory === cat.id
                                ? 'default'
                                : 'outline'
                            }
                            className={classNames(
                              'py-2 px-4 cursor-pointer transition-all hover:scale-105',
                              selectedCategory === cat.id
                                ? 'bg-primary'
                                : cat.color,
                            )}
                            onClick={() =>
                              setSelectedCategory(
                                selectedCategory === cat.id ? null : cat.id,
                              )
                            }
                          >
                            <cat.icon className="w-3 h-3 ml-1" />
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {searchInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-3"
              >
                <Badge variant="secondary" className="py-1 px-3">
                  گەڕان بۆ: {searchInput}
                  <X
                    className="w-3 h-3 mr-2 cursor-pointer hover:text-primary"
                    onClick={() => setSearchInput('')}
                  />
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>هەڵە!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Results Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-6 px-4"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-gray-600">{books.length} کتێب دۆزرایەوە</span>
          </div>
          <Badge variant="outline" className="py-1">
            پەڕەی {page} لە {last_page}
          </Badge>
        </motion.div>

        {/* Books Grid */}
        <BookGrid books={books} />

        {/* Pagination */}
        {last_page > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8 mb-12"
          >
            <Card className="inline-block">
              <CardContent className="py-3 px-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          !isPreviousDisabled && handlePageChange(page - 1)
                        }
                        className={classNames(
                          'cursor-pointer transition-all hover:bg-primary/10',
                          {
                            'opacity-50 pointer-events-none':
                              isPreviousDisabled,
                          },
                        )}
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <div className="flex items-center gap-3 px-6">
                        <span className="font-semibold text-gray-700">
                          پەڕەی
                        </span>
                        <Badge className="text-lg px-3 py-1">{page}</Badge>
                        <span className="text-gray-400">لە</span>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {last_page}
                        </Badge>
                      </div>
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          !isNextDisabled && handlePageChange(page + 1)
                        }
                        className={classNames(
                          'cursor-pointer transition-all hover:bg-primary/10',
                          {
                            'opacity-50 pointer-events-none': isNextDisabled,
                          },
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Location Section */}
        <LocationSection />
      </div>
    </motion.main>
  );
}

export function ErrorBoundary() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full"
      >
        <Card className="border-2 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2" />
          <CardContent className="pt-8 pb-8 text-center">
            <div className="bg-amber-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-amber-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              سیستەمەکەمان لەسەر نوێکردنەوەیە 🔧
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              ئێمە لەسەر باشترکردنی سیستەمەکە کاردەکەین، کاتێکیتر دووبارە
              هەوڵبدەوە
            </p>

            <Separator className="mb-8" />

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-500 text-sm mb-4">
                تکایە پەیوەندی بکەن لە ڕێگەی ئەم ژمارانە بۆ زانیاری زیاتر
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span dir="ltr" className="font-bold">
                    0770 158 0442
                  </span>
                </div>

                <span className="hidden sm:inline text-gray-300">|</span>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span dir="ltr" className="font-bold">
                    0750 112 3555
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Badge variant="outline" className="py-2 px-4">
                دەتوانیت دوای ٣٠ خولەکی تر هەوڵبدەیتەوە
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
