-- /backend/src/config/schema.sql
-- =============================================
--      ExpertSoft Financial Data Schema
--      Database: pd_miguel_canedo_manglar
-- =============================================

-- --------------------------------------
-- Drop and recreate the database
-- --------------------------------------

-- Delete the database if it exists to start fresh
DROP DATABASE IF EXISTS pd_miguel_canedo_manglar; 

-- Create a new database 
CREATE DATABASE pd_miguel_canedo_manglar;

-- Select the new database for use
USE pd_miguel_canedo_manglar;


-- --------------------------------------
-- Table: clients
-- Stores customer information. 
-- --------------------------------------
CREATE TABLE clients (
    id_client INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    identification VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(25),
    email VARCHAR(150) NOT NULL UNIQUE
);


-- --------------------------------------
-- Table: platforms
-- Stores the financial platforms used for transactions.
-- --------------------------------------
CREATE TABLE platforms (
    id_platform INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- --------------------------------------
-- Table: invoices
-- Stores invoice data. 
-- --------------------------------------
CREATE TABLE invoices (
    id_invoice INT PRIMARY KEY AUTO_INCREMENT,
    id_client INT NOT NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    billing_period VARCHAR(7) NOT NULL,
    billed_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,

    CONSTRAINT fk_invoices_clients 
        FOREIGN KEY (id_client) REFERENCES clients(id_client)
        ON DELETE RESTRICT ON UPDATE CASCADE -- Prevents deleting a client if they have invoices
);


-- --------------------------------------
-- Table: transactions
-- Stores all payment attempts.
-- --------------------------------------
CREATE TABLE transactions (
    id_transaction INT PRIMARY KEY AUTO_INCREMENT,
    id_invoice INT NOT NULL,
    id_platform INT NOT NULL,
    transaction_code VARCHAR(60) NOT NULL UNIQUE, 
    transaction_date DATETIME NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('completed', 'pending', 'failed') NOT NULL,
    type VARCHAR(60) NOT NULL,

    CONSTRAINT fk_transactions_invoices 
        FOREIGN KEY (id_invoice) REFERENCES invoices(id_invoice),

    CONSTRAINT fk_transactions_platforms 
        FOREIGN KEY (id_platform) REFERENCES platforms(id_platform)
);
