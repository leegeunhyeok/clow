import { SVG, Svg, G } from '@svgdotjs/svg.js';
import CrawlyModule from './modules/common/CrawlyModule';
import ModuleConnector from './modules/common/Connector';

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
  private _connectorGroup?: G;
  private connectorShadow?: G;
  private _moduleGroup?: G;
  private _onEvent: ContextEventHandlerStore = {};
  private modules: CrawlyModule[] = [];
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
    const handler = this._onEvent[eventType];
    handler && handler(value);
  }

  init(container: HTMLElement) {
    this.svg = SVG().addTo(container).size('100%', '100vh');
    this._connectorGroup = this.svg.group();
    this._moduleGroup = this.svg.group();
    this.svg.on('mousemove', (event: MouseEvent) => {
      const { x, y } = event;
      this.cursorPosition = { x, y };
      this.connectorShadow && this.connectorShadow.findOne('line').attr({ x2: x, y2: y });
    });
  }

  getCursorPoint() {
    return this.cursorPosition;
  }

  getConnectorGroup() {
    return this._connectorGroup as G;
  }

  getModuleGroup() {
    return this._moduleGroup as G;
  }

  registModule(module: CrawlyModule) {
    module.init();
    this.modules.push(module);
  }

  unregistModule(module: CrawlyModule) {
    console.log(module);
  }

  connecting(state: boolean) {
    this.isConnecting = state;
    if (!state) {
      this.connectorShadow = void (this.connectorShadow && this.connectorShadow.remove());
      this.connectingFrom && (this.connectingFrom.inConnectRelation = false);
      this.connectingTo && (this.connectingTo.inConnectRelation = false);
    }
    this.callEventHandler('connectingstatechange', state);
  }

  connectRelation(module: CrawlyModule) {
    if (!this.connectingFrom) {
      const connectorGroup = this.getConnectorGroup();
      const lineGroup = connectorGroup.group();
      const pos = {
        x1: module.getGraphic().cx(),
        y1: module.getGraphic().cy(),
        x2: 0,
        y2: 0,
      };
      lineGroup
        .line(pos.x1, pos.y1, pos.x2, pos.y2)
        .stroke({ color: '#ddd', width: ModuleConnector.LINE_WIDTH, linecap: 'round' });
      lineGroup
        .circle(ModuleConnector.HEAD_SIZE)
        .attr({ cx: pos.x1, cy: pos.y1 })
        .attr({ fill: module.color });
      this.connectorShadow = lineGroup;
      this.connectingFrom = module;
    } else if (this.connectingFrom.isConnectable(module)) {
      this.connectingTo = module;
    } else {
      this.callEventHandler('notconnectable');
    }

    if (this.connectingFrom && this.connectingTo) {
      this.connecting(false);
      this.connectingFrom.connect(this.connectingTo);
      this.connectingFrom = this.connectingTo = null;
    }
  }

  on(eventType: string, f: Function) {
    this._onEvent[eventType] = f;
  }
}
