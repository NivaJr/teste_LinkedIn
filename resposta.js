// Pega todos os itens processados e limpos do nó anterior
const items = $input.all();

// --- 1. Define o Título do Relatório ---
// Pega o nome da vaga do primeiro item para usar no título geral
let nomeVagaTitulo = "Vaga Geral";
if (items.length > 0 && items[0].json.nome_vaga) {
    nomeVagaTitulo = items[0].json.nome_vaga;
}

// Inicia o texto com um cabeçalho
let texto = `### 📋 Relatório de Candidatos: ${nomeVagaTitulo}\n\n`;

// --- 2. Loop para montar a lista ---
for (const item of items) {
    const c = item.json;

    // Definição de emojis baseada na nota (Visual Score)
    const nota = c.nota_match || 0;
    let statusEmoji = "🔴"; // Baixo
    if (nota >= 80) statusEmoji = "🟢"; // Alto
    else if (nota >= 50) statusEmoji = "🟡"; // Médio

    // Variáveis finais (usando as chaves certas do nó anterior)
    const nome = c.nome_candidato || "Nome não identificado";
    const local = c.localizacao || "Local não informado";
    const link = c.link_perfil || "#";
    
    // --- Montagem do Bloco Visual ---
    texto += `**👤 ${nome}**\n`;
    texto += `📊 **Match:** ${nota}/100 ${statusEmoji}\n`;
    texto += `📍 ${local}\n`;
    texto += `🔗 [Acessar Perfil no LinkedIn](${link})\n`;
    texto += "---\n"; // Linha separadora
}

// Retorna um único objeto JSON com o texto completo
return { 
    json: { 
        response: texto 
    } 
};
