// services/AuthServiceWebAuthn.js
class AuthServiceWebAuthn {
  async register() {
    try {
      const publicKey = {
        challenge: new Uint8Array([
          /* random challenge data */
        ]),
        rp: { name: "My App" },
        user: {
          id: new Uint8Array(16),
          name: "user@example.com",
          displayName: "User",
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7, // ES256 algorithm
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct",
      };

      const credential = await navigator.credentials.create({ publicKey });

      // Send the credential to the server for registration
      // (Assume we have an API endpoint for registering WebAuthn credentials)
      await fetch("/api/register-webauthn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  }

  async authenticate() {
    try {
      const publicKey = {
        challenge: new Uint8Array([
          /* random challenge data */
        ]),
        allowCredentials: [
          {
            id: new Uint8Array(16),
            type: "public-key",
            transports: ["internal"],
          },
        ],
        userVerification: "required",
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({ publicKey });

      // Send the assertion to the server for verification
      // (Assume we have an API endpoint for verifying WebAuthn assertions)
      const response = await fetch("/api/verify-webauthn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assertion }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  }
}

export default new AuthServiceWebAuthn();
