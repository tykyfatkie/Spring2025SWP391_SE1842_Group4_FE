import React from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiMoreHorizontal,
} from 'react-icons/fi';
import {
  Pagination as SemUiPagination,
  StrictPaginationProps,
  Table,
} from 'semantic-ui-react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  div.pagination {
    box-shadow: none;
  }
  div.selection {
    margin-left: 8px;
  }
`;
const StyledCurrentCount = styled.span`
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  margin-left: auto;
`;

interface Props {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  gotoPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const Pagination: React.FC<Props> = (props) => {
  const {
    pageIndex,
    pageSize,
    pageCount,
    totalCount,
    gotoPage,
    setPageSize,
  } = props;

  const { useEffect } = React;

  useEffect(() => {
    gotoPage(0);
  }, [pageCount]);

  return (
    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan={100}>
          <Wrapper>
            <SemUiPagination
              boundaryRange={0}
              siblingRange={1}
              size="mini"
              activePage={pageIndex + 1}
              ellipsisItem={{ content: <FiMoreHorizontal />, icon: true }}
              firstItem={{ content: <FiChevronsLeft />, icon: true }}
              lastItem={{ content: <FiChevronsRight />, icon: true }}
              prevItem={{ content: <FiChevronLeft />, icon: true }}
              nextItem={{ content: <FiChevronRight />, icon: true }}
              totalPages={pageCount}
              onPageChange={async (
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
                data: StrictPaginationProps,
              ): Promise<void> => {
                // TODO: dirty fix
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await gotoPage((data.activePage as number) - 1);
                gotoPage((data.activePage as number) - 1);
              }}
            />
            {/* <StyledCurrentCount>{`Total: ${totalCount}`}</StyledCurrentCount> */}
            {/* <Select
              value={pageSize}
              options={[10, 20, 30, 40, 50].map((o) => ({
                value: o,
                text: `Hiển thị: ${o}`,
              }))}
              onChange={(
                event: React.SyntheticEvent<HTMLElement>,
                data: StrictDropdownProps,
              ): void => setPageSize(data.value as number)}
            /> */}
          </Wrapper>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  );
};

export default Pagination;
