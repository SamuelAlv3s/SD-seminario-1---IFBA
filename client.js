const io = require("socket.io-client");
const socket = io("http://localhost:3000");

// Gerar um timestamp
const timestamp = Date.now();

// Solicitar entrada na seção crítica
socket.emit("request", timestamp);

// Lidar com a resposta do servidor
socket.on("response", (canEnter, minTimestamp) => {
  if (canEnter) {
    console.log(`Cliente ${socket.id} acessou recurso`);
    // Simular um tempo usando o recurso
    setTimeout(() => {
      // Liberar o recurso
      socket.emit("release");
    }, Math.random() * 15000);
  } else {
    console.log(
      `Cliente ${socket.id} não pode acessar o recurso. O próximo timestamp é ${minTimestamp}`
    );
  }
});