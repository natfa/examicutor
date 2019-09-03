INSERT INTO `subjects` (name) VALUES
  ("Math");
SET @sid = LAST_INSERT_ID();
INSERT INTO `themes` (name, subjectid, themeid) VALUES
  ("Geometry", @sid, NULL);
SET @tid = LAST_INSERT_ID();
INSERT INTO `themes` (name, subjectid, themeid) VALUES
  ("Trigonometry", @sid, @tid);


INSERT INTO `subjects` (name) VALUES
  ("Programming");
SET @sid = LAST_INSERT_ID();
INSERT INTO `themes` (name, subjectid, themeid) VALUES
  ("Software development", @sid, NULL),
  ("Web development", @sid, NULL);
SET @tid = LAST_INSERT_ID();
INSERT INTO `themes` (name, subjectid, themeid) VALUES
  ("NodeJS", @sid, @tid);


INSERT INTO `questions` (text, points)
  VALUES ("Which programming language is used for this project?", 2);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("C#", FALSE, @qid),
  ("Javascript", TRUE, @qid),
  ("Typescript", TRUE, @qid),
  ("Python", FALSE, @qid),
  ("Golang", FALSE, @qid);


INSERT INTO `questions` (text, points)
  VALUES ("Which database is used for this project?", 3);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("MongoDB", FALSE, @qid),
  ("MySQL", TRUE, @qid),
  ("PostgreSQL", FALSE, @qid),
  ("MS SQL", FALSE, @qid);


INSERT INTO `questions` (text, points)
  VALUES ("What does this picture represent?", 1);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("An old lady", FALSE, @qid),
  ("A cute girl", TRUE, @qid),
  ("A batka", FALSE, @qid),
  ("Some friend I saw last night", FALSE, @qid);
