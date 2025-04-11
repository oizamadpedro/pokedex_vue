const typeCache = new Map()
const moveCache = new Map()

const ptTypeMap = {
    normal: 'Normal',
    fire: 'Fogo',
    water: 'Água',
    grass: 'Planta',
    electric: 'Elétrico',
    ice: 'Gelo',
    fighting: 'Lutador',
    poison: 'Veneno',
    ground: 'Terra',
    flying: 'Voador',
    psychic: 'Psíquico',
    bug: 'Inseto',
    rock: 'Pedra',
    ghost: 'Fantasma',
    dragon: 'Dragão',
    dark: 'Sombrio',
    steel: 'Aço',
    fairy: 'Fada'
}

export async function fetchTranslatedName(url, locale) {
    const res = await fetch(url)
    const data = await res.json()
    const translation = data.names?.find(n => n.language.name === locale)
    return translation?.name || data.name
}

export async function fetchTranslatedTypes(types, locale) {
    return await Promise.all(types.map(async (t) => {
        if (locale === 'pt') {
            return {
                ...t,
                translatedName: ptTypeMap[t.type.name] || t.type.name
            }
        } else {
            const res = await fetch(t.type.url)
            const data = await res.json()
            const translated = data.names.find(n => n.language.name === locale)?.name || t.type.name
            return {
                ...t,
                translatedName: translated
            }
        }
    }))
}

export async function fetchTranslatedMoves(moves, locale) {
    return await Promise.all(
        moves.slice(0, 10).map(async (m) => {
            const res = await fetch(m.move.url)
            const data = await res.json()
            const translated = data.names.find(n => n.language.name === locale)?.name
                || data.names.find(n => n.language.name === 'en')?.name
                || m.move.name

            return {
                ...m,
                translatedName: translated
            }
        })
    )
}


