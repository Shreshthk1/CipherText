import { useEffect, useState } from 'react'
import { saveKey } from './keystore'

const GenerateKeys = async (username, password) => {
    console.log(username, password);

    const keyPair = await window.crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveBits"]
    );
    console.log(keyPair.publicKey);
    console.log(keyPair.privateKey);

    await saveKey(username, keyPair);

    const jwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey); 
    const publicKey = { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y };

    const res = await fetch("/api/register", {                    
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, username, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("username", username);
    }

  return {ok: res.ok, status: res.status, data};
}
export default GenerateKeys