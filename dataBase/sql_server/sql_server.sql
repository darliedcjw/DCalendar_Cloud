CREATE TABLE events (
  id INT PRIMARY KEY IDENTITY(1,1),
  start_datetime DATETIME,
  end_datetime DATETIME,
  event_text NVARCHAR(MAX) NOT NULL,
  color NVARCHAR(MAX) NOT NULL,
  bg NVARCHAR(MAX) NOT NULL
);

CREATE INDEX idx_start ON events (start_datetime);
CREATE INDEX idx_end ON events (end_datetime);