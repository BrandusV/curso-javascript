// ============================================================
// EXERCÍCIO 6 — Botão Curtir com Array de Nomes
// ============================================================
// Objetivo: armazenar em um array os nomes de quem clicou em
// "Curtir" e atualizar o parágrafo seguindo 4 regras de exibição.
//
// Regras de exibição do parágrafo:
//   0 pessoas → "Ninguém curtiu"
//   1 pessoa  → "[Nome] curtiu"
//   2 pessoas → "[Pessoa1] e [Pessoa2] curtiram"
//   3+        → "[Pessoa1], [Pessoa2] e mais [N-2] pessoas curtiram"
// ============================================================


// ============================================================
// SELEÇÃO DE ELEMENTOS
// ============================================================
// Selecionamos os elementos do HTML que serão lidos ou modificados
// pelo JavaScript ao longo da execução do exercício.

const inputNome        = document.getElementById('input-nome');
const btnCurtir        = document.getElementById('btn-curtir');
const paragrafoCurtidas = document.getElementById('paragrafo-curtidas');
const msgErro          = document.getElementById('msg-erro');
const contador         = document.getElementById('contador');


// ============================================================
// ARRAY DE NOMES
// ============================================================
// Array que acumula os nomes de quem curtiu.
// Começa vazio — a página exibe "Ninguém curtiu" por padrão.

const nomes = [];


// ============================================================
// FUNÇÃO: gerarTexto
// ============================================================
// Recebe o array atualizado e retorna a string correta segundo
// as 4 regras do exercício.
// Manter essa lógica em uma função separada facilita testes e
// evita código duplicado dentro do handler de evento.

function gerarTexto(lista) {
    const tamanho = lista.length;

    // Regra 1 — nenhum nome no array
    if (tamanho === 0) {
        return 'Ninguém curtiu';
    }

    // Regra 2 — exatamente 1 nome
    if (tamanho === 1) {
        return `${lista[0]} curtiu`;
    }

    // Regra 3 — exatamente 2 nomes
    if (tamanho === 2) {
        return `${lista[0]} e ${lista[1]} curtiram`;
    }

    // Regra 4 — 3 ou mais nomes
    // Exibe apenas os dois primeiros e informa quantos restam.
    // "tamanho - 2" porque lista[0] e lista[1] já foram citados.
    const restantes = tamanho - 2;
    return `${lista[0]}, ${lista[1]} e mais ${restantes} ${restantes === 1 ? 'pessoa curtiu' : 'pessoas curtiram'}`;
}


// ============================================================
// FUNÇÃO: atualizarPagina
// ============================================================
// Centraliza todas as alterações visuais em um único lugar.
// Sempre chamada após qualquer mudança no array 'nomes'.

function atualizarPagina() {
    // Atualiza o parágrafo principal com o texto gerado pelas regras
    paragrafoCurtidas.textContent = gerarTexto(nomes);

    // Atualiza o contador abaixo do parágrafo (oculto quando vazio)
    if (nomes.length > 0) {
        contador.textContent = `Total: ${nomes.length} ${nomes.length === 1 ? 'curtida' : 'curtidas'}`;
    } else {
        contador.textContent = '';
    }

    console.log('Array atualizado:', nomes);
}


// ============================================================
// FUNÇÃO: curtir
// ============================================================
// Executada quando o usuário clica em "Curtir" ou pressiona Enter.
// Responsável por: validar, verificar duplicata, inserir e atualizar.

function curtir() {
    // --- Leitura e limpeza do input ---
    // trim() remove espaços extras do início e do fim.
    // Assim " João " é tratado igual a "João".
    const nome = inputNome.value.trim();

    // --- Validação 1: campo vazio ---
    if (nome === '') {
        msgErro.textContent = 'Por favor, digite seu nome antes de curtir.';
        inputNome.focus(); // devolve o foco ao campo para o usuário digitar
        return; // interrompe a função — não continua
    }

    // --- Validação 2: nome duplicado ---
    // some() percorre o array e retorna true se ALGUM elemento satisfaz
    // a condição. Usamos toLowerCase() para a comparação ser
    // case-insensitive: "João" e "joão" são considerados o mesmo nome.
    const jaExiste = nomes.some(
        (nomeCadastrado) => nomeCadastrado.toLowerCase() === nome.toLowerCase()
    );

    if (jaExiste) {
        msgErro.textContent = `"${nome}" já curtiu! Cada pessoa pode curtir apenas uma vez.`;
        inputNome.select(); // seleciona o texto no campo para facilitar a correção
        return;
    }

    // --- Limpeza da mensagem de erro anterior ---
    // Chegando aqui, a entrada é válida — esconde qualquer erro exibido antes.
    msgErro.textContent = '';

    // --- Inserção no array ---
    // push() adiciona o nome ao FINAL do array.
    // O array preserva a ordem de chegada, usada nas regras de exibição.
    nomes.push(nome);

    // --- Limpeza do campo de texto ---
    // Garante que o usuário não precise apagar manualmente o nome anterior.
    inputNome.value = '';

    // --- Devolve o foco ao input para facilitar novas curtidas seguidas ---
    inputNome.focus();

    // --- Atualiza o parágrafo e o contador na página ---
    atualizarPagina();
}


// ============================================================
// EVENTOS
// ============================================================

// --- Evento click no botão "Curtir" ---
// addEventListener é a forma recomendada: permite múltiplos handlers
// e pode ser removido depois com removeEventListener.
btnCurtir.addEventListener('click', curtir);

// --- Evento keydown no campo de texto ---
// Permite confirmar com Enter sem precisar clicar no botão.
// e.key === 'Enter' verifica especificamente a tecla Enter.
// Isso melhora a usabilidade do formulário.
inputNome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        curtir();
    }
});

// --- Evento input no campo de texto ---
// Limpa a mensagem de erro enquanto o usuário digita,
// evitando que o aviso persista mesmo após a correção.
inputNome.addEventListener('input', () => {
    msgErro.textContent = '';
});
