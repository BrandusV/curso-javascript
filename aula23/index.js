// ============================================================
// AULA 23 — PROMISES NO JAVASCRIPT
// ============================================================
// JavaScript é single-thread: executa uma coisa por vez.
// Operações demoradas (fetch, leitura de arquivo, timers)
// bloqueariam tudo se fossem síncronas.
//
// A solução é código ASSÍNCRONO: iniciamos a operação e
// registramos uma função para ser chamada quando terminar.
//
// Promise é o objeto que representa o resultado FUTURO de
// uma operação assíncrona. Ela tem três estados:
//
//   pending   → ainda em andamento (estado inicial)
//   fulfilled → concluída com sucesso (via resolve)
//   rejected  → concluída com falha  (via reject)
//
// Uma Promise só muda de estado UMA VEZ e não volta atrás.
// Isso é chamado de "imutabilidade de estado".
//
// Anatomia básica:
//
//   const promessa = new Promise((resolve, reject) => {
//       // código assíncrono aqui
//       if (sucesso) resolve(valor);   // → fulfilled
//       else         reject(motivo);   // → rejected
//   });
//
//   promessa
//       .then(valor   => { /* sucesso */ })
//       .catch(motivo => { /* erro    */ })
//       .finally(()   => { /* sempre  */ });
// ============================================================


// ============================================================
// UTILITÁRIO — Helpers usados em todas as seções
// ============================================================

const listaLog = document.getElementById('lista-log');

function registrarLog(mensagem) {
    const item = document.createElement('li');
    item.textContent = mensagem;
    listaLog.prepend(item);
}

// Aguarda N milissegundos e resolve — simula uma operação assíncrona
// como um fetch() ou leitura de banco de dados.
function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mesma espera, mas rejeita com uma mensagem de erro
function esperarComErro(ms, motivo) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(motivo)), ms));
}

// Atualiza o conteúdo e a classe de um elemento de saída
function exibirSaida(id, texto, classe = '') {
    const el = document.getElementById(id);
    el.textContent = texto;
    el.className = 'saida-codigo ' + classe;
}


// ============================================================
// SEÇÃO 1 — Criando uma Promise com new Promise()
// ============================================================
// O construtor recebe uma função "executor" com dois parâmetros:
//
//   resolve(valor)  → chame para sinalizar sucesso
//   reject(motivo)  → chame para sinalizar falha
//
// O executor roda IMEDIATAMENTE (síncrono), mas resolve/reject
// podem ser chamados de forma assíncrona (ex: dentro de setTimeout).
// ============================================================

const btnCriarResolve = document.getElementById('btn-criar-resolve');
const btnCriarReject  = document.getElementById('btn-criar-reject');

function criarPromise(deveResolver) {
    const delay = Number(document.getElementById('input-delay-criar').value) || 1500;

    exibirSaida('saida-criar', `⏳ pending — aguardando ${delay}ms...`, 'pending');
    registrarLog(`Promise criada — estado: pending (${delay}ms)`);

    // new Promise cria o objeto imediatamente no estado pending
    const promessa = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (deveResolver) {
                // resolve() muda o estado para "fulfilled"
                // O valor passado estará disponível no .then()
                resolve('Operação concluída com sucesso!');
            } else {
                // reject() muda o estado para "rejected"
                // O motivo estará disponível no .catch()
                reject(new Error('Algo deu errado na operação.'));
            }
        }, delay);
    });

    // .then() é chamado quando a Promise resolve
    promessa
        .then((valor) => {
            exibirSaida('saida-criar', `✔ fulfilled\n\nvalor recebido no .then():\n"${valor}"`, 'sucesso');
            registrarLog(`Promise → fulfilled: "${valor}"`);
        })
        .catch((erro) => {
            // .catch() é atalho para .then(undefined, onRejected)
            exibirSaida('saida-criar', `✖ rejected\n\nerro recebido no .catch():\n"${erro.message}"`, 'erro');
            registrarLog(`Promise → rejected: "${erro.message}"`);
        });
}

btnCriarResolve.addEventListener('click', () => criarPromise(true));
btnCriarReject.addEventListener('click',  () => criarPromise(false));


// ============================================================
// SEÇÃO 2 — .then(), .catch() e .finally()
// ============================================================
// Esses três métodos existem em toda instância de Promise:
//
//   .then(fn)    → registra handler para o estado fulfilled
//                  retorna uma NOVA Promise (permite encadear)
//
//   .catch(fn)   → registra handler para o estado rejected
//                  equivale a .then(null, fn)
//
//   .finally(fn) → registra handler que roda em QUALQUER estado
//                  NÃO recebe valor — apenas para limpeza/finalização
//                  ex: esconder loading spinner, fechar conexão
// ============================================================

const barraThen = document.getElementById('barra-then');

function simularOperacao(comSucesso) {
    const delay = 2000;

    exibirSaida('saida-then', '⏳ Processando...', 'pending');
    barraThen.style.width = '0%';

    // Anima a barra durante o pending
    let progresso = 0;
    const intervalo = setInterval(() => {
        progresso = Math.min(progresso + 5, 90);
        barraThen.style.width = progresso + '%';
    }, delay / 20);

    const operacao = comSucesso
        ? esperar(delay).then(() => 'Dados do servidor recebidos!')
        : esperarComErro(delay, 'Servidor não respondeu (timeout)');

    operacao
        .then((resultado) => {
            // Executado SOMENTE se a Promise resolver
            exibirSaida('saida-then',
                `.then() executado:\n"${resultado}"`, 'sucesso');
            registrarLog(`.then() → "${resultado}"`);
        })
        .catch((erro) => {
            // Executado SOMENTE se a Promise rejeitar
            exibirSaida('saida-then',
                `.catch() executado:\n"${erro.message}"`, 'erro');
            registrarLog(`.catch() → "${erro.message}"`);
        })
        .finally(() => {
            // Executado SEMPRE — sucesso ou erro
            // Perfeito para esconder loading, liberar recursos, etc.
            clearInterval(intervalo);
            barraThen.style.width = '100%';
            registrarLog('.finally() → executado (sempre roda)');
            console.log('.finally() — operação encerrada');
        });
}

document.getElementById('btn-simular-sucesso').addEventListener('click', () => simularOperacao(true));
document.getElementById('btn-simular-erro').addEventListener('click',    () => simularOperacao(false));


// ============================================================
// SEÇÃO 3 — Encadeamento de .then()
// ============================================================
// Cada .then() retorna uma nova Promise cujo valor é o retorno
// da função passada a ele. Isso permite criar "pipelines":
//
//   promessa
//       .then(v => v * 2)       // 5 → 10
//       .then(v => v + 100)     // 10 → 110
//       .then(v => `R$ ${v}`)   // 110 → "R$ 110"
//       .catch(erro => ...)     // captura erro de QUALQUER etapa
//
// Se um .then() lançar um erro (throw) ou retornar uma Promise
// rejeitada, o .catch() mais próximo à frente na cadeia captura.
// ============================================================

document.getElementById('btn-encadear').addEventListener('click', () => {
    const numero = Number(document.getElementById('input-numero').value) || 5;
    let log = '';

    exibirSaida('saida-encadeamento', '⏳ Executando pipeline...', 'pending');

    // Etapa 0: cria a Promise inicial já resolvida com o número
    Promise.resolve(numero)

        // Etapa 1: dobra o número (síncrona — retorno direto)
        .then((valor) => {
            log += `Etapa 1 → dobrar: ${valor} × 2 = ${valor * 2}\n`;
            return valor * 2;
        })

        // Etapa 2: soma 100 — simula uma operação que demora 800ms
        .then((valor) => {
            log += `Etapa 2 → somar 100: ${valor} + 100 = ${valor + 100}\n`;
            return esperar(800).then(() => valor + 100);
            // Retornar uma Promise dentro do .then() faz o encadeamento
            // aguardar essa Promise antes de executar o próximo .then()
        })

        // Etapa 3: formata o resultado como moeda
        .then((valor) => {
            const formatado = valor.toLocaleString('pt-BR', {
                style: 'currency', currency: 'BRL'
            });
            log += `Etapa 3 → formatar: ${formatado}\n\nResultado final: ${formatado}`;
            exibirSaida('saida-encadeamento', log, 'sucesso');
            registrarLog(`Pipeline concluído → valor final: ${formatado}`);
        })

        // .catch() no final captura erros de QUALQUER etapa acima
        .catch((erro) => {
            exibirSaida('saida-encadeamento', `Erro no pipeline:\n${erro.message}`, 'erro');
            registrarLog(`Pipeline falhou: ${erro.message}`);
        });
});


// ============================================================
// SEÇÃO 4 — Promise.resolve() e Promise.reject()
// ============================================================
// Métodos estáticos do construtor Promise.
// Criam Promises já no estado final — sem executor assíncrono.
//
//   Promise.resolve(42)
//   → equivale a new Promise(resolve => resolve(42))
//   → útil para normalizar: se você não sabe se um valor é
//     síncrono ou assíncrono, envolva em Promise.resolve()
//
//   Promise.reject(new Error('msg'))
//   → cria uma Promise já rejeitada
//   → útil em testes e para propagar erros em cadeias
// ============================================================

document.getElementById('btn-resolve-estatico').addEventListener('click', () => {
    const valor = document.getElementById('input-valor-estatico').value;

    // Cria uma Promise já fulfilled — .then() é chamado imediatamente
    // (na próxima microtask, não de forma 100% síncrona)
    Promise.resolve(valor)
        .then((v) => {
            exibirSaida('saida-estaticos',
                `Promise.resolve("${v}")\n\n.then() recebeu: "${v}"\ntypeof: ${typeof v}`, 'sucesso');
            registrarLog(`Promise.resolve("${v}") → .then() executado`);
        });
});

document.getElementById('btn-reject-estatico').addEventListener('click', () => {
    const valor = document.getElementById('input-valor-estatico').value;

    // Cria uma Promise já rejected — .catch() é chamado imediatamente
    Promise.reject(new Error(`Rejeitado: "${valor}"`))
        .catch((erro) => {
            exibirSaida('saida-estaticos',
                `Promise.reject(new Error(...))\n\n.catch() recebeu:\n"${erro.message}"`, 'erro');
            registrarLog(`Promise.reject → .catch() executado: "${erro.message}"`);
        });
});


// ============================================================
// SEÇÃO 5 — Promise.all()
// ============================================================
// Promise.all(iterável)
//
// Recebe um array de Promises e retorna uma nova Promise que:
//   RESOLVE quando TODAS as Promises do array resolvem
//     → valor: array com os resultados na mesma ordem
//   REJEITA se QUALQUER uma rejeitar (fail-fast)
//     → valor: o motivo da primeira rejeição
//
// As Promises rodam em PARALELO — Promise.all não espera uma
// terminar para começar a próxima. O tempo total é o da mais lenta.
//
// Use quando: todas as operações são obrigatórias e independentes.
// Ex: buscar dados de usuário, pedidos e endereço em paralelo.
// ============================================================

function atualizarCardAll(id, texto, cor) {
    const el = document.getElementById(`status-all-${id}`);
    el.textContent = texto;
    el.style.color = cor;
}

function resetarCardsAll() {
    [1, 2, 3].forEach(i => atualizarCardAll(i, 'pending...', '#64b5f6'));
}

function executarAll(tarefaBFalha) {
    resetarCardsAll();
    exibirSaida('saida-all', '⏳ Executando em paralelo...', 'pending');
    registrarLog('Promise.all → iniciado');

    // Tarefa A: simples, demora 1s
    const tarefaA = esperar(1000).then(() => {
        atualizarCardAll(1, '✔ ok (1s)', '#69f0ae');
        return 'resultado-A';
    });

    // Tarefa B: demora 2s, pode falhar
    const tarefaB = tarefaBFalha
        ? esperarComErro(2000, 'Tarefa B falhou!').catch((e) => {
            atualizarCardAll(2, '✖ erro', '#ff5252');
            throw e; // re-lança para o Promise.all receber
        })
        : esperar(2000).then(() => {
            atualizarCardAll(2, '✔ ok (2s)', '#69f0ae');
            return 'resultado-B';
        });

    // Tarefa C: demora 1.5s
    const tarefaC = esperar(1500).then(() => {
        atualizarCardAll(3, '✔ ok (1.5s)', '#69f0ae');
        return 'resultado-C';
    });

    // Promise.all aguarda todas — o array de resultados mantém a ordem original
    Promise.all([tarefaA, tarefaB, tarefaC])
        .then((resultados) => {
            // resultados[0] → tarefaA, [1] → tarefaB, [2] → tarefaC
            exibirSaida('saida-all',
                `Promise.all → fulfilled!\n\nResultados (em ordem):\n${JSON.stringify(resultados, null, 2)}`,
                'sucesso');
            registrarLog(`Promise.all → fulfilled: ${JSON.stringify(resultados)}`);
        })
        .catch((erro) => {
            // Qualquer rejeição cancela o all — as outras são ignoradas
            exibirSaida('saida-all',
                `Promise.all → rejected!\n\nPrimeiro erro:\n"${erro.message}"\n\n(As demais Promises continuam rodando, mas seus resultados são descartados)`,
                'erro');
            registrarLog(`Promise.all → rejected: "${erro.message}"`);
        });
}

document.getElementById('btn-all-sucesso').addEventListener('click', () => executarAll(false));
document.getElementById('btn-all-falha').addEventListener('click',   () => executarAll(true));


// ============================================================
// SEÇÃO 6 — Promise.allSettled()
// ============================================================
// Promise.allSettled(iterável)
//
// Semelhante ao all(), mas NUNCA rejeita.
// Aguarda todas terminarem e retorna um array de objetos:
//
//   { status: 'fulfilled', value: resultado }   → para as que resolveram
//   { status: 'rejected',  reason: motivo    }  → para as que rejeitaram
//
// Use quando: você quer processar todos os resultados mesmo que
// alguns falhem. Ex: enviar e-mails em lote — quer saber quais
// enviaram e quais falharam, não parar no primeiro erro.
// ============================================================

document.getElementById('btn-allsettled').addEventListener('click', () => {
    exibirSaida('saida-allsettled', '⏳ Aguardando todas terminarem...', 'pending');
    registrarLog('Promise.allSettled → iniciado');

    const p1 = esperar(800).then(() => 'Serviço A — ok');
    const p2 = esperarComErro(1200, 'Serviço B — offline');
    const p3 = esperar(600).then(() => 'Serviço C — ok');

    Promise.allSettled([p1, p2, p3])
        .then((resultados) => {
            // resultados é sempre um array, mesmo com rejeições
            const linhas = resultados.map((r, i) => {
                if (r.status === 'fulfilled') {
                    return `[${i}] ✔ fulfilled → value: "${r.value}"`;
                } else {
                    return `[${i}] ✖ rejected  → reason: "${r.reason.message}"`;
                }
            });

            exibirSaida('saida-allsettled',
                `Promise.allSettled → sempre resolve!\n\n${linhas.join('\n')}`,
                'sucesso');
            registrarLog(`Promise.allSettled → ${resultados.length} resultados recebidos`);
        });
});


// ============================================================
// SEÇÃO 7 — Promise.race()
// ============================================================
// Promise.race(iterável)
//
// Retorna o resultado da PRIMEIRA Promise que concluir
// — seja fulfilled ou rejected. As demais são ignoradas.
//
// Uso clássico: implementar timeout
//   Promise.race([
//       fetch(url),
//       esperar(5000).then(() => { throw new Error('Timeout') })
//   ])
// Se o fetch demorar mais de 5s, o timeout vence a corrida.
// ============================================================

document.getElementById('btn-race').addEventListener('click', () => {
    exibirSaida('saida-race', '⏳ Corrida iniciada...', 'pending');
    registrarLog('Promise.race → corrida iniciada');

    // Três Promises com tempos aleatórios para tornar a corrida imprevisível
    const tempos = [
        Math.floor(Math.random() * 1500) + 500,
        Math.floor(Math.random() * 1500) + 500,
        Math.floor(Math.random() * 1500) + 500,
    ];

    const promessas = tempos.map((ms, i) =>
        esperar(ms).then(() => ({ nome: `Promise ${i + 1}`, tempo: ms }))
    );

    const logTempos = tempos.map((ms, i) => `Promise ${i + 1}: ${ms}ms`).join(' | ');
    registrarLog(`Tempos sorteados → ${logTempos}`);

    Promise.race(promessas)
        .then((vencedora) => {
            exibirSaida('saida-race',
                `Promise.race → vencedora: ${vencedora.nome}!\n\nTempo: ${vencedora.tempo}ms\n\nTempos sorteados:\n${tempos.map((ms, i) => `  Promise ${i + 1}: ${ms}ms`).join('\n')}`,
                'sucesso');
            registrarLog(`Promise.race → vencedora: ${vencedora.nome} (${vencedora.tempo}ms)`);
        });
});


// ============================================================
// SEÇÃO 8 — Promise.any()
// ============================================================
// Promise.any(iterável)
//
// Resolve com a PRIMEIRA que for fulfilled — ignora rejeições.
// Só rejeita se TODAS rejeitarem → lança AggregateError.
//
// Diferença em relação ao race():
//   race() → vence a mais rápida, seja resolve OU reject
//   any()  → vence a mais rápida que RESOLVER (ignora rejeições)
//
// Use quando: você tem múltiplas fontes/servidores e quer o
// primeiro resultado bem-sucedido, ignorando os que falharem.
// ============================================================

document.getElementById('btn-any-parcial').addEventListener('click', () => {
    exibirSaida('saida-any', '⏳ Testando fontes...', 'pending');
    registrarLog('Promise.any → iniciado (duas falham, uma resolve)');

    const fontes = [
        esperarComErro(500,  'Fonte 1 — indisponível'),  // rejeita em 500ms
        esperarComErro(800,  'Fonte 2 — timeout'),        // rejeita em 800ms
        esperar(1200).then(() => 'Fonte 3 — dados ok!'),  // resolve em 1200ms
    ];

    Promise.any(fontes)
        .then((resultado) => {
            exibirSaida('saida-any',
                `Promise.any → primeiro sucesso!\n\n"${resultado}"\n\n(As rejeições anteriores foram ignoradas)`,
                'sucesso');
            registrarLog(`Promise.any → fulfilled: "${resultado}"`);
        })
        .catch((erro) => {
            // AggregateError contém todas as razões de rejeição
            exibirSaida('saida-any',
                `Promise.any → todas rejeitaram!\n\n${erro.message}`, 'erro');
            registrarLog(`Promise.any → AggregateError: todas rejeitaram`);
        });
});

document.getElementById('btn-any-todas-falham').addEventListener('click', () => {
    exibirSaida('saida-any', '⏳ Testando fontes (todas vão falhar)...', 'pending');
    registrarLog('Promise.any → iniciado (todas rejeitam)');

    const fontes = [
        esperarComErro(400, 'Fonte 1 — erro'),
        esperarComErro(700, 'Fonte 2 — erro'),
        esperarComErro(900, 'Fonte 3 — erro'),
    ];

    Promise.any(fontes)
        .then((resultado) => {
            exibirSaida('saida-any', resultado, 'sucesso');
        })
        .catch((erro) => {
            // erro é um AggregateError quando todas rejeitam
            exibirSaida('saida-any',
                `Promise.any → AggregateError!\n\nTodas as Promises rejeitaram.\n\ntipo do erro: ${erro.constructor.name}\nmensagem: ${erro.message}`,
                'erro');
            registrarLog(`Promise.any → AggregateError (todas rejeitaram)`);
        });
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
    registrarLog('Página pronta — explore as seções de Promises!');
    console.log('Aula 23 — Promises carregado.');
});
