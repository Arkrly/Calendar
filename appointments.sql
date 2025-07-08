CREATE DATABASE IF NOT EXISTS course_calendar;
USE course_calendar;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `instructor_name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `appointments` (`id`, `course_name`, `instructor_name`, `start_date`, `end_date`, `created_at`, `start_time`, `end_time`) VALUES
(8, 'Artificial Intelligence Bootcamp', 'Alex', '2025-06-19', '2025-06-28', '2025-06-05 18:40:18', '07:00:00', '10:00:00');

COMMIT;
