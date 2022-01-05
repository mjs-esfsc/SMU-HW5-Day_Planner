class timeSlotObj {
    constructor(hour, todo) {
      this.hour = hour;
      this.todo = todo;
    }
  }
  
  window.onload = function() {
    const currenttimeSlots = getCurrenttimeSlots();
    const currentTime = moment();
  
    displayCurrentDate(currentTime);
    displaytimeSlotRows(currentTime);
  
    document.querySelector('.container')
      .addEventListener('click', function(event) {
        containerClicked(event, currenttimeSlots);
      });
    settimeSlotText(currenttimeSlots);
  };
  
  function getCurrenttimeSlots() {
    const currenttimeSlots = localStorage.getItem('timeSlotObjects');
    return currenttimeSlots ? JSON.parse(currenttimeSlots) : [];
  }
  
  function displayCurrentDate(currentTime) {
    document.getElementById('currentDay')
      .textContent = currentTime.format('dddd, MMMM Do');
  }
  
  //functions for displaying all time dlot rows
  function displaytimeSlotRows(currentTime) {
    const currentHour = currentTime.hour();
    //working hours are 0900-1700
    for (let i = 9; i <= 17; i ++) {
      const timeSlot = createtimeSlotRow(i);
      const hourCol = createCol(createHourDiv(i), 1);
      const textArea = createCol(createTextArea(i, currentHour), 10);
      const saveBtn = createCol(createSaveBtn(i), 1);
      appendtimeSlotColumns(timeSlot, hourCol, textArea, saveBtn);
      document.querySelector('.container').appendChild(timeSlot);
    }
  }
  
  function createtimeSlotRow(hourId) {
    const timeSlot = document.createElement('div');
    timeSlot.classList.add('row');
    timeSlot.id = `timeSlot-${hourId}`;
    return timeSlot;
  }
  
  function createCol(element, colSize) {
    const col = document.createElement('div');
    col.classList.add(`col-${colSize}`,'p-0');
    col.appendChild(element);
    return col;
  }
  
  function createHourDiv(hour) {
    const hourCol = document.createElement('div');
    hourCol.classList.add('hour');
    hourCol.textContent = formatHour(hour);
    return hourCol;
  }
  
  function formatHour(hour) {
    const hourString = String(hour);
    return moment(hourString, 'h').format('hA');
  }
  
  function createTextArea(hour, currentHour) {
    const textArea = document.createElement('textarea');
    textArea.classList.add(getTextAreaBackgroundClass(hour, currentHour));
    return textArea;
  }
  //set class for background based on time
  function getTextAreaBackgroundClass(hour, currentHour) {
    return hour < currentHour ? 'past' 
      : hour === currentHour ? 'present' 
      : 'future';
  }
  
  function createSaveBtn(hour) {
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('saveBtn');
    saveBtn.innerHTML = '<i class="fas fa-save"></i>';
    saveBtn.setAttribute('data-hour', hour);
    return saveBtn;
  }
  
  function appendtimeSlotColumns(timeSlotRow, hourCol, textAreaCol, saveBtnCol) {
    const innerCols = [hourCol, textAreaCol, saveBtnCol];
    for (let col of innerCols) {
      timeSlotRow.appendChild(col);
    }
  }
  
//Local Storage Functions
  function containerClicked(event, timeSlotList) {
    if (isSaveButton(event)) {
      const timeSlotHour = gettimeSlotHour(event);
      const textAreaValue = getTextAreaValue(timeSlotHour);
      placetimeSlotInList(new timeSlotObj(timeSlotHour, textAreaValue), timeSlotList);
      savetimeSlotList(timeSlotList);
    }
  }
  
  function isSaveButton(event) {
    return event.target.matches('button') || event.target.matches('.fa-save');
  }
  
  function gettimeSlotHour(event) {
    return event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
  }
  
  function getTextAreaValue(timeSlotHour) {
    return document.querySelector(`#timeSlot-${timeSlotHour} textarea`).value;
  }
  
  function placetimeSlotInList(newtimeSlotObj, timeSlotList) {
    if (timeSlotList.length > 0) {
      for (let savedtimeSlot of timeSlotList) {
        if (savedtimeSlot.hour === newtimeSlotObj.hour) {
          savedtimeSlot.todo = newtimeSlotObj.todo;
          return;
        }
      }
    } 
    timeSlotList.push(newtimeSlotObj);
    return;
  }
  
  function savetimeSlotList(timeSlotList) {
    localStorage.setItem('timeSlotObjects', JSON.stringify(timeSlotList));
  }
  
  function settimeSlotText(timeSlotList) {
    if (timeSlotList.length === 0 ) {
      return;
    } else {
      for (let timeSlot of timeSlotList) {
        document.querySelector(`#timeSlot-${timeSlot.hour} textarea`)
          .value = timeSlot.todo;
      }
    }
  }