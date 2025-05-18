function sendReminder() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var book = document.getElementById("book").value;
  var subject = "Reminder: You have some books to return!";

  var message =
    "Hello " +
    name +
    ",\n\n" +
    "This is a friendly reminder that you have " +
    book +
    " to return. " +
    "Please return them by the due date.\n\nThank you!";

  console.log("To: " + email);
  console.log("Subject: " + subject);
  console.log("Message:\n" + message);

  showMessage(message);
  return message;
}

function lastItem() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var book = document.getElementById("book").value;
  var subject = "Urgent: Items in your cart are almost out of stock";

  var message =
    "Hello " +
    name +
    ",\n\n" +
    "Just a quick heads-up — " +
    book +
    " in your cart are running low in stock.\n" +
    "If you're still interested, we recommend checking out soon before they're gone!\n\n" +
    "Thanks for using our bookstore platform!\n\nBest regards,";

  console.log("To: " + email);
  console.log("Subject: " + subject);
  console.log("Message:\n" + message);

  showMessage(message);
  return message;
}

function newBook() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var book = document.getElementById("book").value;
  var subject = "New Books are now available!";

  var message =
    "Hello " +
    name +
    ",\n\n" +
    "We are excited to let you know that " +
    book +
    " have just arrived! " +
    "Check out the latest additions to our collection.\n\n" +
    "Happy reading!\n\nBest regards,";
  console.log("To: " + email);
  console.log("Subject: " + subject);
  console.log("Message:\n" + message);

  showMessage(message);
  return message;
}
window.onload = function() {
  var messageList = JSON.parse(localStorage.getItem("generatedMessages")) || [];
  var notifContainer = document.querySelector(".notif-page");

  messageList.forEach(function(message) {
    var newNotif = document.createElement("div");
    newNotif.className = "notification-item";
    newNotif.innerText = "📢 " + message;
    notifContainer.appendChild(newNotif);
  });
};
function borrowBook() {
  var title = document.querySelector('.book-title').innerText;
  var author = document.querySelector('.book-author').innerText;

  var message = `You have successfully borrowed "${title}" by ${author}.`;
  localStorage.setItem("borrowedMessage", message);
  showMessage(message);
  alert("Book borrowed successfully!");

}


function showMessage(message) {
  var messageList = JSON.parse(localStorage.getItem("generatedMessages")) || [];
  messageList.push(message);
  localStorage.setItem("generatedMessages", JSON.stringify(messageList));
}


function errorhandle() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var book = document.getElementById("book").value;
  var error = document.getElementById("error");
  var text = "";

  if (name.length < 3) {
    text = "Please enter a valid name.";
    error.innerHTML = text;
    return false;
  } else if (
    email.length < 3 ||
    email.indexOf("@") == -1 ||
    email.indexOf(".") == -1
  ) {
    text = "Please enter a valid email address.";
    error.innerHTML = text;
    return false;
  } else if (book.length < 3) {
    text = "Please enter a valid book name.";
    error.innerHTML = text;
    return false;
  } else {
    error.innerHTML = "";
    return true;
  }
}

// Update notification badge
function updateNotificationBadge() {
    const unreadCount = document.querySelectorAll('.notification-card.unread').length;
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Fetch notifications periodically
function fetchNotifications() {
    fetch('/notifications/get-latest/', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        const dropdownContent = document.querySelector('.dropdown-content');
        if (dropdownContent && data.notifications) {
            // Update dropdown content
            let html = '';
            data.notifications.forEach(notif => {
                html += `
                    <p class="notif ${!notif.is_read ? 'unread' : ''}">
                        ${notif.message}
                        <time>${new Date(notif.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}</time>
                    </p>
                `;
            });
            html += '<a class="notif" href="/notifications/">See all notifications</a>';
            dropdownContent.innerHTML = html;
            
            // Update badge
            updateNotificationBadge();
        }
    })
    .catch(error => console.error('Error fetching notifications:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    // Add notification badge to navbar
    const notificationLink = document.querySelector('a[href*="notifications"]');
    if (notificationLink) {
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.style.display = 'none';
        notificationLink.appendChild(badge);
    }

    // Mark notifications as read when clicked
    const notifications = document.querySelectorAll('.notification-card.unread');
    notifications.forEach(notification => {
        notification.addEventListener('click', function() {
            const notificationId = this.dataset.id;
            fetch(`/notifications/${notificationId}/mark-read/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    this.classList.remove('unread');
                    updateNotificationBadge();
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });

    // Initial notification count
    updateNotificationBadge();

    // Fetch notifications every 30 seconds
    fetchNotifications();
    setInterval(fetchNotifications, 30000);
});

// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
