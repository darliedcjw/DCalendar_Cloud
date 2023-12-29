import pyodbc

def connect_sql_server(DRIVER, SERVER, UID, PWD, DATABASE):
    return pyodbc.connect(
        "DRIVER=" + DRIVER +
        "SERVER=" + SERVER +
        "UID=" + UID +
        "PWD=" + PWD +
        "database=" + DATABASE +
        "TrustServerCertificate=" + "yes;",
        autocommit=True
        )