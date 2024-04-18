export function indent(data: string, delimiter: string): string {
  return data
    .split("\n")
    .map((line) => `${delimiter}${line}`)
    .join("\n");
}

export function bindVariables(value: string, variables: Record<string, unknown>): string {
  const replacer = (match: string, parameter: string): string => {
    parameter = parameter.trim();
    const value = variables[parameter];
    const converted = `${value ?? match}`;
    return converted;
  };
  return value.replace(/{{(?<key>.*?)}}/gm, replacer);
}
