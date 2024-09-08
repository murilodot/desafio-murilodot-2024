class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: ['savana'], tamanhoTotal: 10, animaisExistentes: ['MACACO'], espacoOcupado: 3 }, 
            { numero: 2, bioma: ['floresta'], tamanhoTotal: 5, animaisExistentes: [], espacoOcupado: 0 }, 
            { numero: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animaisExistentes: ['GAZELA'], espacoOcupado: 2 },
            { numero: 4, bioma: ['rio'], tamanhoTotal: 8, animaisExistentes: [], espacoOcupado: 0 }, 
            { numero: 5, bioma: ['savana'], tamanhoTotal: 9, animaisExistentes: ['LEAO'], espacoOcupado: 3 }
        ];
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    // Método auxiliar para verificar se um animal é compatível com o bioma
    biomaEhCompatível(biomasAnimal, biomasRecinto) {
        return biomasAnimal.some(bioma => biomasRecinto.includes(bioma));
    }

    // Método para verificar se o recinto contém carnívoros
    contemCarnivoro(recinto) {
        return recinto.animaisExistentes.some(animal => this.animais[animal].carnivoro);
    }

    // Método para verificar se pode adicionar mais animais no recinto respeitando as regras
    podeAdicionarAnimal(recinto, animal, quantidade) {
        const espacoNecessario = this.animais[animal].tamanho * quantidade;

        // Verifica se o recinto já contém carnívoros
        if (this.contemCarnivoro(recinto)) {
            return false; // Não pode adicionar animais não carnívoros a recintos com carnívoros
        }

        // Verifica se o animal é carnívoro e se o recinto já contém outra espécie
        if (this.animais[animal].carnivoro && recinto.animaisExistentes.length > 0) {
            return false; // Carnívoros não podem habitar com outras espécies
        }

        // Regras para hipopótamos
        if (animal === 'HIPOPOTAMO' && recinto.animaisExistentes.length > 0) {
            const temOutroAnimal = recinto.animaisExistentes.some(a => a !== 'HIPOPOTAMO');
            if (temOutroAnimal && (!recinto.bioma.includes('savana') || !recinto.bioma.includes('rio'))) {
                return false; // Hipopótamos só toleram outras espécies em savana e rio
            }
        }

        // Regras para macacos
        if (animal === 'MACACO' && quantidade === 1 && recinto.animaisExistentes.length === 0) {
            return false; // Macacos precisam de pelo menos mais um animal
        }

        // Verifica se o bioma é compatível e se há espaço suficiente
        const biomaCompativel = this.biomaEhCompatível(this.animais[animal].biomas, recinto.bioma);
        const espacoOcupado = recinto.espacoOcupado + espacoNecessario;
        const espacoSuficiente = espacoOcupado <= recinto.tamanhoTotal;

        return biomaCompativel && espacoSuficiente;
    }

    analisaRecintos(animal, quantidade) {
        const resultado = {};

        if (!this.animais[animal]) {
            resultado.erro = 'Animal inválido';
            return resultado;
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            resultado.erro = 'Quantidade inválida';
            return resultado;
        }

        const recintosViaveis = this.recintos
            .filter(recinto => this.podeAdicionarAnimal(recinto, animal, quantidade))
            .map(recinto => {
                const espacoLivre = recinto.tamanhoTotal - recinto.espacoOcupado - (this.animais[animal].tamanho * quantidade);
                
                // Verifica se deve subtrair 1 espaço extra no final
                const especiesDiferentes = recinto.animaisExistentes.filter(a => a !== animal).length > 0;
                const espacoFinal = especiesDiferentes ? espacoLivre - 1 : espacoLivre;
                
                return `Recinto ${recinto.numero} (espaço livre: ${espacoFinal} total: ${recinto.tamanhoTotal})`;
            });

        if (recintosViaveis.length > 0) {
            resultado.recintosViaveis = recintosViaveis;
        } else {
            resultado.erro = 'Não há recinto viável';
        }

        return resultado;
    }
}

export { RecintosZoo as RecintosZoo };
