--As Postgres User
CREATE USER bcer_proxy WITH PASSWORD 'bcer';
--RDS handles the CREATE DATABASE bcer step
--CREATE DATABASE bcer WITH OWNER = bcer ENCODING = 'UTF8' CONNECTION LIMIT = -1 IS_TEMPLATE = False;
GRANT ALL PRIVILEGES on database bcer to bcer_proxy;

--Switch to bcer_proxy user
--Use the BCER database
CREATE SCHEMA bcer;
GRANT ALL ON ALL TABLES IN SCHEMA bcer TO bcer_proxy;
GRANT ALL ON SCHEMA bcer TO bcer_proxy;