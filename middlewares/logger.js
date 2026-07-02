// Middleware de log — registra cada requisição no terminal
export default function logger(req, res, next) {
  const agora = new Date().toISOString();     // timestamp no formato ISO
  const metodo = req.method;                   // GET, POST, PUT, DELETE
  const url = req.originalUrl;                 // URL completa da requisição
  console.log(`[${agora}]${metodo}${url}`);  // exibe no terminal
  next();                                       // passa para o próximo middleware/rota
}