function getDaysOfMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      const formattedMonth = (month).toString().padStart(2, '0');
  
      dates.push(`${year}-${formattedMonth}-${day}`);
    }
  
    return dates;
}

export default getDaysOfMonth;