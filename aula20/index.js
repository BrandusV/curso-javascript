// ============================================================
// AULA 20 — EVENTOS NO JAVASCRIPT
// ============================================================
// Evento = algo que acontece no navegador que o JS pode "escutar":
//   clique, digitação, envio de formulário, movimento do mouse, etc.
//
// As três formas de adicionar eventos:
//
//   FORMA 1 — Inline no HTML (evite — mistura HTML com JS)
//   <button onclick="minhaFuncao()">
//   Desvantagem: difícil de manter e impossível de remover via JS.
//
//   FORMA 2 — Propriedade do elemento (legado)
//   elemento.onclick = function() { ... }
//   Desvantagem: permite apenas UM handler por evento.
//
//   FORMA 3 — addEventListener (RECOMENDADA)
//   elemento.addEventListener('nomeDoEvento', funcaoHandler)
//   Vantagens: múltiplos handlers, fácil de remover, mais controle.
// ============================================================


// ============================================================
// UTILITÁRIO — Registra mensagens no painel de log da página
// ============================================================
const listaLog = document.getElementById('lista-log');

function registrarLog(mensagem) {
    const item = document.createElement('li');
    item.textContent = mensagem;
    listaLog.prepend(item); // adiciona sempre no topo
}


// ============================================================
// EVENTOS DE CARREGAMENTO — DOMContentLoaded  vs  load
// ============================================================

// DOMContentLoaded: dispara quando o HTML foi parseado e o DOM está pronto.
// É mais rápido que 'load' porque não aguarda imagens e folhas de estilo.
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded — HTML carregado, DOM pronto.');
    registrarLog('Página carregada (DOMContentLoaded)');
});

// 'load' no window: dispara quando TODO o conteúdo foi carregado
// (HTML + CSS + imagens + scripts externos).
window.addEventListener('load', () => {
    console.log('load — tudo carregado (HTML, CSS, imagens).');
});


// ============================================================
// EVENTOS DE MOUSE
// ============================================================
const btnClick  = document.getElementById('btn-click');
const btnDuplo  = document.getElementById('btn-duplo');
const areaMouse = document.getElementById('area-mouse');

// ------- click -------
// Dispara quando o botão do mouse é clicado e solto sobre o elemento.
btnClick.addEventListener('click', (e) => {
    // O objeto 'e' (event) carrega informações sobre o evento:
    //   e.target   → elemento que disparou o evento
    //   e.type     → nome do evento ('click', 'keydown', etc.)
    //   e.clientX/Y → posição do mouse na tela
    console.log('click!', 'target:', e.target.id, '| tipo:', e.type);
    registrarLog(`click em: #${e.target.id}`);
});

// ------- mousedown / mouseup -------
// mousedown: botão pressionado; mouseup: botão solto.
// Juntos formam um 'click', mas permitem reações mais precisas.
btnClick.addEventListener('mousedown', () => registrarLog('mousedown'));
btnClick.addEventListener('mouseup',   () => registrarLog('mouseup'));

// ------- dblclick -------
// Dispara ao clicar duas vezes rapidamente no mesmo elemento.
btnDuplo.addEventListener('dblclick', (e) => {
    registrarLog('dblclick detectado!');
    e.target.textContent = 'Clicou duas vezes!';
    setTimeout(() => e.target.textContent = 'Dblclick aqui', 1500);
});

// ------- mouseenter / mouseleave -------
// mouseenter: mouse entrou na área do elemento.
// mouseleave: mouse saiu da área do elemento.
// Diferente de mouseover/mouseout, NÃO propagam para elementos filhos (sem bubbling).
areaMouse.addEventListener('mouseenter', () => {
    areaMouse.style.backgroundColor = '#1b5e20';
    registrarLog('mouseenter — mouse entrou na área');
});

areaMouse.addEventListener('mouseleave', () => {
    areaMouse.style.backgroundColor = '';
    registrarLog('mouseleave — mouse saiu da área');
});

// ------- mouseover / mouseout -------
// Similares a enter/leave, mas PROPAGAM (bubbling) — disparam em filhos também.
// Úteis quando você precisa rastrear entradas em elementos aninhados.
areaMouse.addEventListener('mouseover', () => {
    console.log('mouseover (com bubbling)');
});

// ------- contextmenu -------
// Dispara ao clicar com o botão DIREITO do mouse.
// e.preventDefault() bloqueia o menu nativo do navegador.
areaMouse.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    registrarLog('contextmenu — menu nativo bloqueado!');
});


// ============================================================
// EVENTOS DE TECLADO
// ============================================================
const campoTexto  = document.getElementById('campo-texto');
const saidaTeclado = document.getElementById('saida-teclado');

// ------- keydown -------
// Dispara quando uma tecla é PRESSIONADA (antes de aparecer no campo).
// É o evento certo para reagir a teclas especiais (Enter, Escape, setas).
campoTexto.addEventListener('keydown', (e) => {
    // e.key  → valor legível da tecla: 'a', 'Enter', 'ArrowUp', 'Backspace'
    // e.code → código físico da tecla: 'KeyA', 'Enter' (independe do layout)
    // e.ctrlKey / e.shiftKey / e.altKey → modificadores pressionados
    console.log(`keydown: key="${e.key}" | code="${e.code}"`);

    if (e.key === 'Enter') {
        registrarLog(`Enter pressionado — valor: "${e.target.value}"`);
    }
    if (e.key === 'Escape') {
        e.target.value = '';
        registrarLog('Escape — campo limpo');
    }
});

// ------- keyup -------
// Dispara quando a tecla é SOLTA. Neste ponto o valor já foi atualizado no campo.
campoTexto.addEventListener('keyup', (e) => {
    saidaTeclado.textContent = `Você digitou: "${e.target.value}"`;
});

// ------- input -------
// Dispara a CADA mudança de valor, inclusive via Ctrl+V, arrastar-soltar e autocompletar.
// Preferível ao keyup quando você só quer rastrear o valor atual do campo.
campoTexto.addEventListener('input', (e) => {
    console.log('input event — valor atual:', e.target.value);
});


// ============================================================
// EVENTOS DE FORMULÁRIO
// ============================================================
const formulario  = document.getElementById('meu-formulario');
const campoNome   = document.getElementById('campo-nome');
const campoOpcao  = document.getElementById('campo-opcao');

// ------- focus -------
// Dispara quando o elemento RECEBE foco (clique ou Tab).
campoNome.addEventListener('focus', () => {
    registrarLog('focus — campo nome ativado');
});

// ------- blur -------
// Dispara quando o elemento PERDE foco.
// Ideal para validar o campo após o usuário terminar de digitar.
campoNome.addEventListener('blur', (e) => {
    const valor = e.target.value.trim();
    registrarLog(`blur — nome final: "${valor}"`);
    if (valor.length < 2) {
        campoNome.style.borderColor = '#e53935';
    } else {
        campoNome.style.borderColor = '#43a047';
    }
});

// ------- change -------
// Dispara quando o VALOR é alterado E o elemento perde foco.
// Para <select>, <checkbox> e <radio>, dispara imediatamente ao mudar.
campoOpcao.addEventListener('change', (e) => {
    registrarLog(`change no <select>: "${e.target.value}"`);
});

// ------- submit -------
// Dispara quando o formulário é enviado (botão submit ou Enter num input).
// e.preventDefault() é ESSENCIAL para evitar o recarregamento da página.
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome  = campoNome.value.trim();
    const opcao = campoOpcao.value;
    registrarLog(`submit — nome: "${nome}" | linguagem: "${opcao}"`);
    console.log('Dados do formulário:', { nome, opcao });
});


// ============================================================
// EVENTOS DE JANELA — resize e scroll
// ============================================================
const infoJanela = document.getElementById('info-janela');

// resize: dispara sempre que a janela do navegador é redimensionada.
window.addEventListener('resize', () => {
    const info = `resize — ${window.innerWidth} x ${window.innerHeight} px`;
    infoJanela.textContent = info;
    console.log(info);
});

// scroll: dispara ao rolar a página (pode disparar muitas vezes por segundo).
// Use técnicas de "throttle" em produção para não sobrecarregar.
window.addEventListener('scroll', () => {
    console.log('scroll — posição Y:', window.scrollY);
});


// ============================================================
// DELEGAÇÃO DE EVENTOS (Event Delegation)
// ============================================================
// Problema: adicionar um listener em CADA item da lista é caro em memória
// e não funciona para itens criados dinamicamente.
//
// Solução: um ÚNICO listener no elemento pai (ul).
// Os eventos "sobem" (bubbling) dos filhos até o pai — isso é o Event Bubbling.
// No handler, usamos e.target para saber qual filho foi clicado.

const listaDelegacao = document.getElementById('lista-delegacao');
let contadorItem = 4;

listaDelegacao.addEventListener('click', (e) => {
    // e.target é o elemento real clicado dentro da lista
    if (e.target.tagName === 'LI') {
        registrarLog(`Delegação — clicou em: "${e.target.textContent}"`);
        e.target.style.color = '#eb00b0';
    }
});

// Itens adicionados dinamicamente também são capturados pelo listener do pai!
const btnAdicionar = document.getElementById('btn-adicionar');
btnAdicionar.addEventListener('click', () => {
    const novoItem = document.createElement('li');
    novoItem.textContent = `Item ${contadorItem++}`;
    listaDelegacao.appendChild(novoItem);
    registrarLog('Novo item adicionado — delegação funcionando!');
});


// ============================================================
// removeEventListener — removendo um listener específico
// ============================================================
// Para remover, a função PRECISA ter um nome (não pode ser anônima).

function handlerTemporario() {
    registrarLog('Este handler será removido após o primeiro disparo.');
    areaMouse.removeEventListener('click', handlerTemporario);
}

// Descomente para testar removeEventListener:
// areaMouse.addEventListener('click', handlerTemporario);


// ============================================================
// Opção { once: true } — dispara apenas UMA VEZ e se auto-remove
// ============================================================
// Forma moderna e limpa de ouvir um evento apenas uma vez.
btnDuplo.addEventListener('mouseenter', () => {
    console.log('mouseenter no btn-duplo — só aparece uma vez!');
    registrarLog('{ once: true } — listener auto-removido após 1ª vez');
}, { once: true });


// ============================================================
// Opção { passive: true } — melhora performance em scroll/touch
// ============================================================
// Garante ao navegador que preventDefault() NÃO será chamado,
// permitindo que ele execute o scroll de forma mais suave.
window.addEventListener('scroll', () => {}, { passive: true });


// ============================================================
// stopPropagation — impedindo o bubbling
// ============================================================
// Por padrão, um evento "sobe" (bubbles) por todos os ancestrais.
// e.stopPropagation() interrompe essa subida.
//
// Exemplo comentado:
//   filho.addEventListener('click', (e) => {
//       e.stopPropagation(); // o pai não recebe este clique
//   });


// ============================================================
// LIMPAR LOG
// ============================================================
const btnLimpar = document.getElementById('btn-limpar');
btnLimpar.addEventListener('click', () => {
    listaLog.innerHTML = '';
});
