// components/LoginPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";
import { startRegistration } from "../authn/startRegistration/startRegistration";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, redirectPath, loginWithWebAuthn, signup, signupVerify } =
    useAuth();
  const navigate = useNavigate();
  const handleLogin = () => {
    if (login(username, password)) {
      if (redirectPath && redirectPath !== "/login") {
        const pathToNavigate = redirectPath !== "/login" ? redirectPath : "/";
        // window.history.replaceState(null, null, pathToNavigate);
        navigate(pathToNavigate, { replace: true });
      } else {
        navigate("/dashboard", { replace: true }); // Replace the current history entry with /dashboard
      }
    } else {
      alert("Invalid credentials");
    }
  };
  const webAuthnInit = async (user_email) => {
    const challengeResponse = await loginWithWebAuthn(user_email);
    console.log("challengeResponse in login page", challengeResponse);
    const clientPasskey = await navigator.credentials.get({
      publicKey: {
        ...challengeResponse,
        challenge: new Uint8Array(Object.values(challengeResponse.challenge)),
        user: {
          ...challengeResponse.user,
          id: new Uint8Array(Object.values(challengeResponse.user.id)),
        },
      },
    });
    console.log("clientPasskey", clientPasskey);
  };
  const handleWebAuthnLogin = async () => {
    if (await webAuthnInit(username)) {
      if (redirectPath && redirectPath !== "/login") {
        const pathToNavigate = redirectPath !== "/login" ? redirectPath : "/";
        // window.history.replaceState(null, null, pathToNavigate);
        navigate(pathToNavigate, { replace: true });
      } else {
        navigate("/dashboard", { replace: true }); // Replace the current history entry with /dashboard
      }
    } else {
      alert("WebAuthn authentication failed");
    }
  };

  const handleSignUp = async () => {
    const response = await signup(username, password);
    console.log("challenge from server", {
      ...response.registrationOptions,
      challenge: new Uint8Array(
        Object.values(response.registrationOptions.challenge)
      ),
      user: {
        ...response.registrationOptions.user,
        id: new Uint8Array(Object.values(response.registrationOptions.user.id)),
      },
    });
    if (response?.registrationOptions) {
      const clientRegistration = await startRegistration(
        response?.registrationOptions
      );
      console.log("client registration", {
        email: username,
        clientRegistration,
      });
      const verificationResponse = await signupVerify({
        email: username,
        clientRegistration,
      });
      alert(verificationResponse);
    }
  };
  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="login-input"
        autocomplete="username webauthn"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="login-input"
      />
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      <button
        className="login-button webauthn-button"
        onClick={handleWebAuthnLogin}
      >
        Login with Windows Hello
      </button>
      <button className="login-button webauthn-button" onClick={handleSignUp}>
        sign up
      </button>
    </div>
  );
};

export default LoginPage;
