import os

# SQL Server Parameters
DRIVER = "{ODBC Driver 18 for SQL Server};"
SERVER = "dcalendar-db.c3rsdhh9wkjq.ap-southeast-1.rds.amazonaws.com,1433;"
UID = "DCalendar23;"
PWD = "DCal23DarChe96!;"
MASTERDATABASE = ";"
DATABASE = "DCalendarDB;"

# Windows OS
try:
    os.environ["OS"]
    HOMEDRIVE = os.environ["HOMEDRIVE"]
    HOMEPATH = os.environ["HOMEPATH"]
    ADDITIONALPATH = "Desktop/Workshop"
    BASEFOLDER = "DCalendar_Cloud"
    DATABASE_FOLDER = "dataBase"
    SQLFILE_PATH = os.path.join(HOMEDRIVE, HOMEPATH, ADDITIONALPATH, BASEFOLDER, DATABASE_FOLDER, "sql_server.sql")

# Linux OS
except KeyError:
    HOMEDRIVE = os.environ["HOME"]
    BASEFOLDER = "DCalendar_Cloud"
    DATABASE_FOLDER = "dataBase"
    SQLFILE_PATH = os.path.join(HOMEDRIVE, BASEFOLDER, DATABASE_FOLDER, "sql_server.sql")