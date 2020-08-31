import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTimes, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Context, { ClowEventType } from 'src/core/context';
import modules from 'src/core/modules';

const ToolbarComponent = () => {
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
        <ToolbarButton style={style} key={i} onClick={() => createModule(module)}>
          {module.name}
        </ToolbarButton>
      );
    });
  };

  return (
    <Toolbar>
      <ToolbarControl>{renderModuleButton()}</ToolbarControl>
      <ToolbarControl fixed={true}>
        <ToolbarButton padding={0} width={32} height={32} onClick={() => toggleConnection()}>
          <FontAwesomeIcon icon={connecting ? faTimes : faLink} />
        </ToolbarButton>
        <ToolbarButton padding={0} width={32} height={32}>
          <FontAwesomeIcon icon={faArrowUp} />
        </ToolbarButton>
        <ToolbarButton padding={0} width={32} height={32}>
          <FontAwesomeIcon icon={faArrowDown} />
        </ToolbarButton>
      </ToolbarControl>
    </Toolbar>
  );
};

export default ToolbarComponent;

const Toolbar = styled('div')`
  position: fixed;
  display: flex;
  bottom: 1rem;
  left: 50%;
  padding: 1rem;
  width: 100%;
  max-width: 500px;
  border-radius: 2rem;
  background-color: #fff;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
  transform: translate(-50%, 0);
`;

const ToolbarControl = styled('div')<{ fixed?: boolean }>`
  ${(props) =>
    props.fixed
      ? `min-width: 100px; margin-left: 1rem;`
      : `
        display: flex;
        flex-grow: 9;
        overflow: hidden;margin-left: 0.5rem;`}
`;

const ToolbarButton = styled('button')<{ width?: number; height?: number; padding?: number }>`
  margin-right: 0.5rem;
  ${(props) => props.padding !== undefined && `padding: ${props.padding}px`};
  ${(props) => props.width !== undefined && `width: ${props.width}px`};
  ${(props) => props.height !== undefined && `height: ${props.height}px`};
`;
