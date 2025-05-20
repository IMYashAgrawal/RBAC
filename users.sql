Use system_permissions;

CREATE TABLE id (
    userid VARCHAR(50) NOT NULL UNIQUE,
    passwd VARCHAR(100) NOT NULL,
    roles INT,
    FOREIGN KEY (roles) REFERENCES roles(id)
);