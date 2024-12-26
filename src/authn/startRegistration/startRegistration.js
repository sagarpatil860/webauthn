export async function startRegistration(registrationOptions) {
  console.log("registrationOptions in authn startreg", registrationOptions);
  const clientRegistartion = await navigator.credentials.create({
    publicKey: {
      ...registrationOptions,
      challenge: new Uint8Array(Object.values(registrationOptions.challenge)),
      user: {
        ...registrationOptions.user,
        id: new Uint8Array(Object.values(registrationOptions.user.id)),
      },
    },
  });
  return clientRegistartion;
}
