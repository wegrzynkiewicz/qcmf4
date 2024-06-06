function failTuple(message: string) {
  return [false, message];
}

Deno.bench('tuple', () => {
  failTuple('message');
});

function failObject(message: string) {
  return { valid: false, message };
}

Deno.bench('object', () => {
  failObject('message');
});
