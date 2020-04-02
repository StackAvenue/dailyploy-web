export const PASSWORDREGX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-.\/\\:;<=>?@\[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-.\/\\:;<=>?@\[\]^_`{|}~]{8,}$/;
export const EMAILREGX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/;
const phoneNo = /^\d{10}$/;
export const checkPassword = sPassword => {
  if (sPassword) {
    if (!sPassword.match(PASSWORDREGX)) {
      // return "Password has to be at least 8 chars long including one small, one capital and one special character";
      return "Min 8 characters at least 1 number and 1 special character";
    }
    return null;
  }
  return "cannot be empty";
};

export const validateName = name => {
  if (name) {
    if (name.toString().length < 3) {
      return "Must be Min 3 Characters";
    }
    return null;
  }
  return "cannot be empty";
};

export const validateEmail = sEmail => {
  if (sEmail) {
    if (!sEmail.match(EMAILREGX)) {
      return "Must be Valid";
    }
    return null;
  }
  return "cannot be empty";
};

export const validatePhone = phoneno => {
  if (phoneno) {
    if (!phoneno.match(phoneNo)) {
      return "Must be Valid";
    }
    return null;
  }
  return "cannot be empty";
};
