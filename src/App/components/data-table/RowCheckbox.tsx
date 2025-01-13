import React from 'react';
import { Checkbox } from 'semantic-ui-react';

interface Props {
  row: {
    getToggleRowSelectedProps: () => {
      checked: boolean;
      onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    };
  };
}

const RowCheckbox: React.FC<Props> = (props) => {
  const {
    row: { getToggleRowSelectedProps },
  } = props;
  const { checked, onChange } = getToggleRowSelectedProps();

  return (
    <Checkbox
      checked={checked}
      onChange={(e): void => {
        e.stopPropagation();
        onChange(e);
      }}
    />
  );
};

export default RowCheckbox;
