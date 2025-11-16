DELIMITER //

CREATE TRIGGER after_expense_update
AFTER UPDATE ON expenses
FOR EACH ROW
BEGIN
  INSERT INTO changes_log (userId, action)
  VALUES (NEW.user_id, 'Updated Expense');
END //

DELIMITER ;
