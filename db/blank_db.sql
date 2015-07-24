PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

DROP TABLE IF EXISTS site_list;
CREATE TABLE site_list (
    id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    title       TEXT (512),
    status      VARCHAR (64),
    date_create DATETIME,
    date_update DATETIME
);

DROP TABLE IF EXISTS page_list;
CREATE TABLE page_list (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT (1024), site_id INT, status VARCHAR (64), date_create DATETIME, date_update DATETIME);

DROP TABLE IF EXISTS link_list;
CREATE TABLE link_list (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT (1024), page_id INT);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
