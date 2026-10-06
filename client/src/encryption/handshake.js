const deriveSharedSecret = async (myPrivateKey, otherUserJwk) => {
  const theirPublicKey = await window.crypto.subtle.importKey(
    "jwk",
    otherUserJwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
  const sharedSecretBits = await window.crypto.subtle.deriveBits(
    { name: "ECDH", public: theirPublicKey },
    myPrivateKey,
    256
  );
  return sharedSecretBits;
}

const handleStartChat = async (otherUsername, myKeyPair) => {
  const res = await fetch(`/api/user/${otherUsername}/publicKey`);
  const data = await res.json();
  const otherUserJwk = data.publicKey;
  const sharedSecret = await deriveSharedSecret(myKeyPair.privateKey, otherUserJwk);
  console.log(`shared secret with ${otherUsername}:`, new Uint8Array(sharedSecret));

  return sharedSecret;
}
export { deriveSharedSecret, handleStartChat };