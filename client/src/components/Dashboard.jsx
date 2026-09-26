import React, { useEffect, useState } from 'react';
import { loadKey } from '../encryption/keystore.js';
import { handleStartChat } from '../encryption/handshake.js';

const Dashboard = () => {
  const [myKeyPair, setMyKeyPair] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.warn("No username in localStorage — user not properly logged in?");
      return;
    }

    loadKey(username).then((pair) => {
      if (!pair) {
        console.warn("No stored key found for", username);
      }
      console.log("loaded key pair:", pair);
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

  }, []);

  const openChat = async (user) => {
    if (activeChat && activeChat.username === user) return
    
    setMessages([])
  
    try{
      const sharedSecret = await handleStartChat(user, myKeyPair);
      setActiveChat({ username: user, sharedSecret });
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  }

  const sendMessage = () => {
    if (!draft.trim()) return;
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
  );
    
}

export default Dashboard
