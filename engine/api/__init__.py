
from flask_restful import Api
from .engine import StartEngine


def init(app):
    api = Api(app)
    api.add_resource(StartEngine, '/engine/start')
