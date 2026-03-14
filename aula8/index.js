// ============================================
// AULA 8 - Escopo Global e Local
// Tema: Visibilidade de variáveis — onde elas podem ser acessadas
// ============================================

// Variável no ESCOPO GLOBAL — acessível em qualquer lugar do código.
const todoMundoVe = 'Todo mundo vê isso aqui'


// Esta função acessa a variável global sem problemas.
// Funções podem "enxergar" tudo que está no escopo acima delas.
function executaEscopoGlobal() {
    console.log(todoMundoVe)

}

// Esta função cria uma variável no ESCOPO LOCAL.
// 'visivelComEscopoLocal' só existe dentro desta função.
function executaEscopoLocal() {
    const visivelComEscopoLocal = 'Só quem está dentro do bloco vê essa'
    console.log(visivelComEscopoLocal);

    // Função aninhada — ela tem acesso ao escopo da função pai.
    // Isso se chama "scope chain" (cadeia de escopos):
    // a função interna procura a variável no próprio escopo,
    // depois sobe para o escopo pai, e assim por diante até o global.
    function chamaDentroDoEscopoLocal() {
        console.log('ndentro do escopo ==>', visivelComEscopoLocal)
        const dentroDoLocal = false;


    }
}

executaEscopoGlobal()

executaEscopoLocal()

// ERRO! Esta linha vai gerar um ReferenceError.
// 'visivelComEscopoLocal' foi declarada dentro de executaEscopoLocal(),
// então ela não existe fora daquela função.
// Isso demonstra na prática a diferença entre escopo global e local.
console.log(visivelComEscopoLocal)
