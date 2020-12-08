'''
MIT License
Copyright (c) 2020 GeunHyeok LEE
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'''
import argparse
from flask import Flask
from flask_cors import CORS
from api import init as api_init
from socket_io import init as socket_init

parser = argparse.ArgumentParser(description='Clow server/engine agent.')
parser.add_argument('--host', dest='host', type=str, default='local', choices=['local', 'external'],
                    help='Clow server host (default: "local")')
parser.add_argument('--port', dest='port', type=int, default=5000,
                    help='Clow server port (default: 5000)')
parser.add_argument('--debug', dest='debug', type=int, default=False, choices=[0, 1],
                    help='Enable debug mode (default: 0, disabled)')
args = parser.parse_args()
app = Flask(__name__)
CORS(app)

if __name__ == '__main__':
    api_init(app)
    socket_init(app)
    app.run(host='0.0.0.0' if args.host == 'external' else None, port=args.port, debug=args.debug)
