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
    this.addComponent(
      {
        type: 'input',
        attr: {
          type: 'text',
        },
        on: {
          click: this.onClick,
          change: this.onChange,
          mouseover: this.onChange,
        },
      },
      0,
      2,
      6,
      2,
    );
  }

  onClick() {
    console.log('click!');
  }

  onChange(event: InputEvent) {
    console.log((event.target as HTMLInputElement).value);
  }
}

/**
 * 
interface DOMConfig {
  type: string;
  text?: string;
  attr?: { [key: string]: string };
  on?: { [key: string]: Function };
  children?: DOMConfig[];
}
 */
