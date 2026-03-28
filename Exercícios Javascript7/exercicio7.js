// ============================================================
// EXERCÍCIO 7 — Curtir com persistência no localStorage
// ============================================================
// Evolução do Exercício 6: agora a lista de nomes é salva no
// localStorage, então ela persiste mesmo ao recarregar a página.
//
// Novidades em relação ao Exercício 6:
//   1. O array 'nomes' é inicializado a partir do localStorage
//   2. Toda vez que o array muda, ele é sincronizado no localStorage
//   3. O botão "Limpar" remove os nomes do array E do localStorage
//
// Chave usada no localStorage:
//   'curtidas' → valor: JSON.stringify(array de strings)
//
// Regras de exibição (inalteradas do Exercício 6):
//   0 pessoas → "Ninguém curtiu"
//   1 pessoa  → "[Nome] curtiu"
//   2 pessoas → "[Pessoa1] e [Pessoa2] curtiram"
//   3+        → "[Pessoa1], [Pessoa2] e mais [N-2] pessoas curtiram"
// ============================================================


// ============================================================
// SELEÇÃO DE ELEMENTOS
// ============================================================
const inputNome         = document.getElementById('input-nome');
const btnCurtir         = document.getElementById('btn-curtir');
const btnLimpar         = document.getElementById('btn-limpar');
const paragrafoCurtidas = document.getElementById('paragrafo-curtidas');
const msgErro           = document.getElementById('msg-erro');
const contador          = document.getElementById('contador');
const badgeStorage      = document.getElementById('badge-storage');


// ============================================================
// CHAVE DO LOCALSTORAGE
// ============================================================
// Definir a chave como constante evita erros de digitação e
// facilita encontrar todos os lugares onde ela é usada.
const CHAVE_LS = 'curtidas';


// ============================================================
// INICIALIZAÇÃO DO ARRAY A PARTIR DO LOCALSTORAGE
// ============================================================
// Ao carregar a página, tentamos recuperar a lista já salva.
// Fluxo:
//   1. localStorage.getItem → retorna string JSON ou null
//   2. Se existir: JSON.parse → transforma a string em array
//   3. Se não existir: começa com array vazio
//
// Isso garante que os nomes persistam entre recarregamentos.

function carregarDoStorage() {
    const dados = localStorage.getItem(CHAVE_LS);

    // getItem retorna null se a chave ainda não foi criada
    if (dados === null) {
        return []; // primeira vez na página — começa vazio
    }

    // JSON.parse converte a string armazenada de volta para array
    return JSON.parse(dados);
}

// O array é inicializado com o conteúdo do localStorage (ou vazio)
const nomes = carregarDoStorage();


// ============================================================
// FUNÇÃO: salvarNoStorage
// ============================================================
// Sincroniza o estado atual do array 'nomes' com o localStorage.
// Deve ser chamada sempre que o array for modificado (push ou reset).
//
// JSON.stringify converte o array para string — único formato
// aceito pelo localStorage.

function salvarNoStorage() {
    localStorage.setItem(CHAVE_LS, JSON.stringify(nomes));
}


// ============================================================
// FUNÇÃO: gerarTexto
// ============================================================
// Recebe o array e retorna a string de exibição segundo as regras.
// (lógica idêntica ao Exercício 6 — sem alterações)

function gerarTexto(lista) {
    const tamanho = lista.length;

    if (tamanho === 0) {
        return 'Ninguém curtiu';
    }

    if (tamanho === 1) {
        return `${lista[0]} curtiu`;
    }

    if (tamanho === 2) {
        return `${lista[0]} e ${lista[1]} curtiram`;
    }

    // 3 ou mais: exibe os dois primeiros e indica quantos restam
    const restantes = tamanho - 2;
    return `${lista[0]}, ${lista[1]} e mais ${restantes} ${restantes === 1 ? 'pessoa curtiu' : 'pessoas curtiram'}`;
}


// ============================================================
// FUNÇÃO: atualizarPagina
// ============================================================
// Atualiza todos os elementos visuais que dependem do array.
// Centralizar aqui evita repetição e garante consistência.

function atualizarPagina() {
    // Parágrafo principal com as regras de exibição
    paragrafoCurtidas.textContent = gerarTexto(nomes);

    // Contador numérico — oculto quando não há curtidas
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
// Valida o input, adiciona ao array, salva no localStorage
// e atualiza a página.

function curtir() {
    const nome = inputNome.value.trim();

    // Validação 1 — campo vazio
    if (nome === '') {
        msgErro.textContent = 'Por favor, digite seu nome antes de curtir.';
        inputNome.focus();
        return;
    }

    // Validação 2 — nome duplicado (case-insensitive)
    const jaExiste = nomes.some(
        (nomeCadastrado) => nomeCadastrado.toLowerCase() === nome.toLowerCase()
    );

    if (jaExiste) {
        msgErro.textContent = `"${nome}" já curtiu! Cada pessoa pode curtir apenas uma vez.`;
        inputNome.select();
        return;
    }

    // Entrada válida — limpa o erro
    msgErro.textContent = '';

    // Adiciona o nome ao array e salva no localStorage imediatamente
    nomes.push(nome);
    salvarNoStorage(); // ← novidade do Ex7: persiste a mudança

    // Limpa o campo e devolve o foco
    inputNome.value = '';
    inputNome.focus();

    // Oculta o badge de restauração após a primeira curtida nova
    badgeStorage.style.display = 'none';

    atualizarPagina();
}


// ============================================================
// FUNÇÃO: limpar
// ============================================================
// Remove todos os nomes do array E do localStorage.
// Após limpar, a página volta ao estado inicial "Ninguém curtiu".

function limpar() {
    // Esvazia o array in-place (mantém a referência)
    nomes.length = 0;

    // Remove a chave do localStorage — próximo carregamento começa zerado
    localStorage.removeItem(CHAVE_LS);

    // Garante que o badge de restauração não apareça após limpar
    badgeStorage.style.display = 'none';

    atualizarPagina();
    console.log('Lista limpa — localStorage removido.');
}


// ============================================================
// EVENTOS
// ============================================================

btnCurtir.addEventListener('click', curtir);

btnLimpar.addEventListener('click', limpar);

// Enter no campo de texto aciona curtir
inputNome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') curtir();
});

// Limpa o erro enquanto o usuário digita
inputNome.addEventListener('input', () => {
    msgErro.textContent = '';
});


// ============================================================
// EXECUÇÃO INICIAL — renderiza a lista ao carregar a página
// ============================================================
// Se havia dados no localStorage, o array já está preenchido.
// Chamamos atualizarPagina() para refletir isso imediatamente.

atualizarPagina();

// Exibe o badge de restauração se havia dados salvos
if (nomes.length > 0) {
    badgeStorage.style.display = 'block';
    console.log('Lista restaurada do localStorage:', nomes);
}
