export const MTN_UG_REGEX = /256(?:76|77|78|31|39)[0-9]{7}$/;
export const AIRTEL_UG_REGEX = /256(?:70|74|75|20)[0-9]{7}$/;
export const LYCA_UG_REGEX = /25672[0-9]{7}$/;
export const UG_PHONE_NUMBER_REGEX = new RegExp(
  `(${MTN_UG_REGEX.source})|(${AIRTEL_UG_REGEX.source})|(${LYCA_UG_REGEX.source})`
);
export const DOMAIN_REGEX =
  /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/;
export const EMAIL_REGEX = /^[\w\-\\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
// NETSERVE Uganda LIMITED
// KANJOKYA HOUSE
// 1. Application letter
// 2. Resume
// 3. Transcript

export const ANIMALS = [
  "Goats",
  "Sheep",
  "Cows",
  "Hens",
  "Donkeys",
  "Horses",
  "Rabbits",
];
export const CROPS = [
  "Rice",
  "Millet",
  "Beans",
  "Cassava",
  "Irish Potatoes",
  "Sweet Potatoes",
  "Yams",
];
