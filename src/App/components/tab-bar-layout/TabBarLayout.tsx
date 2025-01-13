import { NeumoButton } from '@app/components';
import { NavItem } from '@app/models/side-bar-tab-item';
import { DIVIDER_WIDTH } from '@app/utils';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import ContentTile from '../content-tile/ContentTile';
import './TabBarLayout.less';

interface TabBarProps {
  children?: ReactNode;
  rightToolBar?: ReactNode;
  routerPath: string;
  navItems: NavItem[];
  noMargin?: boolean;
  queryParamsProps?: {
    isQueryParams?: boolean;
    defaultParamName?: string;
  };
  classNames?: string;
}

export const TabBarLayout: React.FC<TabBarProps> = (props) => {
  const {
    children,
    navItems: propNavItems,
    routerPath,
    noMargin = false,
    rightToolBar,
    classNames,
    queryParamsProps = { isQueryParams: false },
  } = props;

  const { useMemo, useEffect, useState } = React;

  const navItems = useMemo(() => {
    const currentRole = localStorage.getItem('ROLE') || '';
    return propNavItems.filter(
      (item) => !!!item.allowedRoles || item.allowedRoles.includes(currentRole),
    );
  }, [propNavItems]);

  const tabBarClasses = cn('tab-bar', classNames, { 'no-margin': noMargin });
  const location = useLocation();

  const getTotalTabsWidth = (endIndex?: number) => {
    let result = 0;
    const propEndIndex =
      endIndex !== undefined && endIndex >= 0 && endIndex < navItems.length
        ? endIndex - 1
        : navItems.length - 1;
    for (let i = 0; i <= propEndIndex; i++) {
      result += tabWidth(i);
    }
    return result;
  };

  const tabWidth = (index: number) => {
    var pixelWidth = require('string-pixel-width');
    const fontStyle = { font: 'Avenir Next', size: 14.5, bold: true };
    const result = navItems[index].icon
      ? pixelWidth(navItems[index].title, fontStyle) + 28 + 20
      : pixelWidth(navItems[index].title, fontStyle) + 22;
    return result > 50 ? result : 50;
  };

  const tabTrailWidth = useMemo(() => {
    return getTotalTabsWidth() + DIVIDER_WIDTH * (navItems.length - 1);
  }, [navItems]);

  const getTabButton = (index: number) => {
    const TabButtonWrapper = styled.div`
      .tab-button {
        width: ${tabWidth(index)}px;
      }
    `;
    const currentPath = `${routerPath}/${navItems[index].path}`;
    return (
      <TabButtonWrapper>
        <NeumoButton
          classNames="tab-button"
          shape="rectangular"
          icon={navItems[index].icon}
          color={navItems[index].iconColor}
          label={navItems[index].title}
          onClick={() => {
            handleTabChange(index);
          }}
          nav={
            queryParamsProps.isQueryParams
              ? {
                  path: currentPath,
                  queryParams: new URLSearchParams(navItems[index].path),
                  defaultParamName:
                    index === 0 ? queryParamsProps.defaultParamName : undefined,
                }
              : {
                  path: `${routerPath}/${navItems[index].path}`,
                  title: navItems[index].title,
                }
          }
        />
      </TabButtonWrapper>
    );
  };

  const handleTabChange = (index: number) => {
    setCurrentTabIndex(index);
    setSliderPosition(getTotalTabsWidth(index) + index * DIVIDER_WIDTH);
  };

  useEffect(() => {
    setCurrentTabIndex(currentPathIndex);
    setSliderPosition(
      getTotalTabsWidth(currentPathIndex) + currentPathIndex * DIVIDER_WIDTH,
    );
  }, [location.pathname, navItems]);

  const currentPathIndex = useMemo(() => {
    const currentSubPaths = location.pathname.split('/');
    const currentPath = currentSubPaths[currentSubPaths.length - 1];
    const currentIndex = navItems.findIndex(
      (item) => item.path === currentPath,
    );
    return currentIndex >= 0 ? currentIndex : 0;
  }, [navItems, location.pathname]);

  const [sliderPosition, setSliderPosition] = useState(
    getTotalTabsWidth(currentPathIndex) + currentPathIndex * DIVIDER_WIDTH,
  );
  const [currentTabIndex, setCurrentTabIndex] = useState(currentPathIndex);

  return (
    <>
      {navItems && (
        <nav id="tab-bar" className={tabBarClasses}>
          <ContentTile padding="narrower">
            <Grid style={{ width: tabTrailWidth }} className="tight tab-trail">
              <Grid.Column
                style={{
                  transform: `translate3d(${sliderPosition}px, 0, 0)`,
                  width: tabWidth(currentTabIndex),
                }}
                className="fit-content tab-slider"
              >
                <div className="slider" />
              </Grid.Column>
              <Grid className="tight column middle aligned fit-content tabs">
                {navItems.map((item, index) => {
                  const currentPath = `${routerPath}/${item.path}`;
                  const nextPath = `${routerPath}/${
                    navItems[index + 1]?.path ?? ''
                  }`;
                  const dividerClasses = cn('vertical-divider', {
                    invisible:
                      location.pathname === currentPath ||
                      location.pathname === nextPath,
                  });
                  return (
                    <React.Fragment key={item.path}>
                      <Grid.Column key={item.path} className="fit-content">
                        {getTabButton(index)}
                      </Grid.Column>
                      <Grid.Column className="fit-content divider">
                        <div className={dividerClasses}></div>
                      </Grid.Column>
                    </React.Fragment>
                  );
                })}
              </Grid>
              {rightToolBar && (
                <Grid className="column right floated closer-gutter fit-content">
                  {rightToolBar}
                </Grid>
              )}
            </Grid>
          </ContentTile>
        </nav>
      )}
      {children}
    </>
  );
};

export default TabBarLayout;
