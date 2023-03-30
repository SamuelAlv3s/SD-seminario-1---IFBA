const io = require("socket.io")();

const clients = {};

io.on("connection", (socket) => {
  console.log(`Cliente ${socket.id} conectado`);

  // Quando um cliente solicita acesso ao recurso
  socket.on("request", (timestamp) => {
    console.log(
      `Cliente ${socket.id} solicitou acesso a recurso com o timestamp ${timestamp}`
    );

    // Adicionar o cliente à lista de espera
    clients[socket.id] = timestamp;

    // Verificar se o cliente pode acessar o recurso
    let canEnter = true;
    for (let id in clients) {
      if (id !== socket.id && clients[id] <= timestamp) {
        canEnter = false;
        break;
      }
    }

    // Enviar mensagem de resposta para o cliente
    if (canEnter) {
      console.log(`Cliente ${socket.id} acessou recurso`);
      socket.emit("response", true);
    } else {
      // Encontrar o menor timestamp dos clientes na lista de espera
      const minTimestamp = Math.min(
        ...Object.values(clients).filter((t) => t !== timestamp)
      );
      socket.emit("response", false, minTimestamp);
    }
  });

  // Quando um cliente libera o recurso
  socket.on("release", () => {
    console.log(`Cliente ${socket.id} liberou recurso`);
    console.log('---------------------------------------------------')

    // Remover o cliente da lista de espera
    delete clients[socket.id];

    // Informar o próximo cliente que pode acessar recurso
    const nextId = Object.keys(clients)[0];
    if (nextId) {
      console.log(`Cliente ${nextId} acessou recurso`);
      io.to(nextId).emit("response", true);
    }
  });
});

io.listen(3000);
console.log('Servidor rodando em http://localhost:3000')