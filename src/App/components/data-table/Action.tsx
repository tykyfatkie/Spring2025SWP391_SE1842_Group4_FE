import React, { PropsWithChildren, useMemo } from 'react';
import { Button, Grid, Popup, SemanticCOLORS } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  NeumoButton,
  CustomColor,
  NeumoButtonState,
} from '../neumo-button/NeumoButton';
import cn from 'classnames';

const StyledIconButtonWrapper = styled.span`
  margin-left: 4px !important;
`;

const IconButton = styled(Button)`
  padding: 8px !important;
  line-height: 0 !important;
  margin-right: 0 !important;
`;

const IconWrapper = styled.div`
  svg {
    margin-right: 4px;
    vertical-align: bottom;
  }
`;

export interface DropdownAction<T> {
  icon?: JSX.Element;
  color?: SemanticCOLORS;
  label?: string | ((data: T) => string);
  onDropdownClick?: (data: T) => void;
  dropdownHidden?: (data: T) => boolean | boolean;
  dropdownDisabled?: (data: T) => boolean | boolean;
}

export interface RowAction<T> {
  className?: string;
  icon?: JSX.Element;
  color?: CustomColor | SemanticCOLORS;
  label?: string | ((data: T) => string);
  state?: NeumoButtonState | ((data: T) => NeumoButtonState);
  highlighted?: boolean;
  onClick?: (data: T) => void;
  hidden?: boolean | ((data: T) => boolean);
  disabled?: boolean | ((data: T) => boolean);
  dropdown?: boolean | ((data: T) => boolean);
  loading?: boolean | ((data: T) => boolean);
  dropdownActions?: DropdownAction<T>[];
}

export interface TableAction<T> {
  icon?: JSX.Element;
  color?: CustomColor | SemanticCOLORS;
  label?: string | ((data: T[]) => string);
  className?: string;
  state?: NeumoButtonState;
  highlighted?: boolean;
  onClick?: (data: T[]) => void;
  hidden?: boolean | ((data: T[]) => boolean);
  disabled?: boolean | ((data: T[]) => boolean);
  dropdown?: boolean | ((data: T[]) => boolean);
  loading?: boolean | ((data: T) => boolean);
  dropdownActions?: DropdownAction<T[]>[];
}

interface Props<T extends object> extends RowAction<T> {
  data: T;
}

const Action: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  const {
    icon,
    color = 'black',
    label: labelProp,
    state: stateProp = 'flat',
    onClick,
    highlighted,
    disabled: disabledProp = false,
    hidden: hiddenProp = false,
    dropdown: dropdownProp = false,
    loading: loadingProp = false,
    dropdownActions = [],
    data,
    className,
  } = props;

  const disabled = useMemo(() => {
    if (typeof disabledProp === 'function') {
      return disabledProp(data);
    }
    return disabledProp;
  }, [data, disabledProp]);

  const label = useMemo(() => {
    if (typeof labelProp === 'function') {
      return labelProp(data);
    }
    return labelProp;
  }, [data, labelProp]);

  const state = useMemo(() => {
    if (typeof stateProp === 'function') {
      return stateProp(data);
    }
    return stateProp;
  }, [data, stateProp]);

  const hidden = useMemo(() => {
    if (typeof hiddenProp === 'function') {
      return hiddenProp(data);
    }
    return hiddenProp;
  }, [data, hiddenProp]);

  const loading = useMemo(() => {
    if (typeof loadingProp === 'function') {
      return loadingProp(data);
    }
    return loadingProp;
  }, [data, loadingProp]);

  const dropdown = useMemo(() => {
    if (typeof dropdownProp === 'function') {
      return dropdownProp(data);
    }
    return dropdownProp;
  }, [data, dropdownProp]);

  const buttonClassName = cn(className, { hidden: hidden });

  const actionButton = (
    <NeumoButton
      classNames={buttonClassName}
      shape="rectangular"
      disabled={disabled}
      loading={loading}
      color={color}
      icon={icon}
      label={label}
      state={state}
      highlighted={highlighted}
      size="small"
      onClick={
        !dropdown
          ? (e: React.MouseEvent): void => {
              e.stopPropagation();
              if (typeof onClick === 'function') {
                onClick(data);
              }
            }
          : undefined
      }
    />
  );

  const getDropdownActionLabel = (action: DropdownAction<any>) => {
    if (typeof action.label === 'function') {
      return action.label(data);
    } else {
      return action.label;
    }
  };

  const getDropdownActionDisabled = (action: DropdownAction<any>) => {
    if (typeof action.dropdownDisabled === 'function') {
      return action.dropdownDisabled(data);
    } else {
      return action.dropdownDisabled !== undefined
        ? action.dropdownDisabled
        : false;
    }
  };

  const getDropdownActionHidden = (action: DropdownAction<any>) => {
    if (typeof action.dropdownHidden === 'function') {
      return !action.dropdownHidden(data);
    } else {
      return action.dropdownHidden !== undefined
        ? !action.dropdownHidden
        : true;
    }
  };

  return (
    <>
      {dropdown ? (
        <Popup
          className="action-menu"
          on={'focus'}
          positionFixed
          position="bottom right"
          trigger={actionButton}
        >
          <Grid className="closer-gutter">
            {dropdownActions
              .filter((action) => getDropdownActionHidden(action))
              .map((action) => (
                <React.Fragment key={getDropdownActionLabel(action)}>
                  <Grid.Column width="16">
                    <NeumoButton
                      classNames="menu-button"
                      disabled={getDropdownActionDisabled(action)}
                      shape="rectangular"
                      label={getDropdownActionLabel(action)}
                      rightIcon={action.icon}
                      color={action.color}
                      alignment="left"
                      onClick={() => {
                        action.onDropdownClick?.(data);
                      }}
                    />
                  </Grid.Column>
                </React.Fragment>
              ))}
          </Grid>
        </Popup>
      ) : (
        actionButton
      )}
    </>
  );
};

export default Action;
