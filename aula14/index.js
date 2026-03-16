const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34];

function iteraSobreoArray() {
    for (let i = 0; i < fibonacci.length; i++) {
        console.log(i + 1, 'o item', fibonacci[i]);

    }

}

iteraSobreoArray();
console.log('---------------------');

function contaAte(numero) {
    for (let conta = 1; conta <= numero; conta++) {
        console.log('Mariana conta', conta);
    }

}

contaAte(10);
contaAte(158);

// Exemplo com while - conta de 1 até 5
let contador = 1;
while (contador <= 5) {
    console.log('While conta:', contador);
    contador++;
}

console.log('---------------------');

// Exemplo com do...while - executa pelo menos uma vez, mesmo se a condição for falsa
let numero = 1;
do {
    console.log('Do...while conta:', numero);
    numero++;
} while (numero <= 5);

console.log('---------------------');

// Diferença: do...while executa pelo menos uma vez
let valor = 10;
do {
    console.log('Isso aparece mesmo com a condição falsa! Valor:', valor);
} while (valor < 5);
