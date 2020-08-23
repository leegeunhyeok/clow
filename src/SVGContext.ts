import { SVG, Svg, G } from '@svgdotjs/svg.js';
import CrawlyModule from './modules/common/CrawlyModule';
import ModuleConnector from './modules/common/ModuleConnector';

interface Point {
  x: number;
  y: number;
}

interface ContextEventHandlerStore {
  [key: string]: Function | undefined;
}

export default class CanvasContext {
  private static instance: CanvasContext;
  private svg?: Svg;
  private cursorPosition: Point = { x: 0, y: 0 };
  private connectorGroup?: G;
  private connectorShadow?: G;
  private onEvent: ContextEventHandlerStore = {};
  private modules: CrawlyModule[] = [];
  public focusedModule: CrawlyModule | null = null;
  public isConnecting: boolean = false;
  public connectingFrom?: CrawlyModule | null;
  public connectingTo?: CrawlyModule | null;

  private constructor() {
    CanvasContext.instance = this;
  }

  // Singleton
  public static getInstance() {
    if (!CanvasContext.instance) {
      CanvasContext.instance = new CanvasContext();
    }
    return this.instance;
  }

  private callEventHandler(eventType: string, value?: any) {
    const handler = this.onEvent[eventType];
    handler && handler(value);
  }

  init(container: HTMLElement) {
    let waiting = false; // for throttle.
    this.svg = SVG().addTo(container).size('100%', '100vh');
    this.connectorGroup = this.svg.group();
    this.svg.on('mousemove', (event: MouseEvent) => {
      const { x, y } = event;
      this.cursorPosition = { x, y };

      // Noting to do.
      if (!(this.connectorShadow || this.focusedModule)) {
        return;
      }

      // Skip handling
      if (!waiting) {
        waiting = true;
        window.requestAnimationFrame(() => (waiting = false));
        return;
      }

      if (this.connectorShadow) {
        this.connectorShadow.findOne('line').attr({ x2: x, y2: y });
      }

      if (this.focusedModule) {
        this.focusedModule.x = x;
        this.focusedModule.y = y;
        this.focusedModule.update();
      }
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

  registModule(module: CrawlyModule) {
    module.init();
    this.modules.push(module);
  }

  unregistModule(module: CrawlyModule) {
    const idx = this.modules.findIndex((x) => x === module);
    this.modules.splice(idx, 1);
    module.destroy();
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
    this.callEventHandler('connectingstatechange', state);
  }

  connectRelation(module: CrawlyModule) {
    if (!this.connectingFrom) {
      const connectorGroup = this.getConnectorGroup();
      const lineGroup = connectorGroup.group();
      const pos = {
        x1: module.x,
        y1: module.y,
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
      this.connectingFrom = module;
    } else if (this.connectingFrom.isConnectable(module)) {
      this.connectingTo = module;
    } else {
      this.callEventHandler('notconnectable');
      return;
    }

    if (this.connectingFrom && this.connectingTo) {
      this.connectingFrom.connect(this.connectingTo);
      this.initConnection();
    }
  }

  on(eventType: string, f: Function) {
    this.onEvent[eventType] = f;
  }
}
