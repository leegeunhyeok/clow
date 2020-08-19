import { SVG, G, Rect, Circle, Ellipse } from '@svgdotjs/svg.js';
import CanvasContext from '../../CanvasContext';
import ModuleConnector from './Connector';
import DataTypes from './Types';

interface UIComponent {
  template: string;
  row: number;
  column: number;
  width: number;
  height: number;
}

export type Graphics = Rect | Circle | Ellipse;

export default class CrawlyModule {
  public static CELL_SIZE = 40;
  public static RENDER_PADDING = 5;
  public x: number = 0;
  public y: number = 0;
  public column: number = 0;
  public row: number = 0;
  public color: string = '#ffffff';
  public inConnectRelation: boolean = false;
  public inputType: DataTypes | DataTypes[];
  public outputType: DataTypes | DataTypes[];
  protected context: CanvasContext;
  protected g: G;
  protected graphic?: Graphics;
  protected connectors: ModuleConnector[] = [];
  private components: UIComponent[] = [];

  constructor(x = 0, y = 0) {
    this.context = CanvasContext.getInstance();
    this.g = this.context.getModuleGroup().group().draggable();
    this.x = x;
    this.y = y;
    this.inputType = DataTypes.NULL;
    this.outputType = DataTypes.NULL;
  }

  addComponent(template: string, row: number, column: number, width: number, height: number) {
    this.components.push({
      template,
      row,
      column,
      width,
      height,
    });
  }

  init() {
    const self = this;
    this.graphic = this.g
      .rect(
        this.column * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2,
        this.row * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2,
      )
      .attr({ x: this.x, y: this.y })
      .radius(8)
      .fill(this.color);

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

    this.graphic.on('mouseover', function (this: Graphics) {
      if (self.context.isConnecting) {
        this.transform({ scale: 1.1 });
      }
    });

    this.graphic.on('mouseleave', function (this: Graphics) {
      this.transform({ scale: 1 });
    });

    this.graphic.on('click', () => {
      if (this.context.isConnecting && !this.inConnectRelation) {
        this.inConnectRelation = true;
        this.context.connectRelation(this);
      }
    });

    const fo = this.g.foreignObject(
      this.column * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2,
      this.row * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2,
    );

    let html = '';
    for (const component of this.components) {
      const el = SVG(component.template).attr({
        style: `
          display:block;
          position:absolute;
          top:${component.row * CrawlyModule.CELL_SIZE}px;
          left:${component.column * CrawlyModule.CELL_SIZE}px;
          width:${component.width * CrawlyModule.CELL_SIZE}px;
          height:${component.height * CrawlyModule.CELL_SIZE}px;
        `.replace(/\s/g, ''),
      });
      html += el.node.outerHTML;
    }

    const wrap = SVG(`<div>${html}</div>`).attr({
      x: 0,
      y: 0,
      style: `
        position:relative;
        margin:${CrawlyModule.RENDER_PADDING}px;
        width:${this.column * CrawlyModule.CELL_SIZE}px;
        height:${this.row * CrawlyModule.CELL_SIZE}px;
      `.replace(/\s/g, ''),
    });
    fo.add(wrap);
  }

  getGraphic() {
    return this.graphic as Graphics;
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
