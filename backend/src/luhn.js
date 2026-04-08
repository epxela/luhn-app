export function normalizeNumber(value) {
  return String(value ?? '').replace(/[\s-]/g, '');
}

export function isValidLuhn(value) {
  const number = normalizeNumber(value);

  if (!/^\d+$/.test(number)) return false;
  if (number.length < 2) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number(number[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
