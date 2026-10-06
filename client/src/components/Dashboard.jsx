import { useEffect, useState, useRef } from 'react';
import { loadKey } from '../encryption/keystore.js';
import { handleStartChat } from '../encryption/handshake.js';
import {decryptMessage, deriveAesKey, encryptMessage } from '../encryption/message.js';

const Dashboard = () => {
  const [myKeyPair, setMyKeyPair] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const wsRef = useRef(null);
  const activeChatRef = useRef(null);
  const username = localStorage.getItem("username");

useEffect(() => {
  if (!username) {
    console.warn("No username in localStorage — user not properly logged in?");
    return;
  }

  const ws = new WebSocket("ws://localhost:5000");
  activeChatRef.current = activeChat;
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "register", username }));
  };

  ws.onmessage = async (e) => {
    const data = JSON.parse(e.data);
    console.log("activeChatRef at this moment:", activeChatRef.current);
    if (data.type === "message") {
      const text = await decryptMessage(data.ciphertext, {
        iv: data.iv,
        aesKey: activeChatRef.current?.aesKey,
      });
      if (activeChatRef.current?.username === data.from) {
        setMessages((prev) => [...prev, { from: data.from, text }]);
      }
    }
  };

  wsRef.current = ws;

  loadKey(username).then((pair) => {
    if (!pair) {
      console.warn("No stored key found for", username);
    }
    setMyKeyPair(pair);
  });

  fetch("/api/users")
    .then((res) => res.json())
    .then((data) => {
      setUsers(data.users);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    });

  return () => ws.close(); 
}, [activeChat]);

const openChat = async (user) => {
  if (activeChat && activeChat.username === user) return
  
  setMessages([])

  try{
    const sharedSecret = await handleStartChat(user, myKeyPair);
    const aesKey = await deriveAesKey(sharedSecret)
    setActiveChat({ username: user, aesKey });

    const res = await fetch(`/api/messages?sender=${localStorage.getItem('username')}&reciever=${user}`)
    const data = await res.json()
    const decryptedMessages = await Promise.all(
      
      data.messages.map(async (message) => ({
      from: message.from_user,
      text: await decryptMessage(message.ciphertext,{iv: message.iv, aesKey: aesKey})
      }
      )
    ))
    setMessages(decryptedMessages)
  } catch (err) {
    console.error("Error starting chat:", err);
  }
}

const sendMessage = async () => {
  if (!draft.trim()) return;
  const encryptedMessage = await encryptMessage(draft, activeChat.aesKey)

  await fetch('/api/messages', {
    method: "POST",
    headers: {"Content-Type": "application/JSON"},
    body: JSON.stringify({
      from: localStorage.getItem('username'),
      to: activeChat.username,
      iv: encryptedMessage.iv,
      ciphertext: encryptedMessage.ciphertext,
    })
  })

  wsRef.current?.send(JSON.stringify({
    type: "message",
    from: localStorage.getItem('username'),
    to: activeChat.username,
    iv: encryptedMessage.iv,
    ciphertext: encryptedMessage.ciphertext,
  }));

  setMessages((prev) => [...prev, { from: localStorage.getItem('username'), text: draft }]);
  setDraft("");
}

return (
  <div className='flex h-screen'> 
  <aside className="w-64 border-r p-4 flex flex-col gap-2">
    <h2 className='font-semibold mb-2'>Users</h2>
    {users.length === 0 && <p className='text-gray-500 text-sm' >No other users available.</p>}
    {users
      .filter((user) => user !== localStorage.getItem("username"))
      .map((user) => (
        <button
          key={user}
          className={`text-left px-3 py-2 rounded-lg 
            ${activeChat === user ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          onClick={() => openChat(user)}
        >
          {user}
        </button>
      ))}
  </aside>
  <main className="flex-1 p-4 flex flex-col">
    {activeChat?.username ? (
      <>
      <div className="border-b px-4 py-3 font-medium">{activeChat.username}</div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((msg, index) => (
          <div key={index} className={`max-w-xs px-3 py-2 rounded-xl ${msg.from === localStorage.getItem("username") ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'}`}>
            {msg.text}
          </div>  
        ))}
      </div>
      <div className="flex gap-2 p-4 border-t">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
      </>
    ) : (
      <div className='flex-1 flex items-center justify-center text-gray-400'>
        Select a user to start a chat.
      </div>
    )}
  </main>
  </div>
)

}

export default Dashboard
