from flask_socketio import SocketIO

def recived():
    print('recived')

def init(app):
    io = SocketIO(app)

    @io.on('test')
    def io_test(json, method=['GET', 'POST']):
        print(str(json))
        io.emit('server', json, callbakc=recived)
