import cn from 'classnames';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import './NeumoSearchField.less';
export interface NeumoSearchFieldProps {
  placeholder?: string;
  classNames?: string;
  onSubmit?: (value?: string) => void;
  onClear?: () => void;
}

export const NeumoSearchField: React.FC<NeumoSearchFieldProps> = (props) => {
  const { placeholder, classNames = '' } = props;
  const classes = cn('neumo-search-field', classNames);
  const [value, setValue] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const _handleIconClick = () => {
    if (value.length > 0) {
      setValue('');
      if (props.onClear && isSubmitted) {
        props.onClear();
      }
    }
    inputRef.current?.focus();
  };

  var inputRef = React.createRef<HTMLInputElement>();

  const _handleKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (props.onSubmit) {
        props.onSubmit(value);
      }
      setIsSubmitted(value.length > 0);
      inputRef.current?.blur();
    }
  };

  const _handleBlur = () => {
    if (value.length <= 0 && isSubmitted && props.onSubmit) {
      props.onSubmit();
    }
  };

  const _handleValueChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <div className={classes}>
      <input
        value={value}
        onChange={_handleValueChange}
        type="text"
        className="textfield"
        placeholder={placeholder}
        onKeyUp={_handleKeyUp}
        onBlur={_handleBlur}
        ref={inputRef}
      />
      <div className="image-wrapper icon" onClick={_handleIconClick}>
        {value.length > 0 ? <MdClear /> : <FaSearch />}
      </div>
    </div>
  );
};

export default NeumoSearchField;
