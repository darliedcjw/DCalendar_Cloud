# (A) INIT
# (A1) LOAD MODULES
import sys
import eventFunction.eventLib as el
from flask import Flask, request, render_template, make_response

# (A2) FLASK SETTINGS + INIT
HOST_NAME = "localhost"
HOST_PORT = 8000
app = Flask(__name__)
# app.debug = True

# (R) ROUTES
# (R1) CALENDAR PAGE
@app.route("/", methods=["GET"])
def index():
  return render_template("calendar.html")

# (R2) Get
@app.route("/get", methods=["POST"])
def get():
  data = dict(request.form)
  events = el.get(int(data["month"]), int(data["year"]))
  return str({}) if events is None else events

# (R3) Save
@app.route("/save", methods=["POST"])
def save():
  data = dict(request.form)
  ok = el.save(data["start_datetime"], data["end_datetime"], data["event_text"], data["color"], data["bg"], data["id"] if "id" in data else None)
  msg = "OK" if ok else sys.last_value
  return make_response(msg, 200) # Result to visualise for status 200

# (R4) Delete
@app.route("/delete", methods=["POST"])
def delete():
  data = dict(request.form)
  ok = el.delete(data["id"])
  msg = "OK" if ok else sys.last_value
  return make_response(msg, 200)

# (C) START
if __name__ == "__main__":
  app.run(host=HOST_NAME, port=HOST_PORT)