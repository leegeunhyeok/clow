import CrawlyModule from './common/CrawlyModule';
import DataTypes from './common/Types';

export default class Pager extends CrawlyModule {
  inputType = DataTypes.STRING;
  outputType = DataTypes.PAGE;
  color = '#cfd8dc';
  row = 2;
  column = 14;

  constructor(x?: number, y?: number) {
    super(x, y);
    this.addComponent(
      {
        type: 'input',
        attr: {
          type: 'text',
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
  }

  onChange(event: InputEvent) {
    const targetUrl = (event.target as HTMLInputElement).value;
    this.data['url'] = targetUrl;
  }
}
