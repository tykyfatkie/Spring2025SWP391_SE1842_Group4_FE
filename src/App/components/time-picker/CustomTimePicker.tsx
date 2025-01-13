import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import React, { ReactNode, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './CustomTimePicker.less';
import cn from 'classnames';

interface Props {
  className?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  errorIcon?: ReactNode;
}

const timeFormat = 'HH:mm';

export const CustomTimePicker: React.FC<Props> = (props) => {
  const {
    value: propValue,
    onChange,
    name,
    className,
    error,
    errorIcon,
  } = props;
  const { useEffect } = React;
  const [value, setValue] = useState<Moment | null | undefined>(
    moment(propValue, timeFormat).isValid()
      ? moment(propValue, timeFormat)
      : null,
  );
  const [open, setOpen] = useState(false);

  const timePickerClassName = cn('custom-time-picker', className, {
    error: error,
  });

  const handleChange = (input: Moment | null) => {
    setValue(input);
    onChange?.(input?.format(timeFormat) ?? '');
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (moment(propValue, timeFormat).isValid()) {
      setValue(moment(propValue, timeFormat));
    }
  }, [propValue]);

  return (
    <TimePicker
      className={timePickerClassName}
      name={name}
      open={open}
      onFocus={handleOpen}
      onBlur={handleClose}
      allowClear={false}
      value={value}
      placeholder="00:00"
      defaultValue={moment('00:00', timeFormat)}
      format="HH:mm"
      onSelect={handleChange}
      inputReadOnly
      suffixIcon={errorIcon}
    />
  );
};
