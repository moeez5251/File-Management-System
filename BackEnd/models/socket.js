import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
const io = new Server({
  cors: {
    origin: process.env.ORIGINS?.replace(/[\[\]']/g, "").split(",").map(o => o.trim()),
    credentials: true,
  },
});

export default io;