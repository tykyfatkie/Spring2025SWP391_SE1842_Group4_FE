import { queryParamsIsSubsetOfAnother } from '@app/utils/helpers';
import { ChevronDirection, ChevronIcon } from '@assets/svg';
import cn from 'classnames';
import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import './NeumoButton.less';

interface NeumoButtonProps {
  shape?: 'circular' | 'rectangular';
  classNames?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  state?: NeumoButtonState;
  highlighted?: boolean;
  label?: string;
  color?: CustomColor | SemanticCOLORS;
  size?: 'regular' | 'large' | 'small';
  shade?: 'light' | 'dark';
  alignment?: 'left' | 'right' | 'center';
  onClick?: (() => any) | ((e: React.MouseEvent) => void);
  nav?: {
    path: string;
    title?: string;
    queryParams?: URLSearchParams;
    defaultParamName?: string;
    replace?: boolean;
  };
  chevron?: {
    position: 'left' | 'right';
    direction: ChevronDirection;
  };
  disabled?: boolean;
  loading?: boolean;
  submit?: boolean;
}

export const NeumoButton = React.forwardRef<
  HTMLButtonElement,
  NeumoButtonProps
>((props, ref: React.LegacyRef<HTMLButtonElement>) => {
  const {
    shape = 'circular',
    classNames = '',
    size = 'regular',
    icon = null,
    rightIcon = null,
    highlighted = false,
    state = 'flat',
    shade = 'light',
    alignment = 'center',
    label = null,
    chevron = null,
    color,
    onClick,
    nav,
    disabled = false,
    loading,
    submit,
  } = props;
  const classes = cn(
    'neumo-button',
    classNames,
    shape,
    shade,
    color,
    state,
    `${size}-size`,
    alignment,
    { highlighted: highlighted },
    {
      'with-left-icon': icon,
    },
    {
      'with-right-icon': rightIcon,
    },
    { 'with-label': label },
    { 'with-chevron': chevron },
    { loading: loading },
  );

  if (nav) {
    let navLinkTo = nav.path;
    if (nav.queryParams) {
      navLinkTo += '?' + nav.queryParams.toString();
    }
    return (
      <NavLink
        data-tooltip={label ? undefined : nav.title}
        data-position={label ? undefined : 'right center'}
        to={navLinkTo}
        replace={nav.replace}
        activeClassName="highlighted"
        isActive={
          nav.queryParams
            ? (match, location) => {
                const currentParams = new URLSearchParams(location.search);
                if (nav.defaultParamName) {
                  return (
                    currentParams.get(nav.defaultParamName) === null ||
                    queryParamsIsSubsetOfAnother(
                      nav.queryParams as URLSearchParams,
                      currentParams,
                    )
                  );
                } else {
                  return queryParamsIsSubsetOfAnother(
                    nav.queryParams as URLSearchParams,
                    currentParams,
                  );
                }
              }
            : undefined
        }
        className={classes}
        onClick={
          disabled
            ? undefined
            : (event) => {
                onClick?.(event);
              }
        }
      >
        {chevron && chevron.position === 'left' && (
          <div className={`image-wrapper chevron left`}>
            <ChevronIcon direction={chevron.direction} />
          </div>
        )}
        {icon && <div className="image-wrapper icon">{icon}</div>}
        {label && <p className="label">{label}</p>}
        {label && rightIcon && (
          <div className="image-wrapper icon">{rightIcon}</div>
        )}
        {chevron && chevron.position === 'right' && (
          <div className={`image-wrapper chevron right`}>
            <ChevronIcon direction={chevron.direction} />
          </div>
        )}
      </NavLink>
    );
  }
  return (
    <button
      ref={ref}
      type={submit ? 'submit' : 'button'}
      disabled={disabled}
      onClick={
        loading || disabled
          ? undefined
          : (event) => {
              onClick?.(event);
            }
      }
      className={classes}
    >
      <Dimmer active={loading} inverted={!highlighted || state === 'flat'}>
        <Loader />
      </Dimmer>
      {chevron && chevron.position === 'left' && (
        <div className={`image-wrapper chevron left`}>
          <ChevronIcon direction={chevron.direction} />
        </div>
      )}
      {icon && <div className="image-wrapper icon">{icon}</div>}
      {label && <p className="label">{label}</p>}
      {label && rightIcon && (
        <div className="image-wrapper icon">{rightIcon}</div>
      )}
      {chevron && chevron.position === 'right' && (
        <div className={`image-wrapper chevron right`}>
          <ChevronIcon direction={chevron.direction} />
        </div>
      )}
    </button>
  );
});

export type CustomColor =
  | 'red'
  | 'green'
  | 'yellow'
  | 'cardboard'
  | 'blue'
  | 'orange'
  | 'dark-gray'
  | 'gray';

export type NeumoButtonState = 'raised' | 'flat' | 'pressed';

export default NeumoButton;
