import { SVG, G, Rect, Circle, Ellipse } from '@svgdotjs/svg.js';
import CanvasContext from '../../CanvasContext';
import ModuleConnector from './Connector';
import DataTypes from './Types';

interface DOMConfig {
  type: string;
  text?: string;
  attr?: { [key: string]: string };
  on?: { [key: string]: Function };
  children?: DOMConfig[];
}

interface UIComponent {
  template: DOMConfig;
  row: number;
  column: number;
  width: number;
  height: number;
}

export type Graphics = Rect | Circle | Ellipse;

export default class CrawlyModule {
  public static CELL_SIZE = 10;
  public static RENDER_PADDING = 5;
  public x: number = 100;
  public y: number = 100;
  public column: number = 0;
  public row: number = 0;
  public width: number = 0;
  public height: number = 0;
  public color: string = '#ffffff';
  public inConnectRelation: boolean = false;
  public inputType: DataTypes | DataTypes[];
  public outputType: DataTypes | DataTypes[];
  protected context: CanvasContext;
  protected g: G;
  protected graphic?: Graphics;
  protected connectors: ModuleConnector[] = [];
  private components: UIComponent[] = [];
  public drag = false;

  constructor(x = 100, y = 100) {
    this.context = CanvasContext.getInstance();
    this.x = x;
    this.y = y;
    this.g = this.context.getSvg().group();
    this.inputType = DataTypes.NULL;
    this.outputType = DataTypes.NULL;
  }

  addComponent(template: DOMConfig, row: number, column: number, width: number, height: number) {
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
    this.width = this.column * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2;
    this.height = this.row * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2;
    this.graphic = this.g.rect(this.width, this.height).radius(8).fill(this.color);
    console.log(this.width, this.height);

    this.g.on('mousedown', (event: MouseEvent) => {
      this.drag = true;
    });

    this.g.on('mousemove', (event: MouseEvent) => {
      if (!this.drag) return;
      // TODO: Check position
      // const dim = (event.target as SVGElement).getBoundingClientRect();
      // const x = event.clientX - dim.left;
      // const y = event.clientY - dim.top;
      this.x = event.x;
      this.y = event.y;
      this.update();
      this.connectors.forEach((connector) => connector.update());
      console.log(
        `%cObj (${this.x}, ${this.y})`,
        `padding:0 5px;border-radius:4px;color:#fff;background-color:${this.color};`,
      );
    });

    this.g.on('mouseup,mouseleave', () => {
      this.drag = false;
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

    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute(
      'width',
      (this.column * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2).toString(),
    );
    foreignObject.setAttribute(
      'height',
      (this.row * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2).toString(),
    );

    const componentList = [];
    for (const component of this.components) {
      const el = this.createElementFromDOMConfig(component.template);
      el.setAttribute(
        'style',
        `
        display:block;
        position:absolute;
        top:${component.row * CrawlyModule.CELL_SIZE}px;
        left:${component.column * CrawlyModule.CELL_SIZE}px;
        width:${component.width * CrawlyModule.CELL_SIZE}px;
        height:${component.height * CrawlyModule.CELL_SIZE}px;
      `.replace(/\s/g, ''),
      );

      componentList.push(el);
    }

    const wrap = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    wrap.setAttribute(
      'style',
      `
      position:relative;
      margin:${CrawlyModule.RENDER_PADDING}px;
      width:0px;
      height:0px;
    `.replace(/\s/g, ''),
    );

    for (const componentEl of componentList) {
      wrap.appendChild(componentEl);
    }

    foreignObject.appendChild(wrap);
    this.g.node.appendChild(foreignObject);
    this.update();
  }

  update() {
    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;
    this.g.attr({
      transform: `translate(${x},${y})`,
    });
  }

  private createElementFromDOMConfig(config: DOMConfig) {
    const el = document.createElement(config.type);

    if (config.text) {
      el.appendChild(document.createTextNode(config.text));
    }

    if (config.attr) {
      for (const key in config.attr) {
        el.setAttribute(key, config.attr[key]);
      }
    }

    if (config.on) {
      for (const event in config.on) {
        el.addEventListener(event, (e: Event) => {
          e.stopPropagation();
          config.on && config.on[event](e);
        });
      }
    }

    if (config.children && config.children.length > 0) {
      config.children.map(this.createElementFromDOMConfig).forEach(el.appendChild);
    }

    return el;
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
