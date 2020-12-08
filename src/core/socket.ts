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
    this._socket = io('http://localhost:5000', {
      extraHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  public disconnect() {
    this._socket && this._socket.disconnect();
  }

  public send<T>(event: string, ...data: T[]) {
    this._socket && this._socket.emit(event, data);
  }
}

export const socket = SocketManager.getInstance();
