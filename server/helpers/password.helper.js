export const generateRandomPassword = (passwordLenght) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%&*()+=_";
  let password = "";

  for (let i = 0; i < passwordLenght; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};
