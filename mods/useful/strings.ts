export function indent(data: string, delimiter: string): string {
  return data
    .split("\n")
    .map((line) => `${delimiter}${line}`)
    .join("\n");
}

export function bindVariables(value: string, variables: Record<string, unknown>): string {
  const replacer = (_match: string, parameter: string): string => {
    parameter = parameter.trim();
    const value = variables[parameter];
    return String.prototype.toString.call(value) ?? _match;
  };
  return value.replace(/{{(?<key>.*?)}}/gm, replacer);
}
