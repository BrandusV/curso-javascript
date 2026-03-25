// Exercício 5 - Lista de Tarefas com Array de Objetos e Manipulação de Elementos

// Array que armazena as tarefas — cada tarefa é um objeto com descrição e status
const tarefas = [];

// Seleciona os elementos da página que serão manipulados pelo JavaScript
const inputDescricao = document.getElementById('input-descricao');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');

// Função que cria e retorna um objeto Tarefa
// O status é sempre inicializado como false (não concluída)
function criarTarefa(descricao) {
    return { descricao: descricao, status: false };
}

// Função que percorre o array e redesenha toda a lista na página
// É chamada sempre que uma tarefa é adicionada ou seu status é alterado
function renderizarTarefas() {
    // Limpa o conteúdo atual da lista antes de redesenhar do zero
    listaTarefas.innerHTML = '';

    // Percorre o array de tarefas usando o índice para identificar cada uma
    for (let i = 0; i < tarefas.length; i++) {
        const tarefa = tarefas[i];

        // Cria o elemento <li> que representa cada tarefa na lista
        const item = document.createElement('li');

        // Define a classe CSS do item com base no status — controla o estilo visual
        // status true → 'concluida' | status false → 'pendente'
        item.className = tarefa.status ? 'concluida' : 'pendente';

        // Cria o checkbox que permite ao usuário alterar o status da tarefa
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        // Sincroniza o estado visual do checkbox com o status armazenado no array
        checkbox.checked = tarefa.status;

        // Armazena o índice da tarefa no atributo data-indice para acessá-la no evento
        checkbox.dataset.indice = i;

        // Evento disparado quando o usuário marca ou desmarca o checkbox
        checkbox.addEventListener('change', function () {
            // Recupera o índice da tarefa armazenado no atributo data-indice
            const indice = parseInt(this.dataset.indice);

            // Inverte o status no array: true vira false, false vira true
            tarefas[indice].status = !tarefas[indice].status;

            // Exibe o estado atualizado da tarefa no console
            console.log(`Status de "${tarefas[indice].descricao}" alterado para:`, tarefas[indice].status ? 'Concluída' : 'Não concluída');

            // Re-renderiza a lista para refletir a mudança no visual
            renderizarTarefas();
        });

        // Cria o <span> com a descrição da tarefa
        const descricaoSpan = document.createElement('span');
        descricaoSpan.className = 'descricao';
        descricaoSpan.innerText = tarefa.descricao;

        // Cria o badge de status exibido ao lado da descrição
        const badgeStatus = document.createElement('span');
        badgeStatus.className = 'badge';
        badgeStatus.innerText = tarefa.status ? 'Concluída' : 'Não concluída';

        // Monta o item da lista: checkbox + descrição + badge
        item.appendChild(checkbox);
        item.appendChild(descricaoSpan);
        item.appendChild(badgeStatus);

        // Insere o item montado na lista visível na página
        listaTarefas.appendChild(item);
    }
}

// Função principal que valida, cria e adiciona uma nova tarefa ao array
function adicionarTarefa() {
    // Obtém o texto digitado removendo espaços extras do início e do fim
    const descricao = inputDescricao.value.trim();

    // Impede o cadastro de tarefas sem descrição
    if (descricao === '') {
        alert('Por favor, insira uma descrição para a tarefa.');
        return;
    }

    // Cria o objeto Tarefa com a descrição informada e status inicial false
    const novaTarefa = criarTarefa(descricao);

    // Adiciona a nova tarefa ao final do array com push()
    tarefas.push(novaTarefa);

    // Exibe no console o objeto adicionado e o estado atual do array completo
    console.log('Tarefa adicionada:', novaTarefa);
    console.log('Array completo de tarefas:', tarefas);

    // Limpa o campo de texto para o usuário digitar a próxima tarefa
    inputDescricao.value = '';

    // Atualiza a lista visível na página com a nova tarefa incluída
    renderizarTarefas();
}

// Associa o evento de clique do botão "Adicionar" à função adicionarTarefa
btnAdicionar.addEventListener('click', adicionarTarefa);

// Permite confirmar a adição pressionando Enter no campo de texto
inputDescricao.addEventListener('keydown', function (evento) {
    // Verifica se a tecla pressionada é Enter (key === 'Enter')
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});
