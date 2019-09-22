INSERT INTO `accounts` (email, passwordhash, isadmin) VALUES
  ("federlizer@gmail.com", "XFXdoubled7770", TRUE);

INSERT INTO `subjects` (name) VALUES
  ("Math");
SET @sid = LAST_INSERT_ID();
INSERT INTO `themes` (name, subjectid) VALUES
  ("Geometry", @sid);
SET @tid = LAST_INSERT_ID();


INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("What's this figure?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("A triangle", FALSE, @qid),
  ("A circle", TRUE, @qid),
  ("A batka", FALSE, @qid);


INSERT INTO `subjects` (name) VALUES
  ("Programming");
SET @sid = LAST_INSERT_ID();
INSERT INTO `themes` (name, subjectid) VALUES
  ("Software development", @sid);
SET @tid = LAST_INSERT_ID();


INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("Which programming language is used for this project?", 2, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("C#", FALSE, @qid),
  ("Javascript", TRUE, @qid),
  ("Typescript", TRUE, @qid),
  ("Python", FALSE, @qid),
  ("Golang", FALSE, @qid);



