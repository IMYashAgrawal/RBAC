-- Create our permission management home
CREATE DATABASE IF NOT EXISTS system_permissions;
USE system_permissions;

-- Define all possible job roles in our system
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- List all possible actions people can take
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Catalog all parts of our system
CREATE TABLE system_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create the master list of who can do what where
CREATE TABLE access_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    component_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (component_id) REFERENCES system_components(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE KEY (role_id, component_id, permission_id)
);

-- Adding all the job roles in our company
INSERT INTO roles (name) VALUES
('Customer'),
('Vendor'),
('Warehouse Staff'),
('Delivery Personnel'),
('Customer Service'),
('Marketing Team'),
('Finance Team'),
('IT Team'),
('Legal Team'),
('Admin');

-- Listing all parts of our online store
INSERT INTO system_components (name) VALUES
('Products'),
('Orders'),
('User Profiles'),
('Inventory Data'),
('Payment Info'),
('Shipping Data'),
('Reviews'),
('Analytics'),
('Promotions'),
('Admin Settings'),
('Legal Data');

-- Defining what people can actually do
INSERT INTO permissions (name) VALUES
('NA'),
('R'),
('R/W');

-- Now assigning permissions for ALL roles based on the original matrix

-- 1. CUSTOMER PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 2. VENDOR PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));


-- 3. WAREHOUSE STAFF PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 4. DELIVERY PERSONNEL PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 5. CUSTOMER SERVICE PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 6. MARKETING TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 7. FINANCE TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 8. IT TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'R')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'NA'));

-- 9. LEGAL TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'NA')),
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'R/W'));

-- 10. ADMIN PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Admin Settings'), (SELECT id FROM permissions WHERE name = 'R/W')),
((SELECT id FROM roles WHERE name = 'Admin'), (SELECT id FROM system_components WHERE name = 'Legal Data'), (SELECT id FROM permissions WHERE name = 'R/W'));