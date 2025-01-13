import React from 'react';
import { SemanticWIDTHS } from 'semantic-ui-react';
import './GridSeparator.less';

interface GridSeparatorProps {
  width?: SemanticWIDTHS;
}

export const GridSeparator: React.FC = () => {
  return (
    <div className="grid-separator">
      <div className="separator"></div>
    </div>
  );
};
