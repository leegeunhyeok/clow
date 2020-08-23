import CrawlyModule from './common/CrawlyModule';
import DataTypes from './common/Types';

export default class Selector extends CrawlyModule {
  static COLOR = '#2196f3';
  inputType = [DataTypes.PAGE, DataTypes.ELEMENT];
  outputType = DataTypes.ELEMENT;
  row = 4;
  column = 14;

  constructor(x?: number, y?: number) {
    super(x, y);
    this.addComponent(
      {
        type: 'input',
        attr: {
          type: 'text',
          placeholder: 'CSS Selector',
        },
        on: {
          change: this.onChange.bind(this),
        },
      },
      0,
      0,
      14,
      2,
    );

    this.addComponent(
      {
        type: 'div',
        text: 'Only one',
        attr: {
          style: 'color: #fff',
        },
      },
      2,
      6,
      6,
      2,
    );

    this.addComponent(
      {
        type: 'input',
        attr: {
          type: 'checkbox',
        },
        on: {
          change: this.onSingleChange.bind(this),
        },
      },
      2,
      12,
      2,
      2,
    );
  }

  onChange(event: InputEvent) {
    const targetUrl = (event.target as HTMLInputElement).value;
    this.data['url'] = targetUrl;
  }

  onSingleChange(event: InputEvent) {
    const checked = (event.target as HTMLInputElement).checked;
    this.data['onlyOne'] = checked;
  }
}
