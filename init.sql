CREATE DATABASE AppContext;
USE AppContext;
CREATE TABLE Figure (
    [ID]    int			  IDENTITY(1,1) NOT NULL,
    [type]  NCHAR (10)    NOT NULL,
    [color] NCHAR (10)    NOT NULL,
    [start] NVARCHAR (50) NOT NULL,
    [end]   NVARCHAR (50) NOT NULL
);

