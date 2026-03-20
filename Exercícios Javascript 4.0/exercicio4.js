// Define a data futura para a contagem regressiva (ano, mês-1, dia, hora, minuto, segundo)
// Mês começa em 0 no JavaScript, por isso dezembro = 11
const dataFutura = new Date(2025, 11, 31, 23, 59, 59);

// Função que calcula o tempo restante entre agora e a data futura
function calcularTempoRestante(dataFutura) {
    // Obtém a data e hora atual em milissegundos
    const agora = new Date();

    // Calcula a diferença em milissegundos entre a data futura e agora
    const diferenca = dataFutura - agora;

    // Se a diferença for zero ou negativa, o tempo acabou
    if (diferenca <= 0) {
        return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    }

    // Converte milissegundos em dias inteiros (1 dia = 86.400.000 ms)
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    // Calcula as horas restantes após remover os dias completos
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // Calcula os minutos restantes após remover as horas completas
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));

    // Calcula os segundos restantes após remover os minutos completos
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    // Retorna um objeto com os valores calculados
    return { dias, horas, minutos, segundos };
}

// Função que exibe o tempo restante atualizado no console
function atualizarTemporizador() {
    // Chama a função de cálculo passando a data futura definida no início
    const tempo = calcularTempoRestante(dataFutura);

    // Verifica se o tempo chegou a zero em todas as unidades
    if (tempo.dias === 0 && tempo.horas === 0 && tempo.minutos === 0 && tempo.segundos === 0) {
        // Exibe mensagem de encerramento no console
        console.log('O tempo acabou!');

        // Para a execução do setInterval ao atingir o prazo
        clearInterval(intervalo);
        return;
    }

    // Exibe o temporizador formatado no console com os valores atuais
    console.log(
        `Tempo restante: ${tempo.dias} dia(s), ${tempo.horas} hora(s), ${tempo.minutos} minuto(s), ${tempo.segundos} segundo(s)`
    );
}

// Executa atualizarTemporizador imediatamente antes do primeiro intervalo completar
atualizarTemporizador();

// Armazena a referência do intervalo para poder cancelá-lo quando o tempo acabar
// Chama a função atualizarTemporizador a cada 1000 milissegundos (1 segundo)
const intervalo = setInterval(atualizarTemporizador, 1000);
