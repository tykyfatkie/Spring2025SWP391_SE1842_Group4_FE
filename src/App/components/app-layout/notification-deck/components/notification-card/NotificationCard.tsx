import { toSimpleShortDateTime } from '@app/utils';
import cn from 'classnames';
import React from 'react';
import { Placeholder } from 'semantic-ui-react';
import './NotificationCard.less';

interface Props {
  title?: string;
  content?: string;
  isRead?: boolean;
  receivedAt?: string;
  onReadIndicatorClick?: () => void;
  onClick?: () => void;
  customComponent?: React.ReactNode;
  loading?: boolean;
}

export const NotificationCard: React.FC<Props> = (props) => {
  const {
    title,
    content,
    isRead,
    receivedAt,
    onReadIndicatorClick,
    onClick,
    customComponent,
    loading,
  } = props;
  const { Fragment } = React;

  const className = cn(
    'notification-card',
    {
      read: isRead === undefined || isRead,
    },
    { clickable: !!onClick },
    { loading: loading },
  );
  return (
    <div className="notification-card-wrapper" onClick={onClick}>
      <div className={className}>
        {loading ? (
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        ) : customComponent ? (
          customComponent
        ) : (
          <Fragment>
            <div className="notification-card-top-line">
              <h1 className="title">{title}</h1>
              <p className="received-at">
                {receivedAt ? toSimpleShortDateTime(receivedAt) : ''}
              </p>
            </div>
            <div className="notification-card-content-line">
              <p className="content">{content}</p>
              <div className="read-indicator-wrapper">
                <div
                  className="read-indicator"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!isRead) {
                      onReadIndicatorClick?.();
                    }
                  }}
                />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};
