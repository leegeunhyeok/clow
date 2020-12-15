import { io, Socket } from 'socket.io-client';

class SocketManager {
  private static instance: SocketManager;
  private _socket: Socket | null = null;

  private constructor() {
    SocketManager.instance = this;
  }

  // Singleton
  public static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return this.instance;
  }

  public connect() {
    if (this._socket) return;
    this._socket = io('ws://localhost:5000', { transports: ['websocket'], upgrade: false });
    this._socket.connect();
    this._socket.on('connect', () => {
      console.log(this._socket);
    });
  }

  public disconnect() {
    this._socket && this._socket.disconnect();
  }

  public send<T>(event: string, ...data: T[]) {
    console.log(this._socket);
    this._socket && this._socket.emit(event, data);
  }
}

export const socket = SocketManager.getInstance();
