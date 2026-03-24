// querySelector: seleciona o PRIMEIRO elemento que corresponde ao seletor CSS informado
// Retorna o elemento DOM ou null se não encontrar
const header = document.querySelector('header');
console.log(header)

// Função que verifica se um elemento existe no DOM pelo seletor informado
// Exibe um alert informando se o elemento existe ou não, e retorna true/false
const verificaSeExisteElemento = (seletor) => {
    const elemento = document.querySelector(seletor)
    if (elemento) {
        alert(`O elemento ${seletor} existe`);
        return true;
    } else {
        alert(`O elemento ${seletor} não existe`)
        return false;
    }
}

verificaSeExisteElemento('header')

// querySelectorAll: seleciona TODOS os elementos que correspondem ao seletor CSS informado
// Retorna uma NodeList (similar a um array) com todos os elementos encontrados
const todosOsParagrafos = document.querySelectorAll('p')

console.log(todosOsParagrafos)

// Função que conta quantos elementos existem no DOM para um seletor informado
// Usa verificaSeExisteElemento para checar antes de buscar todos os elementos
const contaElementosPorSeletor = (seletor) => {
    if (verificaSeExisteElemento(seletor)) {
        const todosOsParagrafos = document.querySelectorAll(seletor)
        console.log(`Existem ${todosOsParagrafos.length} elementos com o seletor`)
    } else {
        console.log(`Nao existem os elementos com o seletor ${seletor}`)
    }
}

// Testa com um seletor válido (li com class menu-item) e um inválido (li.menu-items)
contaElementosPorSeletor('li.menu-item')
contaElementosPorSeletor('li.menu-items')

// Acessando um elemento específico da NodeList pelo índice
// O índice [1] retorna o segundo elemento <li> encontrado (índice começa em 0)
const elementoEspecifico = document.querySelectorAll('li')[1]
console.log(elementoEspecifico)
