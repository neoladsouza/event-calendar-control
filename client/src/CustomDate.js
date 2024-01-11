import { isBefore, isEqual, isAfter } from 'date-fns';

export default class CustomDate extends Date {
    toISOStringWithOffset() {
      const offset = 5; // EST is 5 hours behind toISOString() 
  
      // Adjust the time by subtracting 5 hours
      const adjustedDate = new Date(this);
      adjustedDate.setHours(adjustedDate.getHours() - offset);
  
      // Use the standard toISOString method on the adjusted date
      return adjustedDate.toISOString().slice(0, 16);
    }
  
    getTimeToString() {
      function addZero(i) {
        if (i < 10) { i = "0" + i }
        return i;
      }
  
      const date = new Date(this);
      const hours = addZero(date.getHours());
      const minutes = addZero(date.getMinutes());
      return hours + ":" + minutes;
    }
  
    compareDates(date2) {
      if (isBefore(this, date2)) {
        return -1;
      } else if (isEqual(this, date2)) {
        return 0;
      } else if (isAfter(this, date2)) {
        return 1;
      }
    }
  }