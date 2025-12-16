// src/lib/authErrorMapper.ts
export function mapLoginError(code?: string) {
  switch (code) {
    case "MISSING_FIELDS":
      return "Please enter your email/phone and password.";
    case "USER_NOT_FOUND":
      return "No account found with this email or phone number.";
    case "INVALID_PASSWORD":
      return "The password you entered is incorrect.";
    case "SERVER_ERROR":
      return "Server error. Please try again later.";
    default:
      return "Login failed. Please try again.";
  }
}
