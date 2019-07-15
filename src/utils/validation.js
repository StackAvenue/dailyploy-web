export const checkPassword = sPassword => {
  if (sPassword) {
    let regPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (!sPassword.match(regPassword)) {
      return "Password has to be at least 8 chars long including one small, one capital and one special character";
    }
    return null;
  }
  return "Password cannot be empty";
};

export const validateName = name => {
  if (name) {
    if (name.toString().length < 3) {
      return "Name cannot be shorter than 3 characters";
    }
    return null;
  }
  return "Name cannot be empty";
};

export const validateEmail = sEmail => {
  if (sEmail) {
    let reEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!sEmail.match(reEmail)) {
      return "Enter valid Email Address";
    }
    return null;
  }
  return "Email address cannot be empty";
};
