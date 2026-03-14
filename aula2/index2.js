// ============================================
// AULAS 2 e 3 - Variáveis e Tipos de Dados
// Tema: Os tipos primitivos do JavaScript
// ============================================

// String — texto entre aspas simples, duplas ou crases.
const meuNome = 'Fabi';

// Number — valores numéricos (inteiros ou decimais).
// JavaScript não diferencia int de float como outras linguagens.
const anoAtual = 2026;

// Boolean — verdadeiro ou falso (true/false).
// Muito usado em condições e lógica de controle.
const estaEstudando = true;

// null — representa a ausência intencional de valor.
// Diferente de undefined: null é atribuído de propósito.
let qtdFilhos = null;

// undefined — variável declarada mas sem valor atribuído.
// O JavaScript atribui undefined automaticamente quando não há inicialização,
// mas aqui foi atribuído explicitamente para fins de demonstração.
let profissao = undefined;

// Exibindo todos os valores e seus tipos no console.
// Observação: console.log aceita múltiplos argumentos separados por vírgula.
console.log(meuNome, anoAtual, estaEstudando, qtdFilhos, profissao);
