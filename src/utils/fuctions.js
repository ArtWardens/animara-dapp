export const getTodayDate = () => {
  const date = new Date();

  const malaysiaTimeZone = 'Asia/Kuala_Lumpur';
      const malaysiaTime = new Date(date.toLocaleString('en-US', { timeZone: malaysiaTimeZone }));
     
      let day = malaysiaTime.getDate();
      let month = malaysiaTime.getMonth() + 1;
      let year = malaysiaTime.getFullYear();

      if (day.toString().length === 1) {
        day = "0" + day;
      }
      if (month.toString().length === 1) {
        month = "0" + month;
      }
      if (year.toString().length === 1) {
        year = "0" + year;
      }

  let currentDate = `${day}-${month}-${year}`;
  return currentDate;;
};

export const getTodayMalaysiaDate = () => {
  const malaysiaTimeZone = 'Asia/Kuala_Lumpur';
  const malaysiaTime = new Date().toLocaleString('en-US', { timeZone: malaysiaTimeZone });
  return new Date(malaysiaTime);
};


export function calculateTimeRemaining() {
  const malaysiaTime = getTodayMalaysiaDate();
  const endOfDay = new Date(malaysiaTime);
  endOfDay.setHours(23, 59, 59, 999);

  const timeDifference = endOfDay - malaysiaTime;

  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}