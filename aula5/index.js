// ============================================
// AULA 5 - Parâmetros de Funções
// Tema: Passando argumentos para funções
// ============================================

// Funções podem receber dados externos através de parâmetros.
// O parâmetro 'meuNome' age como uma variável local dentro da função,
// cujo valor é definido no momento da chamada.
function meChameDe(meuNome) {
    console.log('Me chame de', meuNome);
}

// Chamando a mesma função com argumentos diferentes.
// Isso demonstra a reutilização: uma única função serve para múltiplos valores.
meChameDe('Victor');
meChameDe('Pedro');

// Observação: se chamarmos meChameDe() sem argumento,
// o parâmetro 'meuNome' receberia 'undefined' automaticamente.
