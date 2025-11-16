CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    purpose TEXT,
    payment_method VARCHAR(100),
    category VARCHAR(100),
    note VARCHAR(1000),
    userId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
