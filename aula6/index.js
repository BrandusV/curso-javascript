// ============================================
// AULA 6 - Funções de Ordem Superior e Funções Aninhadas
// Tema: Funções chamando outras funções e funções como argumento
// ============================================

// Função simples que exibe uma mensagem.
function chamaPrimeiro() {
    console.log('Chama essa primeiro')
}

// Função que chama outra função internamente.
// Isso demonstra composição: chamaDepois() depende de chamaPrimeiro().
// A ordem de execução será: 'entrou na segunda função' e depois 'Chama essa primeiro'.
function chamaDepois() {
    console.log('entrou na seunda função')
    chamaPrimeiro();
}


chamaDepois()

// Função de ordem superior (higher-order function):
// recebe uma função como parâmetro.
// Em JavaScript, funções são "cidadãos de primeira classe" —
// podem ser passadas como argumento, retornadas, armazenadas em variáveis.
//
// Observação: falta o "()" após 'primeiraFuncao' para executá-la.
// O correto seria: primeiraFuncao() — com os parênteses de invocação.
function recebePrimeira(primeiraFuncao) {
    primeiraFuncao
}


// Aqui passamos a referência da função chamaPrimeiro (sem parênteses).
// Passar com () executaria imediatamente; sem () passa apenas a referência.
recebePrimeira(chamaPrimeiro);
