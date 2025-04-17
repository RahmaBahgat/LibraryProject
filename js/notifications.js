function sendReminder() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var book = document.getElementById("book").value;
    var subject = "Reminder: You have some books to return!";
    
    var message = "Hello " + name + ",\n\n" +
                  "This is a friendly reminder that you have "+book+" to return. " +
                  "Please return them by the due date.\n\nThank you!";

    console.log("To: " + email);
    console.log("Subject: " + subject);
    console.log("Message:\n" + message);
        return message;
  }
  function lastItem(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var book = document.getElementById("book").value;
    var subject = "Urgent: Items in your cart are almost out of stock";
    
    var message = "Hello " + name + ",\n\n" +
                  "Just a quick heads-up —"+book+" in your cart are running low in stock.\n" +
                  "If you're still interested, we recommend checking out soon before they're gone!\n\n" +
                  "Thanks for using our bookstore platform!\n\nBest regards,";
    console.log("To: " + email);
    console.log("Subject: " + subject);
    console.log("Message:\n" + message);
        return message;
  }
  function newBook(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var book = document.getElementById("book").value;
    var subject = "New Books are now available!";
    var message = "Hello " + name + ",\n\n" +
                  "We are excited to let you know that "+book+" have just arrived! " +
                  "Check out the latest additions to our collection.\n\n" +
                  "Happy reading!\n\nBest regards,";
  }
  function showNotifications(type) {
    let msg = "";

    switch (type) {
        case 'reminder':
            msg = sendReminder();
            break;
        case 'lastItem':
            msg = lastItem();
            break;
        case 'newBook':
            msg = newBook();
            break;
        default:
            msg = "Unknown notification type.";
    }

    // Display the message in the notification box
    var box = document.getElementById("notification-box");
    box.innerText = msg;
    box.style.display = "block";
}
