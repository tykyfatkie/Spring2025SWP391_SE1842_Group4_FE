import React from 'react';
import './ToastComponent.less';
import { HiCheckCircle, HiXCircle, HiOutlineExclamationCircle} from 'react-icons/hi';

interface ToastComponentProps {
  content: string;
  type?: 'success' | 'failed' | 'warning';
}

export const ToastComponent: React.FC<ToastComponentProps> = (props) => {
  const { content, type } = props;
  return (
    <React.Fragment>
      {type === 'success' && (
        <div className="image-wrapper icon success">
          <HiCheckCircle />
        </div>
      )}
      {type === 'failed' && (
        <div className="image-wrapper icon failed">
          <HiXCircle />
        </div>
      )}
      {type === 'warning' && (
        <div className="image-wrapper icon warning">
          <HiOutlineExclamationCircle />
        </div>
      )}
      <p className="content">{content}</p>
    </React.Fragment>
  );
};
