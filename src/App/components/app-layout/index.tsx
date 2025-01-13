import { useSelector } from '@app/hooks';
import usePageTitle from '@app/hooks/use-page-title';
import { NavItem } from '@app/models/side-bar-tab-item';
import { apiPaths } from '@app/utils';
import { NARROW_SCREEN_SIZE } from '@app/utils/constants';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NotificationCard } from './notification-deck/components';
import { NotificationDeck } from './notification-deck/NotificationDeck';
import SideBar from './side-bar/SideBar';
import TopBar from './top-bar/TopBar';
import cn from 'classnames';
export interface AppLayoutProps {
  children: ReactNode;
  routerPath: string;
  navItems: NavItem[];
}

const PathsWithFloatingSidebar: string[] = [
  'maintenance-schedule-form',
  'add-item',
  'transfer-item',
  'create-request',
  'subject',
];

const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const { children, routerPath, navItems } = props;
  const { useState, Fragment } = React;
  const pathName = useLocation().pathname;
  const currentSubRoutes = pathName.slice(routerPath.length + 1).split('/');
  const currentPathName = currentSubRoutes[0];
  const useTitle = usePageTitle();
  const pageTitle = useSelector((state) => state.pageTitle.title);
  const pageIcon = useSelector((state) => state.pageTitle.icon);
  const [tabTitle, setTabTitle] = useState<string | undefined>();
  const [tabIcon, setTabIcon] = useState<React.ReactNode | undefined>();
  const [isPageWithFloatingSidebar, setIsPageWithFloatingSidebar] = useState(
    false,
  );
  const [navItemsToShow, setNavItemsToShow] = useState<NavItem[]>([]);
  const [expandedSideBarVisibility, setExpandedSideBarVisibility] = useState(
    window.innerWidth > NARROW_SCREEN_SIZE,
  );
  const [
    expandedSideBarVisibilityPref,
    setExpandedSideBarVisibilityPref,
  ] = useState(expandedSideBarVisibility);
  const [notificationDeckVisibility, setNotificationDeckVisibility] = useState(
    false,
  );

  const [connection, setConnection] = useState<HubConnection>();
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    let tmp = [...navItems];
    let result: NavItem[] = [];
    const role = localStorage.getItem('ROLE') ?? '';
    tmp.map((item) => {
      if (item.allowedRoles) {
        if (item.allowedRoles.findIndex((r) => r === role) >= 0) {
          result.push(item);
        }
      }
    });
    setNavItemsToShow(result);
  }, []);

  const currentTabIndex = navItemsToShow.findIndex((item) => {
    if (item.exact) {
      const firstSlashIndex = pathName.indexOf('/', 1);
      const currentFullPath = pathName.slice(firstSlashIndex + 1);
      return item.path === currentFullPath;
    }
    return item.path === currentPathName;
  });

  useEffect(() => {
    if (currentTabIndex >= 0) {
      useTitle.setIcon();
      useTitle.setTitle();
      setTabTitle(navItemsToShow[currentTabIndex].title);
      setTabIcon(navItemsToShow[currentTabIndex].icon);
    } else {
      setTabTitle(pageTitle);
      setTabIcon(pageIcon);
    }
  }, [currentTabIndex, pageTitle, pageIcon]);

  useEffect(() => {
    const currentIsPageWithFloatingSidebar = PathsWithFloatingSidebar.includes(
      currentPathName,
    );
    setIsPageWithFloatingSidebar(currentIsPageWithFloatingSidebar);
    if (currentIsPageWithFloatingSidebar) {
      setExpandedSideBarVisibility(false);
    } else if (window.innerWidth > NARROW_SCREEN_SIZE) {
      setExpandedSideBarVisibility(expandedSideBarVisibilityPref);
    }
  }, [currentPathName]);

  const handleSideBarButtonClick = () => {
    if (!isPageWithFloatingSidebar) {
      setExpandedSideBarVisibilityPref(!expandedSideBarVisibility);
    }
    setExpandedSideBarVisibility(!expandedSideBarVisibility);
  };
  const handleNotificationButtonClick = () => {
    setNotificationDeckVisibility(!notificationDeckVisibility);
  };

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl(apiPaths.notification.notificationHub, {
        accessTokenFactory: () => {
          return localStorage.getItem('TOKEN') ?? '';
        },
      })
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('Notify', (message) => {
            if (message.id) {
              if (!hasNewNotification) {
                setHasNewNotification(true);
              }
              toast(
                <NotificationCard
                  title={message.title}
                  content={message.body}
                  isRead={message.isSeen}
                  receivedAt={message.dateCreated}
                />,
                {
                  className: 'notification-toast',
                  position: 'top-right',
                  draggableDirection: 'x',
                  closeButton: false,
                },
              );
            }
          });
        })
        .catch((error) => console.error(error));
    }
  }, [connection]);

  const pageContainerClassName = cn(
    'page-container',
    { 'with-expanded-side-bar': expandedSideBarVisibility },
    { 'with-floating-side-bar': isPageWithFloatingSidebar },
  );

  return (
    <Fragment>
      <SideBar
        routerPath={props.routerPath}
        items={navItemsToShow}
        expanded={expandedSideBarVisibility}
      />
      <TopBar
        pageTitle={tabTitle}
        Icon={tabIcon}
        onSidebarButtonClick={handleSideBarButtonClick}
        sideBarIsVisible={expandedSideBarVisibility}
        onNotificationBarButtonClick={handleNotificationButtonClick}
        notificationBarIsVisible={notificationDeckVisibility}
        hasNewNotification={hasNewNotification}
      />
      <NotificationDeck
        visible={notificationDeckVisibility}
        hasNewNotification={hasNewNotification}
        setNotificationDeckVisibility={setNotificationDeckVisibility}
        setHasNewNotification={setHasNewNotification}
      />
      <div
        className={pageContainerClassName}
        onClick={() => {
          if (
            expandedSideBarVisibility &&
            (window.innerWidth <= NARROW_SCREEN_SIZE ||
              isPageWithFloatingSidebar)
          ) {
            setExpandedSideBarVisibility(false);
          }
          setNotificationDeckVisibility(false);
        }}
      >
        <div>{children}</div>
      </div>
    </Fragment>
  );
};

export default AppLayout;
