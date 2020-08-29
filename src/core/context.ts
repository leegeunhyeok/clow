import { SVG, Svg, G } from '@svgdotjs/svg.js';
import Module from 'src/core/common/module';
import Connector from 'src/core/common/connector';

interface Point {
  x: number;
  y: number;
}

export enum ClowEventType {
  CONNECTING_STATE_CHANGE,
  NOT_CONNECTABLE,
  ALREADY_CONNECTED,
}

export interface ClowEvent {
  type: ClowEventType;
  value?: any;
}

export type ClowEventHandler = (event: ClowEvent) => void;

export default class ClowContext {
  private static instance: ClowContext;
  private svg?: Svg;
  private cursorPosition: Point = { x: 0, y: 0 };
  private connectorGroup?: G;
  private connectorShadow?: G;
  private onEvent: Map<ClowEventType, ClowEventHandler[]> = new Map();
  private modules: Module[] = [];
  private focusedModule: Module | null = null;
  private focusedModuleOffset: Point = { x: 0, y: 0 };
  private connectingFrom?: Module | null;
  private connectingTo?: Module | null;
  public isConnecting: boolean = false;

  private constructor() {
    ClowContext.instance = this;
  }

  // Singleton
  public static getInstance() {
    if (!ClowContext.instance) {
      ClowContext.instance = new ClowContext();
    }
    return this.instance;
  }

  private dispatchEvent<T>(eventType: ClowEventType, value?: T) {
    if (this.onEvent.has(eventType)) {
      const event: ClowEvent = {
        type: eventType,
        value,
      };
      this.onEvent.get(eventType)!.forEach((f) => f(event));
    }
  }

  init(container: HTMLElement) {
    let task = 0;
    this.svg = SVG().addTo(container).size('100%', '100vh');
    this.connectorGroup = this.svg.group();
    this.svg.on('mousemove', (event: MouseEvent) => {
      const { x, y } = event;
      this.cursorPosition = { x, y };

      // Noting to do.
      if (!(this.connectorShadow || this.focusedModule)) {
        return;
      }

      cancelAnimationFrame(task);
      task = window.requestAnimationFrame(() => {
        if (this.connectorShadow) {
          this.connectorShadow.findOne('line').attr({ x2: x, y2: y });
        }

        if (this.focusedModule) {
          // TODO: Clicked offset caculate.
          this.focusedModule.x = x - this.focusedModuleOffset.x;
          this.focusedModule.y = y - this.focusedModuleOffset.y;
          this.focusedModule.update();
        }
      });
    });
  }

  getSvg() {
    return this.svg as Svg;
  }

  getCursorPoint() {
    return this.cursorPosition;
  }

  getConnectorGroup() {
    return this.connectorGroup as G;
  }

  registModule(clowModule: Module) {
    clowModule.init(this);
    this.modules.push(clowModule);
  }

  unregistModule(clowModule: Module) {
    const idx = this.modules.findIndex((x) => x === clowModule);
    this.modules.splice(idx, 1);
    clowModule.destroy();
  }

  setAsFocusedModule(clowModule: Module | null, offsetX = 0, offsetY = 0) {
    this.focusedModule = clowModule;
    this.focusedModuleOffset = {
      x: offsetX,
      y: offsetY,
    };
  }

  private prepareConnection() {
    this.connectingFrom && this.connectingFrom.initConnection();
    this.connectingTo && this.connectingTo.initConnection();
    this.connectorShadow = void (this.connectorShadow && this.connectorShadow.remove());
    this.connectingFrom = this.connectingTo = null;
  }

  connecting(state: boolean) {
    this.isConnecting = state;
    this.prepareConnection();
    this.dispatchEvent<boolean>(ClowEventType.CONNECTING_STATE_CHANGE, state);
  }

  connectRelation(clowModule: Module) {
    if (!this.connectingFrom) {
      const connectorGroup = this.getConnectorGroup();
      const lineGroup = connectorGroup.group();
      const { x, y } = clowModule;
      const pos = {
        x1: x,
        y1: y,
        x2: this.cursorPosition.x,
        y2: this.cursorPosition.y,
      };
      lineGroup
        .line(pos.x1, pos.y1, pos.x2, pos.y2)
        .stroke({
          color: Connector.SHADOW_COLOR,
          width: Connector.LINE_WIDTH,
          linecap: 'round',
        })
        .attr({
          'stroke-dasharray': '10',
          class: 'dash',
        });
      this.connectorShadow = lineGroup;
      this.connectingFrom = clowModule;
      return;
    }

    if (this.connectingFrom.isConnectedWith(clowModule)) {
      return this.dispatchEvent<Module>(ClowEventType.ALREADY_CONNECTED, clowModule);
    } else if (!this.connectingFrom.isConnectable(clowModule)) {
      return this.dispatchEvent<Module>(ClowEventType.NOT_CONNECTABLE, clowModule);
    } else {
      this.connectingTo = clowModule;
    }

    if (this.connectingFrom && this.connectingTo) {
      const connector = new Connector(this.connectingFrom, this.connectingTo).init(this);
      this.connectingFrom.connect(connector);
      this.connectingTo.connect(connector);
      this.prepareConnection();
    }
  }

  on(eventType: ClowEventType, f: ClowEventHandler) {
    if (this.onEvent.has(eventType)) {
      this.onEvent.get(eventType)!.push(f);
    } else {
      this.onEvent.set(eventType, [f]);
    }

    console.log(eventType, 'registered');
  }

  off(eventType: ClowEventType, f: ClowEventHandler) {
    const callbackList = this.onEvent.get(eventType)!;
    const idx = callbackList.findIndex((x) => x === f);
    if (!~idx) {
      callbackList.splice(idx, 1);
    }
  }
}
