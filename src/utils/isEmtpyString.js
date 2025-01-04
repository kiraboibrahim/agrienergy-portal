import isString from "./isString";

const isEmptyString = (value) => isString(value) && value.trim() === "";
export default isEmptyString;
