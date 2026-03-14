// ============================================
// AULA 9 - Estruturas Condicionais
// Tema: if/else, else if, switch e operador ternário
// ============================================

// --- IF / ELSE SIMPLES ---
// Verifica se é dia ou noite com base na hora.
// Observação: quando chamada sem argumento, 'hora' será undefined,
// e a condição (undefined <= 18) é false, então retorna 'É de noite'.
function eDediaOudeNoite(hora) {
    let periodo = '';
    if (hora <= 18)
        periodo = 'É de dia';
    else
        periodo = 'É de noite';
    return periodo;

}

console.log(eDediaOudeNoite());    // undefined <= 18 é false → 'É de noite'
console.log(eDediaOudeNoite(13));  // 13 <= 18 é true → 'É de dia'
console.log(eDediaOudeNoite(21));  // 21 <= 18 é false → 'É de noite'


// Outro exemplo de if/else — verificação de maioridade.
function eMaiorDeIdade(idade) {
    if (idade < 18)
        console.log('Menor de idade')
    else
        console.log('Maior de idade')

}

eMaiorDeIdade()




// --- ELSE IF (múltiplas condições) ---
// Classifica o período do dia em três faixas.
// Usa o operador lógico && (AND) para definir intervalos.
function periodoDoDia(hora) {
    if (hora < 12)
        console.log('Manhã');
    else if (hora >= 12 && hora <= 18)
        console.log('Tarde');
    else
        console.log('Noite');
}

periodoDoDia(2);    // Manhã
periodoDoDia(14);   // Tarde
periodoDoDia(20);   // Noite
periodoDoDia(-30)   // Manhã (valor inválido — sem validação aqui)

// Função com validação: rejeita horas fora do intervalo 0-24.
// Demonstra como compor funções — periodoComRegra chama periodoDoDia internamente.
function periodoComRegra(hora) {
    if (hora >= 0 && hora <= 24)
        periodoDoDia(hora);
    else
        console.log('você passou uma hora inexistente')

}

periodoComRegra(3);


// --- SWITCH ---
// Alternativa ao if/else quando temos múltiplos valores específicos.
// Importante: switch usa comparação estrita (===), então '2' !== 2.
// O 'break' evita o "fall-through" (executar os cases seguintes).
// O 'default' é executado quando nenhum case corresponde.
function menuEscolha(opçaoDoMenu) {
    switch (opçaoDoMenu) {
        case 1:
            console.log('você escolheu a primeira opção');
            break;
        case 2:
            console.log('Você escolheu a segunda opção');
            break;
        default:
            console.log('Você não escolheu uma das opções válidas');

    }

}

menuEscolha(1)     // case 1
menuEscolha(2)     // case 2
menuEscolha('2')   // default! — '2' (string) !== 2 (number) por causa do ===
menuEscolha(90)    // default
console.log('------------------------------');



// --- OPERADOR TERNÁRIO ---
// Sintaxe compacta para if/else: condição ? valorSeTrue : valorSeFalse
// Ideal para atribuições simples baseadas em uma condição.
function maiorDeIdadeSimples(idade) {
    let condiçaoIdade = idade >= 18 ? 'Maior de idade' : 'Menor de idade'
    return condiçaoIdade
}

console.log(maiorDeIdadeSimples(18));  // Maior de idade
console.log(maiorDeIdadeSimples(3));   // Menor de idade



// --- SHORT-CIRCUIT com && ---
// O operador && retorna o primeiro valor falsy ou o último valor truthy.
// Se idade >= 18 for true, retorna 'Maior de idade'.
// Se idade >= 18 for false, retorna false (o resultado da comparação).
// Observação: essa técnica não cobre o caso "menor de idade".
function maiorDeidadeUnario(idade) {
    return idade >= 18 && 'Maior de idade'

}
