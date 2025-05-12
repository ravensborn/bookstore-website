import BookCover from '~/assets/BookCover';
import { Card, CardContent, CardHeader } from './ui/card';
import { categoryColors, DEFAULT_CATEGORY_COLOR } from '~/shared/general';

type Book = {
  id: string;
  name: string;
  author: string;
  translator: string;
  price: number;
  category: { id: number; name: string };
  cover: string | null;
};

export function BookCard({ book }: { book: Book }) {
  const categoryColor =
    categoryColors[book.category.id] ?? DEFAULT_CATEGORY_COLOR;

  return (
    <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader
        className="p-0 flex justify-center items-center h-64"
        style={{ backgroundColor: '#f3f4f6' }}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={`${book.name} cover`}
            className="w-[250px] h-full object-cover"
          />
        ) : (
          <BookCover
            title={book.name}
            color={categoryColor}
            className="w-full h-full object-cover"
            width="100%"
            height="100%"
          />
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-1">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
          {book.name}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700">
          ✍ نووسەر: {book.author}
        </p>
        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700">
          🔄 وەرگێڕ: {book.translator}
        </p>
        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700">
          📚 بابەت: {book.category.name}
        </p>
        <div className="text-right mt-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm lg:text-base xl:text-lg font-semibold px-3 py-1 rounded-full">
            نرخ: {book.price.toLocaleString('en-US')} دینار
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
