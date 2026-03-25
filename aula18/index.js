// Usando o GetElement

// Seleciona pelo nome da tag
const elementoPorTag = document.getElementsByTagName('header');
console.log(elementoPorTag);

// Seleciona pelo id
const elementoPorId = document.getElementById('título-principal');
console.log(elementoPorId.innerText);

// Seleciona pela classe
const elementoPorClasse = document.getElementsByClassName('paragrafo');
console.log(elementoPorClasse[1].innerText);

// Seleciona pelo atributo name
const elementoPorNome = document.getElementsByName('meu-botao');
console.log(elementoPorNome[0].innerText);

// Funções para verificar se existe elemento por tipo
const verificaSeExisteTag = (nome) => document.getElementsByTagName(nome).length > 0;
const verificaSeExisteID = (nome) => !!document.getElementById(nome);
const verificaSeExisteClasse = (nome) => document.getElementsByClassName(nome).length > 0;
const verificaSeExisteNome = (nome) => document.getElementsByName(nome).length > 0;

console.log(verificaSeExisteTag('main'));
console.log(verificaSeExisteID('meu-botao'));
console.log(verificaSeExisteClasse('paragrafo'));
console.log(verificaSeExisteNome('meu-botao'));

// Lista de identificadores para verificar o tipo de cada um
const listaDeElementos = ['header', 'meu-botao', 'título-principal', 'paragrafo'];

if (listaDeElementos.length === 0) {
    console.log('Você não passou uma lista de elementos');
} else {
    for (let nome of listaDeElementos) {
        if (verificaSeExisteTag(nome)) {
            console.log(`${nome} é uma tag`);
        } else if (verificaSeExisteID(nome)) {
            console.log(`${nome} é um id`);
        } else if (verificaSeExisteClasse(nome)) {
            console.log(`${nome} é uma classe`);
        } else if (verificaSeExisteNome(nome)) {
            console.log(`${nome} é um atributo name`);
        } else {
            console.log(`${nome} não foi encontrado`);
        }
    }
}
