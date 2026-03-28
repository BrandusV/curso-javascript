// ============================================================
// EXERCÍCIO 9 — Lista de Tarefas com persistência no localStorage
// ============================================================
// Evolução do Exercício 5: agora as tarefas são salvas no
// localStorage e persistem ao recarregar a página.
// Cada tarefa também ganhou um botão individual de exclusão.
//
// Novidades em relação ao Exercício 5:
//   1. O array de tarefas é inicializado a partir do localStorage
//   2. Toda alteração (adicionar, alterar status, excluir) chama
//      salvarNoStorage() para manter localStorage sincronizado
//   3. Botão "Excluir" em cada item remove a tarefa do array e do storage
//
// Estrutura de cada objeto Tarefa (inalterada):
//   { descricao: string, status: boolean }
//
// Chave usada no localStorage:
//   'tarefas' → valor: JSON.stringify(array de objetos Tarefa)
//
// Fluxo de persistência:
//   SALVAR → JSON.stringify(tarefas) → localStorage.setItem('tarefas', ...)
//   LER    → localStorage.getItem('tarefas') → JSON.parse(...) → array
// ============================================================


// ============================================================
// SELEÇÃO DE ELEMENTOS
// ============================================================
const inputDescricao = document.getElementById('input-descricao');
const btnAdicionar   = document.getElementById('btn-adicionar');
const listaTarefas   = document.getElementById('lista-tarefas');
const msgErro        = document.getElementById('msg-erro');
const contador       = document.getElementById('contador');
const badgeStorage   = document.getElementById('badge-storage');
const msgVazia       = document.getElementById('msg-vazia');


// ============================================================
// CHAVE DO LOCALSTORAGE
// ============================================================
// Definida como constante para evitar erros de digitação em
// todos os pontos onde o storage é lido ou escrito.
const CHAVE_LS = 'tarefas';


// ============================================================
// INICIALIZAÇÃO DO ARRAY A PARTIR DO LOCALSTORAGE
// ============================================================
// Ao carregar a página tentamos recuperar as tarefas já salvas.
//   getItem(CHAVE_LS) → string JSON ou null (se nunca foi salvo)
//   JSON.parse(...)   → converte a string de volta para array
// Se não houver dados, começa com array vazio.

function carregarDoStorage() {
    const dados = localStorage.getItem(CHAVE_LS);
    return dados ? JSON.parse(dados) : [];
}

// O array é preenchido com o conteúdo do localStorage (ou vazio)
const tarefas = carregarDoStorage();


// ============================================================
// FUNÇÃO: salvarNoStorage
// ============================================================
// Sincroniza o estado atual do array com o localStorage.
// DEVE ser chamada sempre que o array for modificado.
// JSON.stringify converte o array de objetos para string,
// único formato aceito pelo localStorage.

function salvarNoStorage() {
    localStorage.setItem(CHAVE_LS, JSON.stringify(tarefas));
}


// ============================================================
// FUNÇÃO: criarTarefa
// ============================================================
// Cria e retorna um objeto Tarefa com status inicializado como
// false (não concluída). Isolada em função para facilitar testes
// e manter o padrão de criação consistente.

function criarTarefa(descricao) {
    return { descricao: descricao, status: false };
}


// ============================================================
// FUNÇÃO: atualizarContador
// ============================================================
// Exibe quantas tarefas existem e quantas estão concluídas.
// Também controla a visibilidade da mensagem "lista vazia".

function atualizarContador() {
    const total     = tarefas.length;
    const concluidas = tarefas.filter(t => t.status).length;

    if (total === 0) {
        contador.textContent = '';
        msgVazia.style.display = 'block';
    } else {
        contador.textContent = `${total} tarefa(s) — ${concluidas} concluída(s)`;
        msgVazia.style.display = 'none';
    }
}


// ============================================================
// FUNÇÃO: renderizarTarefas
// ============================================================
// Redesenha toda a lista com base no estado atual do array.
// É chamada após qualquer modificação: adição, mudança de
// status ou exclusão.
//
// Ordem dos elementos em cada <li>:
//   [checkbox] [descrição] [badge de status] [botão excluir]

function renderizarTarefas() {
    // Limpa o conteúdo anterior antes de redesenhar
    listaTarefas.innerHTML = '';

    for (let i = 0; i < tarefas.length; i++) {
        const tarefa = tarefas[i];

        // --- Elemento <li> ---
        const item = document.createElement('li');
        item.className = tarefa.status ? 'concluida' : 'pendente';

        // --- Checkbox ---
        // Controla o status da tarefa — marcado = concluída
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.status;
        checkbox.dataset.indice = i; // armazena o índice para uso no evento

        checkbox.addEventListener('change', function () {
            const indice = parseInt(this.dataset.indice);

            // Inverte o status no array
            tarefas[indice].status = !tarefas[indice].status;

            // Persiste imediatamente a mudança no localStorage
            salvarNoStorage();

            console.log(`"${tarefas[indice].descricao}" → ${tarefas[indice].status ? 'Concluída' : 'Pendente'}`);

            // Re-renderiza para refletir a mudança visual
            renderizarTarefas();
        });

        // --- Descrição ---
        const descricaoSpan = document.createElement('span');
        descricaoSpan.className = 'descricao';
        descricaoSpan.textContent = tarefa.descricao;

        // --- Badge de status ---
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = tarefa.status ? 'Concluída' : 'Não concluída';

        // --- Botão Excluir ---
        // Remove a tarefa do array E do localStorage.
        // O dataset.indice identifica qual tarefa excluir no momento do clique.
        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn-excluir';
        btnExcluir.title = 'Excluir tarefa';
        btnExcluir.textContent = '✕';
        btnExcluir.dataset.indice = i;

        btnExcluir.addEventListener('click', function () {
            const indice = parseInt(this.dataset.indice);
            const descricaoRemovida = tarefas[indice].descricao;

            // splice(indice, 1) remove exatamente 1 elemento na posição indice
            tarefas.splice(indice, 1);

            // Se o array ficou vazio, remove a chave do localStorage;
            // caso contrário, salva o array atualizado.
            if (tarefas.length === 0) {
                localStorage.removeItem(CHAVE_LS);
            } else {
                salvarNoStorage();
            }

            console.log(`Tarefa "${descricaoRemovida}" excluída. Restam: ${tarefas.length}`);

            // Oculta o badge de restauração após qualquer exclusão
            badgeStorage.style.display = 'none';

            renderizarTarefas();
        });

        // --- Monta o item ---
        item.appendChild(checkbox);
        item.appendChild(descricaoSpan);
        item.appendChild(badge);
        item.appendChild(btnExcluir);

        listaTarefas.appendChild(item);
    }

    // Atualiza o contador e a mensagem de lista vazia
    atualizarContador();
}


// ============================================================
// FUNÇÃO: adicionarTarefa
// ============================================================
// Valida o input, cria o objeto Tarefa, adiciona ao array,
// persiste no localStorage e re-renderiza a lista.

function adicionarTarefa() {
    const descricao = inputDescricao.value.trim();

    if (descricao === '') {
        msgErro.textContent = 'Por favor, insira uma descrição para a tarefa.';
        inputDescricao.focus();
        return;
    }

    msgErro.textContent = '';

    // Cria e adiciona ao array
    const novaTarefa = criarTarefa(descricao);
    tarefas.push(novaTarefa);

    // Persiste o array atualizado no localStorage
    salvarNoStorage();

    // Oculta o badge de restauração (já temos dados novos)
    badgeStorage.style.display = 'none';

    inputDescricao.value = '';
    inputDescricao.focus();

    console.log('Tarefa adicionada:', novaTarefa);
    console.log('Array completo:', tarefas);

    renderizarTarefas();
}


// ============================================================
// EVENTOS
// ============================================================
btnAdicionar.addEventListener('click', adicionarTarefa);

inputDescricao.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') adicionarTarefa();
});

inputDescricao.addEventListener('input', () => {
    msgErro.textContent = '';
});


// ============================================================
// EXECUÇÃO INICIAL — renderiza ao carregar a página
// ============================================================
// Se havia tarefas no localStorage, o array já está preenchido.
// renderizarTarefas() exibe todas imediatamente.

renderizarTarefas();

// Exibe o badge de restauração se havia dados salvos
if (tarefas.length > 0) {
    badgeStorage.style.display = 'inline';
    console.log('Tarefas restauradas do localStorage:', tarefas);
}
