import React from 'react';
import { Checkbox } from 'semantic-ui-react';

interface Props {
  getToggleAllRowsSelectedProps: () => {
    indeterminate: boolean;
    checked: boolean;
    onChange: () => void;
  };
}

const HeaderCheckbox: React.FC<Props> = (props) => {
  const { getToggleAllRowsSelectedProps } = props;
  const { checked, onChange, indeterminate } = getToggleAllRowsSelectedProps();

  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      indeterminate={indeterminate}
    />
  );
};

export default HeaderCheckbox;
