const meusDados = {
    nome: 'Victor',
    sobrenome: 'Brandão',
    moraNoBrasil: true,
    idade: 28,
    pegaDocumento: () => {
        console.log('CPF: 12345670000')
    }

};

// verificando se o objeto possui determinado valor
function objetoPossuiValor(valorDaChave) {
    const valoresDoObjeto = Object.values(meusDados)
    return valoresDoObjeto.includes(valorDaChave)
}

console.log(objetoPossuiValor('Victor'))
console.log(objetoPossuiValor(29))
console.log(objetoPossuiValor('Brandão'))

function objetoPossuiChave(nomeDaChave) {
    const valoresDoObjeto = Object.keys(meusDados);
    console.log(valoresDoObjeto);
    //return valoresDoObjeto.includes(nomeDaChave)
}

objetoPossuiChave();

meusDados.pegaDocumento();
