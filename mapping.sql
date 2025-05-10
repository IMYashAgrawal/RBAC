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

-- Adding all the job roles in our company (already present, shown for reference)
INSERT INTO roles (name, description) VALUES
('Customer', 'Our valued shoppers'),
('Vendor', 'Product suppliers we work with'),
('Warehouse Staff', 'The folks who manage our inventory'),
('Delivery Personnel', 'Team that delivers orders to customers'),
('Customer Service', 'Helpful customer support agents'),
('Marketing Team', 'Creative promotions and advertising team'),
('Finance Team', 'Money management and accounting experts'),
('IT Team', 'Technical wizards who keep systems running'),
('Legal Team', 'Our compliance and legal guardians'),
('Admin', 'System overseers with full access');

-- Defining what people can actually do (already present, shown for reference)
INSERT INTO permissions (name, description) VALUES
('No access', 'Cannot see or use this at all'),
('View only', 'Can look but not change anything'),
('Full control', 'Can view and make changes');

-- Listing all parts of our online store (already present, shown for reference)
INSERT INTO system_components (name, description) VALUES
('Roles', 'Who can do what in the system'),
('Products', 'Items we sell'),
('Orders', 'Customer purchases'),
('User Profiles', 'Customer account information'),
('Inventory Data', 'What we have in stock'),
('Payment Info', 'Money handling and transactions'),
('Shipping Data', 'Delivery management'),
('Reviews', 'Customer feedback and ratings'),
('Analytics', 'Business performance data'),
('Promotions', 'Special offers and discounts'),
('Admin Settings', 'System configuration controls'),
('Legal Info', 'Terms, policies and compliance documents');

-- Now assigning permissions for ALL roles based on the original matrix

-- 1. CUSTOMER PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Roles'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'View only'));

-- 2. VENDOR PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Roles'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Vendor'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'View only'));

-- 3. WAREHOUSE STAFF PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Warehouse Staff'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- 4. DELIVERY PERSONNEL PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Inventory Data'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Delivery Personnel'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- 5. CUSTOMER SERVICE PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Roles'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'Full control')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Orders'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'User Profiles'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Shipping Data'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Customer Service'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'View only'));

-- 6. MARKETING TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Roles'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Reviews'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Analytics'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Marketing Team'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- 7. FINANCE TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Products'), (SELECT id FROM permissions WHERE name = 'View only')),
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM system_components WHERE name = 'Payment Info'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- 8. IT TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'IT Team'),
    components.id,
    (SELECT id FROM permissions WHERE name = 'Full control')
FROM system_components components
WHERE components.name NOT IN ('Legal Info', 'Promotions');

-- IT Team has no access to Legal Info and Promotions
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Legal Info'), (SELECT id FROM permissions WHERE name = 'No access')),
((SELECT id FROM roles WHERE name = 'IT Team'), (SELECT id FROM system_components WHERE name = 'Promotions'), (SELECT id FROM permissions WHERE name = 'No access'));

-- 9. LEGAL TEAM PERMISSIONS
INSERT INTO access_rules (role_id, component_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Legal Team'), (SELECT id FROM system_components WHERE name = 'Legal Info'), (SELECT id FROM permissions WHERE name = 'Full control'));

-- 10. ADMIN PERMISSIONS (Full access to everything)
INSERT INTO access_rules (role_id, component_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Admin'),
    components.id,
    (SELECT id FROM permissions WHERE name = 'Full control')
FROM system_components components;