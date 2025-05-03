import { Logger } from '../src/core/Logger.ts';
import { HttpServer, config } from '../src/index.ts';

const app = new HttpServer(config.getDefault(), new Logger());

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world');
});

app.get('/users', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ users: [] }));
});

app.post('/users', (req, res) => {
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ users: [] }));
});
