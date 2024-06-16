function getPreviousMounths() {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
      
    let previousMonths = [];
    for (let i = 0; i < 12; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month < 0) {
            month += 12;
            year -= 1;
        }
        const monthName = new Date(year, month, 1).toLocaleString('ru', { month: 'long' });
        previousMonths.push(`${monthName}, ${year}`);
    }

    return previousMonths.map((date) => {
        return { cost: 0, date: date };
    });
}

export default getPreviousMounths;