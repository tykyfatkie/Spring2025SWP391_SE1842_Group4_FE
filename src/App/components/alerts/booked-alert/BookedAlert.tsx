import { BookedPlan } from '@app/models';
import { toSimpleDateTime, toStandardDateTime } from '@app/utils';
import React from 'react';
import './BookedAlert.less';

interface Props {
  plans: BookedPlan[];
  displayQuantity?: boolean;
}

export const BookedAlert: React.FC<Props> = (props) => {
  const { plans, displayQuantity = true } = props;
  const { Fragment, useMemo } = React;

  const title = useMemo(() => {
    const demonstrativePronoun = plans.length > 1 ? 'these' : 'this';
    const periodText = plans.length > 1 ? 'periods' : 'period';
    if (displayQuantity) {
      return `Some item in this batch is booked during ${demonstrativePronoun} ${periodText}`;
    } else {
      return `This item is booked during ${demonstrativePronoun} ${periodText}`;
    }
  }, [plans, displayQuantity]);

  return (
    <div className="booked-alert-wrapper">
      <h2 className="title">{title}</h2>
      {plans.map((p, index) => (
        <Fragment>
          <div className="plan-line">
            <div className="plan-block">
              <p className="from-to-text">from</p>
              <p>{toStandardDateTime(p.TimeReceive)}</p>
            </div>
            <div className="plan-block">
              <p className="from-to-text">to</p>
              <p>{toStandardDateTime(p.EstimateReturnAt)}</p>
            </div>
            {displayQuantity && (
              <div className="plan-block">
                <p className="quantity">{p.Quantity}x</p>
              </div>
            )}
          </div>
          {index !== plans.length - 1 && <div className="divider" />}
        </Fragment>
      ))}
    </div>
  );
};
