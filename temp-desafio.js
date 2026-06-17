import prisma from './prisma/client.js';

// Seus desafios vão aqui

await prisma.$disconnect();

const alunoInexistente = await prisma.aluno.findUnique({
  where: { id: 999 },
});
console.log('Aluno inexistente:', alunoInexistente);
// Resultado: null

const alunosSemSenha = await prisma.aluno.findMany({
  select: {
    id: true,
    nome: true,
    email: true,
    cidade: true,
    frase: true,
    planosFuturos: true,
    fotoUrl: true,
    role: true,
    criadoEm: true,
  },
});
console.log('Alunos sem senhaHash:', alunosSemSenha);

// Passo 1: criar mensagem
const novaMensagem = await prisma.mensagem.create({
  data: {
    texto: 'Salve, turma! Vamos com tudo nesse último ano!',
    autorId: 1,
  },
});
console.log('Mensagem criada:', novaMensagem);

// Passo 2: listar mensagens com autor
const mensagens = await prisma.mensagem.findMany({
  include: {
    autor: {
      select: {
        nome: true,
        fotoUrl: true,
      },
    },
  },
});
console.log('Mensagens com autor:', JSON.stringify(mensagens, null, 2));