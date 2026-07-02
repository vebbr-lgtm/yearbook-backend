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
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({
    select: selectSemSenha, // retorna todos os campos EXCETO senhaHash
  });
  res.json(alunos); // responde com o array de alunos em JSON
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res) {
  const { id } = req.params; // extrai o :id da URL
  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) }, // converte string → number
    select: selectSemSenha,    // omite senhaHash
  });

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' }); // null → 404
  }

  res.json(aluno); // retorna o aluno encontrado
}

// --- Stubs para o desafio do aluno ---

// 🎯 POST /alunos — cria um novo aluno
// Dica: use prisma.aluno.create({ data: { ... }, select: selectSemSenha })
// Dica: os dados do aluno vêm de req.body (nome, email, senhaHash, cidade, frase, planosFuturos)
// Dica: retorne status 201 com o aluno criado
export async function criarAluno(req, res) {
  try {
    // 1. Extraia os campos de req.body: nome, email, senhaHash, cidade, frase, planosFuturos
    const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

    // 2. Use prisma.aluno.create() com data e select: selectSemSenha
    // Nota: O await é obrigatório aqui porque a operação no banco é assíncrona
    const alunoCriado = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos
      },
      select: selectSemSenha // Garante que a senhaHash NUNCA seja retornada no JSON
    });

    // 3. Retorne res.status(201).json(alunoCriado)
    // O status 201 é o padrão HTTP correto para recursos criados com sucesso
    return res.status(201).json(alunoCriado);

  } catch (error) {
    // Boa prática: Tratamento básico de erro caso o banco falhe (ex: email duplicado)
    console.error("Erro ao criar aluno:", error);
    return res.status(500).json({ erro: "Erro interno ao criar o aluno." });
  }
}

// 🎯 PUT /alunos/:id — atualiza um aluno existente
// Dica: use prisma.aluno.update({ where: { id: Number(id) }, data: { ... }, select: selectSemSenha })
// Dica: o id vem de req.params, os dados atualizados de req.body
// Dica: se o aluno não existir, o Prisma lança um erro — use try/catch
export async function atualizarAluno(req, res) {
  // 1. Extraia o id de req.params
  const { id } = req.params;

  // 2. Extraia os dados de req.body
  const dadosAtualizados = req.body;

  // 3. Use try/catch:
  try {
    // - No try: prisma.aluno.update() e retorne o aluno atualizado
    // Lembre-se de converter o id para Number, pois req.params sempre vem como string!
    const alunoAtualizado = await prisma.aluno.update({
      where: { 
        id: Number(id) 
      },
      data: dadosAtualizados,
      select: selectSemSenha // Mantém a segurança para não expor a senhaHash
    });

    return res.status(200).json(alunoAtualizado);

  } catch (error) {
    // - No catch: retorne status 404 com { erro: 'Aluno não encontrado' }
    // Como o Prisma lança um erro quando o ID não existe no .update(), tratamos aqui:
    console.error("Erro ao atualizar (provável ID inexistente):", error.message);
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}

// 🎯 DELETE /alunos/:id — deleta um aluno
// Dica: use prisma.aluno.delete({ where: { id: Number(id) } })
// Dica: retorne status 204 (sem conteúdo) com res.status(204).end()
// Dica: se o aluno não existir, o Prisma lança um erro — use try/catch
export async function deletarAluno(req, res) {
  // 1. Extraia o id de req.params
  const { id } = req.params;

  // 2. Use try/catch:
  try {
    // - No try: prisma.aluno.delete() e retorne res.status(204).end()
    // Lembre-se sempre de converter o id para Number!
    await prisma.aluno.delete({
      where: {
        id: Number(id)
      }
    });

    // O status 204 significa "No Content" (Sem Conteúdo). 
    // Como o aluno foi apagado, não há dados para devolver, por isso usamos o .end() para fechar a resposta.
    return res.status(204).end();

  } catch (error) {
    // - No catch: retorne status 404 com { erro: 'Aluno não encontrado' }
    console.error("Erro ao deletar (provável ID inexistente):", error.message);
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}