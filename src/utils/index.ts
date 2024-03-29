export const getTime = (t: number) => {
  const date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};

export const css = (element: HTMLElement, style: CSSStyleDeclaration) => {
  for (const property in style) element.style[property] = style[property];
};

export const removeCharsFromString = (
  string: string,
  charsToBeRemoved: string
) => {
  const num_chars = charsToBeRemoved.length;
  const isCharsInString =
    string.slice(string.length - num_chars, string.length) === charsToBeRemoved;

  if (isCharsInString) {
    const newString = string.slice(0, string.length - num_chars - 1);

    return newString;
  }

  return string;
};
