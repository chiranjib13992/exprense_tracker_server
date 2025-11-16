DELIMITER //

CREATE TRIGGER after_expense_insert
AFTER INSERT ON expenses
FOR EACH ROW
BEGIN
  INSERT INTO changes_log (userId, action)
  VALUES (NEW.user_id, 'Added Expense');
END //

DELIMITER ;
