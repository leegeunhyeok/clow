import { SVG, Svg, G } from '@svgdotjs/svg.js';
import ClowModule from './modules/common/ClowModule';
import ModuleConnector from './modules/common/ModuleConnector';

interface Point {
  x: number;
  y: number;
}

export enum ClowEvent {
  CONNECTING_STATE_CHANGE,
  NOT_CONNECTABLE,
}

class ClowContext {
  private static instance: ClowContext;
  private svg?: Svg;
  private cursorPosition: Point = { x: 0, y: 0 };
  private connectorGroup?: G;
  private connectorShadow?: G;
  private onEvent: Map<ClowEvent, Function[]> = new Map();
  private modules: ClowModule[] = [];
  public focusedModule: ClowModule | null = null;
  public isConnecting: boolean = false;
  public connectingFrom?: ClowModule | null;
  public connectingTo?: ClowModule | null;

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

  private dispatchEvent(eventType: ClowEvent, value?: any) {
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

  registModule(clowModule: ClowModule) {
    clowModule.init();
    this.modules.push(clowModule);
  }

  unregistModule(clowModule: ClowModule) {
    const idx = this.modules.findIndex((x) => x === clowModule);
    this.modules.splice(idx, 1);
    clowModule.destroy();
  }

  private initConnection() {
    if (this.connectingFrom) {
      this.connectingFrom.resetConnection();
    }
    if (this.connectingTo) {
      this.connectingTo.resetConnection();
    }
    this.connectorShadow = void (this.connectorShadow && this.connectorShadow.remove());
    this.connectingFrom = this.connectingTo = null;
  }

  connecting(state: boolean) {
    this.isConnecting = state;
    this.initConnection();
    this.dispatchEvent(ClowEvent.CONNECTING_STATE_CHANGE, state);
  }

  connectRelation(clowModule: ClowModule) {
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
          color: '#dddddd',
          width: ModuleConnector.LINE_WIDTH,
          linecap: 'round',
        })
        .attr({
          'stroke-dasharray': '10',
          class: 'dash',
        });
      this.connectorShadow = lineGroup;
      this.connectingFrom = clowModule;
    } else if (this.connectingFrom.isConnectable(clowModule)) {
      this.connectingTo = clowModule;
    } else {
      this.dispatchEvent(ClowEvent.NOT_CONNECTABLE);
      return;
    }

    if (this.connectingFrom && this.connectingTo) {
      this.connectingFrom.connect(this.connectingTo);
      this.initConnection();
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

export default ClowContext.getInstance();
