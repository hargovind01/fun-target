require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const PORT = 8000; // Updated port
const authRoute = require("./router/auth_router");
const adminRoute = require("./router/admin_router");
const transactionRoute = require("./router/transaction_router");
const newsRoute = require('./router/news_router');
const gameRoute = require("./router/game_router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error_middleware");

const app = express();
const server = http.createServer(app);
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176'];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  },
});

// Timer Configuration
const TIMER_DURATION = 60; // Timer duration in seconds
let timerStart = Date.now(); // Timer start time

// Timer Logic
const getCurrentTimerValue = () => {
  const elapsedTime = Math.floor((Date.now() - timerStart) / 1000);
  return TIMER_DURATION - (elapsedTime % TIMER_DURATION);
};

// Spin Wheel State
let globalRotation = 0; // Current rotation of the wheel
let isSpinning = false; // Whether the wheel is spinning
let manualResult = null; // Store manually selected result
let activeImageIndex = 0; // Current index of the center image
let isManualImageSelected = false; // Flag for manual image selection
const totalSegments = 10; // Total segments on the wheel
const segmentAngle = 360 / totalSegments; // Angle of each segment

// CORS Configuration

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // If you're using cookies or authentication headers
}));

app.use(express.json());

// Timer API Endpoint
app.get("/api/timer", (req, res) => {
  console.log("TIMER");
  const timeLeft = getCurrentTimerValue();
  res.json({ timeLeft });
});

// Route Handlers
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/game", gameRoute);
app.use("/api/news", newsRoute);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send the current spin state to the connected client
  socket.emit("stateUpdate", { rotation: globalRotation, isSpinning });

  // Handle spin events
  socket.on("spin", ({ rotation }) => {
    if (!isSpinning) {
      globalRotation = rotation;
      isSpinning = true;

      // Broadcast the updated state to all clients
      io.emit("stateUpdate", { rotation: globalRotation, isSpinning });

      // Reset spinning state after spin duration (9000ms)
      setTimeout(() => {
        isSpinning = false;
        io.emit("stateUpdate", { rotation: globalRotation, isSpinning });
      }, 9000); // Spin duration: 9 seconds
    }
  });

  // Handle manual result declaration
  socket.on("manualResult", (result) => {
    console.log("Manual result received:", result);
    manualResult = result - 1; // Save the manual result
  });

  socket.on("modeChange", (newMode) => {
    console.log("Mode updated to:", newMode);
    io.emit("modeChange", newMode); // Broadcast the mode change to all clients
  });


  // Handle manual image selection from admin
  socket.on("manualImageSelection", (index) => {
    console.log(`Admin selected image index: ${index}`);
    activeImageIndex = index; // Update the current active image index
    isManualImageSelected = true; // Set the flag to true
    io.emit("stateUpdate", { activeImageIndex, isManualImageSelected }); // Broadcast to clients
  });

  // Reset manual image selection flag when the wheel stops spinning
  socket.on("resetManualImageSelection", () => {
    isManualImageSelected = false; // Reset the flag
    io.emit("stateUpdate", { isManualImageSelected }); // Notify clients
  });

  socket.on("setActiveImage", (index) => {
    console.log(`Active image index set to: ${index}`);
    activeImageIndex = index;
    io.emit("stateUpdate", { activeImageIndex }); // Broadcast updated image index to all clients
  });
  

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Automatic Wheel Spin Logic
setInterval(() => {
  const timeLeft = getCurrentTimerValue();

  // Start spinning the wheel at 59 seconds
  if (timeLeft === 59 && !isSpinning) {
    console.log("Timer hit 59 seconds, starting the wheel spin...");
    isSpinning = true;

    // Update active image index during spinning
    const imageInterval = setInterval(() => {
      activeImageIndex = (activeImageIndex + 1) % 5; // Update for 5 images
      io.emit("stateUpdate", {
        rotation: globalRotation,
        isSpinning,
        activeImageIndex,
      });
    }, 1000); // Change image every second

    // Check if a manual result is set
    if (manualResult !== null) {
      const stopAngle = (totalSegments - manualResult - 1) * segmentAngle; // Calculate stop angle
      globalRotation = stopAngle + Math.floor(globalRotation / 360) * 360; // Adjust to the nearest full rotation
      console.log(`Manual result set, wheel will stop on ${manualResult}`);
      manualResult = null; // Reset manual result after use
    } else {
      globalRotation = Math.random() * 360; // Generate random rotation
      console.log("No manual result set, using random rotation");
    }

    // Broadcast the spin start to all clients
    io.emit("stateUpdate", {
      rotation: globalRotation,
      isSpinning,
      activeImageIndex,
      speed: "high", // Notify front-end to spin at high speed
    });

    // Stop spinning after 9 seconds
    setTimeout(() => {
      console.log("Stopping the wheel spin...");
      isSpinning = false;
      clearInterval(imageInterval); // Stop image rotation

      io.emit("stateUpdate", {
        rotation: globalRotation,
        isSpinning,
        activeImageIndex,
        speed: "stopped", // Notify front-end to stop spinning
      });
    }, 9000); // Spin duration: 9 seconds
    
  }
}, 500); // Check timer every 500ms for better accuracy

// Error Middleware
app.use(errorMiddleware);

// Connect to Database and Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});
