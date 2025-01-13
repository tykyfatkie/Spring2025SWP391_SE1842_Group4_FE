import React from 'react';
import { RiErrorWarningLine, RiCheckboxCircleLine } from 'react-icons/ri';
import { ImageBox } from '../..';
import './AlertParagraph.less';

interface Props {
  title?: string;
  content?: (string | React.ReactNode)[];
  type?: 'error' | 'warning' | 'success';
}

export const AlertParagraph: React.FC<Props> = (props) => {
  const { useMemo, isValidElement } = React;
  const { title, content, type = 'error' } = props;

  const icon = useMemo(() => {
    if (type === 'error') {
      return <RiErrorWarningLine />;
    }
    if (type === 'success') {
      return <RiCheckboxCircleLine />;
    }
  }, [type]);

  return (
    <div className={`alert-paragraph-wrapper ${type}`}>
      <div className="alert-paragraph-icon-wrapper">
        <ImageBox content={icon} />
      </div>
      <div className="alert-paragraph-content-wrapper">
        {title && <h1 className="alert-paragraph-title">{title}</h1>}
        {content &&
          content.map((c) =>
            isValidElement(c) ? (
              c
            ) : (
              <p className="alert-paragraph-content">{c}</p>
            ),
          )}
      </div>
    </div>
  );
};
