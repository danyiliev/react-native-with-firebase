import { createMask } from 'string-mask-jedi';

export const dateMask = createMask('dd/dd/dddd', { d: /\d/ });
