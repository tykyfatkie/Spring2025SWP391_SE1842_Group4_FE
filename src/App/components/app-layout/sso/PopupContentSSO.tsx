import React from 'react';
import { Anchor } from 'antd';
import './PopupContentSSO.less';

const PopupSSOContent: React.FC = () => {
  let domain = window.location.hostname;
  const { Link } = Anchor;

  return (
    <div className="module-container">
      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://task.vjaa.edu.vn'
                : 'https://task.hisoft.vn'
            }
            title={
              <div className="module_item">
                <img
                  className="module_img"
                  src={require(`@app/assets/images/task.png`)}
                  height={60}
                />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>Task</span>
              </div>
            }
          />
        </Anchor>
      </div>

      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://document.vjaa.edu.vn'
                : 'https://document.hisoft.vn/'
            }
            title={
              <div className="module_item">
                <img
                  className="module_img"
                  src={require(`@app/assets/images/doc.png`)}
                  height={60}
                />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                  Document
                </span>
              </div>
            }
          />
        </Anchor>
      </div>
      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://digitalsignature.vjaa.edu.vn'
                : 'https://digitalsignature.hisoft.vn'
            }
            title={
              <div className="module_item">
                <img
                  className="module-img"
                  src={require(`@app/assets/images/sign.png`)}
                  height={60}
                />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                  Signature
                </span>
              </div>
            }
          />
        </Anchor>
      </div>
      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://sm.vjaa.edu.vn'
                : 'https://sm.hisoft.vn'
            }
            title={
              <div className="module_item">
                <img src={require(`@app/assets/images/sys.png`)} height={60} />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                  System
                </span>
              </div>
            }
          />
        </Anchor>
      </div>

      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://itasset.vjaa.edu.vn'
                : 'https://itasset.hisoft.vn/'
            }
            title={
              <div className="module_item">
                <img
                  className="module_img"
                  src={require(`@app/assets/images/it.png`)}
                  height={60}
                />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                  IT Asset
                </span>
              </div>
            }
          />
        </Anchor>
      </div>
      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://tsm.vjaa.edu.vn'
                : 'https://asset.hisoft.vn/'
            }
            title={
              <div className="module_item">
                <img
                  className="module_img"
                  src={require(`@app/assets/images/tms.png`)}
                  height={60}
                />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>TSM</span>
              </div>
            }
          />
        </Anchor>
      </div>
      <div className="module">
        <Anchor>
          <Link
            target="_self"
            href={
              domain.includes('vjaa')
                ? 'https://lib.vjaa.edu.vn'
                : 'https://lib.hisoft.vn'
            }
            title={
              <div className="module_item">
                <img
                  className="module_img"
                  src={require(`@app/assets/images/library.png`)}
                  height={60}
                />
                <span style={{ display: 'flex', flexWrap: 'wrap' }}>TSM</span>
              </div>
            }
          />
        </Anchor>
      </div>
    </div>
  );
};

export default PopupSSOContent;
