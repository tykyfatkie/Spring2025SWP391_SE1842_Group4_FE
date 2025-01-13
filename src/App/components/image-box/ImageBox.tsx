import { BoxIcon } from '@app/assets/svg';
import { beBaseUrl, cleanObject } from '@app/utils';
import React, { useMemo } from 'react';
import { Placeholder } from 'semantic-ui-react';
import cn from 'classnames';
import './ImageBox.less';

interface ImageBoxProps {
  content?: string | React.ReactNode;
  loading?: boolean;
  title?: string;
  classNames?: string;
  withShadow?: boolean;
  roundedCorner?: boolean;
  squareRatio?: boolean;
  buttonAnimation?: boolean;
  onClick?: () => void;
  onHoverOverlay?: React.ReactNode;
}

export const ImageBox: React.FC<ImageBoxProps> = (props) => {
  const {
    content: propContent,
    loading,
    withShadow,
    title,
    classNames,
    roundedCorner,
    squareRatio,
    buttonAnimation,
    onClick,
    onHoverOverlay,
  } = cleanObject(props);

  const imageBoxClassnames = cn(
    'image-box',
    classNames,
    {
      'with-shadow': withShadow,
    },
    { 'without-content': !propContent },
    { 'rounded-corner': roundedCorner },
    { 'square-ratio': squareRatio },
    { 'button-animation': buttonAnimation },
  );

  const content = useMemo(() => {
    if (!propContent || React.isValidElement(propContent)) {
      return propContent;
    } else if (typeof propContent === 'string') {
      return <img src={propContent} title={title} alt={title} />;
    }
  }, [propContent]);

  const loadingPlaceholder = (
    <Placeholder className="loading-placeholder">
      <Placeholder.Image />
    </Placeholder>
  );

  return (
    <div onClick={onClick} className={imageBoxClassnames}>
      {!loading ? (
        content ? (
          <React.Fragment>
            {squareRatio && <div className="height-constraint"></div>}
            <div className="image-wrapper">{content}</div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="height-constraint"></div>
            <div className="placeholder">
              <ImageBox content={<BoxIcon />} classNames="placeholder-icon" />
            </div>
          </React.Fragment>
        )
      ) : (
        <React.Fragment>
          <div className="height-constraint"></div>
          {loadingPlaceholder}
        </React.Fragment>
      )}
      {onHoverOverlay && <div className="overlay">{onHoverOverlay}</div>}
    </div>
  );
};
