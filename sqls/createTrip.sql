DROP PROCEDURE IF EXISTS createTrip;

DELIMITER //

CREATE PROCEDURE createTrip(
    IN p_tripTitle VARCHAR(150),
    IN p_note TEXT,
    IN p_startDate DATE,
    IN p_members JSON,
    IN p_created_by VARCHAR(150)
)
BEGIN
    DECLARE v_createdBy INT;
    DECLARE v_tripId INT;
    DECLARE i INT DEFAULT 0;
    DECLARE memberId INT;
    DECLARE totalMembers INT;

    -- Get creator user id
    SELECT user_id INTO v_createdBy
    FROM users
    WHERE user_id = p_created_by
    LIMIT 1;

    IF v_createdBy IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid budgetbodyId';
    END IF;

    -- Insert into trips
    INSERT INTO trips (title, note, trip_start_date, created_by)
    VALUES (p_tripTitle, p_note, p_startDate, v_createdBy);

    SET v_tripId = LAST_INSERT_ID();

    -- Add creator as member
    INSERT INTO trip_members (trip_id, user_id)
    VALUES (v_tripId, v_createdBy);

    -- Insert other members
    SET totalMembers = JSON_LENGTH(p_members);

    WHILE i < totalMembers DO

        SET memberId = JSON_UNQUOTE(
            JSON_EXTRACT(p_members, CONCAT('$[', i, ']'))
        );

        IF memberId <> v_createdBy THEN
            INSERT IGNORE INTO trip_members (trip_id, user_id)
            VALUES (v_tripId, memberId);
        END IF;

        SET i = i + 1;

    END WHILE;

END //

DELIMITER ;