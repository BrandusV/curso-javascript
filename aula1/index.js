// ============================================
// AULA 1 - Declaração de Variáveis em JavaScript
// Tema: var, let e const — diferenças e reatribuição
// ============================================

// 'var' é a forma mais antiga de declarar variáveis.
// Tem escopo de função (não de bloco) e permite reatribuição.
var myname = 'Victor';
console.log(myname);

// 'let' foi introduzido no ES6 (2015).
// Tem escopo de bloco e também permite reatribuição.
let meuPrimeiroNome = 'Meu primeiro nome é Victor';
console.log(meuPrimeiroNome);


// 'const' também é do ES6. Declara uma constante:
// não permite reatribuição após a inicialização.
const meuSobrenome = 'Brandão';
console.log(meuSobrenome);

// Reatribuindo 'var' — funciona normalmente.
myname = 'Pedro';
console.log(myname)

// Reatribuindo 'let' — também funciona.
meuPrimeiroNome = 'Meu nome é Pedro';
console.log(meuPrimeiroNome)

// Tentando reatribuir 'const' — isso vai gerar um TypeError!
// "Assignment to constant variable."
// Esse é o ponto principal da aula: const não pode ser reatribuída.
meuSobrenome = 'Meu sobrenome é Silva'
console.log(meuSobrenome)

// Outra const declarada corretamente — sem tentativa de reatribuição.
const constComValor = 'valor de const';
console.log(constComValor);
