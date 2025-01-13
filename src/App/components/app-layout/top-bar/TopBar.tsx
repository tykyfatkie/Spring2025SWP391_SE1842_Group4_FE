import {
  AppGridIcon,
  ChevronDirection,
  ChevronIcon,
  NotificationIcon,
  ProfileIcon,
  TSMLogo,
} from '@app/assets/svg';
import { ImageBox } from '@app/components';
import NeumoButton from '@app/components/neumo-button/NeumoButton';
import useAuth from '@app/hooks/use-auth';
import { getHomePage } from '@app/utils';
import { NARROW_SCREEN_SIZE } from '@app/utils/constants';
import { ReactComponent as SidebarIcon } from '@assets/svg/sidebar_icon.svg';
import { ReactComponent as Logo } from '@assets/svg/vietjet_logo.svg';
import React from 'react';
import { GoSignOut } from 'react-icons/go';
import { IoHome } from 'react-icons/io5';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Grid, Popup } from 'semantic-ui-react';

import { clearCookie } from '@app/utils/cookie';
import PopupSSOContent from '../sso/PopupContentSSO';
import './TopBar.less';

interface TopBarProps {
  pageTitle?: string;
  Icon?: React.ReactNode;
  sideBarIsVisible: boolean;
  onSidebarButtonClick: () => void;
  notificationBarIsVisible: boolean;
  hasNewNotification: boolean;
  onNotificationBarButtonClick: () => void;
}

const TopBar: React.FC<TopBarProps> = (props) => {
  const {
    pageTitle,
    Icon,
    sideBarIsVisible,
    onSidebarButtonClick,
    notificationBarIsVisible,
    onNotificationBarButtonClick,
    hasNewNotification,
  } = props;

  const { useState, useEffect, Fragment } = React;

  const history = useHistory<{
    backStack: string[];
  }>();

  const backStack = history.location.state?.backStack;

  const auth = useAuth();

  const [widthIsNarrow, setWidthIsNarrow] = useState(false);

  const logout = () => {
    auth.logout();
    clearCookie();
    // history.push('/');
  };

  const _handleResize = () => {
    if (window.innerWidth > NARROW_SCREEN_SIZE !== widthIsNarrow) {
      setWidthIsNarrow(false);
    } else {
      setWidthIsNarrow(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', _handleResize);
    _handleResize();
  }, []);

  return (
    <nav className="top-bar">
      <Grid className="tight">
        <Grid
          verticalAlign="middle"
          className="closer-gutter column five wide fit-content"
        >
          {backStack && backStack.length > 0 && (
            <Fragment>
              <Grid.Column className=" fit-content">
                <Link
                  to={{
                    pathname: backStack[backStack.length - 1],
                    state: { backStack: backStack.slice(0, -1) },
                  }}
                >
                  <NeumoButton
                    icon={<ChevronIcon direction={ChevronDirection.left} />}
                    state="raised"
                  ></NeumoButton>
                </Link>
              </Grid.Column>
              <Grid.Column className="fit-content vertical-divider-column">
                <div className="vertical-divider visible"></div>
              </Grid.Column>
            </Fragment>
          )}
          <Grid.Column className="fit-content">
            <NeumoButton
              icon={<SidebarIcon />}
              onClick={onSidebarButtonClick}
              state={sideBarIsVisible ? 'pressed' : 'raised'}
            ></NeumoButton>
          </Grid.Column>
          {!widthIsNarrow && (
            <Grid.Column className="fit-content vertical-divider-column">
              <div className="vertical-divider"></div>
            </Grid.Column>
          )}
          <Grid.Column className="fit-content">
            <NavLink to={getHomePage()}>
              {!widthIsNarrow ? (
                <ImageBox
                  content={
                    process.env.REACT_APP_ENVIRONMENT === 'HISOFT' ||
                    process.env.REACT_APP_ENVIRONMENT === 'VJAA' ? (
                      <TSMLogo />
                    ) : (
                      // <VietjetLogo />
                      <Logo className="logo-img" />
                    )
                  }
                  classNames="logo"
                />
              ) : (
                <NeumoButton
                  classNames="home-button"
                  icon={<IoHome />}
                  state="raised"
                ></NeumoButton>
              )}
            </NavLink>
          </Grid.Column>
        </Grid>
        <Grid centered verticalAlign="middle" className="tight column six wide">
          <Grid.Row centered className="page-title align-center">
            <div className="icon image-wrapper">{Icon}</div>
            <h1 className="title">{pageTitle}</h1>
          </Grid.Row>
        </Grid>
        <Grid
          verticalAlign="middle"
          className="content-floated-right tight fit-content column five wide"
        >
          <Grid.Column className="right fit-content">
            <Popup
              className="action-menu account-popup"
              on={'click'}
              pinned
              flowing
              positionFixed
              position="bottom right"
              trigger={
                <NeumoButton
                  classNames="account-button"
                  icon={<ProfileIcon />}
                />
              }
            >
              <Grid className="closer-gutter">
                <Grid.Column width="16">
                  <div className="greeting">
                    <ImageBox classNames="icon" content={<ProfileIcon />} />
                    <div className="user-info">
                      <p className="full-name">
                        {localStorage.getItem('FULLNAME')} (
                        {localStorage.getItem('USERNAME')})
                      </p>
                      <p className="role">{localStorage.getItem('ROLE')}</p>
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column width="16">
                  <NeumoButton
                    classNames="menu-button"
                    rightIcon={<GoSignOut />}
                    alignment="left"
                    shape="rectangular"
                    label="Log out"
                    color="red"
                    onClick={logout}
                  />
                </Grid.Column>
              </Grid>
            </Popup>
          </Grid.Column>

          <Grid.Column className="right fit-content">
            <Popup
              className="action-menu account-popup"
              on={'click'}
              pinned
              flowing
              positionFixed
              position="bottom right"
              trigger={
                <NeumoButton classNames="apps-button" icon={<AppGridIcon />} />
              }
            >
              <PopupSSOContent />
            </Popup>
          </Grid.Column>

          <Grid.Column className="right fit-content ">
            <NeumoButton
              classNames={`notification-button${
                hasNewNotification ? ' has-new-notification' : ''
              }`}
              icon={<NotificationIcon />}
              onClick={onNotificationBarButtonClick}
              state={notificationBarIsVisible ? 'pressed' : 'flat'}
            />
          </Grid.Column>
        </Grid>
      </Grid>
    </nav>
  );
};

export default TopBar;
