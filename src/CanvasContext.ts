import { SVG, Svg, G } from '@svgdotjs/svg.js';

export default class CanvasContext {
  private static instance: CanvasContext;
  private svg?: Svg;
  private _connectorGroup?: G;
  private _moduleGroup?: G;

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

  init(container: HTMLElement) {
    this.svg = SVG().addTo(container).size('100%', '100vh');
    this._connectorGroup = this.svg.group();
    this._moduleGroup = this.svg.group();
  }

  getConnectorGroup() {
    return this._connectorGroup as G;
  }

  getModuleGroup() {
    return this._moduleGroup as G;
  }
}
