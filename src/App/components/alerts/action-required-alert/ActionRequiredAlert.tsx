import React from 'react';
import './ActionRequiredAlert.less';
import cn from 'classnames';

interface Props {
  content: string[];
  className?: string;
  dashedBorder?: boolean;
}

export const ActionRequiredAlert: React.FC<Props> = (props) => {
  const { content, className: propClasses, dashedBorder } = props;

  const className = cn(`action-required-alert`, propClasses, {
    'dashed-border': dashedBorder,
  });

  return (
    <div className={className}>
      {content.map((c, index) => (
        <p key={index} className="paragraph">
          {c}
        </p>
      ))}
    </div>
  );
};
