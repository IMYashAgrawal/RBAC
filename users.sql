USE system_permissions;

CREATE TABLE users (
    userid VARCHAR(50) NOT NULL UNIQUE,
    passwd VARCHAR(100) NOT NULL,
    roles INT,
    FOREIGN KEY (roles) REFERENCES roles(id)
);