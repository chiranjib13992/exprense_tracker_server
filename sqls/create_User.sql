DELIMITER //

CREATE PROCEDURE insertUser(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(25),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO users (name, email, phone, password)
    VALUES (p_name, p_email, p_phone, p_password);
END //

DELIMITER ;
