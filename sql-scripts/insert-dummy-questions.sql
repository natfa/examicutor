INSERT INTO `subjects` (name) VALUES
  ("ExamCreationSubject");
SET @sid = LAST_INSERT_ID();

INSERT INTO `themes` (name, subjectid) VALUES
  ("ExamCreationTheme", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("1 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("2 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("3 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("4 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("5 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("6 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("7 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("8 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("9 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("10 Gives 1 point", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 1", TRUE, @qid),
  ("Incorrect 1", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("11 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("12 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("13 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("14 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("15 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("16 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("17 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("18 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("19 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("20 Gives 2 points", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 2", TRUE, @qid),
  ("Incorrect 2", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("21 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("22 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("23 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("24 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("25 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("26 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("27 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("28 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("29 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("30 Gives 3 points", 3, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 3", TRUE, @qid),
  ("Incorrect 3", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("31 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("32 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("33 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("34 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("35 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("36 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("37 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("38 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("39 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("40 Gives 4 points", 4, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 4", TRUE, @qid),
  ("Incorrect 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("41 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("42 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("43 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("44 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("45 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("46 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("47 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("48 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("49 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("50 Gives 5 points", 5, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Correct 5", TRUE, @qid),
  ("Incorrect 5", FALSE, @qid);
