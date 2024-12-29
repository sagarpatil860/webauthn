// services/AuthService.js
class AuthService {
  constructor() {
    this.isAuthenticated = false;
  }

  login(username, password) {
    // Implement your authentication logic here
    // This is just a simple example
    if (username === "user" && password === "pas") {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }
  async loginWithWebAuthn(username) {
    try {
      const signUpResult = await fetch(
        `/api/auth/login-init?email=${username}`
      );
      const response = await signUpResult.json();
      return response;
    } catch (e) {
      return false;
    }
  }
  logout() {
    this.isAuthenticated = false;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  async signup(username, password) {
    try {
      const signUpResult = await fetch("/api/auth/signup", {
        method: "post",
        body: JSON.stringify({ username, password }),
      });
      const response = await signUpResult.json();
      return response;
    } catch (e) {
      return false;
    }
  }

  async signupVerify(verifyOptions) {
    try {
      const signupVerifyResult = await fetch("/api/auth/signup-verify", {
        method: "post",
        body: JSON.stringify(verifyOptions),
      });
      const response = await signupVerifyResult.json();
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default new AuthService();
