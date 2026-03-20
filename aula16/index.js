// Função que recebe a quantidade de segundos de atraso e exibe uma mensagem no console
function chamar(segundosDeAtraso) {
    console.log(`Atrasou 15 segundos ${segundosDeAtraso} segundos`)
}

// Função que recebe outra função como argumento (callback) e a executa após um atraso
// setTimeout: adia a execução de uma função por um tempo definido em milissegundos
// A arrow function passa 'quantidadedeAtraso' como argumento e calcula o delay multiplicando por 15000 ms
function chamaAtrasado(funcaoDeAtraso) {
    setTimeout(() => funcaoDeAtraso(quantidadedeAtraso), quantidadedeAtraso * 15000)
}

// setTimeout: atrasar a chamada de uma função.

// Chama a função 'chamaAtrasado' passando 'chamar' como callback e 15 como quantidade de atraso
chamaAtrasado(chamar, 15)

// Função que recebe um callback e um intervalo, e executa o callback repetidamente
// setInterval: executa uma função de forma repetida a cada X milissegundos indefinidamente
// A arrow function chama funcaoDeIntervalo passando o intervalo e convertendo para milissegundos
function chamarComIntervalo(funcaoDeIntervalo, intervalo) {
    setInterval(() => funcaoDeIntervalo(intervalo, intervalo * 1000))
}

// Chama 'chamarComIntervalo' passando 'chamar' como callback e 2 como valor do intervalo
chamarComIntervalo(chamar, 2)
