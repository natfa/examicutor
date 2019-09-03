INSERT INTO `questions` (text)
  VALUES ("Which programming language is used for this project?");
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) values
  ("C#", FALSE, @qid),
  ("Javascript", TRUE, @qid),
  ("Typescript", TRUE, @qid),
  ("Python", FALSE, @qid),
  ("Golang", FALSE, @qid);


INSERT INTO `questions` (text)
  VALUES ("Which database is used for this project?");
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) values
  ("MongoDB", FALSE, @qid),
  ("MySQL", TRUE, @qid),
  ("PostgreSQL", FALSE, @qid),
  ("MS SQL", FALSE, @qid);


INSERT INTO `questions` (text)
  VALUES ("What does this picture represent?");
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) values
  ("An old lady", FALSE, @qid),
  ("A cute girl", TRUE, @qid),
  ("A batka", FALSE, @qid),
  ("Some friend I saw last night", FALSE, @qid);
