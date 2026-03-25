// Modificação de Elementos com JavaScript

// --- SELEÇÃO DOS ELEMENTOS ---

// Seleciona pelo nome da tag
const selecionaTag = document.getElementsByTagName('header');
console.log(selecionaTag);

// Seleciona pelo id
const selecionaId = document.getElementById('título-principal');
console.log(selecionaId.innerText);

// Seleciona pela classe
const selecionaClasse = document.getElementsByClassName('paragrafo');
console.log(selecionaClasse[1].innerText);

// Seleciona pelo atributo name
const selecionaNome = document.getElementsByName('meu-botao');
console.log(selecionaNome[0].innerText);

// --- MODIFICAÇÃO DE CONTEÚDO ---

// getElementsByTagName retorna uma HTMLCollection — acessa o elemento pelo índice
const tituloH1 = document.getElementsByTagName('h1');

// innerText altera apenas o texto visível do elemento
tituloH1[0].innerText = 'Título Modificado pelo JavaScript';
console.log(tituloH1[0].classList);

// innerHTML permite inserir HTML dentro do elemento (+=  preserva o conteúdo existente)
const secao = document.getElementById('secao-principal');
secao.innerHTML += '<p class="paragrafo">Parágrafo adicionado via innerHTML</p>';

// --- MODIFICAÇÃO DE CLASSES ---

// classList.add() adiciona uma classe sem remover as existentes
tituloH1[0].classList.add('destaque');
console.log('Após add:', tituloH1[0].classList.value);

// classList.remove() remove uma classe específica
tituloH1[0].classList.remove('principal');
console.log('Após remove:', tituloH1[0].classList.value);

// classList.contains() verifica se uma classe existe no elemento
console.log('Contém "titulo"?', tituloH1[0].classList.contains('titulo'));
console.log('Contém "principal"?', tituloH1[0].classList.contains('principal'));

// classList.toggle() adiciona a classe se não existe, remove se já existe
tituloH1[0].classList.toggle('titulo');
console.log('Após toggle (remove "titulo"):', tituloH1[0].classList.value);
tituloH1[0].classList.toggle('titulo');
console.log('Após toggle (adiciona "titulo"):', tituloH1[0].classList.value);

// --- MODIFICAÇÃO DE ATRIBUTOS ---

// setAttribute() define ou sobrescreve um atributo do elemento
const botao = document.getElementById('meu-botao');
botao.setAttribute('disabled', true);
console.log('Botão desabilitado:', botao.getAttribute('disabled'));

// getAttribute() obtém o valor atual de um atributo
console.log('Id do botão:', botao.getAttribute('id'));

// --- MODIFICAÇÃO DE ESTILO COM ATRASO ---

const atrasaMudancaDeCor = () => {
    setTimeout(() => {
        // classList.add() é a forma correta de adicionar uma classe — sem ponto no nome
        tituloH1[0].classList.add('altera-cor-bg');
        // style.<propriedade> usa camelCase para propriedades CSS compostas
        tituloH1[0].style.fontFamily = 'Arial';
        tituloH1[0].style.fontSize = '80px';
        console.log('Estilo alterado após 3 segundos!');
    }, 3000);
};

atrasaMudancaDeCor();
