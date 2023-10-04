function onOpen() {
  var ui = FormApp.getUi();
  ui.createMenu('Reservation management')
      .addItem('Confirm lasts reservations', 'myFunction')
      .addToUi();
}

var data = [];

function myFunction() {
  var FormApplication = FormApp.getActiveForm()
  const formResponses = FormApplication.getResponses();
  for(var i = 0; i < 6; i++){
    var item = FormApplication.getItems()[i]
    
    for (const formResponse of formResponses) {
      const itemResponse = formResponse.getResponseForItem(item);
      data[i] = itemResponse.getResponse();
      console.log(itemResponse.getResponse());
    }
  }  

  addToCalendar(data)
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
  
  const calendarID = 'de58165ddaa061705076c0c928e61b4fe3c1d5d3e7d39c5dcbb7dfdd600b7753@group.calendar.google.com'
  // here u can change the Calendar ID

    var event = CalendarApp.getCalendarById(calendarID).createEvent(`Teacher: ${data[0]}`,
      new Date(formattedStartDate),
      new Date(formattedEndDate),
      {description: `Activity: ${data[5]}`})
  Logger.log('Event ID: ' + event.getId());

}