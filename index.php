<?php include "calendar.php"; ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#0f0f1a" />
  <title>Course Calendar | Modern Scheduling</title>
  <meta name="description" content="Modern course calendar application for managing appointments and schedules.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <h1>🗓️ Course Calendar</h1>
  </header>

  <?php if ($successMsg): ?>
    <div class="alert success"><?= $successMsg ?></div>
  <?php elseif ($errorMsg): ?>
    <div class="alert error"><?= $errorMsg ?></div>
  <?php endif; ?>

  <div class="clock-container">
    <div id="clock"></div>
  </div>

  <div class="calendar">
    <div class="nav-btn-container">
      <button onclick="changeMonth(-1)" class="nav-btn">⏮️</button>
      <h2 id="monthYear"></h2>
      <button onclick="changeMonth(1)" class="nav-btn">⏭️</button>
    </div>
    <div class="calendar-grid" id="calendar"></div>
  </div>

  <div class="modal" id="eventModal">
    <div class="modal-content">
      <div id="eventSelectorWrapper" style="display: none;">
        <label for="eventSelector"><strong>Select Event:</strong></label>
        <select id="eventSelector" onchange="handleEventSelection(this.value)">
          <option disabled selected>Choose Event...</option>
        </select>
      </div>

      <form method="POST" id="eventForm">
        <input type="hidden" name="action" id="formAction" value="add">
        <input type="hidden" name="event_id" id="eventId">

        <label for="courseName">Course Title:</label>
        <input type="text" name="course_name" id="courseName" required>

        <label for="instructorName">Instructor Name:</label>
        <input type="text" name="instructor_name" id="instructorName" required>

        <label for="startDate">Start Date:</label>
        <input type="date" name="start_date" id="startDate" required>

        <label for="endDate">End Date:</label>
        <input type="date" name="end_date" id="endDate" required>

        <label for="startTime">Start Time:</label>
        <input type="time" name="start_time" id="startTime" required>

        <label for="endTime">End Time:</label>
        <input type="time" name="end_time" id="endTime" required>

        <button type="submit">💾 Save</button>
      </form>

      <form method="POST" onsubmit="return confirm('Delete this appointment?')">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="event_id" id="deleteEventId">
        <button type="submit" class="submit-btn">🗑️ Delete</button>
      </form>

      <button type="button" class="cancel-btn" onclick="closeModal()">❌ Cancel</button>
    </div>
  </div>

  <script>const events = <?= json_encode($eventsFromDB, JSON_UNESCAPED_UNICODE); ?>;</script>
  <script src="calendar.js"></script>
</body>
</html>
