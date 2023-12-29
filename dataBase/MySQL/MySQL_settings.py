import os

# SQL Server Parameters
SERVER = "dcalendar-db.c3rsdhh9wkjq.ap-southeast-1.rds.amazonaws.com"
PORT = "3306"
UID = "DCalendar23"
PWD = "DCal23DarChe96!"
MASTERDATABASE = ""
DATABASE = "DCalendarDB"
SQLFILE_PATH = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")), "MySQL/MySQL.sql")