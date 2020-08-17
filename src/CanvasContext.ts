import { SVG, Svg, G } from '@svgdotjs/svg.js';
import CrawlyModule from './modules/common/CrawlyModule';

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
    console.log('!!');
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
      this.connectingFrom && (this.connectingFrom.inConnectRelation = false);
      this.connectingTo && (this.connectingTo.inConnectRelation = false);
    }
    this.callEventHandler('connectingstatechange', state);
  }

  connectRelation(module: CrawlyModule) {
    if (!this.connectingFrom) {
      this.connectingFrom = module;
    } else if (this.connectingFrom.isConnectable(module)) {
      this.connectingTo = module;
    } else {
      console.log('Type not match');
      // return;
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
