import CanvasContext from '../../CanvasContext';
import { G } from '@svgdotjs/svg.js';
import CrawlyModule from './CrawlyModule';

interface ConnectorLinePosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

class ModuleConnector {
  public static HEAD_SIZE = 20;
  public static LINE_WIDTH = 3;
  protected from: CrawlyModule;
  protected to: CrawlyModule;
  protected g: G;

  constructor(from: CrawlyModule, to: CrawlyModule) {
    this.from = from;
    this.to = to;
    const connectorGroup = CanvasContext.getInstance().getConnectorGroup();
    const lineGroup = connectorGroup.group();
    const pos = this.getConnectorPosition();
    lineGroup
      .line(pos.x1, pos.y1, pos.x2, pos.y2)
      .stroke({ color: '#999', width: ModuleConnector.LINE_WIDTH, linecap: 'round' });
    lineGroup
      .circle(ModuleConnector.HEAD_SIZE)
      .attr({ cx: pos.x1, cy: pos.y1 })
      .attr({ fill: from.color });
    this.g = lineGroup;
  }

  update() {
    const pos = this.getConnectorPosition();
    const line = this.g.findOne('line');
    const lineHead = this.g.findOne('circle');
    line.attr({ ...pos });
    lineHead.attr({ cx: pos.x1, cy: pos.y1 });
  }

  private getConnectorPosition(): ConnectorLinePosition {
    const pos: ConnectorLinePosition = {
      x1: this.from.getGraphic().cx(),
      y1: this.from.getGraphic().cy(),
      x2: this.to.getGraphic().cx(),
      y2: this.to.getGraphic().cy(),
    };

    const THRESHOLD = 45; // 45deg based. -> Vertical, Horizontal
    let deg = (Math.atan2(pos.y2 - pos.y1, pos.x2 - pos.x1) * 180) / Math.PI;
    deg = deg < 0 ? -deg : deg; // Convert: -180 ~ 180 -> 0 ~ 180
    deg = deg > 90 ? 180 - deg : deg; // Convert: 0 ~ 90

    if (deg > THRESHOLD) {
      // Vertical relation
      if (pos.y1 > pos.y2) {
        pos.y1 = pos.y1 - this.from.getGraphic().height() / 2;
        pos.y2 = pos.y2 + this.to.getGraphic().height() / 2 - ModuleConnector.LINE_WIDTH;
      } else {
        pos.y1 = pos.y1 + this.from.getGraphic().height() / 2;
        pos.y2 = pos.y2 - this.to.getGraphic().height() / 2 + ModuleConnector.LINE_WIDTH;
      }
    } else {
      // Horizontal relation
      if (pos.x1 > pos.x2) {
        pos.x1 = pos.x1 - this.from.getGraphic().width() / 2;
        pos.x2 = pos.x2 + this.to.getGraphic().width() / 2 - ModuleConnector.LINE_WIDTH;
      } else {
        pos.x1 = pos.x1 + this.from.getGraphic().width() / 2;
        pos.x2 = pos.x2 - this.to.getGraphic().width() / 2 + ModuleConnector.LINE_WIDTH;
      }
    }

    return pos;
  }
}

export default ModuleConnector;
