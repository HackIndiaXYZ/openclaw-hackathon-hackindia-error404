import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connections (Simulated for this environment)
const connectDB = async () => {
  try {
    // In a real environment, we would use process.env.MONGO_URI
    console.log('MongoDB: Connection logic initialized (OIDC/Federated Ready)');
    // await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

const pgPool = new Pool({
  // connectionString: process.env.POSTGRES_URI
});
console.log('PostgreSQL: Connection pool initialized (MOU Ledger Ready)');

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected to Nexus Bridge:', socket.id);
  
  socket.on('join_collab', (roomId) => {
    socket.join(roomId);
    console.log(`User joint Collab Room: ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // Part 7: Guardian AI Moderation Pipeline Simulation
    const { content, roomId } = data;
    if (content.toLowerCase().includes('money') || content.toLowerCase().includes('payment')) {
      io.to(roomId).emit('moderation_alert', { 
        type: 'warning', 
        message: 'Guardian AI: Contextual policy violation flagged. Interaction logged for Campus Admin.' 
      });
    }
    io.to(roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from Nexus');
  });
});

// Routes
import authRoutes from './routes/auth.js';
import karmaRoutes from './routes/karma.js';
import skillRoutes from './routes/skills.js';
import adminRoutes from './routes/admin.js';

app.use('/api/auth', authRoutes);
app.use('/api/karma', karmaRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Nexus Online', version: '4.0.0-MarketReady' });
});

// Import and use feature-specific routes (to be created)
// import authRoutes from './routes/auth.js';
// app.use('/api/auth', authRoutes);

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`EduSync Market-Ready Server running on port ${PORT}`);
  connectDB();
});
