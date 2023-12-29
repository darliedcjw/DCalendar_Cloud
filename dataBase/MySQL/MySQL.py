from MySQL_connect import connect_mysql
from MySQL_settings import *

cnx = connect_mysql(SERVER, PORT, UID, PWD, MASTERDATABASE)

cursor = cnx.cursor()
cursor.execute("SHOW DATABASES WHERE `Database` = 'DCalendarDB;'")
result = cursor.fetchall()

if len(result) == 1:
    print("Database Exist")
    cursor.close()
    cnx.close()

else:
    cursor.execute("CREATE DATABASE DCalendarDB;")    
    cursor.close()
    cnx.close()

    cnx = connect_mysql(SERVER, PORT, UID, PWD, DATABASE)
    cursor = cnx.cursor()
    with open(SQLFILE_PATH) as file:
        cursor.execute(file.read())
    cursor.close()
    cnx.close()
    print("Database created!")