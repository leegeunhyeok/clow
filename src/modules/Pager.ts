import CrawlyModule from './common/CrawlyModule';
import DataTypes from './common/Types';

export default class PagerModule extends CrawlyModule {
  constructor(x: number = 0, y: number, color: string) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
    this.init();
  }
}