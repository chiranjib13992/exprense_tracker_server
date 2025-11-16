DELIMITER //

CREATE TRIGGER after_expense_delete
AFTER DELETE ON expenses
FOR EACH ROW
BEGIN
  INSERT INTO changes_log (userId, action)
  VALUES (OLD.user_id, 'Deleted Expense');
END //

DELIMITER ;
