import mysql.connector

def connect_mysql(SERVER, PORT, UID, PWD, DATABASE):
    return mysql.connector.connect(
        host=SERVER,
        port=PORT,
        user=UID,
        password=PWD,
        database=DATABASE,
    )
