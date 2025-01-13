import { LoadingFailedAlert } from '@app/components';
import NeumoButton from '@app/components/neumo-button/NeumoButton';
import { Notification } from '@app/models';
import { getNotification, markNotificationAsRead } from '@app/services';
import { SUCCESS_STATUS_CODE, TABLE_ROW_AMOUNT } from '@app/utils';
import cn from 'classnames';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationCard } from './components';
import './NotificationDeck.less';

interface Props {
  visible: boolean;
  hasNewNotification: boolean;
  setNotificationDeckVisibility: (visible: boolean) => void;
  setHasNewNotification: (hasNewNotification: boolean) => void;
}

export const NotificationDeck: React.FC<Props> = (props) => {
  const {
    visible,
    hasNewNotification,
    setNotificationDeckVisibility,
    setHasNewNotification,
  } = props;
  const { useState, useEffect, useMemo, Fragment } = React;

  const location = useLocation<{ backStack: string[] }>();
  const backStack = location.state?.backStack;
  const path = `/${location.pathname.split('/')[1]}`;

  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isGettingNotification, setIsGettingNotification] = useState(false);
  const [cannotGetNotification, setCannotGetNotification] = useState(false);
  const [notificationDeckOffset, setNotificationDeckOffset] = useState(130);

  const className = cn(
    'notification-deck',
    { visible: visible },
    { scrolled: notificationDeckOffset < 120 },
  );

  const _handleScroll = () => {
    const notificationContent = document.getElementById(
      'notification-deck-content',
    );
    const scrollOffset =
      notificationContent?.getBoundingClientRect().top ?? 120;
    setNotificationDeckOffset(scrollOffset);
  };

  const _getNotification = async (checkNewNotification: boolean = false) => {
    setCannotGetNotification(false);
    setIsGettingNotification(true);
    await getNotification(0, 20)
      .then((response) => {
        setIsGettingNotification(false);
        if (response.status === SUCCESS_STATUS_CODE) {
          setNotificationList(response.data.data);
          if (checkNewNotification) {
            response.data.data.some(async (notification) => {
              if (!notification.IsSeen) {
                await setTimeout(() => {
                  setHasNewNotification(true);
                }, 2000);
                return true;
              }
            });
          }
        }
      })
      .catch((error) => {
        setIsGettingNotification(false);
        setCannotGetNotification(true);
        console.error(error);
      });
  };

  const _markAsRead = (notificationId: string, index: number) => {
    markNotificationAsRead(notificationId)
      .then((response) => {
        if (response.status === SUCCESS_STATUS_CODE) {
          const newList = notificationList.concat();
          newList[index] = response.data;
          setNotificationList(newList);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    _getNotification(true);
    document
      .getElementById('notification-deck-content-wrapper')
      ?.addEventListener('scroll', _handleScroll);
    return () => {
      document
        .getElementById('notification-deck-content-wrapper')
        ?.removeEventListener('scroll', _handleScroll);
    };
  }, []);

  useEffect(() => {
    if (visible && hasNewNotification) {
      _getNotification();
      setHasNewNotification(false);
    }
  }, [visible, hasNewNotification]);

  const notificationDeckIsEmptyAlert = (
    <NotificationCard
      customComponent={
        <p className="no-notification-alert">
          Yay, your notification deck is empty.
        </p>
      }
    />
  );

  const cannotLoadNotificationAlert = (
    <NotificationCard
      customComponent={
        <LoadingFailedAlert
          displayBoxIcon={false}
          content={[
            'We have encountered some problem loading the notification.',
            'Press the button below to try again.',
          ]}
          onClickButton={(event) => {
            event.stopPropagation();
            _getNotification();
          }}
        />
      }
    />
  );

  const loadingPlaceholder = useMemo(() => {
    const result = [];
    for (let index = 0; index < TABLE_ROW_AMOUNT; index++) {
      result.push(<NotificationCard key={index} loading />);
    }
    return result;
  }, []);

  const notificationDeckContent = useMemo(() => {
    if (isGettingNotification) {
      return <Fragment>{loadingPlaceholder}</Fragment>;
    } else {
      if (!cannotGetNotification) {
        if (notificationList.length > 0) {
          return (
            <Fragment>
              {notificationList.map(
                ({ Title, Body, DateCreated, IsSeen, Id }, index) => (
                  <NotificationCard
                    key={Id}
                    title={Title}
                    content={Body}
                    receivedAt={DateCreated}
                    isRead={IsSeen}
                    onReadIndicatorClick={() => {
                      _markAsRead(Id, index);
                    }}
                  />
                ),
              )}
            </Fragment>
          );
        } else {
          return notificationDeckIsEmptyAlert;
        }
      } else {
        return cannotLoadNotificationAlert;
      }
    }
  }, [isGettingNotification, cannotGetNotification, notificationList]);

  return (
    <div className={className}>
      <div className="notification-deck-title-line">
        <h2>Notifications</h2>
        {notificationList.length > 0 && (
          <Link
            className="view-all-button"
            to={{
              pathname: `${path}/notifications`,
              state: {
                backStack: (backStack ?? []).concat(location.pathname),
              },
            }}
          >
            <NeumoButton
              size="small"
              label="View all"
              color="red"
              onClick={() => {
                setNotificationDeckVisibility(false);
              }}
            />
          </Link>
        )}
      </div>
      <div
        id="notification-deck-content-wrapper"
        className="notification-deck-content-wrapper"
      >
        <div
          id="notification-deck-content"
          className="notification-deck-content"
        >
          {notificationDeckContent}
        </div>
      </div>
    </div>
  );
};
