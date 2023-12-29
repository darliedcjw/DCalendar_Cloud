# Introduction: DCalendar

The project, DCalendar, showcases the development of a basic web-based calendar and deployment on AWS Cloud . DCalendar is running on an AWS EC2 instance and is connect to AWS MySQL as the backend database.

<details>
<summary><h2>Database Information</h2></summary>

<details>
<summary>Database Folder</summary>
<table>
    <tr>
        <td colspan='2;'><b>dataBase</b></td>
    </tr>
    <tr>
        <td>MySQL_settings.py</td>
        <td>Configurations for databases.</td>
    </tr>
    <tr>
        <td>MySQL_connect.py</td>
        <td><b>Python:</b> Function to connect to MySQL.</td>
    </tr>
    <tr>
        <td>MySQL.py</td>
        <td><b>Python:</b> Connect to SQL Server and execute SQL script.</td>
    </tr>
    <tr>
        <td>MySQL.sql</td>
        <td><b>SQL:</b> Create new table.</td>
    </tr>
</table>
</details>

<details>
<summary>Database Table</summary>
<table>
    <tr>
        <td colspan='6;'><b>DCalendarDB</b></td>
    </tr>
    <tr>
        <th>id</th>
        <th>start_datetime</th>
        <th>end_datetime</th>
        <th>event_text</th>
        <th>color</th>
        <th>bg</th>
    </tr>
</table>
<ul>
    <li><code>id: INT</code></li>
    <li><code>start_datetime: DATETIME</code></li>
    <li><code>end_datetime: DATETIME</code></li>
    <li><code>event_text: NVARCHAR(MAX) NOT NULL</code></li>
    <li><code>color: NVARCHAR(MAX) NOT NULL</code></li>
    <li><code>bg: NVARCHAR(MAX) NOT NULL</code></li>
</ul>
</details>
</details>

<details>
<summary><h2>Database Event Handler Information</h2></summary>
<details>
<summary>Event Handler Folder</summary>

<table>
        <tr>
            <td colspan="2;"><b>eventFunction</b></td>
        </tr>
        <tr>
            <td>eventLib.py</td>
            <td>Python scripts to execute SQL statements for events.</td>
        </tr>
</table>
</details>
</details>

---

# Settings Configuration

Modify the database configurations accordingly in the "MySQL_Settings.py" file

```
DCalendar_Cloud
|──dataBase
    |──MySQL
       |──MySQL_settings.py
       |...
```

Include the appropriate parameters

- `SERVER = <DNS_NAME>`
- `PORT = <PORT>`
- `UID = <USERNAME>`
- `PWD = <PASSWORD>`

---

# Deployment

<b>Remarks</b>: The following steps are performed within an AWS EC2 instance operating on Ubuntu.

## 1. Install Prerequisite Tools

Update the command-line tool

```
sudo apt-get update
```

Install python with virtualenv

```
sudo apt-get install python3-venv
```

Install pip3

```
sudo apt-get install python3-pip
```

## 2. Clone Repository

Obtain personal access token (PAT) for git repository

1. Go to "Settings"
2. Go to "Developer Settings"
3. Go to "Personal Access Tokens"
4. Click "Generate a personal access

Clone the corresponding git repository

```
git clone https://<PAT>@github.com/<ACCOUNT>/<REPOSITORY>.git
```

[Optional] Pull the updated git repository

```
cd <LOCAL_REPOSITORY>
git pull https://<PAT>@github.com/<ACCOUNT>/<REPOSITORY>.git
```

## 3. Python Virtual Environment

Enter local repository

```
cd <LOCAL_REPOSITORY>
```

Create and activate python virtual environment

```
python3 -m venv <NAME_VENV>
source <NAME_VENV>/bin/activate
```

Pip install the necessary python packages

```
pip install -r <NAME_REQUIREMENTS>.txt
```

## 4. Configuring System Unit File

Create system unit file

```
sudo nano /etc/systemd/system/<LOCAL_REPOSITORY>.service
```

Include the following in the "<LOCAL_REPOSITORY>.service" file

- Service: Specify user/group to run this service for

```
[Unit]
Description=Gunicorn instance for DCalendar
After=network.target
[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/<LOCAL_REPOSITORY>
ExecStart=
ExecStart=/home/ubuntu/<LOCAL_REPOSITORY>/venv/bin/python3 dataBase/MySQL/MySQL.py
ExecStart=
ExecStart=/home/ubuntu/LOCAL_REPOSITORY/venv/bin/gunicorn -b localhost:8000 app:app
Restart=always
[Install]
WantedBy=multi-user.target
```

Start and enable the service

```
sudo systemctl daemon-reload
sudo systemctl start <LOCAL_REPOSITORY>.service
sudo systemctl enable <LOCAL_REPOSITORY>.service
```

## 5. Configuring Nginx

Install Nginx

```
sudo apt-get install nginx
```

Start and enable Nginx service

```
sudo systemctl start nginx
sudo systemctl enable nginx
```

Edit Nginx default configuration file

```
sudo nano /etc/nginx/sites-available/default
```

Include the following configurations

```
# Add directives at the top

upstream <LOCAL_REPOSITORY> {
    server 127.0.0.1:8000;
}
```

```
# Add proxy pass inside the server block

location / {
    proxy_pass http://<LOCAL_REPOSITORY>/;
    expires -1;
}

location /static/ {
    proxy_pass http://<LOCAL_REPOSITORY>/static/;
    expires -1;
}

location /get {
    proxy_pass http://<LOCAL_REPOSITORY>/get;
    expires -1;
}

location /save {
    proxy_pass http://<LOCAL_REPOSITORY>/save;
    expires -1;
}

location /delete {
    proxy_pass http://<LOCAL_REPOSITORY>/delete;
    expires -1;
}
```

Restart Nginx

```
sudo systemctl restart nginx
```
