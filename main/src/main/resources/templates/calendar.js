// calendar.js

// ========== CLOCK ==========
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// ========== GLOBALS ==========
let events = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedEvent = null;

// ========== API CALLS ==========
async function fetchAppointments() {
    const res = await fetch('/api/appointments');
    events = await res.json();
    renderCalendar();
}

async function addAppointment(data) {
    const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function updateAppointment(id, data) {
    const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function deleteAppointment(id) {
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
}

// ========== CALENDAR RENDERING ==========
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const monthYear = document.getElementById('monthYear');
    const date = new Date(currentYear, currentMonth);
    const month = date.toLocaleString('default', { month: 'long' });
    monthYear.textContent = `${month} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell calendar-header';
        cell.textContent = day;
        calendar.appendChild(cell);
    });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell empty';
        calendar.appendChild(cell);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.textContent = day;

        // Events for this day
        const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(ev =>
            ev.startDate <= dayStr && ev.endDate >= dayStr
        );

        if (dayEvents.length > 0) {
            cell.classList.add('has-event');
            cell.addEventListener('click', () => openModal(dayStr, dayEvents));
            const dot = document.createElement('span');
            dot.className = 'event-dot';
            cell.appendChild(dot);
        } else {
            cell.addEventListener('click', () => openModal(dayStr, []));
        }

        calendar.appendChild(cell);
    }
}

// ========== MODAL LOGIC ==========
function openModal(dateStr, dayEvents) {
    document.getElementById('eventModal').style.display = 'block';
    document.getElementById('eventForm').reset();
    document.getElementById('formAction').value = 'add';
    document.getElementById('eventId').value = '';
    document.getElementById('startDate').value = dateStr;
    document.getElementById('endDate').value = dateStr;

    // Populate event selector if events exist
    const selectorWrapper = document.getElementById('eventSelectorWrapper');
    const selector = document.getElementById('eventSelector');
    selector.innerHTML = '<option disabled selected>Choose Event...</option>';
    if (dayEvents.length > 0) {
        selectorWrapper.style.display = 'block';
        dayEvents.forEach(ev => {
            const opt = document.createElement('option');
            opt.value = ev.id;
            opt.textContent = `${ev.courseName} (${ev.startTime} - ${ev.endTime})`;
            selector.appendChild(opt);
        });
    } else {
        selectorWrapper.style.display = 'none';
    }

    selectedEvent = null;
    document.getElementById('deleteEventId').value = '';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
    selectedEvent = null;
}

// When an event is selected from dropdown
function handleEventSelection(eventId) {
    const ev = events.find(e => e.id == eventId);
    if (!ev) return;
    selectedEvent = ev;
    document.getElementById('formAction').value = 'edit';
    document.getElementById('eventId').value = ev.id;
    document.getElementById('courseName').value = ev.courseName;
    document.getElementById('instructorName').value = ev.instructorName;
    document.getElementById('startDate').value = ev.startDate;
    document.getElementById('endDate').value = ev.endDate;
    document.getElementById('startTime').value = ev.startTime;
    document.getElementById('endTime').value = ev.endTime;
    document.getElementById('deleteEventId').value = ev.id;
}

// ========== FORM HANDLING ==========
document.getElementById('eventForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
        courseName: document.getElementById('courseName').value,
        instructorName: document.getElementById('instructorName').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value
    };
    const action = document.getElementById('formAction').value;
    if (action === 'add') {
        await addAppointment(data);
    } else if (action === 'edit') {
        const id = document.getElementById('eventId').value;
        await updateAppointment(id, data);
    }
    closeModal();
    fetchAppointments();
});

// Delete form
document.querySelector('#eventModal form[onsubmit]').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('deleteEventId').value;
    if (id) {
        await deleteAppointment(id);
        closeModal();
        fetchAppointments();
    }
});

// ========== NAVIGATION ==========
window.changeMonth = function (delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
};

// ========== INIT ==========
window.onload = fetchAppointments;
window.handleEventSelection = handleEventSelection;
window.closeModal = closeModal;