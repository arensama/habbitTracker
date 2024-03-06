export const useHelper = () => {
  const addCommasToNumber = (number: string | number) => {
    number = String(number);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return { addCommasToNumber };
};
