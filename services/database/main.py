import flask
from flask import request, jsonify
from manager.manager import Manager
from configuration.config import PORT, HOST

class DatebaseService:
    def __init__(self):
        self.HOST = HOST
        self.PORT = PORT 

        self.manager = Manager()

        app = flask.Flask(__name__)
        app.config["DEBUG"] = True


        @app.route('/base/new/', methods=['POST'])
        def new_wallet():
            data = self.manager.on_data('add_wallet', request.get_json(force=True))
            return jsonify(data), 200
        
        @app.route('/base/details/<socialId>/<socialName>', methods=['GET'])
        def wallet_details(socialId, socialName): 
            body = {
                "socialId" : str(socialId),
                "socialName" : str(socialName)
            }
            data = self.manager.on_data('wallet_details', body)
            
            return jsonify(data), 200
        
       

        app.run(self.HOST, self.PORT)

if __name__ == "__main__":
    #try:
    server = DatebaseService()
    #except:
    #    pass

    