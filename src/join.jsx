import React, { useState, useEffect } from 'react';

let socket;

export default function RoomCreator() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    socket = new WebSocket('ws://localhost:3000'); // Replace with your server URL

    socket.onopen = () => {
      console.log('Connected to server');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Server says:', data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  const generateRoomCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
  };

  const handleCreate = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'CREATE_ROOM',
        roomType: 'SmallRoom',
        roomCode,
        playerName
      }));
    }
  };

  const handleJoin = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'JOIN_ROOM',
        roomCode,
        playerName
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Room Creator</h1>

        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full mb-3 px-4 py-2 rounded-xl bg-gray-700 text-white"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room code"
            className="flex-1 px-4 py-2 rounded-xl bg-gray-700 text-white"
          />
          <button
            onClick={generateRoomCode}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            🎲
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleCreate}
            className="w-1/2 mr-2 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
          >
            Create Room
          </button>
          <button
            onClick={handleJoin}
            className="w-1/2 ml-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
