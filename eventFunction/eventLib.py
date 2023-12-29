import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))) # Obtain Parent Directory

from calendar import monthrange
from dataBase.MySQL.MySQL_settings import *
from dataBase.MySQL.MySQL_connect import connect_mysql
 

# (3) SAVE EVENT
def save (start_datetime, end_datetime, event_text, color, bg, id=None):
  # (3.1) CONNECT DATABASE
  cnx = connect_mysql(SERVER, PORT, UID, PWD, DATABASE)
  cursor = cnx.cursor()

  # (3.2) INSERT/UPDATE STATEMENTS
  data = (start_datetime, end_datetime, event_text, color, bg,)
  if id is None:
    sql = "INSERT INTO events (start_datetime, end_datetime, event_text, color, bg) VALUES (%s,%s,%s,%s,%s);"
  else:
    sql = "UPDATE events SET start_datetime=%s, end_datetime=%s, event_text=%s, color=%s, bg=%s WHERE id=%s;"
    data = data + (id,)

  # (3.3) EXECUTE STATEMENTS
  cursor.execute(sql, data)
  cnx.commit()
  cnx.close()
  return True


# (4) DELETE EVENT
def delete(id):
  # (4.1) CONNECT DATABASE
  cnx = connect_mysql(SERVER, PORT, UID, PWD, DATABASE)
  cursor = cnx.cursor()
  
  # (4.2) DELETE STATEMENTS
  data = (id,)
  sql = "DELETE FROM events WHERE id=%s;"
  
  # (4.3) EXECUTE STATEMENTS 
  cursor.execute(sql, data)
  cnx.commit()
  cnx.close()
  return True


# (5) RETRIEVE EVENTS
def get(month, year):
  # (5.1) CONNECT DATABASE
  cnx = connect_mysql(SERVER, PORT, UID, PWD, DATABASE)
  cursor = cnx.cursor()

  # (5.2) DATE RANGE CALCULATIONS
  daysInMonth = str(monthrange(year, month)[1])
  month = str(month) if month >= 10 else "0" + str(month)
  dateYM = str(year) + "-" + month + "-"
  start_datetime = dateYM + "01 00:00:00"
  end_datetime = dateYM + daysInMonth + " 23:59:59"

  # (5.3) RETRIEVE STATEMENTS
  data = (start_datetime, end_datetime, start_datetime, end_datetime, start_datetime, end_datetime)
  sql = "SELECT * FROM events WHERE ((start_datetime BETWEEN %s AND %s) OR (end_datetime BETWEEN %s AND %s) OR (start_datetime <= %s AND end_datetime >= %s));"

  # (5.4) EXECUTE STATEMENTS
  cursor.execute(sql, data)
  rows = cursor.fetchall()
  if len(rows)==0:
    return None

  # (5.5) RETURN DICTIONARY OF EVENTS
  events = {}
  for r in rows:
    events[r[0]] = {
      "start_datetime" : r[1], "end_datetime" : r[2],
      "color" : r[4], "bg" : r[5],
      "event_text" : r[3]
    }
  return events