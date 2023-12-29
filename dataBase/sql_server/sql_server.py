from sql_server_connect import connect_sql_server
from sql_server_settings import *

cnx = connect_sql_server(DRIVER, SERVER, UID, PWD, MASTERDATABASE)

# Database Checks
cursor = cnx.cursor()
cursor.execute("SELECT name FROM sys.databases WHERE name = 'DCalendarDB';")
result = cursor.fetchall()

if len(result) == 1:
    print("Database Exist")
    cursor.close()
    cnx.close()

else:
    cursor.execute("CREATE DATABASE DCalendarDB;")    
    cursor.close()
    cnx.close()
    
    cnx = connect_sql_server(DRIVER, SERVER, UID, PWD, DATABASE)
    cursor = cnx.cursor()
    with open(SQLFILE_PATH) as file:
        cursor.execute(file.read())
    cursor.close()
    cnx.close()
    print("Database created!")


