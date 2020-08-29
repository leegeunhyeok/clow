import Context from 'src/core/context';
import Module from 'src/core/common/module';
import Connector from 'src/core/common/connector';

export enum DataTypes {
  NULL = 0,
  STRING,
  OBJECT,
  ANY,
  PAGE,
  ELEMENT,
}

export interface Initable {
  init(ctx: Context): this;
}

export interface Connectable {
  inConnectRelation: boolean;
  connectors: Connector[];
  initConnection(): void;
  isConnectedWith(targetModule: Module): boolean;
  isConnectable(targetModule: Module): boolean;
  connect(connector: Connector): void;
  disconnect(connector: Connector): void;
}

export interface Point {
  x: number;
  y: number;
}
