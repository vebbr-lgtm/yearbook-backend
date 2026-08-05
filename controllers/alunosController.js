import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// select que omite senhaHash — reutilizado em todas as queries de alunos
const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
  // senhaHash NÃO está aqui — nunca retornado pela API
};

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res, next) {  // adicione next aos parâmetros
  try {
    const alunos = await prisma.aluno.findMany({
      select: selectSemSenha,
    });
    res.json(alunos);
  } catch (erro) {
    next(erro);  // passa o erro para o middleware global
  }
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res, next) {
  try {
    const { id } = req.params;
    const aluno = await prisma.aluno.findUnique({
      where: { id: Number(id) },
      select: selectSemSenha,
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (erro) {
    next(erro);
  }
}

// --- Stubs para o desafio do aluno ---

// 🎯 POST /alunos — cria um novo aluno
// Dica: use prisma.aluno.create({ data: { ... }, select: selectSemSenha })
// Dica: os dados do aluno vêm de req.body (nome, email, senhaHash, cidade, frase, planosFuturos)
// Dica: retorne status 201 com o aluno criado
export async function criarAluno(req, res, next) {
  try {
    const { nome, email, senhaHash } = req.body;

    if (!nome || !email || !senhaHash) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    const aluno = await prisma.aluno.create({
      data: { nome, email, senhaHash },
      select: selectSemSenha,
    });

    res.status(201).json(aluno);
  } catch (erro) {
    next(erro);
  }
}

// 🎯 PUT /alunos/:id — atualiza um aluno existente
// Dica: use prisma.aluno.update({ where: { id: Number(id) }, data: { ... }, select: selectSemSenha })
// Dica: o id vem de req.params, os dados atualizados de req.body
// Dica: se o aluno não existir, o Prisma lança um erro — use try/catch
export async function atualizarAluno(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;

    const aluno = await prisma.aluno.update({
      where: { id: Number(id) },
      data: { nome, email },
      select: selectSemSenha,
    });

    res.json(aluno);
  } catch (erro) {
    res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}

// 🎯 DELETE /alunos/:id — deleta um aluno
// Dica: use prisma.aluno.delete({ where: { id: Number(id) } })
// Dica: retorne status 204 (sem conteúdo) com res.status(204).end()
// Dica: se o aluno não existir, o Prisma lança um erro — use try/catch
export async function deletarAluno(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.aluno.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (erro) {
    res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}