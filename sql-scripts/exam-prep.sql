source /home/federlizer/projects/natfa/sql-scripts/create-tables.sql;

INSERT INTO `accounts` (email, passwordhash, roles) VALUES
  ("teacher@teacher.com", "\$2a\$10\$KlYqgfhse0YqJsNMKzl54um3yVCem1mNn06cgpZgN/tMv1Zcs3m3y", "teacher");

INSERT INTO `specialties` (name) VALUES ("Computer Science");
SET @specialtyID = LAST_INSERT_ID();

INSERT INTO `accounts` (email, passwordhash, roles) VALUES
  ("computer@student.com", "\$2a\$10\$KlYqgfhse0YqJsNMKzl54um3yVCem1mNn06cgpZgN/tMv1Zcs3m3y", "student");
SET @accountID = LAST_INSERT_ID();

INSERT INTO `students` (account_id, specialty_id) VALUES
  (@accountID, @specialtyID);

INSERT INTO `specialties` (name) VALUES ("Biochemistry");
SET @specialtyID = LAST_INSERT_ID();

INSERT INTO `accounts` (email, passwordhash, roles) VALUES
  ("biochemistry@student.com", "\$2a\$10\$KlYqgfhse0YqJsNMKzl54um3yVCem1mNn06cgpZgN/tMv1Zcs3m3y", "student");
SET @accountID = LAST_INSERT_ID();

INSERT INTO `students` (account_id, specialty_id) VALUES
  (@accountID, @specialtyID);

INSERT INTO `specialties` (name) VALUES ("Finance degree");
SET @specialtyID = LAST_INSERT_ID();

INSERT INTO `accounts` (email, passwordhash, roles) VALUES
  ("financial@student.com", "\$2a\$10\$KlYqgfhse0YqJsNMKzl54um3yVCem1mNn06cgpZgN/tMv1Zcs3m3y", "student");
SET @accountID = LAST_INSERT_ID();

INSERT INTO `students` (account_id, specialty_id) VALUES
  (@accountID, @specialtyID);




INSERT INTO `subjects` (name) VALUES
  ("Programming");
SET @sid = LAST_INSERT_ID();

INSERT INTO `themes` (name, subjectid) VALUES
  ("Software development", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid) VALUES
  ("What programming language was used for this project?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Typescript", TRUE, @qid),
  ("C#", FALSE, @qid),
  ("PHP", FALSE, @qid),
  ("Java", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("What database was used?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("MySQL", TRUE, @qid),
  ("MongoDB", FALSE, @qid),
  ("PostreSQL", FALSE, @qid);

INSERT INTO `themes` (name, subjectid) VALUES
  ("Web Development", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("What is the package manager for NodeJS called?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("NPM", TRUE, @qid),
  ("Nuggets", FALSE, @qid),
  ("Javascript", FALSE, @qid),
  ("Typescript", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("What does HTTP stand for?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("HyperText Transfer Protocol", TRUE, @qid),
  ("Hello This Text Protocol", FALSE, @qid),
  ("It doesn't stand for anything", FALSE, @qid),
  ("The question is too hard", FALSE, @qid);

INSERT INTO `subjects` (name) VALUES
  ("Biology");
SET @sid = LAST_INSERT_ID();

INSERT INTO `themes` (name, subjectid) VALUES
  ("Organisms", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("What are chromosomes?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("A DNA molecule", TRUE, @qid),
  ("Some wrong answer", FALSE, @qid),
  ("It is a programming language", FALSE, @qid),
  ("x = 4", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("What is DNA?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("A genetic structure (Marked as correct in the system)", TRUE, @qid),
  ("Some wrong answer", FALSE, @qid),
  ("It is a programming language", FALSE, @qid),
  ("x = 4", FALSE, @qid);

INSERT INTO `subjects` (name) VALUES
  ("Chemistry");
SET @sid = LAST_INSERT_ID();

INSERT INTO `themes` (name, subjectid) VALUES
  ("Phisical Chemistry", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("How do you make fire using chemical elements?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("With natrium and some water", TRUE, @qid),
  ("Just a stick and a match...", FALSE, @qid),
  ("What does that have to do with programming?!", FALSE, @qid),
  ("Please DO NOT burn the house down!", FALSE, @qid);

INSERT INTO `subjects` (name) VALUES
  ("Business");
SET @sid = LAST_INSERT_ID();

INSERT INTO `themes` (name, subjectid) VALUES
  ("Organizational structures", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("Which of these is NOT an organizational structure?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("Adhocracy", TRUE, @qid),
  ("Functional structure", FALSE, @qid),
  ("Multidivisional structure", FALSE, @qid),
  ("Matrix structure", FALSE, @qid);

INSERT INTO `subjects` (name) VALUES
  ("Math");
SET @sid = LAST_INSERT_ID();

INSERT INTO `themes` (name, subjectid) VALUES
  ("Algebra", @sid);
SET @tid = LAST_INSERT_ID();

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("How much is 2 + 2?", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("4", TRUE, @qid),
  ("22", FALSE, @qid),
  ("2", FALSE, @qid),
  ("What is this '+' sign?", FALSE, @qid);

INSERT INTO `questions` (text, points, subjectid, themeid)
  VALUES ("1000 + 2000", 1, @sid, @tid);
SET @qid = LAST_INSERT_ID();
INSERT INTO `answers` (text, correct, questionid) VALUES
  ("3000", TRUE, @qid),
  ("10002000", FALSE, @qid),
  ("3", FALSE, @qid),
  ("What is this '+' sign?", FALSE, @qid);
