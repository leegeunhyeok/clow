import CrawlyModule from './common/CrawlyModule';
import DataTypes from './common/Types';

export default class Pager extends CrawlyModule {
  inputType = DataTypes.STRING;
  outputType = DataTypes.STRING;

  constructor(row: number, column: number, color: string) {
    super();
    this.row = row;
    this.column = column;
    this.color = color;
    this.addComponent('<input type="text">', 0, 1, 1, 1);
  }
}
