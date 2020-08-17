import { Rect, Circle, Ellipse } from '@svgdotjs/svg.js';
import CanvasContext from '../../CanvasContext';
import ModuleConnector from './Connector';
import DataTypes from './Types';

export type Graphics = Rect | Circle | Ellipse;

export default class CrawlyModule {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public color: string = '#ffffff';
  public inConnectRelation: boolean = false;
  public inputType: DataTypes | DataTypes[];
  public outputType: DataTypes | DataTypes[];
  protected context: CanvasContext;
  protected g?: Graphics;
  protected connectors: ModuleConnector[] = [];

  constructor(
    x: number = 0,
    y: number = 0,
    width: number = 160,
    height: number = 80,
    color: string = '#ffffff',
  ) {
    this.context = CanvasContext.getInstance();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.inputType = DataTypes.NULL;
    this.outputType = DataTypes.NULL;
  }

  init() {
    const self = this;
    this.g = this.context
      .getModuleGroup()
      .rect(this.width, this.height)
      .radius(16)
      .fill(this.color)
      .attr({ x: this.x, y: this.y })
      .draggable();

    this.g.on('beforedrag', (event: MouseEvent) => {
      this.context.isConnecting && event.preventDefault();
    });

    this.g.on('dragmove,dragend', function (this: Graphics) {
      self.connectors.forEach((connector) => connector.update());
      self.x = this.cx();
      self.y = this.cy();
      console.log(
        `%cObj (${self.x}, ${self.y})`,
        `padding:0 5px;border-radius:4px;color:#fff;background-color:${self.color};`,
      );
    });

    this.g.on('mouseover', function (this: Graphics) {
      if (self.context.isConnecting) {
        this.transform({ scale: 1.1 });
      }
    });

    this.g.on('mouseleave', function (this: Graphics) {
      this.transform({ scale: 1 });
    });

    this.g.on('click', () => {
      if (this.context.isConnecting && !this.inConnectRelation) {
        this.inConnectRelation = true;
        this.context.connectRelation(this);
      }
    });
  }

  getGraphic() {
    return this.g as Graphics;
  }

  isConnectable(to: CrawlyModule) {
    if (Array.isArray(this.outputType)) {
      if (Array.isArray(to.inputType)) {
        return this.outputType.every((x) => (to.inputType as DataTypes[]).includes(x));
      } else {
        return to.inputType in this.outputType;
      }
    } else {
      if (Array.isArray(to.inputType)) {
        return this.outputType in to.inputType;
      } else {
        return this.outputType === to.inputType;
      }
    }
  }

  connect(to: CrawlyModule) {
    const connector = new ModuleConnector(this, to);
    this.connectors.push(connector);
    to.connectorFrom(connector);
  }

  connectorFrom(connector: ModuleConnector) {
    this.connectors.push(connector);
  }
}
