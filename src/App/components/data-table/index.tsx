/* eslint-disable react/jsx-props-no-spreading */
import { TABLE_ROW_AMOUNT } from '@app/utils';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import {
  FiChevronDown,
  FiChevronRight,
  FiCornerLeftUp,
  FiSlash,
} from 'react-icons/fi';
import {
  useExpanded,
  UseExpandedRowProps,
  UseExpandedState,
  useGroupBy,
  UseGroupByCellProps,
  UseGroupByColumnProps,
  UseGroupByRowProps,
  usePagination,
  UsePaginationState,
  useRowSelect,
  useTable,
} from 'react-table';
import { Button, Dimmer, Header, Loader, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import SearchBar from '../SearchBar';
import Action from './Action';
import ExpanderCell from './ExpanderCell';
import HeaderCheckbox from './HeaderCheckbox';
import Pagination from './Pagination';
import RowCheckbox from './RowCheckbox';
import {
  Column as IColumn,
  DataTableInstance as IDataTableInstance,
  Props,
  TableOptions,
} from './types';

// #region styled
const Wrapper = styled.div`
  position: relative;
  border-radius: 7px;
  // overflow: hidden;
  .ui.sortable.table thead th {
    border-left: none;
  }
`;
const TableWrapper = styled.div`
  table {
    margin-top: 0 !important;
  }
`;
const SearchBarWrapper = styled.div`
  margin-bottom: 8px;
`;
const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0;
`;
const TableHeader = styled(Header)`
  margin-bottom: 0 !important;
  font-size: 28px !important;
`;
const ActionsWrapper = styled.div`
  margin-left: auto;
`;
const ExpandCell = styled(Table.Cell)`
  background: rgba(34, 36, 38, 0.05);
  padding-left: 50px !important;
`;
const StyledIconButton = styled(Button)`
  width: 30px;
  height: 30px;
  padding: 3px !important;
  background: transparent !important;
`;
const iconButton = (Icon: React.FC, props: object) => (
  <StyledIconButton icon={<Icon />} {...props} />
);
// #endregion

export const DataTable: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {

  // #region columns and data
  const {
    data,
    columns: propColumns,
    noPaging = false,
    pageCount: controlledPageCount,
    totalCount,
  } = props;

  type T = typeof data[0];
  type DataTableInstance = IDataTableInstance<T>;

  const { subComponent } = props;

  const columns = useMemo(
    () =>
      propColumns.map((c) => ({
        Header: c.header,
        accessor: c.accessor,
        aggregate: c.aggregate,
        Aggregated: c.renderAggregated,
        widthPercentage: c.widthPercentage,
        required: c.required,
      })),
    [propColumns],
  );

  const [searchValue, setSearchValue] = useState('');
  // const filteredData = useMemo(() => filterArray(data, searchValue), [
  //   data,
  //   searchValue,
  // ]);
  const options: TableOptions<T> = {
    columns,
    data: data,
    pageCount: controlledPageCount,
    manualPagination: Boolean(controlledPageCount),
    autoResetPage: false,
    pageSize: TABLE_ROW_AMOUNT!,
    pageIndex: 0,
  };

  const { selectable = false, rowActions = [] } = props;

  const tableInstance = useTable(
    options,
    useGroupBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (subComponent) {
        hooks.visibleColumns.push((visibleColumns) => [
          { id: 'expander', Header: () => null, Cell: ExpanderCell },
          ...visibleColumns,
        ]);
      }
      if (selectable) {
        hooks.visibleColumns.push((visibleColumns) => [
          { id: 'selection', Header: HeaderCheckbox, Cell: RowCheckbox },
          ...visibleColumns,
        ]);
      }
      if (rowActions.length > 0) {
        hooks.visibleColumns.push((visibleColumns) => [
          ...visibleColumns,
          {
            id: 'action',
            Header: (): null => null,
            Cell: (table: DataTableInstance) =>
              rowActions.map((a) => (
                <Action
                  key={`${a.label}|${a.color ?? 'rainbow'}`}
                  data={table.row.original}
                  icon={a.icon}
                  color={a.color}
                  className={a.className}
                  label={a.label}
                  highlighted={a.highlighted}
                  state={a.state}
                  onClick={a.onClick}
                  hidden={a.hidden}
                  disabled={a.disabled}
                  dropdown={a.dropdown}
                  loading={a.loading}
                  dropdownActions={a.dropdownActions}
                />
              )),
          },
        ]);
      }
    },
  ) as DataTableInstance;
  // #endregion

  // #region search
  const { search = false, onSearch } = props;
  useEffect(() => {
    if (onSearch && searchValue) {
      onSearch(searchValue);
    }
  }, [onSearch, searchValue]);

  const searchNode = useMemo(
    () =>
      search ? (
        <SearchBarWrapper>
          <SearchBar onChange={(v): void => setSearchValue(v)} />
        </SearchBarWrapper>
      ) : null,
    [search],
  );
  // #endregion

  // #region pagination
  const {
    pageCount,
    gotoPage,
    setPageSize,
    state: paginationState,
  } = tableInstance;
  const { pageIndex, pageSize } = paginationState as UsePaginationState<T>;
  const { onPaginationChange } = props;
  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex, pageSize });
    }
  }, [onPaginationChange, pageIndex, pageSize]);

  useEffect(() => {
    onPaginationChange?.({ pageIndex: 0, pageSize });
  }, [pageCount]);

  const paginationNode = useMemo(
    () =>
      !noPaging ? (
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={pageCount}
          totalCount={totalCount || data.length}
          gotoPage={gotoPage}
          setPageSize={setPageSize}
        />
      ) : null,
    [
      noPaging,
      pageIndex,
      pageSize,
      pageCount,
      totalCount,
      data.length,
      gotoPage,
      setPageSize,
    ],
  );
  // #endregion

  // #region selectable actions
  const { selectedFlatRows } = tableInstance;
  const { tableActions } = props;
  const tableActionsNode = useMemo(
    () => (
      <ActionsWrapper>
        {selectable && (
          <span>{`Đã chọn: ${selectedFlatRows.length} dòng  `}</span>
        )}
        {tableActions?.map((a) => (
          <Action
            key={`${a.label}|${a.color ?? 'rainbow'}`}
            data={selectedFlatRows.map((r) => r.original)}
            icon={a.icon}
            color={a.color}
            label={a.label}
            onClick={a.onClick}
            hidden={a.hidden}
            disabled={a.disabled}
            dropdown={a.dropdown}
            dropdownActions={a.dropdownActions}
            className={a.className}
          />
        ))}
      </ActionsWrapper>
    ),
    [tableActions, selectedFlatRows, selectable],
  );
  // #endregion

  // #region render
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    visibleColumns,
    state: tableState,
    options: tableOptions,
  } = tableInstance;

  const { expanded } = tableState as UseExpandedState<T>;
  const expandedRowKeys = useMemo(
    () => Object.keys(expanded).map((k) => `row_${k}`),
    [expanded],
  );

  const remainingWidth = useMemo(() => {
    let result = 100;
    let columnsWithoutWidth = 0;
    headerGroups.forEach((hg) => {
      hg.headers.forEach((h) => {
        const widthPercentage = Object(h)['widthPercentage'];
        if (widthPercentage !== undefined) {
          result -= Object(h)['widthPercentage'];
        } else {
          columnsWithoutWidth++;
        }
      });
    });
    if (result > 0) {
      return columnsWithoutWidth > 0 ? result / columnsWithoutWidth : 0;
    } else {
      return 0;
    }
  }, []);

  const {
    title,
    striped = false,
    loading = false,
    groupBy = false,
    rowError,
    onRowClick,
    noOnRowClick,
    classNames,
    customHeader,
    structured,
    cellColSpan,
  } = props;

  return (
    <Wrapper className="data-table">
      <Dimmer inverted active={loading}>
        <Loader>Loading</Loader>
      </Dimmer>
      {/* {searchNode} */}
      {/* <ToolbarWrapper>
        {typeof title === 'string' && <TableHeader content={title} />}
        {typeof title !== 'string' && title}
        {tableActionsNode}
      </ToolbarWrapper> */}
      <TableWrapper>
        <Table
          className={classNames}
          sortable
          stackable
          celled={structured}
          structured={structured}
          size="small"
          compact="very"
          striped={striped}
          role={getTableProps().role}
          selectable={Boolean(onRowClick)}
          fixed
        >
          {customHeader ? (
            customHeader
          ) : (
            <Table.Header>
              {headerGroups.map((hg) => {
                const {
                  key: headerGroupKey,
                  role: headerGroupRole,
                } = hg.getHeaderGroupProps();

                return (
                  <Table.Row key={headerGroupKey} role={headerGroupRole}>
                    {hg.headers.map((c, index) => {
                      const { key: rowKey, role: rowRole } = c.getHeaderProps();
                      // prettier-ignore
                      const columnWithGroupBy = c as unknown as UseGroupByColumnProps<T>;

                      const widthPercentage: number =
                        Object(c)['widthPercentage'] ?? remainingWidth;

                      const required: boolean = Object(c)['required'];
                      return (
                        <Table.HeaderCell
                          className={
                            required ? 'with-required-asterisk' : undefined
                          }
                          key={rowKey}
                          role={rowRole}
                          style={{ width: `${widthPercentage}%` }}
                          content={
                            <>
                              {groupBy &&
                                columnWithGroupBy.canGroupBy &&
                                iconButton(
                                  columnWithGroupBy.isGrouped
                                    ? FiSlash
                                    : FiCornerLeftUp,
                                  columnWithGroupBy.getGroupByToggleProps(),
                                )}
                              {c.render('Header')}
                            </>
                          }
                        />
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Header>
          )}
          <Table.Body role={getTableBodyProps().role}>
            {page.map((r) => {
              prepareRow(r);
              const { key: rKey, role: rRole } = r.getRowProps();
              let noRowClick = false;
              if (noOnRowClick && r.original && noOnRowClick(r.original)) {
                noRowClick = true;
              }
              return (
                <React.Fragment key={rKey}>
                  <Table.Row
                    className={noRowClick ? 'no-row-click' : ''}
                    error={rowError && rowError(r.original)}
                    role={rRole}
                    onClick={
                      noRowClick
                        ? undefined
                        : (): void => {
                          if (onRowClick && r.original) {
                            setTimeout(() => {
                              onRowClick(r.original);
                            }, 100);
                          }
                        }
                    }
                  >
                    {r.cells.map((c) => {
                      const { key: cKey, role: cRole } = c.getCellProps();
                      const accessor = (cKey as string).split('_')[2];
                      const render = propColumns.find(
                        (pc) => pc.accessor === accessor,
                      )?.render;

                      // prettier-ignore
                      const cellWithGroupBy = (c as unknown) as UseGroupByCellProps<T>;
                      // prettier-ignore
                      const rowWithGroupBy = (r as unknown) as UseGroupByRowProps<T>;
                      // prettier-ignore
                      const rowWithExpanded = (r as unknown) as UseExpandedRowProps<T>;
                      const cellNode = render
                        ? render(c.row.original)
                        : c.render('Cell');

                      let content: React.ReactNode = null;
                      if (groupBy && cellWithGroupBy.isGrouped) {
                        content = (
                          <>
                            {iconButton(
                              rowWithExpanded.isExpanded
                                ? FiChevronDown
                                : FiChevronRight,
                              rowWithExpanded.getToggleRowExpandedProps(),
                            )}
                            {cellNode}
                            {` (${rowWithGroupBy.subRows.length})`}
                          </>
                        );
                      } else if (cellWithGroupBy.isAggregated) {
                        content = c.render('Aggregated');
                      } else if (!cellWithGroupBy.isPlaceholder) {
                        content = cellNode;
                      }

                      const textAlign = `${cKey}`.includes('action')
                        ? 'right'
                        : 'left';

                      if (
                        cKey.toString().includes('action') &&
                        r.cells.every((c) => {
                          return (
                            c.value === '-' ||
                            c.value === undefined ||
                            c.value === 'null'
                          );
                          // return c.value === '-' || !c.value;
                        })
                      ) {
                        content = null;
                      }
                      return (
                        <Table.Cell
                          colSpan={cellColSpan}
                          className={
                            cKey.toString().includes('action')
                              ? 'action-cell'
                              : ''
                          }
                          key={cKey}
                          role={cRole}
                          content={content}
                          textAlign={textAlign}
                        />
                      );
                    })}
                  </Table.Row>

                  {/* expand */}
                  {subComponent && expandedRowKeys.includes(`${rKey}`) && (
                    <Table.Row>
                      <ExpandCell
                        colSpan={visibleColumns.length}
                        content={subComponent(r.original)}
                      />
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
          {paginationNode}
        </Table>
      </TableWrapper>
    </Wrapper>
  );
  // #endregion
};

export type Column<T> = IColumn<T>;
export * from './Action';

// (DataTable as any).whyDidYouRender = true;
export default DataTable;
