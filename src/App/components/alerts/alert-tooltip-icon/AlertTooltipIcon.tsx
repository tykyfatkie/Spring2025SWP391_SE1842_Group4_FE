import cn from 'classnames';
import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { RiErrorWarningLine } from 'react-icons/ri';
import { Popup } from 'semantic-ui-react';
import './AlertTooltipIcon.less';

interface Props {
  className?: string;
  content?: string;
  customContent?: React.ReactNode;
  type?: 'error' | 'warning' | 'correct';
}

export const AlertTooltipIcon: React.FC<Props> = (props) => {
  const { useMemo } = React;
  const { content, customContent, type = 'error', className } = props;

  const wrapperClassName = cn('alert-tooltip-icon', 'wrapper', type, className);

  const icon = useMemo(() => {
    switch (type) {
      case 'error':
        return <RiErrorWarningLine />;
      case 'warning':
        return <IoWarningOutline />;
    }
  }, [type]);

  return (
    <div className={wrapperClassName}>
      <Popup
        className="alert-tooltip-icon popup"
        on={['hover']}
        pinned
        flowing
        positionFixed
        position="top center"
        trigger={<div className="alert-tooltip-icon icon">{icon}</div>}
      >
        {customContent ? (
          customContent
        ) : (
          <p className="alert-tooltip-icon content">{content}</p>
        )}
      </Popup>
    </div>
  );
};
