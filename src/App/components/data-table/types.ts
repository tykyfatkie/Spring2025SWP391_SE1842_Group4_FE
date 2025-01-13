import React, { ReactNode } from 'react';
import {
  AggregatedValue,
  DefaultAggregators,
  TableInstance,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseRowSelectInstanceProps,
  UseTableCellProps,
  UseTableOptions,
} from 'react-table';

import { RowAction, TableAction } from './Action';

export interface Column<T> {
  header: string | JSX.Element;
  widthPercentage?: number;
  accessor: keyof Partial<T>;
  render?: (d: T) => ReactNode;
  aggregate?: DefaultAggregators;
  renderAggregated?: (props: { value: AggregatedValue }) => ReactNode;
  required?: boolean;
}

export interface Props<T extends object> {
  title?: string | JSX.Element;
  classNames?: string;
  striped?: boolean;
  loading?: boolean;
  rowError?: (d: T) => boolean;
  structured?: boolean;

  columns: Column<T>[];
  customHeader?: JSX.Element;
  cellColSpan?: string;

  data: T[];

  search?: boolean;
  onSearch?: (searchValue: string) => void;

  selectable?: boolean;
  rowActions?: RowAction<T>[];
  tableActions?: TableAction<T>[];

  groupBy?: boolean;

  onRowClick?: (data: T) => void;
  noOnRowClick?: (data: T) => boolean;

  subComponent?: (data: T) => JSX.Element;

  noPaging?: boolean;
  onPaginationChange?: (param: { pageIndex: number; pageSize: number }) => void;
  pageCount?: number;
  totalCount?: number;
}

export type TableOptions<T extends object> = UseTableOptions<T> &
  UsePaginationOptions<T> &
  UseExpandedOptions<T> &
  UseGroupByOptions<T> &
  UsePaginationState<T>;

export type DataTableInstance<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> &
  UseExpandedInstanceProps<T> &
  UseTableCellProps<T> &
  UseGroupByInstanceProps<T> &
  UseRowSelectInstanceProps<T>;
