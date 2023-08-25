
# Import flask and datetime module for showing date and time
from dotenv import load_dotenv
load_dotenv()

import os
from supabase import create_client, Client
from flask import Flask, jsonify, request, make_response, render_template, session, redirect
from flask_socketio import join_room, leave_room, send, SocketIO
import random
from string import ascii_uppercase
# import datetime
 
# x = datetime.datetime.now()
 
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

# data = supabase.table("chats").select("*").eq("name", "chat21").execute()
# print(data)
data = supabase.table("chats").insert({"name":"Chat 2"}).execute()
data = supabase.table("chats").select("*").execute()
print(data)

# Initializing flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = "topSecret"
socketio = SocketIO(app)

@app.route("/", methods=["POST", "GET"])
def home():
    return render_template("home.html")
 
 
# Route for seeing a data
@app.route('/data', methods=["GET", "OPTIONS"])
def get_time():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "GET": # The actual request following the preflight
        response = jsonify({"order_id": 123, "status": "shipped"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        print(response)
        return response
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))
 
def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


# Running app
if __name__ == '__main__':
    socketio.run(app, debug=True)

