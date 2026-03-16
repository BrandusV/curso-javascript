// Exercício 3 - Sistema de Gerenciamento de Estoque de uma Livraria

// Array que armazena os livros do estoque, cada livro é um objeto com titulo, autor e quantidade
const estoque = [
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', quantidade: 5 },
    { titulo: 'O Alquimista', autor: 'Paulo Coelho', quantidade: 3 },
    { titulo: 'Grande Sertão: Veredas', autor: 'Guimarães Rosa', quantidade: 2 }
];

// Função que adiciona um novo livro ao estoque
function adicionarLivro(titulo, autor, quantidade) {
    // Percorre o array de estoque para verificar se o livro já existe
    for (let i = 0; i < estoque.length; i++) {
        // Se encontrar um livro com o mesmo título, não adiciona e avisa o usuário
        if (estoque[i].titulo === titulo) {
            console.log('O livro "' + titulo + '" já existe no estoque.');
            return; // Encerra a função sem adicionar
        }
    }

    // Cria um objeto representando o novo livro com as propriedades titulo, autor e quantidade
    const novoLivro = {
        titulo: titulo,
        autor: autor,
        quantidade: quantidade
    };

    // Adiciona o novo livro ao final do array de estoque
    estoque.push(novoLivro);

    // Exibe mensagem confirmando a adição do livro
    console.log('Livro "' + titulo + '" adicionado com sucesso!');
}

// Função que remove um livro do estoque pelo título
function removerLivro(titulo) {
    // Percorre o array de estoque para encontrar o livro pelo título
    for (let i = 0; i < estoque.length; i++) {
        // Se o título do livro na posição atual for igual ao título buscado
        if (estoque[i].titulo === titulo) {
            // Remove o livro do array usando splice (remove 1 elemento na posição i)
            estoque.splice(i, 1);
            // Exibe mensagem confirmando a remoção
            console.log('Livro "' + titulo + '" removido do estoque.');
            return; // Encerra a função após remover
        }
    }

    // Se o laço terminar sem encontrar o livro, exibe mensagem de erro
    console.log('Livro "' + titulo + '" não foi encontrado no estoque.');
}

// Função que atualiza a quantidade de um livro no estoque
function atualizarQuantidade(titulo, novaQuantidade) {
    // Percorre o array de estoque procurando o livro pelo título
    for (let i = 0; i < estoque.length; i++) {
        // Se encontrar o livro com o título correspondente
        if (estoque[i].titulo === titulo) {
            // Atualiza a propriedade quantidade do livro com o novo valor
            estoque[i].quantidade = novaQuantidade;
            // Exibe mensagem confirmando a atualização
            console.log('Quantidade do livro "' + titulo + '" atualizada para ' + novaQuantidade + '.');
            return; // Encerra a função após atualizar
        }
    }

    // Se o laço terminar sem encontrar o livro, exibe mensagem de erro
    console.log('Livro "' + titulo + '" não foi encontrado no estoque.');
}

// Função que lista todos os livros disponíveis no estoque
function listarLivros() {
    // Verifica se o estoque está vazio
    if (estoque.length === 0) {
        console.log('O estoque está vazio.');
        return; // Encerra a função se não houver livros
    }

    // Exibe o cabeçalho da listagem
    console.log('===== LIVROS NO ESTOQUE =====');

    // Percorre o array de estoque e exibe as informações de cada livro
    for (let i = 0; i < estoque.length; i++) {
        // Exibe o número do livro, título, autor e quantidade formatados
        console.log(
            (i + 1) + '. ' +
            'Título: ' + estoque[i].titulo + ' | ' +
            'Autor: ' + estoque[i].autor + ' | ' +
            'Quantidade: ' + estoque[i].quantidade
        );
    }

    // Exibe o total de livros diferentes no estoque
    console.log('=============================');
    console.log('Total de títulos no estoque: ' + estoque.length);
}

// ===== TESTANDO O SISTEMA =====

// Lista os livros iniciais do estoque
console.log('--- Listagem inicial ---');
listarLivros();

// Adiciona um novo livro ao estoque
console.log('\n--- Adicionando livro ---');
adicionarLivro('Memórias Póstumas de Brás Cubas', 'Machado de Assis', 4);

// Tenta adicionar um livro que já existe para testar a verificação
console.log('\n--- Tentando adicionar livro duplicado ---');
adicionarLivro('Dom Casmurro', 'Machado de Assis', 10);

// Lista os livros após a adição
console.log('\n--- Listagem após adição ---');
listarLivros();

// Atualiza a quantidade de um livro existente
console.log('\n--- Atualizando quantidade ---');
atualizarQuantidade('O Alquimista', 8);

// Tenta atualizar um livro que não existe
console.log('\n--- Tentando atualizar livro inexistente ---');
atualizarQuantidade('Harry Potter', 5);

// Remove um livro do estoque
console.log('\n--- Removendo livro ---');
removerLivro('Grande Sertão: Veredas');

// Tenta remover um livro que não existe
console.log('\n--- Tentando remover livro inexistente ---');
removerLivro('O Cortiço');

// Lista os livros após todas as operações
console.log('\n--- Listagem final ---');
listarLivros();
