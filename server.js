import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('data/cities.json');
const middlewares = jsonServer.defaults();

// Add delay to all responses
server.use((req, res, next) => {
  setTimeout(() => next(), 500); // 500ms delay
});

server.use(middlewares);
server.use(router);

server.listen(9000, () => {
  console.log('JSON Server is running on port 9000');
});

