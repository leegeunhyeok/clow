import { SVG, Svg, G } from '@svgdotjs/svg.js';
import Module from 'src/core/common/module';
import Connector from 'src/core/common/connector';

interface Point {
  x: number;
  y: number;
}

export enum ClowEvent {
  CONNECTING_STATE_CHANGE,
  NOT_CONNECTABLE,
  ALREADY_CONNECTED,
}

export default class ClowContext {
  private static instance: ClowContext;
  private svg?: Svg;
  private cursorPosition: Point = { x: 0, y: 0 };
  private connectorGroup?: G;
  private connectorShadow?: G;
  private onEvent: Map<ClowEvent, Function[]> = new Map();
  private modules: Module[] = [];
  public focusedModule: Module | null = null;
  public isConnecting: boolean = false;
  public connectingFrom?: Module | null;
  public connectingTo?: Module | null;

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

  private dispatchEvent<T>(eventType: ClowEvent, value?: T) {
    if (this.onEvent.has(eventType)) {
      this.onEvent.get(eventType)!.forEach((f) => f(value));
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
          this.focusedModule.x = x;
          this.focusedModule.y = y;
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

  setAsFocusedModule(clowModule: Module | null) {
    this.focusedModule = clowModule;
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
    this.dispatchEvent<boolean>(ClowEvent.CONNECTING_STATE_CHANGE, state);
  }

  connectRelation(clowModule: Module) {
    if (!this.connectingFrom) {
      const connectorGroup = this.getConnectorGroup();
      const lineGroup = connectorGroup.group();
      const pos = {
        x1: clowModule.x,
        y1: clowModule.y,
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
      return this.dispatchEvent<Module>(ClowEvent.ALREADY_CONNECTED, clowModule);
    } else if (!this.connectingFrom.isConnectable(clowModule)) {
      return this.dispatchEvent<Module>(ClowEvent.NOT_CONNECTABLE, clowModule);
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

  on(eventType: ClowEvent, f: Function) {
    if (this.onEvent.has(eventType)) {
      this.onEvent.get(eventType)!.push(f);
    } else {
      this.onEvent.set(eventType, [f]);
    }
  }

  off(eventType: ClowEvent, f: Function) {
    const callbackList = this.onEvent.get(eventType)!;
    const idx = callbackList.findIndex((x) => x === f);
    if (!~idx) {
      callbackList.splice(idx, 1);
    }
  }
}
