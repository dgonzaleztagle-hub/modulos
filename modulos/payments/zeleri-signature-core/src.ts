import crypto from 'node:crypto';

type SignatureInput = Record<string, unknown> | string;

function sortSingleObject(input: Record<string, unknown>): Record<string, unknown> {
  const sortedKeys = Object.keys(input).sort();
  const sortedObject: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    const value = input[key];

    if (Array.isArray(value)) {
      const normalizedArray = [...value];
      sortedObject[key] = normalizedArray.sort((left, right) => {
        if (typeof left === 'string' && typeof right === 'string') {
          return left.localeCompare(right);
        }

        return 0;
      });

      const isArrayOfObjects = normalizedArray.every(
        item => typeof item === 'object' && item !== null,
      );
      if (isArrayOfObjects) {
        sortedObject[key] = normalizedArray.map(
          item => sortObjectKeys(item as Record<string, unknown>),
        );
      }
    } else if (typeof value === 'object' && value !== null) {
      sortedObject[key] = sortObjectKeys(value as Record<string, unknown>);
    } else {
      sortedObject[key] = value;
    }
  }

  return sortedObject;
}

export function sortObjectKeys(input: SignatureInput | unknown[]): unknown {
  if (typeof input === 'string') {
    try {
      return sortObjectKeys(JSON.parse(input) as SignatureInput);
    } catch {
      return input;
    }
  }

  if (Array.isArray(input)) {
    return input.map(item =>
      typeof item === 'object' && item !== null
        ? sortObjectKeys(item as Record<string, unknown>)
        : item,
    );
  }

  if (typeof input === 'object' && input !== null) {
    return sortSingleObject(input as Record<string, unknown>);
  }

  return input;
}

export function concatenateObjectProperties(object: Record<string, unknown>) {
  let message = '';

  Object.keys(object)
    .sort()
    .forEach(property => {
      if (property === 'signature') return;
      message += property + JSON.stringify(object[property]);
    });

  return message;
}

export function parseSignatureInput(input: SignatureInput) {
  if (typeof input === 'object') {
    return input;
  }

  const params = new URLSearchParams(input);
  const object: Record<string, unknown> = {};

  for (const [key, value] of params.entries()) {
    object[key] = value;
  }

  return object;
}

export class ZeleriSignature {
  constructor(private readonly secret: string) {}

  generate(input: SignatureInput) {
    const object = parseSignatureInput(input);
    const sortedObject = sortObjectKeys(object) as Record<string, unknown>;
    const message = concatenateObjectProperties(sortedObject);
    return crypto.createHmac('sha256', this.secret).update(message).digest('hex');
  }

  validate(data: SignatureInput, signature: string) {
    return this.generate(data) === signature;
  }
}
