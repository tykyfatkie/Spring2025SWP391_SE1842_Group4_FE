/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useEffect, useCallback } from 'react';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';
import { Modifier } from 'react-day-picker/types/Modifiers';

import moment from 'moment';

const locale = 'vi';
const dateFormat = 'DD-MM-YYYY';

// prettier-ignore
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3',
  'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9',
  'Tháng 10', 'Tháng 11', 'Tháng 12',
];

interface Props {
  value?: Date;
  readOnly?: boolean;
  disabledDays?: Modifier[];
  onChange: (date: Date) => void;
  onError?: (err: string) => void;
}

const DateTimePicker: React.FC<Props> = (props) => {
  const [time, setTime] = useState('00:00');
  const [value, setValue] = useState<Date>();
  const [inputValue, setInputValue] = useState('');
  const { value: propValue } = props;
  useEffect(() => {
    if (propValue) {
      setValue(propValue);
      setInputValue(moment(propValue).format(dateFormat));
    }
  }, [propValue]);

  const onKeyUp = useCallback((e: React.KeyboardEvent): void => {
    const target = e?.target as HTMLInputElement;
    const { value: eValue } = target;
    if (eValue === '') {
      setValue(undefined);
    }

    const d = eValue.replace(/\D/g, '').slice(0, 10);
    if (d.length >= 4) {
      const result = `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
      setInputValue(result);
    } else if (d.length >= 2) {
      const result = `${d.slice(0, 2)}-${d.slice(2)}`;
      setInputValue(result);
    } else {
      setInputValue(d);
    }
  }, []);

  const { readOnly = false, disabledDays, onChange, onError } = props;
  return (
    <div>
      <DayPickerInput
        value={inputValue || value}
        format={dateFormat}
        parseDate={MomentLocaleUtils.parseDate}
        formatDate={MomentLocaleUtils.formatDate}
        placeholder={dateFormat}
        onDayChange={(d) => {
          if (d === undefined) {
            onError?.('InvalidDate');
          } else {
            onChange(d);
            setValue(d);
          }
        }}
        inputProps={{ readOnly, onKeyUp, maxLength: 10 }}
        dayPickerProps={{
          months,
          locale,
          disabledDays,
          localeUtils: MomentLocaleUtils,
          className: readOnly ? 'd-none' : '',
        }}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => {
          setTime(e.target.value);
        }}
      />
    </div>
  );
};

export default DateTimePicker;
