// components/About.js
import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h2>About This Project</h2>
      <p>
        This project demonstrates a robust React routing architecture with
        private routes, authentication, and user-friendly navigation. Below is a
        detailed explanation of the components and flow:
      </p>
      <h3>1. Authentication Service (AuthService)</h3>
      <p>
        The <code>AuthService</code> handles all authentication logic, including
        logging in and logging out. It uses a simple boolean flag to track
        authentication status, which can be easily replaced with more complex
        logic in the future.
      </p>
      <h3>2. Authentication Context (AuthContext)</h3>
      <p>
        The <code>AuthContext</code> provides a global authentication state and
        actions to the rest of the app. It uses React's{" "}
        <code>createContext</code> and <code>useContext</code> hooks to manage
        and distribute authentication status across components.
      </p>
      <h3>3. PrivateRoute Component</h3>
      <p>
        The <code>PrivateRoute</code> component protects routes by checking if
        the user is authenticated. If the user is not authenticated, it sets the
        intended route in the redirect path and redirects the user to the login
        page.
      </p>
      <h3>4. Login Page</h3>
      <p>
        The <code>LoginPage</code> component handles user login. Upon successful
        login, it redirects the user to the initially intended route or the
        dashboard. It uses the <code>useNavigate</code> hook from React Router
        for navigation.
      </p>
      <h3>5. Dashboard Page</h3>
      <p>
        The <code>DashboardPage</code> component is a protected route that is
        only accessible to authenticated users. It includes a logout button to
        handle user logout and uses the <code>useNavigate</code> hook to
        redirect the user to the login page upon logout. It also has logic to
        redirect the user to the dashboard when they click the back button after
        logging in.
      </p>
      <h3>6. Styling</h3>
      <p>
        Custom CSS styles have been added to enhance the UI of the LoginPage and
        DashboardPage components, creating a user-friendly and visually
        appealing interface.
      </p>
      <h3>7. Routes Setup</h3>
      <p>
        The application routes are defined using React Router. The{" "}
        <code>RouterProvider</code> and <code>createBrowserRouter</code> are
        used to manage the routing, with <code>PrivateRoute</code> protecting
        the dashboard route.
      </p>
    </div>
  );
};

export default About;
