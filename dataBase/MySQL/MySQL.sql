CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_datetime DATETIME,
  end_datetime DATETIME,
  event_text TEXT NOT NULL,
  color VARCHAR(255) NOT NULL,
  bg VARCHAR(255) NOT NULL
);

CREATE INDEX idx_start ON events (start_datetime);
CREATE INDEX idx_end ON events (end_datetime);