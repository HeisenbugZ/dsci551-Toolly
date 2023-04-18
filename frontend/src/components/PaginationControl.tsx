import React from 'react';
import clsx from 'clsx';
import { PaginationMeta } from '@/.apis/model';

export interface PaginationControlProps {
  meta?: PaginationMeta;
  page: number;
  onChangePage: (p: number) => void;
}

export const PaginationControl: React.VFC<PaginationControlProps> = (props) => {
  const { meta, page, onChangePage } = props;

  return (
    <div className="flex gap-x-4">
      <a>Page {page} {meta?.totalPages && `/ ${meta.totalPages}`}</a>|
      <a
        onClick={() => {
          if (page >= 2) {
            onChangePage(page - 1);
          }
        }}
        className={clsx(page < 2 && "cursor-not-allowed text-gray-100")}
      >
        Previous
      </a>
      |
      <a
        onClick={() => {
          if (meta && page < meta.totalPages) {
            onChangePage(page + 1);
          }
        }}
        className={clsx(!(meta && page < meta.totalPages) && "cursor-not-allowed text-gray-100")}
      >
        Next
      </a>
    </div>
  );
};
