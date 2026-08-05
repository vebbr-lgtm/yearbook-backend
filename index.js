import 'dotenv/config';
import express from 'express';                // importa o Express
import logger from './middlewares/logger.js';
import tratarErro from './middlewares/erro.js';
import alunosRouter from './routes/alunos.js'; // importa o router de alunos <- NOVO
import mensagensRouter from './routes/mensagens.js';

const app = express();      // cria a aplicação Express
const PORT = process.env.PORT || 3000;          // porta do servidor

app.use(express.json());    // 1º — parseia JSON do body
app.use(logger);            // 2º — registra log de cada requisição

// rota raiz — boas-vindas
app.get('/', (req, res) => {
  res.json({ mensagem: 'Yearbook API está no ar! 🎓' });
});

// rota de health check
app.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// registra as rotas de alunos com prefixo /alunos  <- NOVO
app.use('/alunos', alunosRouter);
app.use('/mensagens', mensagensRouter); // registra rotas de mensagens

// Middleware de erro — SEMPRE por último, depois das rotas
app.use(tratarErro);

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// inicia o servidor localmente — na Vercel essa parte é pulada
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// exporta o app para a Vercel usar como serverless function
export default app;