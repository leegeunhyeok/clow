import { G } from '@svgdotjs/svg.js';
import { Renderable } from 'src/core/common';
import Module from 'src/core/common/module';
import Context from 'src/core/context';

interface ConnectorLinePosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

class Connector implements Renderable {
  public static HEAD_SIZE = 20;
  public static LINE_WIDTH = 3;
  public static COLOR = '#999999';
  public static SHADOW_COLOR = '#cccccc';
  public id = 'connector_' + +new Date();
  protected from: Module;
  protected to: Module;
  public g: G | null = null;

  constructor(from: Module, to: Module) {
    this.from = from;
    this.to = to;
  }

  private getConnectorPosition(): ConnectorLinePosition {
    const pos: ConnectorLinePosition = {
      x1: this.from.x,
      y1: this.from.y,
      x2: this.to.x,
      y2: this.to.y,
    };

    const THRESHOLD = 45; // 45deg based. -> Vertical, Horizontal
    let deg = (Math.atan2(pos.y2 - pos.y1, pos.x2 - pos.x1) * 180) / Math.PI;
    deg = deg < 0 ? -deg : deg; // Convert: -180 ~ 180 -> 0 ~ 180
    deg = deg > 90 ? 180 - deg : deg; // Convert: 0 ~ 90

    if (deg > THRESHOLD) {
      // Vertical relation
      if (pos.y1 > pos.y2) {
        pos.y1 = pos.y1 - this.from.height / 2;
        pos.y2 = pos.y2 + this.to.height / 2 - Connector.LINE_WIDTH;
      } else {
        pos.y1 = pos.y1 + this.from.height / 2;
        pos.y2 = pos.y2 - this.to.height / 2 + Connector.LINE_WIDTH;
      }
    } else {
      // Horizontal relation
      if (pos.x1 > pos.x2) {
        pos.x1 = pos.x1 - this.from.width / 2;
        pos.x2 = pos.x2 + this.to.width / 2 - Connector.LINE_WIDTH;
      } else {
        pos.x1 = pos.x1 + this.from.width / 2;
        pos.x2 = pos.x2 - this.to.width / 2 + Connector.LINE_WIDTH;
      }
    }

    return pos;
  }

  isConnectedWith(targetModule: Module) {
    return this.to === targetModule || this.from === targetModule;
  }

  create(ctx: Context) {
    const connectorGroup = ctx.getConnectorGroup();
    const lineGroup = connectorGroup.group();
    const pos = this.getConnectorPosition();
    lineGroup
      .line(pos.x1, pos.y1, pos.x2, pos.y2)
      .stroke({ color: Connector.COLOR, width: Connector.LINE_WIDTH, linecap: 'round' })
      .attr({ class: 'connector' });
    lineGroup
      .circle(Connector.HEAD_SIZE)
      .attr({ cx: pos.x1, cy: pos.y1, fill: (this.from.constructor as typeof Module).COLOR });
    lineGroup.on('click', () => {
      this.destroy();
    });
    this.g = lineGroup;
    return this;
  }

  update() {
    const pos = this.getConnectorPosition();
    const line = this.g!.findOne('line');
    const lineHead = this.g!.findOne('circle');
    line.attr({ ...pos });
    lineHead.attr({ cx: pos.x1, cy: pos.y1 });
  }

  destroy() {
    this.from.disconnect(this);
    this.to.disconnect(this);
    this.g!.remove();
  }
}

export default Connector;
