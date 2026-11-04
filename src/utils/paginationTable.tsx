import { ReactNode } from "react";
import SpkTables from "../@spk/tables/spk-tables";

interface PaginatedTableProps<T> {
  data: T[];
  currentPage: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  tableHeaders: { title: ReactNode; headerClassname?: string }[];
  renderRow: (item: T, index: number) => ReactNode;
}

export const PaginatedTable = <T,>({
  data = [],
  currentPage,
  itemsPerPage = 10,
  onPageChange,
  tableHeaders = [],
  renderRow,
}: PaginatedTableProps<T>) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);

  const maxVisiblePages = 15;
  const paginationItems: Array<number | '...'> = (() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const innerSlots = maxVisiblePages - 2; // keep 1 and totalPages always visible
    const halfInner = Math.floor(innerSlots / 2);

    let left = Math.max(2, currentPage - halfInner);
    let right = left + innerSlots - 1;

    if (right > totalPages - 1) {
      right = totalPages - 1;
      left = Math.max(2, right - innerSlots + 1);
    }

    const items: Array<number | '...'> = [1];

    if (left > 2) items.push('...');
    for (let p = left; p <= right; p += 1) items.push(p);
    if (right < totalPages - 1) items.push('...');

    items.push(totalPages);
    return items;
  })();

  return (
    <div>
      <div className="table-responsive">
        <SpkTables
          tableClass="table table-hover table-bordered border-gray-200"
          header={tableHeaders}
          tableRowclass="bg-white hover:bg-gray-50 border-b border-gray-200"
          tBodyClass="bg-white"
        >
          {currentItems.map(renderRow)}
        </SpkTables>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          Précédent
        </button>

        {paginationItems.map((item, idx) => {
          if (item === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-3 py-1 text-gray-500 select-none"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`px-3 py-1 border rounded ${
                currentPage === item
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};


