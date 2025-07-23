-- hotel_db.sql

-- Create the database
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;

-- Users table (with roles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (name, email, password, role) VALUES ('Pradeep Gharti', 'ghartipradeep51@gmail.com', '$2b$10$1DfsoaZmT6xFV/AUZ5RVDeTW.utaZeCEJ0Goziu8k0TVQuhE4SoXS', 'admin'); -- password: Pradeep123##

-- Rooms table (with room number and type, no image_url)
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(10) NOT NULL UNIQUE, -- Room number, e.g., 101, 102
  type ENUM('Standard','Deluxe','Exclusive','Presidential') NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  facilities TEXT, -- Comma-separated list or JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (references room by id)
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  check_in DATE,
  room_type ENUM('Standard','Deluxe','Exclusive','Presidential'),
  room_no VARCHAR(10),
  adults INT,
  children INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table (references customer and room)
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INT NOT NULL,
  children INT DEFAULT 0,
  room_id INT NOT NULL,
  room_no VARCHAR(10) NOT NULL, -- Room number
  room_type ENUM('Standard','Deluxe','Exclusive','Presidential') NOT NULL, -- Room type
  special_requests TEXT,
  status ENUM('pending','accepted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Sample data for users
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@example.com', '$2b$10$DSJptMrE.eulqjn/i7O6gOac5IUV6SBOovOfRN19o3K1bi0II3Iaq', 'admin'), 
  ('John Doe', 'john@example.com', '$2b$10$DSJptMrE.eulqjn/i7O6gOac5IUV6SBOovOfRN19o3K1bi0II3Iaq', 'customer'); 

-- Sample data for rooms
INSERT INTO rooms (number, type, description, price, facilities) VALUES
  ('101', 'Standard', 'Cozy standard room with all basic amenities.', 2000, 'WiFi,Parking,AC'),
  ('102', 'Standard', 'Another standard room, perfect for solo travelers.', 2100, 'WiFi,Parking'),
  ('201', 'Deluxe', 'Spacious deluxe room with city view.', 3500, 'WiFi,Parking,Breakfast,AC,TV'),
  ('301', 'Exclusive', 'Exclusive suite with premium facilities.', 5000, 'WiFi,Parking,Breakfast,AC,TV,Mini Bar'),
  ('401', 'Presidential', 'Presidential suite for VIP guests.', 10000, 'WiFi,Parking,Breakfast,AC,TV,Mini Bar');

-- Sample data for customers
INSERT INTO customers (first_name, last_name, email, phone, check_in, room_type, room_no, adults, children) VALUES
  ('Alice', 'Smith', 'alice.smith@example.com', '9800000001', '2024-07-01', 'Standard', '101', 2, 0),
  ('Bob', 'Johnson', 'bob.johnson@example.com', '9800000002', '2024-07-05', 'Deluxe', '201', 2, 1);

-- Sample data for reservations
INSERT INTO reservations (customer_id, check_in, check_out, adults, children, room_id, room_no, room_type, special_requests, status) VALUES
  (1, '2024-07-01', '2024-07-03', 2, 0, 1, '101', 'Standard', 'Near elevator', 'pending'),
  (2, '2024-07-05', '2024-07-07', 2, 1, 3, '201', 'Deluxe', 'High floor', 'accepted');