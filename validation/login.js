const Validator   = require('validator');
const isEmpty     = require('is-empty');

module.exports = function validateLoginInput(data) {

  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.username)) {
    message = 'username field is required';
  } else if (!Validator.isEmail(data.username)) {
    message = 'username is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    message = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
