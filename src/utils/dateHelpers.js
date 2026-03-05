export const isHairOilDay = (currentDate) => {
  const startDate = new Date('2026-03-07');
  const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  return daysDiff >= 0 && daysDiff % 3 === 0;
};

export const isMonday = (date) => {
  return date.getDay() === 1;
};
