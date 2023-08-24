module.exports = (io) => {
    const rooms = {};

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('join-room', (roomId) => {
            if (!roomId) {
                console.error('Room ID not provided.');
                return;
            }

            // Add the user to the room
            socket.join(roomId);

            // Initialize room if it doesn't exist
            if (!rooms[roomId]) {
                rooms[roomId] = {
                    players: [],
                    currentPlayerIndex: 0
                };
            }

            // Add player to the room's player list
            rooms[roomId].players.push(socket.id);

            // Start game if two players are in the room
            if (rooms[roomId].players.length === 2) {
                
                io.to(roomId).emit('start-game');
                io.to(rooms[roomId].players[rooms[roomId].currentPlayerIndex]).emit('turn');
            }
        });

        const getRoomIdForSocket = (socket) => {
            return Object.keys(socket.rooms).find(room => room !== socket.id);
        }

        const sendLogMessageToRoom = (roomId, message) => {
            io.to(roomId).emit('log-message', message);
        };

        socket.on('damage', (data) => {
            const roomId = data.roomId;
            const userName = data.userName;
            if (!rooms[roomId]) {
                console.error(`No room found with ID: ${roomId}`);
                return;
            }

            const opponentSocketId = rooms[roomId].players.find(id => id !== socket.id);
            io.to(opponentSocketId).emit('damage-received', data.damage);
            sendLogMessageToRoom(roomId, `${userName} damaged the opponent for ${data.damage} points.`);
            // Switch turn to the next player
            rooms[roomId].currentPlayerIndex = 1 - rooms[roomId].currentPlayerIndex;
            io.to(rooms[roomId].players[rooms[roomId].currentPlayerIndex]).emit('turn');
            
        });

        socket.on('heal', (data) => {
            const roomId = data.roomId;
            const userName = data.userName;
            if (!rooms[roomId]) {
              console.error(`No room found with ID: ${roomId}`);
              return;
            }
            
            const opponentSocketId = rooms[roomId].players.find(id => id !== socket.id);
          
            if (opponentSocketId) {
              io.to(opponentSocketId).emit('opponent-healed', data.health); // Notify the opponent
            }
          
            // Emit the healed event only once to the sender.
            io.to(socket.id).emit('healed', data.health);
            sendLogMessageToRoom(roomId, `${userName} healed for ${data.health} points.`);
            // Switch turn to the next player
            rooms[roomId].currentPlayerIndex = 1 - rooms[roomId].currentPlayerIndex;
            io.to(rooms[roomId].players[rooms[roomId].currentPlayerIndex]).emit('turn');
            
          });

          socket.on('random-damage', (data) => {
            const roomId = data.roomId;
            const userName = data.userName;
            if (!rooms[roomId]) {
                console.error(`No room found with ID: ${roomId}`);
                return;
            }
        
            const opponentSocketId = rooms[roomId].players.find(id => id !== socket.id);
            io.to(opponentSocketId).emit('damage-received', data.damage);
            sendLogMessageToRoom(roomId, `A Random Event!!! ${userName} inflicted random damage to the opponent for ${data.damage} points.`);
            // rooms[roomId].currentPlayerIndex = 1 - rooms[roomId].currentPlayerIndex;
            // io.to(rooms[roomId].players[rooms[roomId].currentPlayerIndex]).emit('turn');
        });
        
        socket.on('random-heal', (data) => {
            const roomId = data.roomId;
            const userName = data.userName;
            if (!rooms[roomId]) {
                console.error(`No room found with ID: ${roomId}`);
                return;
            }
        
            const opponentSocketId = rooms[roomId].players.find(id => id !== socket.id);
            io.to(opponentSocketId).emit('opponent-healed', data.health);
            sendLogMessageToRoom(roomId, `A Random event!!! ${userName} healed randomly for ${data.health} points.`);
            // rooms[roomId].currentPlayerIndex = 1 - rooms[roomId].currentPlayerIndex;
            // io.to(rooms[roomId].players[rooms[roomId].currentPlayerIndex]).emit('turn');
        });
        
          
          
        

        socket.on('surrender', (data) => {
            const roomId = data.roomId;
            if (!rooms[roomId]) {
                console.error(`No room found with ID: ${roomId}`);
                return;
            }

            const opponentSocketId = rooms[roomId].players.find(id => id !== socket.id);
            io.to(opponentSocketId).emit('opponent-surrendered');
            sendLogMessageToRoom(roomId, "Player surrendered.");
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');

            for (let roomId in rooms) {
                rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
                if (rooms[roomId].players.length === 0) {
                    delete rooms[roomId];
                }
            }
        });
    });
};



