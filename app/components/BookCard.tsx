import BookCover from '~/assets/BookCover';
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
  const categoryColor = categoryColors[book.category.id] ?? DEFAULT_CATEGORY_COLOR;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Cover */}
      <div className="relative overflow-hidden bg-stone-100 flex-shrink-0 h-56">
        <span className="absolute top-2.5 right-2.5 z-10 bg-stone-900/75 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-md text-amber-200">
          {book.category.name}
        </span>
        {book.cover ? (
          <img
            src={book.cover}
            alt={`${book.name} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
            <BookCover
              title={book.name}
              color={categoryColor}
              width="100%"
              height="100%"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-stone-900 text-base leading-snug mb-3 line-clamp-2">
          {book.name}
        </h3>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-stone-400 shrink-0 text-xs">نووسەر:</span>
            <span className="text-stone-700 text-sm font-medium truncate">{book.author}</span>
          </div>
          {book.translator && (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-stone-400 shrink-0 text-xs">وەرگێڕ:</span>
              <span className="text-stone-600 text-sm truncate">{book.translator}</span>
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-stone-100">
          <span className="font-bold text-amber-700 text-lg tabular-nums">
            {book.price.toLocaleString('en-US')}
          </span>
          <span className="text-stone-400 text-xs">دینار</span>
        </div>
      </div>
    </div>
  );
}
