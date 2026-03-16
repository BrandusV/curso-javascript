const cores = ['Preto', 'Branco']
console.log(cores)
console.log(cores[0])
console.log(cores[1])
console.log('Quantidade de cores', cores.length)
console.log(cores.indexOf('Preto'))
console.log(cores.indexOf('Branco'))
console.log(cores.indexOf('Vermelho'))
cores.push('Vermelho')
console.log(cores)
cores.push('Azul')
console.log(cores)
cores.shift()
console.log(cores)
cores.pop()

function removeCor(nomeDaCor) {
  const posicaoDaCor = cores.indexOf(nomeDaCor)
  cores.splice(posicaoDaCor, 1)
  console.log(cores)
}

removeCor('Branco')
