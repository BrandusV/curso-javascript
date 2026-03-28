// ============================================================
// EXERCÍCIO 8 — Busca de Usuários no GitHub
// ============================================================
// Objetivo: consumir a API pública do GitHub para pesquisar
// usuários a partir de um termo digitado num campo de texto.
// A busca começa apenas com o clique no botão (ou Enter).
//
// Endpoint utilizado:
//   GET https://api.github.com/search/users?q={termo}
//
// A API retorna um objeto com a propriedade "items" contendo
// um array de usuários correspondentes ao termo buscado.
//
// Conceitos aplicados neste exercício:
//   - fetch() com async/await
//   - Verificação de response.ok (erros HTTP não rejeitam fetch)
//   - try/catch para erros de rede e HTTP
//   - Manipulação de DOM: criação de elementos e inserção na página
//   - Estados de UI: loading, vazio, resultados, erro
// ============================================================


// ============================================================
// SELEÇÃO DE ELEMENTOS
// ============================================================
const inputBusca         = document.getElementById('input-busca');
const btnBuscar          = document.getElementById('btn-buscar');
const msgErro            = document.getElementById('msg-erro');
const loading            = document.getElementById('loading');
const msgVazio           = document.getElementById('msg-vazio');
const listaResultados    = document.getElementById('lista-resultados');
const contadorResultados = document.getElementById('contador-resultados');


// ============================================================
// ESTADOS DE UI
// ============================================================
// Centralizar as mudanças de estado em funções dedicadas evita
// repetição e garante que apenas um estado seja visível por vez.

function mostrarLoading() {
    loading.style.display = 'block';
    msgVazio.style.display = 'none';
    listaResultados.innerHTML = '';
    contadorResultados.textContent = '';
    btnBuscar.disabled = true; // evita cliques duplos durante a requisição
}

function mostrarVazio() {
    loading.style.display = 'none';
    msgVazio.style.display = 'block';
    listaResultados.innerHTML = '';
    contadorResultados.textContent = '';
    btnBuscar.disabled = false;
}

function mostrarResultados(usuarios, total) {
    loading.style.display = 'none';
    msgVazio.style.display = 'none';
    btnBuscar.disabled = false;

    // A API limita a exibição a 30 resultados por página por padrão.
    // total_count é o número real de usuários encontrados no GitHub.
    contadorResultados.textContent =
        `${total.toLocaleString('pt-BR')} usuário(s) encontrado(s) — exibindo ${usuarios.length}`;
}

function mostrarErro(mensagem) {
    loading.style.display = 'none';
    msgVazio.style.display = 'none';
    listaResultados.innerHTML = '';
    contadorResultados.textContent = '';
    msgErro.textContent = mensagem;
    btnBuscar.disabled = false;
}

function limparEstado() {
    msgErro.textContent = '';
    msgVazio.style.display = 'none';
    listaResultados.innerHTML = '';
    contadorResultados.textContent = '';
}


// ============================================================
// FUNÇÃO: buscarUsuarios
// ============================================================
// Realiza a requisição à API do GitHub e atualiza a página.
//
// Fluxo:
//   1. Valida o campo (não pode ser vazio)
//   2. Exibe o spinner (estado loading)
//   3. fetch() → aguarda resposta
//   4. Verifica response.ok (fetch não rejeita em erros HTTP!)
//   5. response.json() → converte o corpo para objeto JS
//   6. Se items.length === 0 → exibe mensagem "não encontrado"
//   7. Caso contrário → renderiza os cards
//   8. try/catch captura qualquer erro de rede ou HTTP
// ============================================================

async function buscarUsuarios() {
    const termo = inputBusca.value.trim();

    // Validação: campo vazio
    if (!termo) {
        msgErro.textContent = 'Digite um nome ou termo para pesquisar.';
        inputBusca.focus();
        return;
    }

    limparEstado();
    mostrarLoading();

    try {
        // -------------------------------------------------------
        // fetch() — 1º await: aguarda os headers da resposta
        // -------------------------------------------------------
        // A API do GitHub aceita o parâmetro "q" como termo de busca.
        // Headers: Accept e User-Agent são recomendados pela documentação
        // do GitHub para evitar rate limiting e receber JSON correto.
        const response = await fetch(
            `https://api.github.com/search/users?q=${encodeURIComponent(termo)}&per_page=30`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                }
            }
        );

        // fetch() NUNCA rejeita em erros HTTP (404, 422, 503...).
        // Precisamos checar response.ok (true para status 200-299).
        if (!response.ok) {
            // 422 acontece quando o termo de busca é inválido para a API
            if (response.status === 422) {
                throw new Error('Termo de busca inválido. Tente outro termo.');
            }
            // 403 = rate limit excedido (60 req/hora sem autenticação)
            if (response.status === 403) {
                throw new Error('Limite de requisições da API atingido. Aguarde alguns minutos.');
            }
            throw new Error(`Erro na API do GitHub: ${response.status}`);
        }

        // -------------------------------------------------------
        // response.json() — 2º await: lê e parseia o corpo
        // -------------------------------------------------------
        const dados = await response.json();

        // total_count: quantos usuários o GitHub encontrou no total
        // items: array com até 30 usuários desta página
        const { total_count, items } = dados;

        if (total_count === 0 || items.length === 0) {
            mostrarVazio();
            return;
        }

        mostrarResultados(items, total_count);
        renderizarLista(items);

    } catch (erro) {
        // Captura erros de REDE (offline, DNS) e os throw acima
        mostrarErro(erro.message);
        console.error('Erro na busca:', erro);
    }
}


// ============================================================
// FUNÇÃO: renderizarLista
// ============================================================
// Recebe o array de usuários retornado pela API e cria um
// card HTML para cada um, inserindo na lista da página.
//
// Cada objeto do array "items" contém:
//   login        → nome de usuário (ex: "torvalds")
//   avatar_url   → URL da foto de perfil
//   html_url     → link para o perfil no GitHub
//   type         → "User" ou "Organization"
//   score        → relevância do resultado para o termo buscado
//
// Os campos "name", "public_repos" e "followers" NÃO vêm
// neste endpoint — para obtê-los seria preciso um segundo fetch
// para /users/{login}, o que está além do escopo do exercício.
// ============================================================

function renderizarLista(usuarios) {
    // Criamos todos os itens e inserimos de uma só vez com um Fragment,
    // evitando múltiplos repaints do DOM (melhor performance).
    const fragmento = document.createDocumentFragment();

    usuarios.forEach((usuario) => {
        const li = document.createElement('li');
        li.className = 'card-usuario';

        // ---- Avatar ----
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = usuario.avatar_url;
        avatar.alt = `Avatar de ${usuario.login}`;
        // Se a imagem falhar ao carregar, exibe um fallback com inicial
        avatar.onerror = () => {
            avatar.src = `https://ui-avatars.com/api/?name=${usuario.login}&background=3b2f6e&color=fff`;
        };

        // ---- Bloco de informações ----
        const info = document.createElement('div');
        info.className = 'info';

        // Login (sempre presente)
        const loginEl = document.createElement('p');
        loginEl.className = 'info-login';
        loginEl.textContent = usuario.login;

        // Tipo de conta: User ou Organization
        const metaEl = document.createElement('div');
        metaEl.className = 'info-meta';

        const tipoSpan = document.createElement('span');
        tipoSpan.textContent = `&#128100; ${usuario.type}`;

        // ID do usuário (número único e permanente no GitHub)
        const idSpan = document.createElement('span');
        idSpan.textContent = `ID: ${usuario.id}`;

        metaEl.appendChild(tipoSpan);
        metaEl.appendChild(idSpan);

        info.appendChild(loginEl);
        info.appendChild(metaEl);

        // ---- Botão "Ver perfil" ----
        // Abre o perfil do usuário no GitHub em nova aba
        const linkPerfil = document.createElement('a');
        linkPerfil.className = 'btn-perfil';
        linkPerfil.href = usuario.html_url;
        linkPerfil.target = '_blank';
        linkPerfil.rel = 'noopener noreferrer'; // segurança: evita acesso ao window.opener
        linkPerfil.textContent = 'Ver perfil';

        // Monta o card
        li.appendChild(avatar);
        li.appendChild(info);
        li.appendChild(linkPerfil);

        fragmento.appendChild(li);
    });

    // Insere todos os cards no DOM de uma vez
    listaResultados.appendChild(fragmento);
}


// ============================================================
// EVENTOS
// ============================================================

// Clique no botão inicia a busca
btnBuscar.addEventListener('click', buscarUsuarios);

// Enter no campo de texto também inicia a busca
// (melhora a usabilidade — comportamento esperado pelo usuário)
inputBusca.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscarUsuarios();
});

// Limpa a mensagem de erro enquanto o usuário digita
inputBusca.addEventListener('input', () => {
    msgErro.textContent = '';
});
