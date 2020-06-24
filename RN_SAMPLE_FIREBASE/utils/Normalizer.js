const lower = value => value && value.toLowerCase();

const price = value => {
  if (value) {
    const parts = value.split('$');
    return `$${parts[1]}`;
  }
  return '';
}

export const Normalizers = {
  lower,
}