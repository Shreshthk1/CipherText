const deriveAesKey = async (sharedSecret) => {
    const hkfdKey = await window.crypto.subtle.importKey(
        "raw",
        sharedSecret,
        { name: "HKDF" },
        false,
        ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
        {
            name: "HKDF",
            hash: "SHA-256",
            salt: new Uint8Array(16), 
            info: new TextEncoder().encode("message-key"), 
        },
        hkfdKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    )
    return aesKey;
}

const encryptMessage = async (message, aesKey) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        new TextEncoder().encode(message)
    );

    return { 
        iv: btoa(String.fromCharCode(...iv)), 
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
}

const decryptMessage = async (ciphertext, {iv , aesKey}) => {
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const ciphertextBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const plaintextBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes },
        aesKey,
        ciphertextBytes
    );

    return new TextDecoder().decode(plaintextBuffer);
}


export { deriveAesKey, encryptMessage, decryptMessage }