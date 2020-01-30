DROP TABLE IF EXISTS `student_exam_answers`;
DROP TABLE IF EXISTS `exam_grades`;
DROP TABLE IF EXISTS `exam_boundaries`;
DROP TABLE IF EXISTS `exam_questions`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `themes`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `specialties`;
DROP TABLE IF EXISTS `accounts`;

CREATE TABLE `accounts` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `passwordhash` VARCHAR(150) NOT NULL,
  `roles` SET('none', 'admin', 'student', 'teacher') NOT NULL DEFAULT 'none'
  -- `roles` ENUM('none', 'admin', 'student', 'teacher') NOT NULL DEFAULT 'none'
);


CREATE TABLE `specialties` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE `students` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `account_id` INT UNSIGNED NOT NULL,
  `specialty_id` INT UNSIGNED NOT NULL,
  FOREIGN KEY (account_id)
    REFERENCES accounts (id)
    ON DELETE RESTRICT,
  FOREIGN KEY (specialty_id)
    REFERENCES specialties (id)
    ON DELETE RESTRICT
);


CREATE TABLE `subjects` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE
);


CREATE TABLE `themes` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `subjectid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (subjectid)
    REFERENCES subjects (id)
    ON DELETE CASCADE
);


CREATE TABLE `questions` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `text` VARCHAR(500) NOT NULL,
  `points` INT UNSIGNED NOT NULL,
  `subjectid` INT UNSIGNED NOT NULL,
  `themeid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (subjectid)
    REFERENCES subjects (id)
    ON DELETE CASCADE,
  FOREIGN KEY (themeid)
    REFERENCES themes (id)
    ON DELETE CASCADE
);


CREATE TABLE `media` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `content` MEDIUMBLOB NOT NULL,
  `questionid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (questionid)
    REFERENCES questions (id)
    ON DELETE CASCADE
);


CREATE TABLE `answers` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `text` VARCHAR(150) NOT NULL,
  `correct` BOOLEAN NOT NULL,
  `questionid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (questionid)
    REFERENCES questions (id)
    ON DELETE CASCADE
);


CREATE TABLE `exams` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `startdate` DATETIME NOT NULL,
  `enddate` DATETIME NOT NULL,
  `timetosolve` TIME NOT NULL,
  `creatorid` INT UNSIGNED NOT NULL,
  FOREIGN KEY(creatorid)
    REFERENCES accounts (id)
    ON DELETE RESTRICT
);


CREATE TABLE `exam_questions` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `examid` INT UNSIGNED NOT NULL,
  `questionid` INT UNSIGNED NOT NULL,
  FOREIGN KEY (examid)
    REFERENCES exams (id)
    ON DELETE CASCADE,
  FOREIGN KEY (questionid)
    REFERENCES questions (id)
    ON DELETE RESTRICT
);

CREATE TABLE `exam_boundaries` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `exam_id` INT UNSIGNED NOT NULL,
  `specialty_id` INT UNSIGNED NOT NULL,
  `three` INT UNSIGNED NOT NULL,
  `four` INT UNSIGNED NOT NULL,
  `five` INT UNSIGNED NOT NULL,
  `six` INT UNSIGNED NOT NULL,
  FOREIGN KEY (exam_id)
    REFERENCES exams (id)
    ON DELETE CASCADE,
  FOREIGN key (specialty_id)
    REFERENCES specialties (id)
    ON DELETE RESTRICT
);

CREATE TABLE `exam_grades` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `exam_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NOT NULL,
  `grade` INT UNSIGNED NOT NULL,
  FOREIGN KEY (exam_id)
    REFERENCES exams (id)
    ON DELETE RESTRICT,
  FOREIGN KEY (student_id)
    REFERENCES students (id)
    ON DELETE RESTRICT
);

CREATE TABLE `student_exam_answers` (
  `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `exam_id` INT UNSIGNED NOT NULL,
  `question_id` INT UNSIGNED NOT NULL,
  `answer_id` INT UNSIGNED NOT NULL,
  FOREIGN KEY (student_id)
    REFERENCES students (id)
    ON DELETE CASCADE,
  FOREIGN KEY (exam_id)
    REFERENCES exams (id)
    ON DELETE RESTRICT,
  FOREIGN KEY (question_id)
    REFERENCES questions (id)
    ON DELETE RESTRICT,
  FOREIGN KEY (answer_id)
    REFERENCES answers (id)
    ON DELETE RESTRICT
);
