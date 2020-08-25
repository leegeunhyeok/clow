from flask_restful import Resource, reqparse


class StartEngine(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('timestamp', type=str)
            args = parser.parse_args()

            _timestamp = args['timestamp']
            return {'timestamp': _timestamp}
        except Exception as e:
            return {'error': str(e)}
