import React from 'react';
import { Button } from 'semantic-ui-react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

const IconButton = styled(Button)`
  padding: 8px !important;
  line-height: 0 !important;
  margin-right: 0 !important;
`;

interface Props {
  row: {
    getToggleRowExpandedProps: () => {
      onClick: (data: object) => void;
    };
    isExpanded: boolean;
  };
}

const ExpanderCell: React.FC<Props> = (props) => {
  const { row } = props;
  const { getToggleRowExpandedProps, isExpanded } = row;
  const { onClick } = getToggleRowExpandedProps();

  return (
    <IconButton
      basic
      circular
      onClick={onClick}
      icon={isExpanded ? <FiChevronDown /> : <FiChevronRight />}
    />
  );
};

export default ExpanderCell;
