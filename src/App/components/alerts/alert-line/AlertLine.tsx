import React from 'react';
import { ImageBox } from '@app/components';
import { RiErrorWarningLine } from 'react-icons/ri';
import './AlertLine.less';

interface Props {
  content: string;
  type?: 'error' | 'warning' | 'correct';
  margin?: 'top' | 'bottom' | 'top-and-bottom' | 'none';
}

export const AlertLine: React.FC<Props> = (props) => {
  const { useMemo } = React;
  const { content, type = 'error', margin = 'top' } = props;

  const icon = useMemo(() => {
    return <RiErrorWarningLine />;
  }, [type]);

  return (
    <div className={`alert-line ${type} margin-${margin}`}>
      <div className="alert-line-icon">{icon}</div>
      <p className="alert-line-content">{content}</p>
    </div>
  );
};
