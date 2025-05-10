-- Create our permission management home
CREATE DATABASE IF NOT EXISTS system_permissions;
USE system_permissions;

-- Define all possible job roles in our system
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- List all possible actions people can take
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Catalog all parts of our system
CREATE TABLE system_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
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
INSERT INTO roles (name, description) VALUES
('Customer', 'Our valued shoppers'),
('Vendor', 'Product suppliers we work with'),
('Warehouse Team', 'The folks who manage our inventory'),
('Delivery Crew', 'Team that gets orders to customers'),
('Support Staff', 'Helpful customer service agents'),
('Marketing', 'Creative promotions team'),
('Accounting', 'Money management experts'),
('Tech Team', 'IT wizards who keep things running'),
('Legal', 'Our compliance guardians'),
('Administrators', 'System overseers with full access');

-- Defining what people can actually do
INSERT INTO permissions (name, description) VALUES
('No access', 'Cannot see or use this at all'),
('View only', 'Can look but not change anything'),
('Full control', 'Can view and make changes');

-- Listing all parts of our online store
INSERT INTO system_components (name, description) VALUES
('Roles', 'Who can do what in the system'),
('Products', 'Items we sell'),
('Orders', 'Customer purchases'),
('User Accounts', 'Customer profiles'),
('Inventory', 'What we have in stock'),
('Payments', 'Money handling'),
('Shipping', 'Delivery management'),
('Product Reviews', 'Customer feedback'),
('Sales Reports', 'Business analytics'),
('Promotions', 'Special offers and discounts'),
('System Settings', 'Administrative controls'),
('Legal Docs', 'Terms and policies');

-- Now assigning permissions based on real-world needs
-- Customers can view products and manage their own orders
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- Vendors can edit products but only view orders
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'View only'));

-- Warehouse team manages inventory and shipping
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Warehouse Team'), (SELECT id FROM system_components WHERE name = 'Inventory'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Warehouse Team'), (SELECT id FROM system_components WHERE name = 'Shipping'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- Administrators can do everything (handle with care!)
INSERT INTO access_rules (role_id, component_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Administrators'),
    components.id,
    (SELECT id FROM permissions WHERE name = 'Full control')
FROM system_components components;