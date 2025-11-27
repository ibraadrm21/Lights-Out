-- PostgreSQL Schema for Lights Out F1 Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Points table
CREATE TABLE IF NOT EXISTS points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    mode VARCHAR(50) DEFAULT 'quiz',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct CHAR(1) NOT NULL CHECK (correct IN ('A', 'B', 'C', 'D'))
);

-- Geo locations table
CREATE TABLE IF NOT EXISTS geo_locations (
    id SERIAL PRIMARY KEY,
    lat DECIMAL(10, 6) NOT NULL,
    lon DECIMAL(10, 6) NOT NULL,
    description VARCHAR(255),
    mapillary_image_id TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_points_user_id ON points(user_id);
CREATE INDEX IF NOT EXISTS idx_points_created_at ON points(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
