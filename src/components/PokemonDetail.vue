<template>
    <div class="modal fade" id="pokemonModal" tabindex="-1" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-capitalize">{{ selectedPokemon?.translatedName }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body" v-if="selectedPokemon">
                    <div class="row">
                        <!-- ESQUERDA -->
                        <div class="col-md-4 text-center p-3 border-end">
                            <div class="bg-light p-3 rounded-4">
                                <img :src="selectedPokemon.sprites.other['official-artwork'].front_default" alt="sprite"
                                    class="img-fluid" style="max-height: 180px;" />
                            </div>


                            <h4 class="mt-3 text-capitalize">{{ selectedPokemon.translatedName }}</h4>
                            <p class="text-muted">N°{{ selectedPokemon.id.toString().padStart(3, '0') }}</p>

                            <div>
                                <span class="badge rounded-pill me-2" :class="'bg-' + typeColor(t.type.name)"
                                    v-for="(t, i) in selectedPokemon.types" :key="i">
                                    {{ t.translatedName || t.type.name }}
                                </span>
                            </div>
                            <!-- GALERIA DE SPRITES -->
                            <div class="mt-3">
                                <small class="text-muted d-block mb-2">{{ $t('details.sprites') }}</small>
                                <div v-if="selectedPokemon?.allSprites"
                                    class="d-flex flex-wrap gap-3 justify-content-center">
                                    <template v-for="(src, key) in selectedPokemon.allSprites" :key="key">
                                        <div v-if="src" class="text-center" style="width: 80px;">
                                            <img :src="src" :alt="key" class="rounded border bg-white"
                                                style="width: 64px; height: 64px; object-fit: contain; padding: 4px;" />
                                            <div class="small text-muted mt-1" style="font-size: 0.75rem;">
                                                {{ $t(`details.spritesLabels.${key}`) }}
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- DIREITA -->
                        <div class="col-md-8 px-4">
                            <p class="text-muted mb-3">{{ flavorText }}</p>

                            <div class="row text-center mb-3">
                                <div class="col">
                                    <small class="text-muted">{{ $t('details.weight') }}</small>
                                    <div class="fw-bold">{{ selectedPokemon.weight / 10 }} kg</div>
                                </div>
                                <div class="col">
                                    <small class="text-muted">{{ $t('details.height') }}</small>
                                    <div class="fw-bold">{{ selectedPokemon.height / 10 }} m</div>
                                </div>
                            </div>

                            <div class="row text-center mb-3">
                                <div class="col">
                                    <small class="text-muted">{{ $t('details.category') }}</small>
                                    <div class="fw-bold text-capitalize">
                                        {{
                                            speciesData?.genera?.find(g => g.language.name === locale.value)?.genus
                                            || speciesData?.genera?.find(g => g.language.name === 'en')?.genus
                                            || ''
                                        }}
                                    </div>
                                </div>
                                <div class="col">
                                    <small class="text-muted">{{ $t('details.ability') }}</small>
                                    <div class="fw-bold text-capitalize">
                                        {{ selectedPokemon.abilities[0]?.ability.name }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <small class="text-muted">{{ $t('details.weaknesses') }}</small>
                                <div>
                                    <span class="badge rounded-pill bg-danger me-2" v-for="(weak, i) in weaknesses"
                                        :key="i">
                                        {{ weak.translatedName }}
                                    </span>
                                </div>
                            </div>

                            <div class="mb-2">
                                <small class="text-muted">{{ $t('details.evolutions') }}</small>
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                    <div v-for="(evo, i) in evolutionChain" :key="i" class="d-flex align-items-center">
                                        <div class="text-center">
                                            <img :src="evo.img" class="rounded-circle bg-white border"
                                                style="width: 64px; height: 64px;" />
                                            <div class="small mt-1 text-capitalize">{{ evo.name }}</div>
                                            <div class="text-muted small">
                                                N°{{ evo.id.toString().padStart(3, '0') }}
                                            </div>
                                        </div>
                                        <div v-if="i < evolutionChain.length - 1" class="mx-2 text-secondary">➔</div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <small class="text-muted">{{ $t('details.moves') }}</small>
                                <div class="d-flex flex-wrap gap-2 mt-1">
                                    <span class="badge bg-info text-dark text-capitalize"
                                        v-for="(move, i) in selectedPokemon.translatedMoves" :key="i">
                                        {{ move.translatedName }}
                                    </span>
                                </div>
                            </div>

                            <div class="mb-2">
                                <small class="text-muted">{{ $t('details.games') }}</small>
                                <div class="d-flex flex-wrap gap-2 mt-1">
                                    <span class="badge bg-secondary text-capitalize"
                                        v-for="(entry, i) in selectedPokemon.game_indices" :key="i">
                                        {{ entry.version.name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useI18n } from 'vue-i18n'
import {
    fetchTranslatedName,
    fetchTranslatedMoves,
    fetchTranslatedTypes
} from '../i18n/fetch.js'

const { locale } = useI18n()
const props = defineProps({ pokemon: Object })

const modalRef = ref(null)
const selectedPokemon = ref(null)
const speciesData = ref(null)
const flavorText = ref('')
const weaknesses = ref([])
const evolutionChain = ref([])

watch(() => props.pokemon, async (newVal) => {
    if (!newVal) return
    selectedPokemon.value = newVal
    await nextTick()
    const modal = new bootstrap.Modal(modalRef.value)
    modal.show()
    await fetchDetails(newVal)
})

watch(locale, async () => {
    if (selectedPokemon.value) {
        await fetchDetails(selectedPokemon.value)
    }
})

async function fetchDetails(pokemon) {
    const speciesRes = await fetch(pokemon.species.url).then(res => res.json())
    speciesData.value = speciesRes

    selectedPokemon.value.translatedName = await fetchTranslatedName(pokemon.species.url, locale.value)
    flavorText.value = speciesRes.flavor_text_entries.find(f => f.language.name === locale.value)?.flavor_text.replace(/\f/g, ' ') || ''

    const types = await fetchTranslatedTypes(pokemon.types, locale.value)
    selectedPokemon.value.types = types

    const typeUrls = types.map(t => t.type.url)
    const typeDetails = await Promise.all(typeUrls.map(url => fetch(url).then(res => res.json())))
    const rawWeaknesses = typeDetails.flatMap(td => td.damage_relations.double_damage_from)
    const uniqueWeaknesses = Array.from(new Map(rawWeaknesses.map(t => [t.name, t])).values())
    weaknesses.value = await fetchTranslatedTypes(uniqueWeaknesses.map(t => ({ type: t })), locale.value)

    const evoRes = await fetch(speciesRes.evolution_chain.url).then(res => res.json())
    evolutionChain.value = await extractEvolutionData(evoRes.chain)

    selectedPokemon.value.translatedMoves = await fetchTranslatedMoves(pokemon.moves, locale.value)
    selectedPokemon.value.allSprites = {
        front_default: pokemon.sprites.front_default,
        front_shiny: pokemon.sprites.front_shiny,
        back_default: pokemon.sprites.back_default,
        back_shiny: pokemon.sprites.back_shiny,
        official_artwork: pokemon.sprites.other['official-artwork']?.front_default,
        dream_world: pokemon.sprites.other['dream_world']?.front_default,
        home: pokemon.sprites.other['home']?.front_default,
        home_shiny: pokemon.sprites.other['home']?.front_shiny
    }
}

async function extractEvolutionData(chain) {
    const result = []
    let current = chain
    while (current) {
        const name = current.species.name
        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
        result.push({ name, id: data.id, img: data.sprites.front_default })
        current = current.evolves_to?.[0]
    }
    return result
}

function typeColor(type) {
    const map = {
        fire: 'danger', water: 'info', grass: 'success', electric: 'warning',
        normal: 'secondary', poison: 'dark', flying: 'primary', bug: 'success',
        ground: 'warning', rock: 'dark', psychic: 'danger', ghost: 'secondary',
        ice: 'info', dragon: 'primary', dark: 'dark', steel: 'secondary', fairy: 'pink'
    }
    return map[type] || 'light'
}
</script>

<style scoped>
.bg-pink {
    background-color: #ec407a !important;
}
</style>
