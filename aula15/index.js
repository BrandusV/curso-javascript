// Cria um objeto Date com a data e hora atuais do sistema
const dataAtual = new Date();

// Exibe o objeto Date completo com data e hora no formato local
console.log(dataAtual)

// Retorna o dia do mês (1-31)
console.log(dataAtual.getDate())

// Retorna o mês (0-11), somando +1 para exibir o valor real (1-12)
console.log(dataAtual.getMonth() + 1)

// Retorna o ano com quatro dígitos (ex: 2025)
console.log(dataAtual.getFullYear())

// Retorna a hora atual (0-23)
console.log(dataAtual.getHours())

// Retorna os minutos (0-59)
console.log(dataAtual.getMinutes())
console.log(dataAtual.getMinutes())

// Retorna os segundos (0-59)
console.log(dataAtual.getSeconds())

// Converte a data para uma string no formato UTC (ex: "Wed, 01 Jan 2025 00:00:00 GMT")
console.log(dataAtual.toUTCString())

// Converte a data para o formato ISO 8601 (ex: "2025-01-01T00:00:00.000Z")
console.log(dataAtual.toISOString())
