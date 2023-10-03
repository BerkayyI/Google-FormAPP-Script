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

  addToCalendar(data);
}

function addToCalendar(data){
    
    var event = CalendarApp.getDefaultCalendar().createEvent(`Teacher: ${data[0]}`,
      new Date('October 10, 2023 20:00:00 UTC'),
      new Date('October 10, 2023 21:00:00 UTC'),
      {description: `Activity: ${data[5]}`})
  Logger.log('Event ID: ' + event.getId());

}