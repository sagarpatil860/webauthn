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
      console.log("signup data", response);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default new AuthService();
