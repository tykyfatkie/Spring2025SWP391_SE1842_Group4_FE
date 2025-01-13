import NeumoButton from '@app/components/neumo-button/NeumoButton';
import { NavItem } from '@app/models/side-bar-tab-item';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import './SideBar.less';

export interface SideBarProps {
  routerPath: string;
  items: NavItem[];
  expanded: boolean;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const { routerPath, items, expanded } = props;
  return (
    <React.Fragment>
      <nav className={`side-bar ${expanded ? 'visible' : ''}`}>
        <Grid className="tight direction-col justify-between button-grid">
          <Grid.Column textAlign="left" className="top button-group">
            {items.map((item) => {
              if (!item.isInvisible)
                return (
                  <NeumoButton
                    key={item.path}
                    classNames="side-bar-button"
                    shade="light"
                    shape="rectangular"
                    alignment="left"
                    size="large"
                    color={item.iconColor ?? undefined}
                    nav={{
                      path: `${routerPath}/${item.path}`,
                      title: item.title,
                    }}
                    icon={item.icon}
                    label={item.title}
                  />
                );
            })}
          </Grid.Column>
        </Grid>
      </nav>
      <nav className={`compact-side-bar`}>
        <Grid className="tight direction-col justify-between button-grid">
          <Grid.Column textAlign="left" className="top button-group">
            {items.map((item) => {
              if (!item.isInvisible)
                return (
                  <NeumoButton
                    key={item.path}
                    classNames="side-bar-button"
                    shade="light"
                    shape="rectangular"
                    alignment="center"
                    size="large"
                    color={item.iconColor ?? undefined}
                    nav={{
                      path: `${routerPath}/${item.path}`,
                      title: item.title,
                    }}
                    icon={item.icon}
                  />
                );
            })}
          </Grid.Column>
        </Grid>
      </nav>
    </React.Fragment>
  );
};

export default SideBar;
