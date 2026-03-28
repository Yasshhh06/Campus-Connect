const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For dev
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io accessible to routes
app.set('io', io);

// Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const matchRoutes = require('./routes/matchRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/matches', matchRoutes);

app.get('/', (req, res) => {
  res.send('Campus Connect API is running');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
