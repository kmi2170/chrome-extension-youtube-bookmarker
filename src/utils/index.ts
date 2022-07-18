export const getTime = (t: number) => {
  var date = new Date(0);
  date.setSeconds(t);

  console.log(date.toISOString());
  return date.toISOString().substr(11, 8);
};

export const css = (element: HTMLElement, style: Record<string, any>) => {
  for (const property in style)
    element.style[property as any] = style[property];
};
