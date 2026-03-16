const meusDados = {
    nome: 'Victor',
    sobrenome: 'Brandão',
    moraNoBrasil: true,
    idade: 28

}

console.log(meusDados);
console.log(meusDados.idade)
console.log(meusDados['nome']);


function retornoDadoPessoa(dadoPessoal) {
    return meusDados[dadoPessoal];
}

console.log(retornoDadoPessoa('nome'))
console.log(retornoDadoPessoa('sobrenome'))
console.log(retornoDadoPessoa('idade'))

