export function getErrorMessage(e) {
  if (typeof e === 'string') return e;
  return (e || {}).message || 'Unknown error occurred';
}

export const gen = name => {
  return {
    REQUEST: `${name}_REQUEST`,
    SUCCESS: `${name}_SUCCESS`,
    FAILURE: `${name}_FAILURE`,
  };
};