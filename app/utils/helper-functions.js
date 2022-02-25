export const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const intercalate = (str) => str.split(" ").join("+");

export const deintercalate = (str) => str.split("+").join(" ");

export const classNames = (...classes) => classes.filter(Boolean).join(" ");
