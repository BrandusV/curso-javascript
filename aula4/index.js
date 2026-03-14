// ============================================
// AULA 4 - Funções e Arrow Functions
// Tema: Declaração de funções tradicionais vs arrow functions
// ============================================

// Declaração de variável com let — permite reatribuição.
let meuNome = 'Victor';

console.log(meuNome)

// Reatribuindo a variável meuNome.
meuNome = "Pedro";
console.log(meuNome);

// Função tradicional (function declaration).
// Observação importante: a variável 'meuNome' dentro da função
// é LOCAL — ela não altera a variável global de mesmo nome.
// Isso se chama "shadowing" (sombreamento de variável).
function exibeNome() {
    let meuNome = 'Maria';
    console.log(meuNome);


}

// Ao chamar exibeNome(), o console exibe 'Maria' (escopo local),
// mas a variável global 'meuNome' continua sendo 'Pedro'.
exibeNome()


// Arrow Function — sintaxe moderna introduzida no ES6.
// Usa a notação () => {} em vez da palavra-chave 'function'.
// Arrow functions são especialmente úteis para funções curtas e callbacks.
const minhaPrimeiraArrowFunction = () => {
    console.log('executei arrow function');

};

// Outra arrow function demonstrando escopo local.
// Mesma lógica do shadowing: o 'meuNome' aqui é diferente do global.
const exibeNomeArrow = () => {
    let meuNome = 'Victor arrow function';
    console.log(meuNome);


}

minhaPrimeiraArrowFunction();
