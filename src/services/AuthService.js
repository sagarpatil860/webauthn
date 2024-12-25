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
}

export default new AuthService();
