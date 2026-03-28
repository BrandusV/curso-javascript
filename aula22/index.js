// ============================================================
// AULA 22 — WEB STORAGE NO JAVASCRIPT
// ============================================================
// Web Storage é uma API do navegador que permite guardar dados
// localmente na máquina do usuário, sem precisar de servidor.
//
// Existem dois mecanismos:
//
//   localStorage    → dados persistem indefinidamente
//   sessionStorage  → dados duram apenas enquanto a aba estiver aberta
//
// Diferenças em relação a cookies:
//   - Não são enviados ao servidor a cada requisição
//   - Maior capacidade (~5 MB vs ~4 KB dos cookies)
//   - API mais simples e intuitiva
//
// Regra fundamental: ambos só armazenam STRINGS.
//   Para salvar objetos: JSON.stringify(obj) antes do setItem
//   Para ler objetos:    JSON.parse(str)     depois do getItem
//
// Métodos disponíveis (idênticos em ambos):
//   setItem(chave, valor)  → salva um par chave/valor
//   getItem(chave)         → retorna o valor (ou null se não existir)
//   removeItem(chave)      → apaga uma chave específica
//   clear()                → apaga TODO o storage
//   key(index)             → retorna a chave na posição index
//   length                 → número de itens armazenados
// ============================================================


// ============================================================
// UTILITÁRIO — Log na tela
// ============================================================
const listaLog = document.getElementById('lista-log');

function registrarLog(mensagem) {
    const item = document.createElement('li');
    item.textContent = mensagem;
    listaLog.prepend(item);
}


// ============================================================
// SEÇÃO 1 — localStorage: setItem e getItem
// ============================================================
// setItem(chave, valor)
//   Salva o par no localStorage. Se a chave já existir, sobrescreve.
//   Ambos os argumentos são convertidos para string automaticamente.
//
// getItem(chave)
//   Retorna a string armazenada, ou NULL se a chave não existir.
//   Sempre verifique se o retorno é null antes de usar o valor.
// ============================================================

const btnLsSet = document.getElementById('btn-ls-set');
const btnLsGet = document.getElementById('btn-ls-get');
const saidaLsBasico = document.getElementById('saida-ls-basico');

btnLsSet.addEventListener('click', () => {
    const chave = document.getElementById('ls-chave').value.trim();
    const valor = document.getElementById('ls-valor').value.trim();

    if (!chave) {
        saidaLsBasico.textContent = 'Informe uma chave.';
        return;
    }

    // setItem salva o par chave/valor como strings
    localStorage.setItem(chave, valor);

    saidaLsBasico.textContent =
        `localStorage.setItem("${chave}", "${valor}")\n` +
        `→ Salvo com sucesso!`;
    saidaLsBasico.className = 'saida-codigo sucesso';

    registrarLog(`localStorage.setItem("${chave}", "${valor}")`);
    console.log('localStorage após setItem:', { chave, valor });
});

btnLsGet.addEventListener('click', () => {
    const chave = document.getElementById('ls-chave').value.trim();

    // getItem retorna null se a chave não existir — sempre trate esse caso!
    const valor = localStorage.getItem(chave);

    if (valor === null) {
        saidaLsBasico.textContent = `localStorage.getItem("${chave}") → null\n(chave não encontrada)`;
        saidaLsBasico.className = 'saida-codigo aviso';
        registrarLog(`localStorage.getItem("${chave}") → null`);
        return;
    }

    saidaLsBasico.textContent =
        `localStorage.getItem("${chave}")\n` +
        `→ "${valor}"\n` +
        `typeof: ${typeof valor}`;  // sempre 'string' — mesmo que tenha salvo um número
    saidaLsBasico.className = 'saida-codigo sucesso';

    registrarLog(`localStorage.getItem("${chave}") → "${valor}"`);
});


// ============================================================
// SEÇÃO 2 — sessionStorage: setItem e getItem
// ============================================================
// API idêntica ao localStorage.
// A diferença está no ciclo de vida dos dados:
//   - Fechar a aba → dados apagados automaticamente
//   - Recarregar a aba → dados mantidos (a sessão continua)
//   - Abrir nova aba → storage separado (não compartilha com esta aba)
// ============================================================

const btnSsSet = document.getElementById('btn-ss-set');
const btnSsGet = document.getElementById('btn-ss-get');
const saidaSsBasico = document.getElementById('saida-ss-basico');

btnSsSet.addEventListener('click', () => {
    const chave = document.getElementById('ss-chave').value.trim();
    const valor = document.getElementById('ss-valor').value.trim();

    if (!chave) {
        saidaSsBasico.textContent = 'Informe uma chave.';
        return;
    }

    // sessionStorage.setItem — mesma API, ciclo de vida diferente
    sessionStorage.setItem(chave, valor);

    saidaSsBasico.textContent =
        `sessionStorage.setItem("${chave}", "${valor}")\n` +
        `→ Salvo! Feche esta aba e reabra — os dados sumirão.`;
    saidaSsBasico.className = 'saida-codigo aviso';

    registrarLog(`sessionStorage.setItem("${chave}", "${valor}")`);
});

btnSsGet.addEventListener('click', () => {
    const chave = document.getElementById('ss-chave').value.trim();
    const valor = sessionStorage.getItem(chave);

    if (valor === null) {
        saidaSsBasico.textContent = `sessionStorage.getItem("${chave}") → null`;
        saidaSsBasico.className = 'saida-codigo aviso';
        registrarLog(`sessionStorage.getItem("${chave}") → null`);
        return;
    }

    saidaSsBasico.textContent =
        `sessionStorage.getItem("${chave}")\n→ "${valor}"`;
    saidaSsBasico.className = 'saida-codigo sucesso';

    registrarLog(`sessionStorage.getItem("${chave}") → "${valor}"`);
});


// ============================================================
// SEÇÃO 3 — removeItem e clear
// ============================================================
// removeItem(chave) → apaga somente a chave informada
//   Útil para "deslogar" um usuário, limpar um item específico.
//
// clear() → apaga TODOS os itens do storage de uma vez
//   Use com cautela em produção — pode apagar dados de outras
//   partes da aplicação que compartilham o mesmo origem.
// ============================================================

const btnLsRemove = document.getElementById('btn-ls-remove');
const btnLsClear = document.getElementById('btn-ls-clear');
const saidaLsRemover = document.getElementById('saida-ls-remover');

btnLsRemove.addEventListener('click', () => {
    const chave = document.getElementById('ls-remover-chave').value.trim();

    if (!chave) {
        saidaLsRemover.textContent = 'Informe a chave a remover.';
        return;
    }

    // Verificamos se a chave existe antes de remover (para feedback ao usuário)
    const existia = localStorage.getItem(chave) !== null;
    localStorage.removeItem(chave);

    saidaLsRemover.textContent = existia
        ? `localStorage.removeItem("${chave}") → removido com sucesso.`
        : `localStorage.removeItem("${chave}") → chave não existia (sem erro).`;
    saidaLsRemover.className = 'saida-codigo ' + (existia ? 'sucesso' : 'aviso');

    registrarLog(`localStorage.removeItem("${chave}")`);
});

btnLsClear.addEventListener('click', () => {
    const total = localStorage.length;

    // clear() não recebe argumentos — apaga tudo sem exceção
    localStorage.clear();

    saidaLsRemover.textContent =
        `localStorage.clear() → ${total} item(ns) removido(s).\nO localStorage agora está vazio.`;
    saidaLsRemover.className = 'saida-codigo sucesso';

    // Atualiza o inspector se estiver visível
    renderizarInspector();
    registrarLog(`localStorage.clear() — ${total} item(ns) apagado(s)`);
});


// ============================================================
// SEÇÃO 4 — Iterando o localStorage (length + key)
// ============================================================
// localStorage.length → propriedade com a contagem de itens
// localStorage.key(i) → retorna o nome da chave no índice i
//
// Combinados, permitem percorrer todo o storage dinamicamente:
//   for (let i = 0; i < localStorage.length; i++) {
//       const chave = localStorage.key(i);
//       const valor = localStorage.getItem(chave);
//   }
// ============================================================

const inspectorLs = document.getElementById('inspector-ls');

function renderizarInspector() {
    inspectorLs.innerHTML = '';

    if (localStorage.length === 0) {
        inspectorLs.innerHTML = '<span class="inspector-vazio">localStorage está vazio</span>';
        return;
    }

    // Iteração usando length + key(i)
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        const valor = localStorage.getItem(chave);

        // Cria uma linha no inspector para cada par chave/valor
        const linha = document.createElement('div');
        linha.className = 'inspector-item';
        linha.innerHTML = `
            <span class="inspector-chave">"${chave}"</span>
            <span class="inspector-valor">${valor}</span>
            <button class="inspector-btn-remover" data-chave="${chave}">✕</button>
        `;
        inspectorLs.appendChild(linha);
    }

    // Delegação de eventos — um único listener no inspector cuida dos botões de remoção
    inspectorLs.querySelectorAll('.inspector-btn-remover').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chave = e.target.dataset.chave;
            localStorage.removeItem(chave);
            registrarLog(`Inspector → removeu "${chave}"`);
            renderizarInspector(); // re-renderiza após remoção
        });
    });
}

document.getElementById('btn-listar-ls').addEventListener('click', () => {
    renderizarInspector();
    registrarLog(`Inspector → ${localStorage.length} item(ns) encontrado(s)`);
});

// Preenche o localStorage com dados de exemplo para facilitar os testes
document.getElementById('btn-ls-preencher').addEventListener('click', () => {
    localStorage.setItem('tema', 'escuro');
    localStorage.setItem('idioma', 'pt-BR');
    localStorage.setItem('usuario', 'Beatriz');
    localStorage.setItem('ultimaVisita', new Date().toLocaleDateString('pt-BR'));
    renderizarInspector();
    registrarLog('Inspector → 4 itens de exemplo adicionados');
});


// ============================================================
// SEÇÃO 5 — Salvando Objetos com JSON
// ============================================================
// Fluxo completo para persistir um objeto JavaScript:
//
//   SALVAR:
//     const obj = { nome: "Ana", email: "ana@email.com" };
//     localStorage.setItem("perfil", JSON.stringify(obj));
//
//   LER:
//     const str = localStorage.getItem("perfil");  // string ou null
//     if (str) {
//         const obj = JSON.parse(str);              // objeto JavaScript
//         console.log(obj.nome);                    // "Ana"
//     }
// ============================================================

const CHAVE_OBJETO = 'perfilUsuario'; // chave fixa usada nesta seção

document.getElementById('btn-obj-salvar').addEventListener('click', () => {
    const perfil = {
        nome: document.getElementById('obj-nome').value.trim(),
        email: document.getElementById('obj-email').value.trim(),
        tema: document.getElementById('obj-tema').value.trim(),
        salvoEm: new Date().toLocaleString('pt-BR')
    };

    // Converte o objeto para string e salva
    const jsonString = JSON.stringify(perfil, null, 2);
    localStorage.setItem(CHAVE_OBJETO, JSON.stringify(perfil)); // sem indentação para o storage

    document.getElementById('saida-obj-string').textContent =
        `Chave: "${CHAVE_OBJETO}"\n\nString armazenada:\n${jsonString}`;
    document.getElementById('saida-obj-parsed').textContent = '← clique em "Ler" para ver o objeto reconstituído';

    registrarLog(`Objeto salvo em localStorage["${CHAVE_OBJETO}"]`);
    console.log('Objeto salvo:', perfil);
});

document.getElementById('btn-obj-ler').addEventListener('click', () => {
    const stringArmazenada = localStorage.getItem(CHAVE_OBJETO);

    if (stringArmazenada === null) {
        document.getElementById('saida-obj-parsed').textContent =
            `Chave "${CHAVE_OBJETO}" não encontrada — salve primeiro.`;
        return;
    }

    // JSON.parse recria o objeto a partir da string armazenada
    const perfil = JSON.parse(stringArmazenada);

    // Acessa propriedades normalmente — é um objeto JavaScript comum
    const linhas = Object.entries(perfil)
        .map(([k, v]) => `perfil.${k} → "${v}"`)
        .join('\n');

    document.getElementById('saida-obj-parsed').textContent = linhas;

    registrarLog(`Objeto lido de localStorage["${CHAVE_OBJETO}"] com JSON.parse`);
    console.log('Objeto recuperado:', perfil);
});

document.getElementById('btn-obj-remover').addEventListener('click', () => {
    localStorage.removeItem(CHAVE_OBJETO);
    document.getElementById('saida-obj-string').textContent = '—';
    document.getElementById('saida-obj-parsed').textContent = '—';
    registrarLog(`localStorage.removeItem("${CHAVE_OBJETO}")`);
});


// ============================================================
// SEÇÃO 6 — sessionStorage: Rascunho Automático por Aba
// ============================================================
// Caso de uso clássico do sessionStorage:
//   salvar o conteúdo de um campo enquanto o usuário digita,
//   restaurar ao recarregar a página, descartar ao fechar a aba.
//
// O evento 'input' dispara a cada mudança no campo — ideal para
// autosave contínuo sem precisar de botão "salvar".
// ============================================================

const CHAVE_RASCUNHO = 'rascunhoMensagem';
const textareaRascunho = document.getElementById('ss-rascunho');
const saidaSsRascunho = document.getElementById('saida-ss-rascunho');

// Ao carregar a página, restaura o rascunho se existir
const rascunhoSalvo = sessionStorage.getItem(CHAVE_RASCUNHO);
if (rascunhoSalvo) {
    textareaRascunho.value = rascunhoSalvo;
    saidaSsRascunho.textContent = `Rascunho restaurado (${rascunhoSalvo.length} caracteres). Sessão ainda ativa.`;
    saidaSsRascunho.className = 'saida-codigo aviso';
    registrarLog('sessionStorage → rascunho restaurado ao carregar a página');
}

// Salva automaticamente a cada tecla digitada
textareaRascunho.addEventListener('input', (e) => {
    const conteudo = e.target.value;
    sessionStorage.setItem(CHAVE_RASCUNHO, conteudo);

    saidaSsRascunho.textContent =
        `Rascunho salvo automaticamente — ${conteudo.length} caractere(s).\n` +
        `(sessionStorage — some ao fechar a aba)`;
    saidaSsRascunho.className = 'saida-codigo aviso';
});

document.getElementById('btn-ss-limpar-rascunho').addEventListener('click', () => {
    sessionStorage.removeItem(CHAVE_RASCUNHO);
    textareaRascunho.value = '';
    saidaSsRascunho.textContent = 'Rascunho descartado.';
    saidaSsRascunho.className = 'saida-codigo';
    registrarLog('sessionStorage → rascunho descartado');
});


// ============================================================
// SEÇÃO 7 — Evento 'storage'
// ============================================================
// window.addEventListener('storage', handler)
//
// Dispara quando o localStorage é modificado por OUTRA aba da
// mesma origem (mesmo protocolo + domínio + porta).
//
// O objeto de evento contém:
//   e.key      → chave que foi alterada
//   e.oldValue → valor anterior (null se era novo)
//   e.newValue → novo valor (null se foi removido)
//   e.url      → URL da aba que fez a alteração
//   e.storageArea → referência ao storage alterado
//
// Usos práticos: sincronizar login/logout, temas, notificações
// entre múltiplas abas abertas da mesma aplicação.
// ============================================================

const saidaEventoStorage = document.getElementById('saida-evento-storage');

// Listener real — recebe eventos de OUTRAS abas
window.addEventListener('storage', (e) => {
    saidaEventoStorage.textContent =
        `Evento 'storage' recebido de outra aba!\n` +
        `chave:    "${e.key}"\n` +
        `anterior: "${e.oldValue}"\n` +
        `novo:     "${e.newValue}"\n` +
        `origem:   ${e.url}`;
    saidaEventoStorage.className = 'saida-codigo sucesso';

    registrarLog(`Evento storage → chave "${e.key}" alterada por outra aba`);
});

// Botão de simulação: altera o localStorage desta aba manualmente para demonstrar
// como o evento funcionaria para OUTRAS abas (esta não recebe o próprio evento)
document.getElementById('btn-simular-storage').addEventListener('click', () => {
    const valorAtual = localStorage.getItem('_teste_evento') || '0';
    const novoValor = String(Number(valorAtual) + 1);
    localStorage.setItem('_teste_evento', novoValor);

    saidaEventoStorage.textContent =
        `Alteração feita nesta aba → "_teste_evento" = "${novoValor}"\n\n` +
        `O evento 'storage' NÃO dispara nesta aba — apenas nas outras.\n` +
        `Abra esta página em outra aba e clique aqui — lá o evento aparecerá.`;
    saidaEventoStorage.className = 'saida-codigo aviso';

    registrarLog(`Simulação storage → "_teste_evento" = "${novoValor}" (outras abas receberiam o evento)`);
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
    registrarLog('Página pronta — explore localStorage e sessionStorage!');
    console.log('Aula 22 — Web Storage carregado.');

    // Exibe no console a situação atual dos dois storages para referência
    console.log('localStorage.length:', localStorage.length);
    console.log('sessionStorage.length:', sessionStorage.length);
});
