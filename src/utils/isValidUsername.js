import { EMAIL_REGEX, UG_PHONE_NUMBER_REGEX } from "../constants";

export default function isValidUsername(username) {
  return EMAIL_REGEX.test(username) || UG_PHONE_NUMBER_REGEX.test(username);
}
