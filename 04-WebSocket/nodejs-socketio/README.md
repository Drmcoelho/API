# WebSocket API com Node.js e Socket.IO 🔌

## O que é WebSocket? / What is WebSocket?

**WebSocket** é um protocolo de comunicação que permite comunicação bidirecional em tempo real entre cliente e servidor através de uma única conexão TCP persistente.

### Diferenças entre WebSocket e HTTP

| Característica | HTTP | WebSocket |
|---------------|------|-----------|
| Conexão | Request-Response (fechada após resposta) | Persistente (sempre aberta) |
| Comunicação | Unidirecional (cliente → servidor) | Bidirecional (cliente ⇄ servidor) |
| Overhead | Alto (headers em cada request) | Baixo (após handshake) |
| Latência | Alta (cada request abre nova conexão) | Baixa (conexão sempre aberta) |
| Uso | APIs REST tradicionais | Chat, notificações em tempo real, jogos |

## Socket.IO vs WebSocket Puro

**Socket.IO** é uma biblioteca que usa WebSocket internamente, mas adiciona:

✅ **Fallback automático** - Se WebSocket não estiver disponível, usa long-polling
✅ **Reconnection** - Reconexão automática
✅ **Rooms** - Agrupamento de conexões
✅ **Broadcasting** - Envio para múltiplos clientes
✅ **Namespaces** - Múltiplos canais na mesma conexão

## Instalação / Installation

```bash
cd 04-WebSocket/nodejs-socketio

npm install
npm start
```

## Casos de Uso / Use Cases

### 1. Chat em Tempo Real
- Mensagens instantâneas
- Indicador de digitação
- Status online/offline

### 2. Notificações Push
- Alertas de sistema
- Atualizações de status
- Notificações de eventos

### 3. Dashboards ao Vivo
- Métricas em tempo real
- Gráficos atualizados automaticamente
- Monitoramento de sistemas

### 4. Colaboração em Tempo Real
- Edição colaborativa de documentos
- Quadros brancos compartilhados
- Sincronização de estado

### 5. Jogos Multiplayer
- Sincronização de estado do jogo
- Movimentos de jogadores
- Chat in-game

## Testando a API / Testing the API

### Cliente Web (Navegador)

Abra `http://localhost:3000` no navegador para testar o chat.

### Cliente Node.js

```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

// Conectar
socket.on('connect', () => {
  console.log('Conectado!');
  
  // Enviar mensagem
  socket.emit('chat message', 'Olá do cliente Node.js!');
});

// Receber mensagens
socket.on('chat message', (msg) => {
  console.log('Mensagem recebida:', msg);
});
```

### Cliente Python

```python
import socketio

sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print('Conectado!')
    sio.emit('chat message', 'Olá do cliente Python!')

@sio.on('chat message')
def on_message(data):
    print('Mensagem recebida:', data)

sio.connect('http://localhost:3000')
sio.wait()
```

## Eventos Disponíveis / Available Events

### Cliente → Servidor (Emit)

- `chat message` - Enviar mensagem no chat
- `typing` - Indicar que está digitando
- `join room` - Entrar em uma sala
- `leave room` - Sair de uma sala

### Servidor → Cliente (On)

- `connect` - Conexão estabelecida
- `disconnect` - Conexão perdida
- `chat message` - Nova mensagem no chat
- `user joined` - Novo usuário entrou
- `user left` - Usuário saiu
- `user typing` - Alguém está digitando

## Exemplo de Chat Completo

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat em Tempo Real</title>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <ul id="messages"></ul>
  <input id="input" autocomplete="off" />
  <button onclick="sendMessage()">Enviar</button>

  <script>
    const socket = io();
    
    // Receber mensagens
    socket.on('chat message', (msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      document.getElementById('messages').appendChild(li);
    });
    
    // Enviar mensagem
    function sendMessage() {
      const input = document.getElementById('input');
      socket.emit('chat message', input.value);
      input.value = '';
    }
  </script>
</body>
</html>
```

## Recursos Avançados / Advanced Features

### Rooms (Salas)

```javascript
// Servidor
io.on('connection', (socket) => {
  // Entrar em uma sala
  socket.join('room1');
  
  // Enviar mensagem para sala específica
  io.to('room1').emit('message', 'Olá sala 1!');
  
  // Sair de uma sala
  socket.leave('room1');
});
```

### Broadcasting

```javascript
// Enviar para todos exceto o remetente
socket.broadcast.emit('user connected');

// Enviar para todos incluindo o remetente
io.emit('announcement', 'Servidor vai reiniciar');
```

### Namespaces

```javascript
// Servidor
const chatNamespace = io.of('/chat');
const notificationsNamespace = io.of('/notifications');

// Cliente
const chatSocket = io('/chat');
const notifSocket = io('/notifications');
```

### Middleware

```javascript
io.use((socket, next) => {
  // Autenticação
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
```

## Performance e Escalabilidade / Performance and Scalability

### Redis Adapter (para múltiplos servidores)

```javascript
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Boas Práticas

1. **Limite de conexões** - Configure max connections
2. **Heartbeat** - Verifique conexões inativas
3. **Compressão** - Use compressão para mensagens grandes
4. **Rate limiting** - Limite mensagens por segundo
5. **Validação** - Valide todas as mensagens recebidas

## Debugging

```javascript
// Cliente
localStorage.debug = '*';

// Servidor
DEBUG=* node server.js
```

## Próximos Passos / Next Steps

1. ✅ Adicione autenticação JWT
2. ✅ Implemente persistência de mensagens
3. ✅ Configure Redis para múltiplos servidores
4. ✅ Adicione suporte a arquivos/imagens
5. ✅ Implemente criptografia end-to-end
6. ✅ Configure monitoramento e métricas
7. ✅ Adicione testes automatizados

## Recursos Adicionais / Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [WebSocket Protocol RFC](https://tools.ietf.org/html/rfc6455)
- [Socket.IO Admin UI](https://socket.io/docs/v4/admin-ui/)

---

**Comunicação em tempo real nunca foi tão fácil! / Real-time communication has never been so easy!**
