# Hotel Website Backend (Node.js + MySQL)

## Setup

1. Create a `.env` file in the `server` directory with:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=hotel_db
JWT_SECRET=your_jwt_secret
PORT=5000
```

2. Create the MySQL database and users table:

```sql
CREATE DATABASE IF NOT EXISTS hotel_db;
USE hotel_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Database Schema (Add to your MySQL setup)

```sql
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status ENUM('pending','accepted','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
```

3. Install dependencies:
```
npm install
```

4. Start the backend:
```
npm start
```

## API Endpoints
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/health` — Health check

---

**Connect your React frontend to these endpoints for authentication and role-based dashboards.** 