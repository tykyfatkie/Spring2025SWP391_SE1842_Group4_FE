import { Popconfirm, message, Button } from 'antd';
import React from 'react';

const text = 'Are you sure to delete this task?';

function confirm() {
  message.info('Clicked on Yes.');
}

const ConfirmPopup = () => {
  return (
    <div className="demo">
      <div style={{ marginLeft: 70, whiteSpace: 'nowrap' }}>
        <Popconfirm
          placement="topLeft"
          title={text}
          onConfirm={confirm}
          okText="Yes"
          cancelText="No"

        >
          <Button>TL</Button>
        </Popconfirm>
      </div>
    </div>
  );
};
