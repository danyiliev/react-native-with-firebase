import moment from 'moment';

import { checkUsername } from './Firebase';

export function validateEmail(email) {
  // eslint-disable-next-line
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(email.toLowerCase());
}

export function validateUrl(url) {
  const regEx = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  return regEx.test(url.toLowerCase());
}

export function validateText(text) {
  return text && text.trim().length > 0;
}

const required = value => (value ? undefined : 'Required');
const minLength8 = value => value && value.length < 8 ? 'MinLength8' : undefined;
const containsSymbol = value => value && !value.match(/[@#$%&^*]/) ? 'SymbolRequired' : undefined;
const containsNumber = value => value && !value.match(/[0-9]/) ? 'NumberRequired' : undefined;
const containsCapitalLetter = value => value && !value.match(/[A-Z]/) ? 'CapitalLetterRequired' : undefined;
const correctPassword = value => value && !containsNumber(value) && !containsCapitalLetter(value) ? undefined : 'Must be longer than 6 letters, contain a capital letter, and a number'
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;
const email = value =>
  value && !validateEmail(value) ? 'Please enter a valid email address' : undefined;
const positiveInteger = value =>
  value && !isNaN(Number(value)) && Number(value) <= 0
    ? 'Must be a positive number'
    : undefined;
const date = value =>
  value && !moment(value).isValid() ? 'Please enter a valid date' : undefined;
const usernameMatch = value => value && !value.match(/^[a-z0-9._-]{6,}$/i) ? 'You can only use letters, numbers, and periods' : undefined;
const lengthCheck = (len, str) => value =>
  (value && value.length < len) ? str || `Must be longer than ${len} characters` : undefined;

const url = value =>
  value && !validateUrl(value) ? 'Invalid url' : undefined;

const asyncUsernameCheck = async (values, rest) => {
    try {
      const isValid = await checkUsername(values.username);
      if (isValid) {
        return true;
      } else {
        throw {username: 'This username is already taken.'}
      }
    }catch {
      throw {username: 'This username is already taken.'}
    }
  }

export const Validators = {
  required,
  minLength8,
  containsSymbol,
  containsNumber,
  containsCapitalLetter,
  correctPassword,
  maxLength,
  number,
  minValue,
  email,
  positiveInteger,
  date,
  lengthCheck,
  usernameMatch,
  asyncUsernameCheck,
  url,
};
