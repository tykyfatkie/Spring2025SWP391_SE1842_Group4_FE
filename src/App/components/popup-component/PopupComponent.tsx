import { ImageBox, NeumoButton } from '@app/components';
import { usePopup, useSelector } from '@app/hooks';
import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { Grid, Modal, Transition } from 'semantic-ui-react';
import './PopupComponent.less';

const PopupComponent: React.FC = () => {
  const {
    title,
    open,
    visible,
    content,
    type,
    closeButtonLabel = 'Close',
    confirmButtonLabel = 'Confirm',
    onCloseButtonClick,
    onConfirmButtonClick,
  } = useSelector((state) => state.popup);

  const { useMemo } = React;
  const { Header, Content, Actions } = Modal;
  const { Row, Column } = Grid;

  const toast = usePopup();

  const handleClose = () => {
    toast.hide();
  };

  const header = useMemo(() => {
    if (
      type === 'confirm' ||
      type === 'confirmDangerous' ||
      (type === 'inform' && !!title)
    ) {
      return (
        <Header>
          <Grid className="closer-gutter">
            {type === 'confirmDangerous' && (
              <Column className="fit-content">
                <ImageBox
                  classNames="danger-icon"
                  content={<RiErrorWarningLine />}
                />
              </Column>
            )}
            <Column
              centered
              textAlign="center"
              className="tight column fit-content flex-grow-1"
            >
              <h1 className="modal-title">{title || 'Confirm'}</h1>
            </Column>
            {type === 'confirmDangerous' && (
              <Column className="fit-content">
                <ImageBox
                  classNames="danger-icon"
                  content={<RiErrorWarningLine />}
                />
              </Column>
            )}
          </Grid>
        </Header>
      );
    }
  }, [type, title]);

  const _getContent = () => {
    if (React.isValidElement(content)) {
      return content;
    } else if (typeof content === 'string') {
      return <p className="popup-paragraph">{content}</p>;
    } else if (content) {
      return content.map((c) => <p className="popup-paragraph">{c}</p>);
    }
  };

  return (
    <Transition visible={visible} animation="fade up" duration={200}>
      <Modal
        className={`popup-component${
          type === 'confirmDangerous' ? ' dangerous' : ''
        }`}
        open={open}
        size="small"
      >
        {header}
        <Content>{_getContent()}</Content>
        <Actions className="footer">
          <Grid className="content-floated-right closer-gutter fit-content">
            <Column className="fit-content">
              <NeumoButton
                shape="rectangular"
                state="raised"
                highlighted={type === 'inform'}
                label={closeButtonLabel}
                onClick={onCloseButtonClick ?? handleClose}
              />
            </Column>
            {(type === 'confirm' || type === 'confirmDangerous') && (
              <Column className="fit-content">
                <NeumoButton
                  shape="rectangular"
                  state="raised"
                  color="red"
                  highlighted
                  label={confirmButtonLabel}
                  onClick={onConfirmButtonClick ?? handleClose}
                />
              </Column>
            )}
          </Grid>
        </Actions>
      </Modal>
    </Transition>
  );
};

export default PopupComponent;
