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
    this._socket = io();
  }

  public disconnect() {
    this._socket && this._socket.disconnect();
  }
}

export const socket = SocketManager.getInstance();
