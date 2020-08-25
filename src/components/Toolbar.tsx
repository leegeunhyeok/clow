import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTimes, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './Toolbar.scss';
import ClowContext from '../ClowContext';
import modules from '../modules';

const Toolbar = () => {
  const ctx = ClowContext.getInstance();
  const [connecting, setConnectingState] = useState(false);
  ctx.on('connectingstatechange', setConnectingState);

  const createModule = (TargetModule: typeof modules[number]) => {
    ctx.registModule(new TargetModule());
  };

  const toggleConnection = () => ctx.connecting(!connecting);

  const renderModuleButton = () => {
    return modules.map((module, i) => {
      const style = {
        color: module.TEXT_COLOR,
        backgroundColor: module.COLOR,
      };
      return (
        <button style={style} key={i} onClick={() => createModule(module)}>
          {module.name}
        </button>
      );
    });
  };

  return (
    <div className="Toolbar">
      <div className="Control">{renderModuleButton()}</div>
      <div className="Control--fixed">
        <button onClick={() => toggleConnection()}>
          <FontAwesomeIcon icon={connecting ? faTimes : faLink} />
        </button>
        <button>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
