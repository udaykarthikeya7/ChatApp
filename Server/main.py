
# Import flask and datetime module for showing date and time
from dotenv import load_dotenv
load_dotenv()

import os
from supabase import create_client, Client
from flask import Flask, jsonify, request, make_response, render_template, session, redirect
from flask_socketio import join_room, leave_room, send, emit, SocketIO
import random
from string import ascii_uppercase
# import datetime
 
# x = datetime.datetime.now()

 
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

rooms = supabase.table("Rooms").select("roomCode").execute()

# data = supabase.table("chats").select("*").eq("name", "chat21").execute()
# print(data)
# data = supabase.table("chats").insert({"name":"Chat 2"}).execute()
# data = supabase.table("chats").select("*").execute()
# print(data)

def generate_unique_code(length):
    while True:
        code = ""
        for _ in range(length):
            code += random.choice(ascii_uppercase)
        
        if code not in rooms:
            break
    
    return code

def encrypt(data):
    return data

# Initializing flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = "topSecret"
socketio = SocketIO(app, cors_allowed_origins="*")


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
        response.headers.add("Access-Control-Allow-Origin", "*")
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

@socketio.on("connect")
def connect(auth):
    print("socket connected")
    send({"name": "message", "message": "connected successfully"})

@socketio.on("disconnect")
def disconnect():
    print("socket disconnected")

@socketio.on("create")
def createTable(msg):
    room = generate_unique_code(4)
    supabase.table("Rooms").insert({"roomCode": room, "members": [{"name": msg["name"]}]}).execute()
    supabase.table("Chats").insert({"roomId": room}).execute()
    emit("createStatus",{"success": True, "roomCode": room, "name": msg["name"]})

@socketio.on("join")
def createTable(msg):
    room = msg["code"]
    data, count = supabase.table("Rooms").select("members").eq("roomCode", room).execute()
    # print(data[1][0]["members"])
    supabase.table("Rooms").update({"members": [*data[1][0]["members"],{"name": msg["name"]}]}).eq("roomCode", room).execute()
    emit("createStatus",{"success": True, "roomCode": room, "name": msg["name"]})


@socketio.on("loadmsgs")
def sendmsgs(id):
    data, count = supabase.table("Chats").select("messages").eq("roomId", id).execute()
    if (data[1] != [] or data[1][0] != []):
        emit("msgs", data[1][0]["messages"])
    else :
        emit("msgs", [])
    join_room(id)

@socketio.on("sendmsg")
def sendmsgs(msg):
    data, count = supabase.table("Chats").select("messages").eq("roomId", msg["id"]).execute()
    if (hasattr(data[1][0]["messages"], '__iter__') == True):
        supabase.table("Chats").update({"messages": [*data[1][0]["messages"],{
        "name": msg["name"],
        "time": msg["time"],
        "message": msg["message"]
        }]}).eq("roomId", msg["id"]).execute()
    else:
        supabase.table("Chats").update({"messages": [{
        "name": msg["name"],
        "time": msg["time"],
        "message": msg["message"]
        }]}).eq("roomId", msg["id"]).execute()
    emit("newmsg", encrypt(msg), room=msg["id"])

# Running app
if __name__ == '__main__':
    socketio.run(app, debug=True)

