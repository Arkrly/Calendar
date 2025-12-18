<?php

// Connect to MySQL Docker container
$host = "127.0.0.1";
$username = "root";
$password = "root";
$database = "course_calendar";
$conn = new mysqli($host, $username, $password, $database);
$conn->set_charset("utf8mb4");