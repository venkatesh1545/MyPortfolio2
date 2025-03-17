-- Create the portfolio database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portfolio;

-- Use the portfolio database
USE portfolio;

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    tech_stack JSON,
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a sample project
INSERT INTO projects (title, description, image, tech_stack, github_url, demo_url)
VALUES (
    'E-Commerce Platform',
    'A complete e-commerce solution with product management, cart functionality, and secure payment processing.',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    '["React", "Node.js", "MongoDB", "Stripe"]',
    'https://github.com/yourusername/project-1',
    'https://project-demo-1.com'
);
