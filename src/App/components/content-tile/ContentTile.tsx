import cn from 'classnames';
import React from 'react';
import NeumoButton from '../neumo-button/NeumoButton';
import './ContentTile.less';

export interface ContentTileProps {
  children?: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  padding?: 'normal' | 'narrower' | 'none';
  inAnotherTile?: boolean;
  classNames?: string;
  actionButton?: {
    label?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
}

export const ContentTile: React.FC<ContentTileProps> = (props) => {
  const {
    children,
    label,
    icon,
    classNames = '',
    actionButton,
    inAnotherTile = false,
    padding = 'normal',
  } = props;
  const classes = cn(
    'content-tile',
    classNames,
    { 'sub-tile': inAnotherTile },
    `padding-${padding}`,
  );
  return (
    <div className={classes}>
      {label && (
        <div
          className={`label-row ${actionButton ? 'with-action-button' : ''}`}
        >
          <div className="label-side">
            {icon && <div className="icon image-wrapper">{icon}</div>}
            <h2 className="label">{label}</h2>
          </div>
          {actionButton && (
            <div className="action-button">
              <NeumoButton
                icon={actionButton.icon}
                shape="rectangular"
                size="small"
                label={actionButton.label}
                onClick={actionButton.onClick}
                disabled={actionButton.disabled}
                loading={actionButton.loading}
              />
            </div>
          )}
        </div>
      )}
      <div className="content">{children}</div>
    </div>
  );
};

export default ContentTile;
