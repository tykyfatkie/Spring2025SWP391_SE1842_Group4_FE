import React from 'react';
import './InfoTag.less';

interface Props {
  content: string;
  color?: 'green' | 'gray' | 'yellow' | 'red' | 'blue';
}

export const InfoTag: React.FC<Props> = (props) => {
  const { content, color = 'gray' } = props;
  return <div className={`info-tag ${color}`}>{content}</div>;
};
