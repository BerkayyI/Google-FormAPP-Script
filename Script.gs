
var data = []

function onOpen() {
  var ui = FormApp.getUi();
  ui.createMenu('Reservation management')
    .addItem('To confirm the reservations of your choice.\n please proceed', 'showInputDialog')
    .addToUi();
}

function showInputDialog() {
  var FormApplication = FormApp.getActiveForm();
  const formResponses = FormApplication.getResponses();
  var ui = FormApp.getUi();
  
  var result = ui.prompt('Enter the number of last responses to process:');

  if (result.getSelectedButton() == ui.Button.OK) {
      var lastResponses = parseInt(result.getResponseText());

      if (!isNaN(lastResponses)) {
        myFunction(lastResponses);
      } else {
        ui.alert('Invalid input. Please enter a valid number.');
      }
  }

}


function myFunction(lastResponses) {
  var FormApplication = FormApp.getActiveForm();
  const formResponses = FormApplication.getResponses();
  var ui = FormApp.getUi();
  var i;
 
  var response = ui.alert(
    'Send an Email?',
    '',
    ui.ButtonSet.YES_NO
  );


  for (i = formResponses.length - 1; i >= Math.max(0, formResponses.length - lastResponses); i--) {
    var data = []

    for (var j = 0; j < 6; j++) {
      var item = FormApplication.getItems()[j];

      const itemResponse = formResponses[i].getResponseForItem(item);
      data[j] = itemResponse.getResponse();
      console.log(itemResponse.getResponse());
      
    }
    console.log(`${data[3]}, ${data[4]}`)

    
    // Check if start time is greater than end time

    if (response == ui.Button.YES) {
    var respondentEmail = formResponses[i].getRespondentEmail();
      

    if (data[3] > data[4]) {
      console.log('Start time is greater than end time for response ' + i);
      var respondentEmail = formResponses[i].getRespondentEmail();
      sendErrorEmail(data, respondentEmail);
    }


    else if(data[3] == "00:00" || data[4] == "00:00"){
      console.log('Start time is 00:00  ' + i);
      var respondentEmail = formResponses[i].getRespondentEmail();
      sendErrorEmail(data, respondentEmail);
    }



    sendEmailToRespondent(data, respondentEmail);
    ui.alert('Email sent.');
    } else {
      ui.alert('Email not sent.');
    }
      addToCalendar(data);
    
  }


}


function formatDate(dateTimeStr) {
  try {
    var dateTime = new Date(dateTimeStr);
    var year = dateTime.getFullYear();
    var month = ('0' + (dateTime.getMonth() + 1)).slice(-2); // Add 1 to month (0-based index)
    var day = ('0' + dateTime.getDate()).slice(-2);
    var hours = ('0' + dateTime.getHours()).slice(-2);
    var minutes = ('0' + dateTime.getMinutes()).slice(-2);
    var seconds = ('0' + dateTime.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error formatting date: " + error.message);
    return null;
  }
}



function sendErrorEmail(data, respondentEmail) {

  if (data[3] > data[4]) {
    var emailSubject = 'Reservation Error';
    var emailBody = 'Dear ' + data[0] + ',\n\n';
    emailBody += 'We encountered an issue with your reservation:\n Start time is greater then end time.\n';
    emailBody += 'Start Time: ' + data[3] + '\n';
    emailBody += 'End Time: ' + data[4] + '\n';
    emailBody += 'Please redo your reservation with valid start and end times.\n';
    try {
      GmailApp.sendEmail(respondentEmail, emailSubject, emailBody);
      console.log('Error email sent to: ' + respondentEmail);
    } catch (error) {
      console.error('Error sending error email to: ' + respondentEmail + '\n' + error.toString());
    }  
  }

  else if(data[3] == "00:00" || data[4] == "00:00"){
    var emailSubject2 = 'Reservation Error';
    var emailBody2 = 'Dear ' + data[0] + ',\n\n';
    emailBody2 += 'We encountered an issue with your reservation:\nStart or End time can not be 00:00\n';
    emailBody2 += 'Start Time: ' + data[3] + '\n';
    emailBody2 += 'End Time: ' + data[4] + '\n';
    emailBody2 += 'Please redo your reservation with valid start and end times.\n';

    try {
      GmailApp.sendEmail(respondentEmail, emailSubject2, emailBody2);
      console.log('Error email sent to: ' + respondentEmail);
    } catch (error) {
      console.error('Error sending error email to: ' + respondentEmail + '\n' + error.toString());
    }      
      
  }

}

function extractEmailFromResponses(formResponse) {
  
  var emailFieldTitle = 'Email';

  // Find the 'Short answer' text field by title
  var emailField = FormApp.getActiveForm().getItems(FormApp.ItemType.TEXT).filter(function(item) {
    return item.getTitle() === emailFieldTitle;
  })[0];
  if (emailField) {
    var emailResponse = formResponse.getResponseForItem(emailField);
    if (emailResponse) {
      return emailResponse.getResponse();
    }
  }
  return null;
}

function sendEmailToRespondent(data, respondentEmail) {
  if (respondentEmail) {
    var emailSubject = 'Pruebas Reserva Aula Ateca'; 
    var emailBody = 'Dear ' + data[0] + ',\n\n';
    emailBody += 'Thank you for your reservation!\nCourse: ' + data[1] + '.\n';
    emailBody += 'Details about the date and time\n ' + data[2] +  ' from: ' + data[3] + ' To: ' + data[4] + '\nThe Resources needed: ' + data[5] + '\n';

    try {
      GmailApp.sendEmail(respondentEmail, emailSubject, emailBody);
      console.log('Email sent to: ' + respondentEmail);
    } catch (error) {
      console.error('Error sending email to: ' + respondentEmail + '\n' + error.toString());
    }
  } else {
    console.log('Email address not found in form response.');
  }
}



function getMonthName(month) {
  var monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[parseInt(month) - 1];
}


function addToCalendar(data){
  
  
  var DataComponents = data[2].split('-')
  var Year = DataComponents[0]
  var Month = DataComponents[1]
  var Day = DataComponents[2]

  var StartTimeComponents = data[3].split(':')
  var startHours = StartTimeComponents[0]
  var startMinute = StartTimeComponents[1]

  var StopTimeComponents = data[4].split(':')
  var stopHours = StopTimeComponents[0]
  var stopMinute = StopTimeComponents[1]

  var formattedStartDate = `'${getMonthName(Month)} ${Day}, ${Year} ${startHours - 2}:${startMinute}:00 UTC'`;
  var formattedEndDate = `'${getMonthName(Month)} ${Day}, ${Year} ${stopHours - 2}:${stopMinute}:00 UTC'`;
  
  const calendarID = 'berkayischule@gmail.com'
  // here u can change the Calendar ID

    var event = CalendarApp.getCalendarById(calendarID).createEvent(`Teacher: ${data[0]}`,
      new Date(formattedStartDate),
      new Date(formattedEndDate),
      {description: `Activity: ${data[5]}`})
  Logger.log('Event ID: ' + event.getId());

}
