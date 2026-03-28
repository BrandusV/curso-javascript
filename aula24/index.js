// ============================================================
// AULA 24 — JAVASCRIPT ASSÍNCRONO
// ============================================================
// JavaScript roda em uma ÚNICA thread — executa uma instrução
// por vez na Call Stack. Se uma operação demorada bloqueasse
// essa thread, a página inteira travaria.
//
// A solução é o modelo ASSÍNCRONO: iniciamos a operação,
// registramos o que fazer quando terminar, e liberamos a thread
// para continuar executando outro código enquanto aguarda.
//
// Evolução histórica das abordagens:
//
//   Callbacks (ES1/1997)
//     → Simples, mas aninhar vários cria "callback hell"
//
//   Promises (ES6/2015)
//     → Objeto que representa um valor futuro
//     → .then().catch() encadeados, mais legível
//     → Métodos estáticos: .all(), .race(), .any(), .allSettled()
//
//   async / await (ES8/2017)
//     → Açúcar sintático sobre Promises
//     → Código assíncrono com aparência síncrona
//     → try/catch para tratar erros, igual código síncrono
//
//   fetch() (ES6/2015 — nativo nos browsers modernos)
//     → API padrão para requisições HTTP
//     → Retorna Promise, usa async/await naturalmente
// ============================================================


// ============================================================
// UTILITÁRIOS GLOBAIS
// ============================================================

const listaLog = document.getElementById('lista-log');

function registrarLog(msg) {
    const li = document.createElement('li');
    li.textContent = msg;
    listaLog.prepend(li);
}

// Cria e retorna uma Promise que resolve após `ms` milissegundos.
// Simula qualquer operação assíncrona com duração conhecida
// (ex: leitura de banco, requisição de rede, processamento).
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mesma espera, mas rejeita — simula falhas de rede ou servidor.
function esperarComErro(ms, mensagem) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error(mensagem)), ms)
    );
}

// Atalho para atualizar uma saída com texto e classe visual
function exibir(id, texto, classe = '') {
    const el = document.getElementById(id);
    el.textContent = texto;
    el.className = 'saida-codigo ' + classe;
}


// ============================================================
// SEÇÃO 1 — Callbacks
// ============================================================
// Um callback é simplesmente uma função passada como argumento
// para ser chamada (de volta) quando uma operação terminar.
//
// É o mecanismo mais antigo e ainda amplamente usado em:
//   - addEventListener('click', callback)
//   - setTimeout(callback, ms)
//   - Array.forEach, .map, .filter (callbacks síncronos)
//
// O problema aparece quando precisamos encadear operações
// assíncronas dependentes — cada nível adiciona um recuo
// e a estrutura cresce em pirâmide: "callback hell".
//
// Exemplo de callback hell (evite):
//
//   buscarUsuario(id, (usuario) => {
//       buscarPedidos(usuario, (pedidos) => {
//           buscarEndereco(pedidos[0], (endereco) => {
//               calcularFrete(endereco, (frete) => {
//                   // quatro níveis de indentação — difícil de manter!
//               });
//           });
//       });
//   });
// ============================================================

// Simula uma função assíncrona no estilo "Node.js callback":
// primeiro argumento = erro (null se ok), segundo = resultado.
// Esse padrão é chamado "error-first callback" (convenção Node).
function buscarDadosCallback(id, callback) {
    setTimeout(() => {
        if (id <= 0) {
            callback(new Error('ID inválido'), null); // sinaliza erro
        } else {
            callback(null, { id, nome: `Produto #${id}`, preco: id * 29.90 });
        }
    }, 1000);
}

document.getElementById('btn-callback-simples').addEventListener('click', () => {
    exibir('saida-callback', '⏳ Buscando (1 nível de callback)...', 'pending');
    registrarLog('Callback simples → iniciado');

    // Passamos uma função anônima como callback — ela será chamada após 1s
    buscarDadosCallback(5, (erro, produto) => {
        if (erro) {
            exibir('saida-callback', `Erro: ${erro.message}`, 'erro');
            return;
        }
        exibir('saida-callback',
            `Callback executado após 1s:\n\n` +
            `produto.id:    ${produto.id}\n` +
            `produto.nome:  "${produto.nome}"\n` +
            `produto.preco: R$ ${produto.preco.toFixed(2)}`,
            'sucesso');
        registrarLog(`Callback → produto recebido: "${produto.nome}"`);
    });
});

document.getElementById('btn-callback-hell').addEventListener('click', () => {
    exibir('saida-callback', '⏳ Executando 3 callbacks aninhados...', 'pending');
    registrarLog('Callback hell → 3 níveis iniciados');

    // NÍVEL 1: busca o produto
    buscarDadosCallback(3, (erro, produto) => {
        if (erro) return exibir('saida-callback', erro.message, 'erro');
        let log = `[nível 1] produto: "${produto.nome}"\n`;

        // NÍVEL 2: simula buscar estoque do produto
        buscarDadosCallback(produto.id * 2, (erro2, estoque) => {
            if (erro2) return exibir('saida-callback', erro2.message, 'erro');
            log += `[nível 2] estoque id: ${estoque.id}\n`;

            // NÍVEL 3: simula calcular frete com base no estoque
            buscarDadosCallback(estoque.id + 1, (erro3, frete) => {
                if (erro3) return exibir('saida-callback', erro3.message, 'erro');
                log += `[nível 3] frete calc: R$ ${frete.preco.toFixed(2)}\n\n`;
                log += `Perceba a pirâmide de indentação no código.\nIsso é o "Callback Hell" — Promises e async/await resolvem isso.`;
                exibir('saida-callback', log, 'aviso');
                registrarLog('Callback hell → 3 níveis concluídos');
            });
        });
    });
});


// ============================================================
// SEÇÃO 2 — async / await básico
// ============================================================
// Uma função marcada com "async" sempre retorna uma Promise.
// Dentro dela, "await" pausa a FUNÇÃO (não a página inteira)
// até a Promise à direita resolver.
//
//   async function minhaFuncao() {
//       console.log('antes');          // executa imediatamente
//       const r = await esperar(1000); // pausa aqui por 1s
//       console.log('depois');         // executa após 1s
//   }
//
// O código fora da função async continua rodando normalmente
// enquanto ela aguarda — isso é a essência do não-bloqueio.
//
// Equivalência com .then():
//   const r = await promessa
//   ≡
//   promessa.then(r => { ... })
// ============================================================

document.getElementById('btn-async-basico').addEventListener('click', async () => {
    // A função do listener é marcada com "async"
    // — podemos usar await diretamente aqui dentro

    const delay = Number(document.getElementById('input-await-delay').value) || 1500;
    exibir('saida-async-basico', `⏳ await esperar(${delay}ms)...\n\nO restante da página não está bloqueado.`, 'pending');
    registrarLog(`async/await → aguardando ${delay}ms`);

    // "await" pausa este handler até a Promise resolver
    // A página continua responsiva — tente clicar em outros botões
    await esperar(delay);

    // Esta linha só executa depois que o await terminar
    exibir('saida-async-basico',
        `✔ await concluído após ${delay}ms\n\n` +
        `A função async parou aqui e esperou,\n` +
        `mas o navegador NÃO travou durante a espera.`,
        'sucesso');
    registrarLog(`async/await → continuou após ${delay}ms`);
});


// ============================================================
// SEÇÃO 3 — try / catch / finally com async/await
// ============================================================
// Quando um await recebe uma Promise rejeitada, ela "lança"
// um erro — exatamente como um throw em código síncrono.
// Por isso usamos try/catch para capturá-lo.
//
//   async function buscar() {
//       try {
//           const dados = await operacaoQuePoderFalhar();
//           exibirDados(dados);           // só chega aqui se ok
//       } catch (erro) {
//           tratarErro(erro.message);     // captura qualquer falha
//       } finally {
//           esconderLoading();            // sempre executa
//       }
//   }
//
// Vantagem sobre .then()/.catch():
//   - Fluxo normal e fluxo de erro ficam no mesmo bloco
//   - Mais fácil de ler e debugar com breakpoints
//   - Suporta múltiplos await dentro do mesmo try
// ============================================================

document.getElementById('btn-try-sucesso').addEventListener('click', async () => {
    exibir('saida-try-catch', '⏳ Executando... (try/catch/finally)', 'pending');
    registrarLog('try/catch → tentando operação (sucesso)');

    try {
        // await dentro do try — se a Promise rejeitar, vai direto para o catch
        const resultado = await esperar(1200).then(() => 'Dados recebidos com sucesso!');
        exibir('saida-try-catch',
            `try → operação concluída\nresultado: "${resultado}"`, 'sucesso');
        registrarLog(`try → "${resultado}"`);
    } catch (erro) {
        // Não será executado neste caso (operação bem-sucedida)
        exibir('saida-try-catch', `catch → ${erro.message}`, 'erro');
    } finally {
        // SEMPRE executa — sucesso ou erro
        // Ideal para: esconder loading, fechar conexões, liberar recursos
        registrarLog('finally → sempre executa (limpeza)');
        console.log('finally executado');
    }
});

document.getElementById('btn-try-erro').addEventListener('click', async () => {
    exibir('saida-try-catch', '⏳ Executando... (vai falhar)', 'pending');
    registrarLog('try/catch → tentando operação (vai falhar)');

    try {
        // Esta Promise rejeita — o await transforma em throw
        await esperarComErro(1200, 'Conexão recusada pelo servidor (503)');

        // Esta linha NUNCA executa se o await acima falhar
        exibir('saida-try-catch', 'nunca chegará aqui', 'sucesso');
    } catch (erro) {
        // O erro do await chega aqui como um objeto Error normal
        exibir('saida-try-catch',
            `catch capturou o erro:\n"${erro.message}"\n\n` +
            `Sem try/catch, o erro apareceria como\n"Unhandled Promise Rejection" no console.`,
            'erro');
        registrarLog(`catch → "${erro.message}"`);
    } finally {
        registrarLog('finally → executou mesmo com erro');
    }
});


// ============================================================
// SEÇÃO 4 — fetch() com async/await
// ============================================================
// fetch(url) retorna uma Promise que resolve com um Response.
// Precisamos de DOIS awaits:
//
//   const response = await fetch(url);   // aguarda os headers chegarem
//   const dados    = await response.json(); // aguarda o body ser lido
//
// Armadilha importante: fetch() SÓ rejeita em falhas de rede.
// Respostas HTTP de erro (404, 500) chegam como "fulfilled"!
// Por isso SEMPRE verificamos response.ok antes de prosseguir.
//
//   if (!response.ok) {
//       throw new Error(`HTTP ${response.status}`);
//   }
//
// A URL abaixo é da API pública JSONPlaceholder — usada para
// praticar requisições sem precisar de backend próprio.
// ============================================================

document.getElementById('btn-fetch-post').addEventListener('click', async () => {
    const id = document.getElementById('input-post-id').value || 1;
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;

    exibir('saida-fetch', `⏳ fetch("${url}")...`, 'pending');
    registrarLog(`fetch → GET ${url}`);

    try {
        // 1º await: aguarda os headers da resposta chegarem
        const response = await fetch(url);

        // fetch() não rejeita em erros HTTP — verificamos manualmente
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        // 2º await: aguarda o corpo da resposta ser lido e parseado como JSON
        const post = await response.json();

        exibir('saida-fetch',
            `✔ Resposta: ${response.status} OK\n\n` +
            `post.id:     ${post.id}\n` +
            `post.userId: ${post.userId}\n` +
            `post.title:  "${post.title}"\n` +
            `post.body:   "${post.body.substring(0, 80)}..."`,
            'sucesso');
        registrarLog(`fetch → post #${post.id} recebido`);

    } catch (erro) {
        // Captura erros de rede E o throw que fizemos acima
        exibir('saida-fetch', `✖ Erro:\n"${erro.message}"`, 'erro');
        registrarLog(`fetch → erro: "${erro.message}"`);
    }
});

document.getElementById('btn-fetch-404').addEventListener('click', async () => {
    // ID 9999 não existe na API — retornará 404
    const url = 'https://jsonplaceholder.typicode.com/posts/9999';
    exibir('saida-fetch', `⏳ Forçando 404...\nfetch("${url}")`, 'pending');
    registrarLog('fetch → tentando rota inexistente (404)');

    try {
        const response = await fetch(url);

        // Sem esta verificação, o código continuaria sem erro!
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} — recurso não encontrado`);
        }

        const dados = await response.json();
        exibir('saida-fetch', JSON.stringify(dados), 'sucesso');

    } catch (erro) {
        exibir('saida-fetch',
            `✖ Erro capturado no catch:\n"${erro.message}"\n\n` +
            `Dica: fetch() não rejeita em 404.\n` +
            `Precisamos verificar response.ok manualmente.`,
            'erro');
        registrarLog(`fetch 404 → erro capturado: "${erro.message}"`);
    }
});


// ============================================================
// SEÇÃO 5 — Sequencial vs Paralelo
// ============================================================
// SEQUENCIAL com await:
//   const a = await tarefa1(); // espera terminar
//   const b = await tarefa2(); // só começa depois
//   // tempo total = tempo(a) + tempo(b)
//
//   Use quando: b precisa do resultado de a.
//   Ex: buscar usuário e depois buscar pedidos DESSE usuário.
//
// PARALELO com Promise.all + await:
//   const [a, b] = await Promise.all([tarefa1(), tarefa2()]);
//   // as duas começam ao mesmo tempo
//   // tempo total = max(tempo(a), tempo(b))
//
//   Use quando: a e b são independentes entre si.
//   Ex: buscar usuário e estoque simultaneamente.
//
// Regra de ouro:
//   Se B não depende do resultado de A → use Promise.all.
//   Se B precisa do resultado de A → use await sequencial.
// ============================================================

async function tarefaSimulada(nome, duracaoMs) {
    await esperar(duracaoMs);
    return `${nome} (${duracaoMs}ms)`;
}

document.getElementById('btn-sequencial').addEventListener('click', async () => {
    exibir('saida-seq', '⏳ Executando sequencialmente...', 'pending');
    document.getElementById('barra-seq').style.width = '0%';
    registrarLog('Sequencial → iniciado');

    const inicio = Date.now();

    // Anima a barra enquanto processa
    const animSeq = setInterval(() => {
        const el = document.getElementById('barra-seq');
        const atual = parseFloat(el.style.width) || 0;
        if (atual < 92) el.style.width = (atual + 2) + '%';
    }, 100);

    // Os três await rodam UM POR VEZ — cada um espera o anterior terminar
    const r1 = await tarefaSimulada('Tarefa 1', 800);
    const r2 = await tarefaSimulada('Tarefa 2', 600);
    const r3 = await tarefaSimulada('Tarefa 3', 700);

    clearInterval(animSeq);
    document.getElementById('barra-seq').style.width = '100%';

    const total = Date.now() - inicio;
    exibir('saida-seq',
        `Resultados (em ordem de execução):\n${r1}\n${r2}\n${r3}\n\nTempo total: ~${total}ms\n(≈ 800 + 600 + 700 = 2100ms)`,
        'erro'); // vermelho para indicar "mais lento"
    registrarLog(`Sequencial → concluído em ${total}ms`);
});

document.getElementById('btn-paralelo').addEventListener('click', async () => {
    exibir('saida-par', '⏳ Executando em paralelo...', 'pending');
    document.getElementById('barra-par').style.width = '0%';
    registrarLog('Paralelo → iniciado');

    const inicio = Date.now();

    const animPar = setInterval(() => {
        const el = document.getElementById('barra-par');
        const atual = parseFloat(el.style.width) || 0;
        if (atual < 92) el.style.width = (atual + 3) + '%';
    }, 50);

    // As três tarefas começam AO MESMO TEMPO
    // Promise.all retorna quando a mais lenta terminar
    const [r1, r2, r3] = await Promise.all([
        tarefaSimulada('Tarefa 1', 800),
        tarefaSimulada('Tarefa 2', 600),
        tarefaSimulada('Tarefa 3', 700),
    ]);

    clearInterval(animPar);
    document.getElementById('barra-par').style.width = '100%';

    const total = Date.now() - inicio;
    exibir('saida-par',
        `Resultados (todas paralelas):\n${r1}\n${r2}\n${r3}\n\nTempo total: ~${total}ms\n(≈ max(800, 600, 700) = 800ms)`,
        'sucesso'); // verde para indicar "mais rápido"
    registrarLog(`Paralelo → concluído em ${total}ms`);
});


// ============================================================
// SEÇÃO 6 — Event Loop (animação didática)
// ============================================================
// A Event Loop é o coração do JS assíncrono.
// Ela monitora constantemente:
//
//   Call Stack      → funções sendo executadas agora
//   Web APIs        → temporizadores, fetch, eventos rodando em
//                     paralelo FORA da thread JS
//   Microtask Queue → callbacks de Promises (.then, await)
//                     prioridade ALTA — roda antes das macrotasks
//   Callback Queue  → callbacks de setTimeout, setInterval
//                     prioridade NORMAL — roda depois das microtasks
//
// Ordem de execução de um ciclo:
//   1. Executa tudo na Call Stack (código síncrono)
//   2. Drena toda a Microtask Queue (Promises)
//   3. Pega UMA tarefa da Callback Queue (setTimeout etc.)
//   4. Repete
//
// Por isso: setTimeout(fn, 0) sempre roda DEPOIS de Promises,
// mesmo que o delay seja zero.
// ============================================================

let animacaoAtiva = false;

function adicionarItem(listaId, texto, classe) {
    const ul = document.getElementById(listaId);
    const li = document.createElement('li');
    li.textContent = texto;
    li.className = classe;
    ul.appendChild(li);
}

function limparLista(id) {
    document.getElementById(id).innerHTML = '';
}

document.getElementById('btn-loop-reset').addEventListener('click', () => {
    animacaoAtiva = false;
    limparLista('el-stack');
    limparLista('el-webapi');
    limparLista('el-queue');
    exibir('saida-eventloop', '—');
    registrarLog('Event Loop → resetado');
});

document.getElementById('btn-loop-demo').addEventListener('click', async () => {
    if (animacaoAtiva) return;
    animacaoAtiva = true;

    limparLista('el-stack');
    limparLista('el-webapi');
    limparLista('el-queue');

    // Simula o trecho de código:
    //   console.log('início');               // síncrono → Call Stack
    //   setTimeout(callback, 1000);          // vai para Web API
    //   Promise.resolve().then(microtask);   // vai para Microtask Queue
    //   console.log('fim do script');        // síncrono → Call Stack

    const passos = [
        async () => {
            exibir('saida-eventloop', 'Passo 1 — console.log("início") entra na Call Stack e executa', 'pending');
            adicionarItem('el-stack', 'console.log("início")', 'item-call-stack');
            registrarLog('Event Loop → Call Stack: console.log("início")');
            await esperar(900);
            limparLista('el-stack');
        },
        async () => {
            exibir('saida-eventloop', 'Passo 2 — setTimeout() entra na Call Stack e é imediatamente enviado para a Web API', 'pending');
            adicionarItem('el-stack', 'setTimeout(cb, 1000)', 'item-call-stack');
            await esperar(700);
            limparLista('el-stack');
            adicionarItem('el-webapi', '⏱ timer: 1000ms', 'item-web-api');
            registrarLog('Event Loop → setTimeout enviado para Web API');
            await esperar(900);
        },
        async () => {
            exibir('saida-eventloop', 'Passo 3 — Promise.resolve().then() entra na Microtask Queue (alta prioridade)', 'pending');
            adicionarItem('el-stack', 'Promise.resolve().then()', 'item-call-stack');
            await esperar(700);
            limparLista('el-stack');
            adicionarItem('el-queue', '⚡ microtask: then()', 'item-queue');
            registrarLog('Event Loop → microtask na fila (alta prioridade)');
            await esperar(900);
        },
        async () => {
            exibir('saida-eventloop', 'Passo 4 — console.log("fim") é o último código síncrono — executa antes de qualquer callback', 'pending');
            adicionarItem('el-stack', 'console.log("fim")', 'item-call-stack');
            registrarLog('Event Loop → Call Stack: console.log("fim")');
            await esperar(900);
            limparLista('el-stack');
        },
        async () => {
            exibir('saida-eventloop', 'Passo 5 — Call Stack vazia! Event Loop drena a Microtask Queue primeiro (Promises têm prioridade)', 'pending');
            const li = document.getElementById('el-queue').querySelector('li');
            if (li) li.style.background = '#ffab40'; // destaca
            await esperar(700);
            adicionarItem('el-stack', '⚡ then() ← microtask', 'item-call-stack');
            limparLista('el-queue');
            registrarLog('Event Loop → microtask executada (antes do setTimeout)');
            await esperar(900);
            limparLista('el-stack');
        },
        async () => {
            exibir('saida-eventloop', 'Passo 6 — Timer de 1000ms expirou na Web API → callback movido para a Callback Queue', 'pending');
            limparLista('el-webapi');
            adicionarItem('el-queue', '📬 setTimeout callback', 'item-queue');
            registrarLog('Event Loop → setTimeout expirou, callback na fila');
            await esperar(900);
        },
        async () => {
            exibir('saida-eventloop', 'Passo 7 — Event Loop pega o callback da fila e coloca na Call Stack para executar', 'pending');
            adicionarItem('el-stack', '📬 setTimeout callback', 'item-call-stack');
            limparLista('el-queue');
            registrarLog('Event Loop → setTimeout callback executado por último');
            await esperar(900);
            limparLista('el-stack');
            exibir('saida-eventloop',
                `✔ Animação concluída!\n\nOrdem de execução observada:\n` +
                `  1. console.log("início")     ← síncrono\n` +
                `  2. console.log("fim")        ← síncrono\n` +
                `  3. then() da Promise         ← microtask (alta prioridade)\n` +
                `  4. callback do setTimeout    ← macrotask (depois das microtasks)\n\n` +
                `setTimeout(fn, 0) SEMPRE roda depois de Promises pendentes!`,
                'sucesso');
            registrarLog('Event Loop → animação concluída');
            animacaoAtiva = false;
        },
    ];

    for (const passo of passos) {
        if (!animacaoAtiva) break;
        await passo();
        await esperar(300);
    }
});


// ============================================================
// SEÇÃO 7 — Guia de uso por cenário
// ============================================================

const guias = {
    evento: {
        recomendacao: 'Callback via addEventListener',
        porque:
            `Eventos DOM sempre usam callbacks — é a API do navegador.\n` +
            `Não há assincronismo aqui: o callback roda imediatamente ao evento.\n\n` +
            `Exemplo:\n` +
            `  btn.addEventListener('click', () => {\n` +
            `      // executa quando o botão for clicado\n` +
            `  });`,
    },
    timer: {
        recomendacao: 'setTimeout / setInterval (callback) ou async/await com esperar()',
        porque:
            `Para esperar N ms e continuar, use await com uma Promise:\n\n` +
            `  async function exemploTimer() {\n` +
            `      console.log('antes');\n` +
            `      await new Promise(r => setTimeout(r, 2000));\n` +
            `      console.log('depois de 2s'); // ← mais legível que callback\n` +
            `  }`,
    },
    'fetch-simples': {
        recomendacao: 'async/await + fetch() + try/catch',
        porque:
            `Padrão moderno para qualquer requisição HTTP:\n\n` +
            `  async function buscarPost(id) {\n` +
            `      try {\n` +
            `          const res  = await fetch(\`/api/posts/\${id}\`);\n` +
            `          if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n` +
            `          const data = await res.json();\n` +
            `          return data;\n` +
            `      } catch (e) {\n` +
            `          console.error(e.message);\n` +
            `      }\n` +
            `  }`,
    },
    'fetch-depende': {
        recomendacao: 'async/await sequencial (await um por um)',
        porque:
            `Quando B depende do resultado de A, use await em sequência:\n\n` +
            `  async function buscarPostEAutor(postId) {\n` +
            `      const post   = await buscarPost(postId);    // aguarda\n` +
            `      const autor  = await buscarUsuario(post.userId); // usa post.userId\n` +
            `      return { post, autor };\n` +
            `  }\n\n` +
            `Não é possível paralelizar aqui — o ID do autor só existe após buscar o post.`,
    },
    'fetch-paralelo': {
        recomendacao: 'Promise.all + await (paralelo)',
        porque:
            `Quando as operações são independentes, dispare todas juntas:\n\n` +
            `  async function buscarTudo(userId) {\n` +
            `      const [usuario, pedidos, endereco] = await Promise.all([\n` +
            `          buscarUsuario(userId),\n` +
            `          buscarPedidos(userId),\n` +
            `          buscarEndereco(userId),\n` +
            `      ]);\n` +
            `      // tempo total ≈ o da operação mais lenta\n` +
            `  }`,
    },
    'fetch-qualquer': {
        recomendacao: 'Promise.any + await',
        porque:
            `Quando há múltiplas fontes/servidores, use a primeira que responder:\n\n` +
            `  async function buscarRapido(url) {\n` +
            `      try {\n` +
            `          const resultado = await Promise.any([\n` +
            `              fetch(servidorA + url),\n` +
            `              fetch(servidorB + url),\n` +
            `              fetch(servidorC + url),\n` +
            `          ]);\n` +
            `          return await resultado.json();\n` +
            `      } catch { /* todas falharam (AggregateError) */ }\n` +
            `  }`,
    },
    erro: {
        recomendacao: 'try/catch/finally dentro de função async',
        porque:
            `O padrão mais legível para tratar erros assíncronos:\n\n` +
            `  async function operacao() {\n` +
            `      try {\n` +
            `          const dados = await buscarDados(); // pode lançar erro\n` +
            `          processar(dados);\n` +
            `      } catch (erro) {\n` +
            `          // captura erros de rede, HTTP e exceções do código\n` +
            `          mostrarMensagem(erro.message);\n` +
            `      } finally {\n` +
            `          esconderLoading(); // sempre executa\n` +
            `      }\n` +
            `  }`,
    },
    legado: {
        recomendacao: 'Promisify — envolver o callback em uma Promise',
        porque:
            `Ao integrar com bibliotecas antigas que usam callbacks,\n` +
            `envolva em uma Promise para poder usar async/await:\n\n` +
            `  function lerArquivo(caminho) {\n` +
            `      // retorna uma Promise que envolve o callback antigo\n` +
            `      return new Promise((resolve, reject) => {\n` +
            `          fs.readFile(caminho, 'utf8', (erro, dados) => {\n` +
            `              if (erro) reject(erro);\n` +
            `              else      resolve(dados);\n` +
            `          });\n` +
            `      });\n` +
            `  }\n\n` +
            `  // Agora pode usar com await normalmente:\n` +
            `  const conteudo = await lerArquivo('dados.txt');`,
    },
};

document.getElementById('select-cenario').addEventListener('change', (e) => {
    const chave = e.target.value;
    if (!chave) {
        exibir('saida-guia', '—');
        return;
    }

    const guia = guias[chave];
    exibir('saida-guia',
        `Recomendação: ${guia.recomendacao}\n\n${guia.porque}`,
        'sucesso');
    registrarLog(`Guia → cenário: "${chave}"`);
});


// ============================================================
// LIMPAR LOG
// ============================================================
document.getElementById('btn-limpar-log').addEventListener('click', () => {
    listaLog.innerHTML = '';
});


// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    registrarLog('Página pronta — explore o JS assíncrono!');
    console.log('Aula 24 — JavaScript Assíncrono carregado.');
});
