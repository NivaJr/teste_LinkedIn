// 1. Pega todas as entradas da IA
const inputs = $input.all();

// 2. Pega os itens originais do Loop
let loopItems = [];
try {
    loopItems = $('Loop Over Items').all();
} catch(e) {
    loopItems = inputs; 
}

// --- MÁGICA PARA PEGAR O NOME DA VAGA ---
// Define "Vaga Geral" como padrão caso dê erro
let nomeVagaReal = "Vaga Geral";

try {
    // Acessa o que o Agente de Pesquisa gerou
    const outputPesquisa = $('Pesquisar').first().json.output;
    
    // Pega a string de busca (ex: site:linkedin... ("Analista de Redes" OR ...))
    const stringBusca = outputPesquisa.search_string || "";

    // Usa REGEX para capturar o primeiro texto que estiver entre aspas duplas
    // Geralmente o primeiro termo é o cargo principal
    const match = stringBusca.match(/"([^"]+)"/);
    
    if (match && match[1]) {
        nomeVagaReal = match[1]; // Isso vai ser "Analista de Redes", por exemplo
    }
} catch(error) {
    // Se falhar, mantém "Vaga Geral"
}
// ----------------------------------------

const results = [];

for (let i = 0; i < inputs.length; i++) {
    const iaOutput = inputs[i].json.output || inputs[i].json.text; 
    const original = loopItems[i] ? loopItems[i].json : {};

    // -- LIMPEZA DO JSON --
    let jsonLimpo = {};
    try {
        if (typeof iaOutput === 'object') {
            jsonLimpo = iaOutput;
        } else if (typeof iaOutput === 'string') {
            const startIndex = iaOutput.indexOf('{');
            const endIndex = iaOutput.lastIndexOf('}');
            if (startIndex !== -1 && endIndex !== -1) {
                const jsonString = iaOutput.substring(startIndex, endIndex + 1);
                jsonLimpo = JSON.parse(jsonString);
            } else {
                const cleanStr = iaOutput.replace(/```json|```/g, '').trim();
                jsonLimpo = JSON.parse(cleanStr);
            }
        }
    } catch (error) {
        jsonLimpo = {};
    }

    // -- CORREÇÃO DA NOTA --
    let rawScore = jsonLimpo.nota_match || jsonLimpo.match_percentage || jsonLimpo.score || jsonLimpo.nota || 0;
    let finalScore = Number(rawScore);
    if (isNaN(finalScore)) finalScore = 0;

    // -- CORREÇÃO DO NOME --
    let nomeFinal = jsonLimpo.nome_candidato || jsonLimpo.nome;
    if (!nomeFinal || nomeFinal === "Não identificado") {
        const tituloOriginal = original.title || original.name || "";
        nomeFinal = tituloOriginal.split("- LinkedIn")[0].split("| LinkedIn")[0].split(" - ")[0].trim() || "Candidato";
    }

    // -- MONTAGEM FINAL --
    results.push({
        json: {
            "nome_candidato": nomeFinal,
            
            // Aqui usamos a variável que extraímos lá no topo
            "nome_vaga": nomeVagaReal,
            
            "link_perfil": jsonLimpo.link_perfil || original.link || original.url || "Link perdido",
            "nota_match": finalScore,
            "localizacao": jsonLimpo.localizacao || "Local não identificado"
        }
    });
}

return results;
