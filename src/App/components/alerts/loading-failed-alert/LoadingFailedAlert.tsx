import { OpenBoxIcon } from '@app/assets/svg';
import React from 'react';
import { IoIosRefresh } from 'react-icons/io';
import { NeumoButton } from '../..';
import './LoadingFailedAlert.less';
import cn from 'classnames';

interface LoadingFailedAlertProps {
  title?: string;
  content?: string[];
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  fullScreen?: boolean;
  classNames?: string;
  displayBoxIcon?: boolean;
  noButtonIcon?: boolean;
  noButton?: boolean;
  onClickButton?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

export const LoadingFailedAlert: React.FC<LoadingFailedAlertProps> = (
  props,
) => {
  const {
    title = 'Loading could not be completed',
    content = [
      'We might have faced some problem while loading this content, or it is no longer available. ',
      'Please press the button below to try again.',
    ],
    buttonText = 'Try again',
    fullScreen = false,
    classNames,
    onClickButton,
    displayBoxIcon = true,
    noButtonIcon,
    noButton = false,
    buttonIcon = <IoIosRefresh />,
  } = props;

  const wrapperClassNames = cn('loading-failed-alert', classNames, {
    'full-screen': fullScreen,
  });
  return (
    <div className={wrapperClassNames}>
      {displayBoxIcon && (
        <div className="image-wrapper icon">
          <OpenBoxIcon />
        </div>
      )}
      <h2 className="alert-content header">{title}</h2>
      {content.map((line) => (
        <p className="alert-content paragraph">{line}</p>
      ))}
      {!noButton && (
        <NeumoButton
          shape="rectangular"
          state="raised"
          highlighted
          label={buttonText}
          icon={!noButtonIcon ? buttonIcon : undefined}
          color="red"
          onClick={onClickButton}
        />
      )}
    </div>
  );
};
