INSERT INTO users (user_id, username, password, role) VALUES
    (UNHEX('3f883b26f61b41b0a83f390bfb4b311a'), 'Stefan', '$2a$12$zv38uwdc05GJw5LVUjPZguaMHBUcDsRCdsDCMZVP0M14sC4J5wUti', 'CASHIER'),
    (UNHEX('1f883b26f61b41b0a83f390bfb4b311a'), 'Ema', '$2a$12$zv38uwdc05GJw5LVUjPZguaMHBUcDsRCdsDCMZVP0M14sC4J5wUti', 'CASHIER'),
    (UNHEX('2f883b26f61b41b0a83f390bfb4b311a'), 'Uros', '$2a$12$zv38uwdc05GJw5LVUjPZguaMHBUcDsRCdsDCMZVP0M14sC4J5wUti', 'CASHIER');

INSERT INTO store_article (serial_number, article_name, price, quantity_available)
VALUES
    ('SN001', 'T-shirt', 19.99, 100),
    ('SN002', 'Jeans', 39.99, 50),
    ('SN003', 'Sneakers', 49.99, 75),
    ('SN004', 'Backpack', 29.99, 30),
    ('SN005', 'Hoodie', 29.99, 80),
    ('SN006', 'Running Shoes', 59.99, 60),
    ('SN007', 'Dress Shirt', 34.99, 45),
    ('SN008', 'Skirt', 24.99, 55),
    ('SN009', 'Jacket', 79.99, 25),
    ('SN010', 'Shorts', 22.99, 70);

INSERT INTO loyalty_card (jmbg, firstname, lastname, phonenumber, points, code) VALUES
    ('1234567890123', 'John', 'Doe', '123-456-7890', 0.00, 'LC123456'),
    ('2345678901234', 'Jane', 'Smith', '234-567-8901', 1000.00, 'LC234567'),
    ('3456789012345', 'Alice', 'Johnson', '345-678-9012', 500.00, 'LC345678'),
    ('4567890123456', 'Bob', 'Brown', '456-789-0123', 200.00, 'LC456789'),
    ('5678901234567', 'Carol', 'Davis', '567-890-1234', 600.00, 'LC567890');