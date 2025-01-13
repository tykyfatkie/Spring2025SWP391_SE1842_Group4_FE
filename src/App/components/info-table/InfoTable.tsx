import { InfoTableRow } from '@app/models/info-table-row';
import React from 'react';
import { Placeholder, Table } from 'semantic-ui-react';
import './InfoTable.less';
import cn from 'classnames';

interface InfoTableProps {
  content?: InfoTableRow[];
  loading?: boolean;
  lineAmount?: number;
  classNames?: string;
  labelAlign?: 'top' | 'middle' | 'middle-form-field';
  showNAForBlankContent?: boolean;
}

export const InfoTable: React.FC<InfoTableProps> = (props) => {
  const {
    content,
    lineAmount = 8,
    classNames = '',
    labelAlign = 'top',
    loading,
    showNAForBlankContent = true,
  } = props;

  const getLength = (index: number) => {
    if (index === 0) {
      return 'short';
    }
    if (index % 6 === 0) {
      return 'very long';
    }
    if (index % 5 === 0) {
      return 'short';
    }
    if (index % 3 === 0) {
      return 'medium';
    }
    if (index % 4 === 0) {
      return 'full';
    }
    if (index % 2 === 0) {
      return 'very short';
    }
    return 'long';
  };

  const labelClassName = (row: InfoTableRow) => {
    return cn(
      'label',
      row.labelClassNames,
      {
        'middle-form-field': labelAlign === 'middle-form-field',
      },
      { 'with-required-asterisk': row.requiredLabel },
    );
  };

  const getContent = () => {
    if (loading) {
      var loadingPlaceholder = [];
      for (var i = 0; i < lineAmount; i++) {
        loadingPlaceholder.push(
          <Table.Row key={i}>
            <Table.Cell verticalAlign="middle" width="3">
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line />
                </Placeholder.Header>
              </Placeholder>
            </Table.Cell>
            <Table.Cell verticalAlign="middle">
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length={getLength(i)} />
                </Placeholder.Header>
              </Placeholder>
            </Table.Cell>
          </Table.Row>,
        );
      }
      return loadingPlaceholder;
    } else {
      return content?.map((row, index) => {
        if (!row.hidden) {
          return (
            <Table.Row key={index}>
              <Table.Cell
                verticalAlign={
                  labelAlign !== 'middle-form-field' ? labelAlign : 'top'
                }
                width="3"
              >
                <h2 className={labelClassName(row)}>{row.label}</h2>
              </Table.Cell>
              <Table.Cell className={row.contentClassNames}>
                {row.content ? (
                  row.content.map((item) => {
                    return React.isValidElement(item) ? (
                      item
                    ) : !item && !showNAForBlankContent ? undefined : (
                      <p
                        className={`content ${row.contentClassNames ?? ''}`}
                        key={item ?? index}
                      >
                        {item
                          ? item
                          : showNAForBlankContent
                          ? 'n/a'
                          : undefined}
                      </p>
                    );
                  })
                ) : (
                  <p>n/a</p>
                )}
              </Table.Cell>
            </Table.Row>
          );
        }
      });
    }
  };
  return (
    <Table striped compact="very" className={`info-table ${classNames}`}>
      <Table.Body>{getContent()}</Table.Body>
    </Table>
  );
};
