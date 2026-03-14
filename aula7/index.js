// ============================================
// AULA 7 - Retorno de Funções (return)
// Tema: Usando return para devolver valores de funções
// ============================================

// Função que retorna um valor usando a palavra-chave 'return'.
// Observação: o valor retornado é a string '2024', não um número.
// Para retornar um número, seria: return 2024 (sem aspas).
function retornaNumero() {
    return '2024';
}


const meuPrimeiroNome = 'Victor';


// Chamada sem usar o retorno — o valor é descartado.
// A função executa, retorna '2024', mas ninguém captura esse valor.
retornaNumero()

// Aqui o retorno é utilizado: retornaNumero() é avaliado dentro do console.log.
// O resultado será: "Victor 2024"
// Isso mostra que funções com return podem ser usadas como expressões.
console.log(meuPrimeiroNome, retornaNumero())
