import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTimes, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './Toolbar.scss';
import Context, { ClowEventType } from 'src/core/context';
import modules from 'src/core/modules';

const Toolbar = () => {
  const ctx = useRef(Context.getInstance());
  const [connecting, setConnectingState] = useState(false);

  useEffect(() => {
    ctx.current.on(ClowEventType.CONNECTING_STATE_CHANGE, ({ value }) => {
      setConnectingState(value);
    });
  }, []);

  const createModule = useCallback((TargetModule: typeof modules[number]) => {
    ctx.current.registModule(new TargetModule());
  }, []);

  const toggleConnection = () => ctx.current.connecting(!connecting);

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
