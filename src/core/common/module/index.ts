import { G, Rect, Circle, Ellipse } from '@svgdotjs/svg.js';
import { DataTypes, Renderable, Connectable } from 'src/core/common';
import Connector from 'src/core/common/connector';
import Context from 'src/core/context';

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

export default class Module implements Renderable, Connectable {
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
  public inputType: DataTypes | DataTypes[];
  public outputType: DataTypes | DataTypes[];
  protected data: ModuleData = {};
  private components: UIComponent[] = [];
  public g: G | null = null;
  protected graphic: Graphics | null = null;
  public inConnectRelation = false;
  public connectors: Connector[] = [];

  constructor(x = 100, y = 100) {
    this.x = x;
    this.y = y;
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

  create(ctx: Context) {
    const g = ctx.getSvg().group();
    this.width = this.column * Module.CELL_SIZE + Module.RENDER_PADDING * 2;
    this.height = this.row * Module.CELL_SIZE + Module.RENDER_PADDING * 2;
    const color = (this.constructor as typeof Module).COLOR;
    const textColor = (this.constructor as typeof Module).TEXT_COLOR;
    const graphic = g.rect(this.width, this.height).radius(8).fill(color);

    g.attr({ style: `color:${textColor}` });
    g.on('mousedown', (event: MouseEvent) => {
      const offsetX = event.offsetX + (event.target as HTMLElement).offsetLeft;
      const offsetY = event.offsetY + (event.target as HTMLElement).offsetTop;
      const halfWidth = this.width / 2;
      const halfHeight = this.height / 2;
      ctx.setAsFocusedModule(this, offsetX - halfWidth, offsetY - halfHeight);
      g.findOne('foreignObject').addClass('grap');
    });

    g.on('mouseup', () => {
      ctx.setAsFocusedModule(null);
      g.findOne('foreignObject').removeClass('grap');
    });

    g.on('mouseover', () => {
      if (ctx.isConnecting) {
        graphic.transform({ scale: 1.1 });
      }
    });

    g.on('mouseleave', () => {
      if (ctx.isConnecting) {
        this.initConnection();
      }
    });

    g.on('click', () => {
      if (ctx.isConnecting && !this.inConnectRelation) {
        this.inConnectRelation = true;
        ctx.connectRelation(this);
      }
    });

    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('width', this.width.toString());
    foreignObject.setAttribute('height', this.height.toString());
    g.node.appendChild(foreignObject);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('close');
    deleteButton.addEventListener('click', () => {
      ctx.unregistModule(this);
    });

    const wrap = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    wrap.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    wrap.setAttribute(
      'style',
      `position:relative;padding:${Module.RENDER_PADDING}px;width:${this.width}px;height:${this.height}px;`,
    );
    foreignObject.appendChild(wrap);
    wrap.appendChild(deleteButton);

    this.components.forEach((component) => {
      const el = this.createElementFromDOMConfig(component.template);
      el.setAttribute(
        'style',
        `top:${
          component.row * Module.CELL_SIZE + Module.COMPONENT_MARGIN + Module.RENDER_PADDING
        }px;\
        left:${
          component.column * Module.CELL_SIZE + Module.COMPONENT_MARGIN + Module.RENDER_PADDING
        }px;\
        width:${component.width * Module.CELL_SIZE - Module.COMPONENT_MARGIN * 2}px;\
        height:${component.height * Module.CELL_SIZE - Module.COMPONENT_MARGIN * 2}px;\
        ${el.getAttribute('style') || ''};`,
      );
      wrap.appendChild(el);
    });

    this.g = g;
    this.graphic = graphic;
    this.update();
    return this;
  }

  update() {
    const x = this.x - this.width / 2;
    const y = this.y - this.height / 2;
    this.g!.transform({
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

  destroy() {
    [...this.connectors].forEach((connector) => connector.destroy());
    this.g!.remove();
  }

  initConnection() {
    this.graphic && this.graphic.transform({ scale: 1 });
    this.inConnectRelation = false;
  }

  isConnectedWith(targetModule: Module) {
    return !!this.connectors.find((connector) => connector.isConnectedWith(targetModule));
  }

  isConnectable(targetModule: Module): boolean {
    if (Array.isArray(this.outputType)) {
      if (Array.isArray(targetModule.inputType)) {
        return this.outputType.some((x) => (targetModule.inputType as DataTypes[]).includes(x));
      } else {
        return !!this.outputType.find((x) => x === targetModule.inputType);
      }
    } else {
      if (Array.isArray(targetModule.inputType)) {
        return !!targetModule.inputType.find((x) => x === this.outputType);
      } else {
        return this.outputType === targetModule.inputType;
      }
    }
  }

  connect(connector: Connector) {
    this.connectors.push(connector);
  }

  disconnect(connector: Connector) {
    const idx = this.connectors.findIndex((c) => c === connector);
    if (~idx) this.connectors.splice(idx, 1);
  }
}
