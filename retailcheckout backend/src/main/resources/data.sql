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