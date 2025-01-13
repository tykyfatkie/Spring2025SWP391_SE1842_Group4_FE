/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useEffect, useCallback } from 'react';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';
import { Modifier } from 'react-day-picker/types/Modifiers';

import moment from 'moment';
import './DatePicker.less';
import { Input } from 'semantic-ui-react';

const dateFormat = 'YYYY-MM-DD';

interface Props {
  className?: string;
  error?: boolean;
  name?: string;
  value?: string;
  readOnly?: boolean;
  disabledDays?: Modifier[];
  fromMonth?: Date;
  toMonth?: Date;
  icon?: any;
  onChange?: (date: string) => void;
  onError?: (err: string) => void;
}

const DatePicker: React.FC<Props> = (props) => {
  const [value, setValue] = useState<string>();
  var inputRef = React.createRef<HTMLInputElement>();

  const [inputValue, setInputValue] = useState('');
  const { value: propValue, name, className, error, icon } = props;
  useEffect(() => {
    if (propValue) {
      setValue(propValue);
      setInputValue(moment(propValue).format(dateFormat));
    } else {
      setValue(undefined);
      setInputValue('');
    }
  }, [propValue]);

  const {
    readOnly = false,
    disabledDays,
    onChange,
    onError,
    fromMonth,
    toMonth,
  } = props;

  return (
    <DayPickerInput
      value={propValue || value}
      format={dateFormat}
      parseDate={MomentLocaleUtils.parseDate}
      formatDate={MomentLocaleUtils.formatDate}
      placeholder={dateFormat}
      onDayChange={(d, m, i) => {
        if (d === undefined) {
          onError?.('InvalidDate');
        } else {
          d.setHours((-1 * d.getTimezoneOffset()) / 60);
          onChange?.(d.toISOString().split('T')[0]);
          setValue(d.toISOString().split('T')[0]);
        }
        inputRef.current?.focus();
      }}
      inputProps={{
        readOnly,
        maxLength: 10,
        name: name,
        ref: inputRef,
      }}
      keepFocus
      dayPickerProps={{
        fromMonth,
        toMonth,
        disabledDays,
        localeUtils: MomentLocaleUtils,
        className: readOnly ? 'd-none' : '',
      }}
      component={(props: any) => (
        <Input
          autoComplete="false"
          className={icon ? 'icon' : undefined}
          error={error}
          value={propValue || value}
          fluid
          {...props}
        >
          <input ref={inputRef} />
          {icon}
        </Input>
      )}
    />
  );
};

export default React.memo(DatePicker);
