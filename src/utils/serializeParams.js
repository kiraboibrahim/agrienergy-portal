function removeEmpty(obj) {
  function isString(value) {
    return typeof value === "string";
  }
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => (isString(v) && v !== "") || v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}

export default function serializeParams(params) {
  const paramString = new URLSearchParams(removeEmpty(params)).toString();
  return paramString !== "" ? `${paramString}` : paramString;
}
