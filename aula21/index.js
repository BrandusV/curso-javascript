// ============================================================
// AULA 21 — JSON NO JAVASCRIPT
// ============================================================
// JSON (JavaScript Object Notation) é um formato de texto leve
// usado para trocar dados entre aplicações (frontend ↔ backend).
//
// Regras do formato JSON:
//   - Chaves (keys) SEMPRE entre aspas duplas: "nome"
//   - Strings SEMPRE entre aspas duplas: "valor"
//   - Números, booleanos e null sem aspas: 42, true, null
//   - Sem comentários, sem funções, sem undefined
//
// Tipos válidos em JSON:
//   string   → "texto"
//   number   → 42 / 3.14
//   boolean  → true / false
//   null     → null
//   array    → [1, 2, 3]
//   object   → { "chave": "valor" }
// ============================================================


// ============================================================
// UTILITÁRIO — Registra mensagens no painel de log
// ============================================================
const listaLog = document.getElementById('lista-log');

function registrarLog(mensagem) {
    const item = document.createElement('li');
    item.textContent = mensagem;
    listaLog.prepend(item); // insere sempre no topo
}


// ============================================================
// SEÇÃO 1 — JSON.stringify()
// ============================================================
// JSON.stringify(valor, replacer, space)
//
//   valor    → o objeto/array a ser convertido
//   replacer → filtro (array de chaves ou função) — geralmente null
//   space    → número de espaços para indentação (ex: 2 ou 4)
//
// Retorna: uma STRING com o conteúdo JSON.
// ============================================================

const btnStringify = document.getElementById('btn-stringify');
const saidaStringify = document.getElementById('saida-stringify');
const saidaStringifyFormatado = document.getElementById('saida-stringify-formatado');

btnStringify.addEventListener('click', () => {
    // Lê os valores dos campos do formulário
    const nome = document.getElementById('input-nome').value.trim();
    const idade = Number(document.getElementById('input-idade').value);
    const linguagem = document.getElementById('input-linguagem').value.trim();

    // Monta o objeto JavaScript normal
    const objeto = {
        nome: nome,
        idade: idade,
        linguagem: linguagem,
        ativo: true        // propriedade extra para demonstrar boolean
    };

    // JSON.stringify sem formatação — gera uma linha só (ideal para tráfego de rede)
    const jsonSimples = JSON.stringify(objeto);

    // JSON.stringify com espaçamento — legível por humanos (ideal para debug)
    const jsonFormatado = JSON.stringify(objeto, null, 2);

    // typeof nos ajuda a confirmar: o resultado É uma string, não um objeto!
    saidaStringify.textContent = `${jsonSimples}\n\ntypeof: ${typeof jsonSimples}`;
    saidaStringifyFormatado.textContent = jsonFormatado;

    registrarLog(`stringify → "${nome}" convertido para JSON`);
    console.log('Objeto original:', objeto);
    console.log('String JSON:', jsonSimples);
});


// ============================================================
// SEÇÃO 2 — JSON.parse()
// ============================================================
// JSON.parse(texto)
//
// Converte uma STRING JSON em um OBJETO JavaScript manipulável.
// Se a string for inválida, lança um SyntaxError — por isso
// sempre use try/catch ao fazer parse de dados externos.
// ============================================================

const btnParse = document.getElementById('btn-parse');
const inputJsonRaw = document.getElementById('input-json-raw');
const saidaParse = document.getElementById('saida-parse');

btnParse.addEventListener('click', () => {
    const textoJson = inputJsonRaw.value.trim();

    try {
        // Tentamos converter a string para objeto
        const objeto = JSON.parse(textoJson);

        // Object.entries() retorna um array de pares [chave, valor]
        // — útil para percorrer todas as propriedades dinamicamente
        const linhas = Object.entries(objeto).map(([chave, valor]) => {
            // typeof informa o tipo de cada valor após o parse
            return `${chave}: ${valor}  (typeof: ${typeof valor})`;
        });

        saidaParse.textContent = linhas.join('\n');
        saidaParse.classList.remove('erro');
        saidaParse.classList.add('sucesso');

        registrarLog(`parse → objeto com ${Object.keys(objeto).length} propriedade(s)`);
        console.log('Objeto parseado:', objeto);

    } catch (erro) {
        // SyntaxError é lançado quando o JSON é malformado
        saidaParse.textContent = `ERRO: ${erro.message}\n\nVerifique:\n- Aspas duplas nas chaves e strings\n- Sem vírgula no último item\n- Sem comentários`;
        saidaParse.classList.remove('sucesso');
        saidaParse.classList.add('erro');

        registrarLog(`parse FALHOU → ${erro.message}`);
    }
});


// ============================================================
// SEÇÃO 3 — JSON com Arrays
// ============================================================
// Arrays são totalmente suportados em JSON.
// Formato típico de resposta de API: [ { ... }, { ... }, ... ]
// ============================================================

const inputArrayNome = document.getElementById('input-array-nome');
const inputArrayPreco = document.getElementById('input-array-preco');
const saidaArrayVisual = document.getElementById('saida-array-visual');
const saidaArrayJson = document.getElementById('saida-array-json');

// Array que acumulará os objetos adicionados pelo usuário
let listaItens = [];

// Função auxiliar: atualiza os dois elementos de saída sempre que o array mudar
function atualizarExibicaoArray() {
    if (listaItens.length === 0) {
        saidaArrayVisual.textContent = '[ ]';
        saidaArrayJson.textContent = '[ ]';
        return;
    }

    // Exibição visual com JSON formatado (indentação de 2 espaços)
    saidaArrayVisual.textContent = JSON.stringify(listaItens, null, 2);

    // Exibição compacta numa única linha (simula dado enviado pela rede)
    saidaArrayJson.textContent = JSON.stringify(listaItens);
}

document.getElementById('btn-add-item').addEventListener('click', () => {
    const nome = inputArrayNome.value.trim();
    const preco = parseFloat(inputArrayPreco.value);

    if (!nome || isNaN(preco)) {
        registrarLog('Array → preencha nome e preço antes de adicionar');
        return;
    }

    // Cria um novo objeto e empurra para o array
    const novoItem = { nome: nome, preco: preco };
    listaItens.push(novoItem);

    // Limpa os inputs após adicionar
    inputArrayNome.value = '';
    inputArrayPreco.value = '';

    atualizarExibicaoArray();
    registrarLog(`Array → item "${nome}" adicionado (total: ${listaItens.length})`);
    console.log('Array atual:', listaItens);
});

document.getElementById('btn-limpar-array').addEventListener('click', () => {
    listaItens = [];
    atualizarExibicaoArray();
    registrarLog('Array → lista limpa');
});


// ============================================================
// SEÇÃO 4 — JSON + localStorage
// ============================================================
// O localStorage armazena SOMENTE strings.
// Fluxo obrigatório:
//   SALVAR → JSON.stringify(objeto)  → localStorage.setItem(chave, string)
//   LER    → localStorage.getItem(chave) → JSON.parse(string) → objeto
// ============================================================

const saidaLocalStorage = document.getElementById('saida-localstorage');

document.getElementById('btn-ls-salvar').addEventListener('click', () => {
    const chave = document.getElementById('input-ls-chave').value.trim();
    const valorTexto = document.getElementById('input-ls-valor').value.trim();

    if (!chave) {
        registrarLog('localStorage → informe uma chave');
        return;
    }

    // Montamos um objeto com metadados (valor + timestamp)
    const dadosSalvar = {
        valor: valorTexto,
        salvoEm: new Date().toLocaleString('pt-BR')
    };

    // JSON.stringify converte o objeto para string antes de salvar
    localStorage.setItem(chave, JSON.stringify(dadosSalvar));

    saidaLocalStorage.textContent = `Salvo!\nChave: "${chave}"\nJSON: ${JSON.stringify(dadosSalvar)}`;
    saidaLocalStorage.classList.remove('erro');
    saidaLocalStorage.classList.add('sucesso');

    registrarLog(`localStorage → "${chave}" salvo com JSON.stringify`);
});

document.getElementById('btn-ls-ler').addEventListener('click', () => {
    const chave = document.getElementById('input-ls-chave').value.trim();

    // getItem retorna null se a chave não existir
    const stringArmazenada = localStorage.getItem(chave);

    if (stringArmazenada === null) {
        saidaLocalStorage.textContent = `Chave "${chave}" não encontrada no localStorage.`;
        saidaLocalStorage.classList.add('erro');
        saidaLocalStorage.classList.remove('sucesso');
        registrarLog(`localStorage → chave "${chave}" não existe`);
        return;
    }

    // JSON.parse transforma a string de volta em objeto JavaScript
    const objetoRecuperado = JSON.parse(stringArmazenada);

    saidaLocalStorage.textContent =
        `String bruta: ${stringArmazenada}\n\nApós JSON.parse:\n` +
        Object.entries(objetoRecuperado)
            .map(([k, v]) => `  ${k}: ${v}`)
            .join('\n');

    saidaLocalStorage.classList.remove('erro');
    saidaLocalStorage.classList.add('sucesso');

    registrarLog(`localStorage → "${chave}" lido com JSON.parse`);
    console.log('Objeto recuperado:', objetoRecuperado);
});

document.getElementById('btn-ls-remover').addEventListener('click', () => {
    const chave = document.getElementById('input-ls-chave').value.trim();
    localStorage.removeItem(chave);

    saidaLocalStorage.textContent = `Chave "${chave}" removida do localStorage.`;
    saidaLocalStorage.classList.remove('sucesso', 'erro');

    registrarLog(`localStorage → chave "${chave}" removida`);
});


// ============================================================
// SEÇÃO 5 — JSON Aninhado (Nested JSON)
// ============================================================
// JSON pode ter objetos dentro de objetos (profundidade ilimitada).
// Para acessar dados aninhados encadeamos a notação de ponto:
//   pessoa.endereco.cidade   →  terceiro nível
//   pessoa.habilidades[0]    →  array dentro do objeto
// ============================================================

// Variável que guardará o objeto parseado do JSON aninhado
let pessoaAninhada = null;

// JSON aninhado de exemplo (armazenado como string — simula dado vindo de uma API)
const jsonAninhadoExemplo = `{
  "nome": "Lucas",
  "idade": 25,
  "endereco": {
    "rua": "Av. Brasil",
    "numero": 100,
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "habilidades": ["JavaScript", "Python", "SQL"],
  "emprego": {
    "empresa": "TechCorp",
    "cargo": "Dev Frontend",
    "salario": 7500
  }
}`;

document.getElementById('btn-carregar-aninhado').addEventListener('click', () => {
    // Simula o recebimento de JSON de uma API e faz o parse
    pessoaAninhada = JSON.parse(jsonAninhadoExemplo);

    document.getElementById('saida-json-aninhado').textContent = jsonAninhadoExemplo;
    document.getElementById('saida-acesso-aninhado').textContent = 'JSON carregado! Clique nos botões de acesso.';

    registrarLog('JSON aninhado carregado e parseado');
    console.log('Objeto aninhado:', pessoaAninhada);
});

document.getElementById('btn-acessar-nivel1').addEventListener('click', () => {
    if (!pessoaAninhada) {
        registrarLog('Aninhado → carregue o JSON primeiro');
        return;
    }
    // Acesso de primeiro nível — propriedade direta do objeto
    const valor = pessoaAninhada.nome;
    document.getElementById('saida-acesso-aninhado').textContent =
        `pessoa.nome → "${valor}"  (typeof: ${typeof valor})`;
    registrarLog(`Aninhado → pessoa.nome = "${valor}"`);
});

document.getElementById('btn-acessar-nivel2').addEventListener('click', () => {
    if (!pessoaAninhada) {
        registrarLog('Aninhado → carregue o JSON primeiro');
        return;
    }
    // Acesso de segundo nível — objeto dentro de objeto
    const valor = pessoaAninhada.endereco.cidade;
    document.getElementById('saida-acesso-aninhado').textContent =
        `pessoa.endereco.cidade → "${valor}"  (typeof: ${typeof valor})`;
    registrarLog(`Aninhado → pessoa.endereco.cidade = "${valor}"`);
});

document.getElementById('btn-acessar-array').addEventListener('click', () => {
    if (!pessoaAninhada) {
        registrarLog('Aninhado → carregue o JSON primeiro');
        return;
    }
    // Acesso a um array aninhado — usa índice numérico entre colchetes
    const valor = pessoaAninhada.habilidades[0];
    document.getElementById('saida-acesso-aninhado').textContent =
        `pessoa.habilidades[0] → "${valor}"  (array completo: ${JSON.stringify(pessoaAninhada.habilidades)})`;
    registrarLog(`Aninhado → habilidades[0] = "${valor}"`);
});


// ============================================================
// SEÇÃO 6 — Deep Clone com JSON
// ============================================================
// Problema: ao copiar um objeto por atribuição (b = a), ambas as
// variáveis apontam para o MESMO objeto na memória.
// Qualquer alteração em b reflete em a — isso se chama cópia rasa.
//
// Solução popular: JSON.parse(JSON.stringify(objeto))
//   1. stringify converte para string (quebra a referência)
//   2. parse cria um objeto NOVO na memória
//
// Limitação: perde funções, undefined, Date (vira string), etc.
// Para casos mais complexos, use structuredClone() (API moderna).
// ============================================================

document.getElementById('btn-clonar').addEventListener('click', () => {
    const original = {
        nome: 'Maria',
        config: {
            tema: 'escuro',
            idioma: 'pt-BR'
        }
    };

    // CÓPIA RASA — errada para objetos aninhados
    // const copiaRasa = original;  ← modificar copiaRasa.config altera original.config!

    // DEEP CLONE via JSON — cria objeto completamente independente
    const clone = JSON.parse(JSON.stringify(original));

    // Modificamos o clone — o original NÃO deve ser afetado
    clone.nome = 'Maria (clone modificado)';
    clone.config.tema = 'claro';

    document.getElementById('saida-original').textContent =
        JSON.stringify(original, null, 2);

    document.getElementById('saida-clone').textContent =
        JSON.stringify(clone, null, 2);

    registrarLog('Deep clone → original preservado, clone modificado');
    console.log('Original:', original);
    console.log('Clone:', clone);
});


// ============================================================
// LIMPAR LOG
// ============================================================
document.getElementById('btn-limpar-log').addEventListener('click', () => {
    listaLog.innerHTML = '';
});


// ============================================================
// INICIALIZAÇÃO — exibe mensagem de boas-vindas no log
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    registrarLog('Página pronta — explore as seções de JSON!');
    console.log('Aula 21 — JSON carregado.');
});
