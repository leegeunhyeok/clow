import Module from 'src/core/common/module';
import { DataTypes } from 'src/core/common';

export default class Pager extends Module {
  static COLOR = '#cfd8dc';
  inputType = DataTypes.STRING;
  outputType = DataTypes.PAGE;
  row = 2;
  column = 16;

  constructor(x?: number, y?: number) {
    super(x, y);
    this.addComponent(
      {
        type: 'input',
        attr: {
          type: 'text',
          placeholder: 'Page URL',
        },
        on: {
          change: this.onChange.bind(this),
        },
      },
      0,
      0,
      16,
      2,
    );
  }

  onChange(event: InputEvent) {
    const targetUrl = (event.target as HTMLInputElement).value;
    this.data['url'] = targetUrl;
  }
}
