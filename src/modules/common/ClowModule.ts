import { G, Rect, Circle, Ellipse } from '@svgdotjs/svg.js';
import ClowContext from '../../ClowContext';
import ModuleConnector from './ModuleConnector';
import DataTypes from './Types';

interface ModuleData {
  [key: string]: string | number | boolean;
}

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
  public static COLOR = '#ffffff';
  public static TEXT_COLOR = '#000000';
  public static CELL_SIZE = 12;
  public static RENDER_PADDING = 5;
  public static COMPONENT_MARGIN = 2;
  public id = 'module_' + +new Date();
  public x = 100;
  public y = 100;
  public column = 0;
  public row = 0;
  public width = 0;
  public height = 0;
  public inConnectRelation = false;
  public inputType: DataTypes | DataTypes[];
  public outputType: DataTypes | DataTypes[];
  protected data: ModuleData = {};
  protected ctx: ClowContext;
  protected g: G;
  protected graphic?: Graphics;
  protected connectors: ModuleConnector[] = [];
  private components: UIComponent[] = [];

  constructor(x = 100, y = 100) {
    this.ctx = ClowContext.getInstance();
    this.x = x;
    this.y = y;
    this.g = this.ctx.getSvg().group();
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
    this.width = this.column * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2;
    this.height = this.row * CrawlyModule.CELL_SIZE + CrawlyModule.RENDER_PADDING * 2;
    const color = (this.constructor as typeof CrawlyModule).COLOR;
    const textColor = (this.constructor as typeof CrawlyModule).TEXT_COLOR;
    const graphic = this.g.rect(this.width, this.height).radius(8).fill(color);

    this.g.attr({ style: `color:${textColor}` });
    this.g.on('mousedown', () => {
      this.ctx.focusedModule = this;
      this.g.findOne('foreignObject').addClass('grap');
    });

    this.g.on('mouseup', () => {
      this.ctx.focusedModule = null;
      this.g.findOne('foreignObject').removeClass('grap');
    });

    this.g.on('mouseover', () => {
      if (this.ctx.isConnecting) {
        graphic.transform({ scale: 1.1 });
      }
    });

    this.g.on('mouseleave', () => {
      if (this.ctx.isConnecting) {
        this.resetConnection();
      }
    });

    this.g.on('click', () => {
      if (this.ctx.isConnecting && !this.inConnectRelation) {
        this.inConnectRelation = true;
        this.ctx.connectRelation(this);
      }
    });

    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('width', this.width.toString());
    foreignObject.setAttribute('height', this.height.toString());

    const componentList = [];
    for (const component of this.components) {
      const el = this.createElementFromDOMConfig(component.template);
      el.setAttribute(
        'style',
        `
        top:${component.row * CrawlyModule.CELL_SIZE + CrawlyModule.COMPONENT_MARGIN}px;
        left:${component.column * CrawlyModule.CELL_SIZE + CrawlyModule.COMPONENT_MARGIN}px;
        width:${component.width * CrawlyModule.CELL_SIZE - CrawlyModule.COMPONENT_MARGIN * 2}px;
        height:${component.height * CrawlyModule.CELL_SIZE - CrawlyModule.COMPONENT_MARGIN * 2}px;
        ${el.getAttribute('style') || ''};
      `.replace(/\s/g, ''),
      );
      componentList.push(el);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('close');
    deleteButton.addEventListener('click', () => {
      this.ctx.unregistModule(this);
    });

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

    wrap.appendChild(deleteButton);

    for (const componentEl of componentList) {
      wrap.appendChild(componentEl);
    }

    foreignObject.appendChild(wrap);
    this.g.node.appendChild(foreignObject);
    this.update();
    this.graphic = graphic;
  }

  update() {
    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;
    this.g.transform({
      translateX: x,
      translateY: y,
    });
    this.connectors.forEach((connector) => connector.update());
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
      for (const child of config.children) {
        el.appendChild(this.createElementFromDOMConfig(child));
      }
    }

    return el;
  }

  getSVG() {
    return this.g as G;
  }

  getGraphic() {
    return this.graphic as Graphics;
  }

  isConnectable(to: CrawlyModule): boolean {
    if (Array.isArray(this.outputType)) {
      if (Array.isArray(to.inputType)) {
        return this.outputType.some((x) => (to.inputType as DataTypes[]).includes(x));
      } else {
        return !!this.outputType.find((x) => x === to.inputType);
      }
    } else {
      if (Array.isArray(to.inputType)) {
        return !!to.inputType.find((x) => x === this.outputType);
      } else {
        return this.outputType === to.inputType;
      }
    }
  }

  resetConnection() {
    this.graphic && this.graphic.transform({ scale: 1 });
    this.inConnectRelation = false;
  }

  connect(to: CrawlyModule) {
    const connector = new ModuleConnector(this, to);
    this.connectors.push(connector);
    to.connectorFrom(connector);
  }

  connectorFrom(connector: ModuleConnector) {
    this.connectors.push(connector);
  }

  disconnect(connector: ModuleConnector) {
    const idx = this.connectors.findIndex((c) => c === connector);
    this.connectors.splice(idx, 1);
  }

  destroy() {
    [...this.connectors].forEach((connector) => connector.destroy());
    this.g.remove();
  }
}
