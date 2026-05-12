import { Button } from './Button.jsx';

export const PAGE_SIZE = 20;

export function PaginationBar({ page, pageSize, total, onPageChange, className = '' }) {
  if (total <= pageSize) return null;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 0;
  const hasNext = (page + 1) * pageSize < total;
  return (
    <div className={`pagination-bar ${className}`.trim()}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </Button>
      <span className="hint">
        Сторінка {page + 1} з {totalPages}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Далі
      </Button>
    </div>
  );
}
