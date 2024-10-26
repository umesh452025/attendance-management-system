document.addEventListener('DOMContentLoaded', function() {
  // Get the elements for notifications
  const notification = document.createElement('div');
  document.body.appendChild(notification);
  notification.id = 'notification';
  notification.style.display = 'none'; // Initially hidden

  // Helper function to show notifications
  function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = type; // 'success' or 'error'
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  // Handle the Login Page
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (!username || !password) {
        showNotification('Please fill out both fields', 'error');
        return;
      }

      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.token); // Save the JWT token
          showNotification('Login successful!', 'success');
          setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to the main page
          }, 1000);
        } else {
          showNotification(result.message || 'Invalid login details', 'error');
        }
      } catch (error) {
        showNotification('An error occurred while logging in', 'error');
      }
    });
  }

  // Handle the Attendance Page (index.html)
  const attendanceBody = document.getElementById('attendanceBody');
  if (attendanceBody) {
    // Attendance functionality for marking attendance and displaying records

    // Handle attendance marking
    document.getElementById('markAttendanceBtn')?.addEventListener('click', async () => {
      const studentName = document.getElementById('studentName').value;
      const status = document.getElementById('status').value;
      const date = document.getElementById('attendanceDate').value;
      const token = localStorage.getItem('token');

      if (!studentName || !status || !date) {
        showNotification('Please provide all fields', 'error');
        return;
      }

      if (!token) {
        showNotification('You need to be logged in to mark attendance', 'error');
        return;
      }

      try {
        const response = await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ studentName, status, date })
        });

        const result = await response.json();
        if (response.ok) {
          showNotification('Attendance marked successfully!', 'success');
          loadAttendanceRecords(); // Reload attendance records after marking
        } else {
          showNotification(result.message || 'Failed to mark attendance', 'error');
        }
      } catch (error) {
        showNotification('An error occurred while marking attendance', 'error');
      }
    });

    // Handle attendance filtering by student name
    document.getElementById('filterAttendanceBtn')?.addEventListener('click', async () => {
      const studentName = document.getElementById('filterStudentName').value;
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`/api/attendance?studentName=${studentName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const records = await response.json();
        if (response.ok) {
          displayAttendanceRecords(records); // Display filtered records
        } else {
          showNotification(records.message || 'Failed to filter attendance', 'error');
        }
      } catch (error) {
        showNotification('An error occurred while filtering attendance', 'error');
      }
    });

    // Load attendance records
    async function loadAttendanceRecords() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/attendance', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const records = await response.json();
        if (response.ok) {
          displayAttendanceRecords(records); // Display all records
        }
      } catch (error) {
        showNotification('Failed to load attendance records', 'error');
      }
    }

    // Function to display attendance records
    function displayAttendanceRecords(records) {
      attendanceBody.innerHTML = ''; // Clear existing records

      records.forEach(record => {
        const row = `<tr>
                      <td>${record.studentName}</td>
                      <td>${new Date(record.date).toLocaleDateString()}</td>
                      <td>${record.status}</td>
                    </tr>`;
        attendanceBody.innerHTML += row;
      });
    }

    // Load attendance records on page load
    loadAttendanceRecords();
  }

  // Handle Logout
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token'); // Clear the JWT token
      window.location.href = 'login.html'; // Redirect to login page
    });
  }
});
