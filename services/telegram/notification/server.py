import flask
import  asyncio
from flask import request, jsonify
from .manager.manager import transaction, proposal, price, vote
from configuration.config import PORT, HOST
from telegram.ext import Application

class NotificationCenter:
    def __init__(self, application : Application, job_queue):
        self.HOST = HOST
        self.PORT = PORT 
        #manager = Manager(application)

        app = flask.Flask(__name__)
        #app.config["DEBUG"] = True

        @app.route('/notify/transaction/', methods=['POST'])
        async def new_transaction():
            job_queue.run_once(transaction, data=request.get_json(force=True), when=1)
            return '', 200

        @app.route('/notify/proposal/', methods=['POST'])
        async def new_proposal():
            job_queue.run_once(proposal, data=request.get_json(force=True), when=1)
            return '', 200
        
        @app.route('/notify/price/', methods=['POST'])
        async def new_price():
            job_queue.run_once(price, data=request.get_json(force=True), when=1)
            return '', 200
        
        @app.route('/notify/vote/', methods=['POST'])
        async def new_vote():
            job_queue.run_once(vote, data=request.get_json(force=True), when=1)
            return '', 200
        

        print('server on')

        app.run(self.HOST, self.PORT)
        print('yeahh run')