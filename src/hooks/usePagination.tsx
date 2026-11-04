import { useCallback, useEffect, useMemo, useState } from "react";

type PaginationState = {
  page: number;
  pageSize: number;
};

export const usePagination = <T,>(items: T[], initialPageSize = 5) => {
  const [state, setState] = useState<PaginationState>({ page: 1, pageSize: initialPageSize });

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / state.pageSize));

  useEffect(() => {
    setState((prev) => {
      const nextPage = Math.min(Math.max(1, prev.page), totalPages);
      return nextPage === prev.page ? prev : { ...prev, page: nextPage };
    });
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (state.page - 1) * state.pageSize;
    return items.slice(start, start + state.pageSize);
  }, [items, state.page, state.pageSize]);

  const setPage = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, page: Math.min(Math.max(1, page), totalPages) }));
    },
    [totalPages]
  );

  const next = useCallback(() => setPage(state.page + 1), [setPage, state.page]);
  const prev = useCallback(() => setPage(state.page - 1), [setPage, state.page]);

  const setPageSize = useCallback((pageSize: number) => {
    setState({ page: 1, pageSize });
  }, []);

  return {
    page: state.page,
    pageSize: state.pageSize,
    totalItems,
    totalPages,
    pageItems,
    setPage,
    next,
    prev,
    setPageSize,
  };
};
