/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useRef } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { Modifier, RangeModifier } from 'react-day-picker/types/Modifiers';

import moment from 'moment';
import useOutsideClick from '@archive/app/hooks/use-outside-click';
import { FiArrowRight } from 'react-icons/fi';

const Wrapper = styled.div`
  position: relative;
`;
const ArrowIcon = styled(FiArrowRight)`
  vertical-align: bottom;
  margin: 0 2px;
`;

// prettier-ignore
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3',
  'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9',
  'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const getWeekDays = (date: Date): Date[] => {
  const result: Date[] = [];
  const startOfWeek = moment(date).startOf('week').toDate();
  for (let i = 0; i < 7; i += 1) {
    result.push(moment(startOfWeek).add(i, 'days').toDate());
  }
  return result;
};

const getWeekRange = (date: Date): RangeModifier => ({
  from: moment(date).startOf('week').toDate(),
  to: moment(date).endOf('week').toDate(),
});

interface Props {
  weekStartDate?: Date;
  disabledDays?: Modifier[];
  onChange?: (range: RangeModifier) => void;
  onError?: (err: string) => void;
}

const WeekPicker: React.FC<Props> = (props) => {
  const { weekStartDate, onChange, disabledDays } = props;

  const [hoverRange, setHoverRange] = useState<RangeModifier>();
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    getWeekDays(weekStartDate ?? new Date()),
  );

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const modifiers = {
    hoverRange,
    selectedRange:
      selectedDates.length === 7
        ? {
            from: selectedDates[0],
            to: selectedDates[6],
          }
        : undefined,
    hoverRangeStart: hoverRange?.from,
    hoverRangeEnd: hoverRange?.to,
    selectedRangeStart: selectedDates?.[0],
    selectedRangeEnd: selectedDates?.[6],
  };

  const f = moment(selectedDates[0]).format('DD-MM');
  const t = moment(selectedDates[6]).format('DD-MM');
  const buttonContent = (
    <>
      {f}
      <ArrowIcon />
      {t}
    </>
  );

  return (
    <Wrapper>
      <Button
        secondary
        content={buttonContent}
        onClick={(): void => setOpen(true)}
      />
      {open && (
        <div ref={ref} className="DayPickerInput-Overlay">
          <DayPicker
            locale="vi"
            showOutsideDays
            showWeekNumbers
            months={months}
            localeUtils={MomentLocaleUtils}
            disabledDays={disabledDays}
            modifiers={modifiers}
            onDayMouseEnter={(d) => setHoverRange(getWeekRange(d))}
            onDayMouseLeave={() => setHoverRange(undefined)}
            onWeekClick={(weekNumber, days) => setSelectedDates(days)}
            onDayClick={(d) => {
              const selected = getWeekDays(d);
              setSelectedDates(selected);
              setOpen(false);
              if (onChange && selected.length === 7) {
                onChange({ from: selected[0], to: selected[6] });
              }
            }}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(WeekPicker);
