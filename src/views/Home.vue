<script setup>
import { fetchTranslatedName, fetchTranslatedMoves, fetchTranslatedTypes } from "../i18n/fetch.js"
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PokemonCard from '../components/PokemonCard.vue'
import PokemonFilter from '../components/PokemonFilter.vue'
import PokemonDetailModal from '../components/PokemonDetail.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const pokemons = ref([])
const filteredPokemons = ref([])
const offset = ref(0)
const loading = ref(false)
const filters = ref({ name: '', type: '', id: '', species: '' })
const selectedPokemon = ref(null)
const bottom = ref(null)
let observer

const { t, locale } = useI18n()

// 🔄 Salva idioma no localStorage sempre que trocar
watch(locale, async (lang) => {
  localStorage.setItem('lang', lang)
  await reloadTranslatedPokemons()
})

const isFilteringActive = computed(() => {
  return filters.value.name || filters.value.id || filters.value.type || filters.value.species
})

onMounted(() => {
  locale.value = localStorage.getItem('lang') || 'pt'
  loadPokemons()
  setupObserver()
})

function setupObserver() {
  observer = new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting && !loading.value && !isFilteringActive.value) {
      await loadPokemons()
    }
  })

  if (bottom.value) observer.observe(bottom.value)
}

async function loadPokemons() {
  loading.value = true

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`)
  const data = await res.json()

  const detailedPokemons = await Promise.all(
    data.results.map(async (p) => {
      const pokemon = await fetch(p.url).then((res) => res.json())
      const speciesRes = await fetch(pokemon.species.url).then((res) => res.json())

      const speciesNameTranslated = await fetchTranslatedName(pokemon.species.url, locale.value)
      const translatedTypes = await fetchTranslatedTypes(pokemon.types, locale.value)
      const translatedMoves = await fetchTranslatedMoves(pokemon.moves, locale.value)

      // Obtem a espécie (genus) na linguagem correta
      const genus = speciesRes.genera.find(g => g.language.name === locale.value)?.genus
        || speciesRes.genera.find(g => g.language.name === 'en')?.genus
        || ''

      pokemon.speciesName = genus
      pokemon.speciesFull = speciesRes
      pokemon.types = translatedTypes
      pokemon.translatedMoves = translatedMoves

      pokemon.allSprites = {
        front_default: pokemon.sprites.front_default,
        front_shiny: pokemon.sprites.front_shiny,
        back_default: pokemon.sprites.back_default,
        back_shiny: pokemon.sprites.back_shiny,
        official_artwork: pokemon.sprites.other?.['official-artwork']?.front_default,
        dream_world: pokemon.sprites.other?.['dream_world']?.front_default,
        home: pokemon.sprites.other?.['home']?.front_default,
        home_shiny: pokemon.sprites.other?.['home']?.front_shiny
      }

      return pokemon
    })
  )

  pokemons.value.push(...detailedPokemons)
  filteredPokemons.value = [...pokemons.value]
  offset.value += 20
  loading.value = false
}

async function reloadTranslatedPokemons() {
  loading.value = true

  // Reinicia tudo do zero
  offset.value = 0
  pokemons.value = []
  filteredPokemons.value = []

  await loadPokemons()
}

function normalize(str) {
  return str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
}

function handleFilter(newFilters) {
  filters.value = newFilters
  const idFilter = newFilters.id ? parseInt(newFilters.id) : null

  filteredPokemons.value = pokemons.value.filter((p) => {
    const matchesName = normalize(p.name).includes(normalize(newFilters.name))
    const matchesID = idFilter ? p.id === idFilter : true
    const matchesType = newFilters.type
      ? p.types.some((t) => t.type.name === newFilters.type)
      : true
    const matchesSpecies = newFilters.species
      ? normalize(p.speciesName).includes(normalize(newFilters.species)) ||
      normalize(p.name).includes(normalize(newFilters.species))
      : true

    return matchesName && matchesID && matchesType && matchesSpecies
  })

  loading.value = false
}

function showDetails(pokemon) {
  selectedPokemon.value = pokemon
}
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-3">
      <div class="container d-flex justify-content-between align-items-center">
        <a class="navbar-brand fw-bold" href="#">
          <img src="https://img.icons8.com/color/48/000000/pokeball--v1.png" width="32" alt="pokeball" />
          {{ t('app.title') }}
        </a>

        <!-- Idioma: Select -->
        <div class="form-group mb-0">
          <select class="form-select form-select-sm" style="width: auto;" v-model="locale">
            <option value="pt">🇧🇷 {{ t('languages.pt') }}</option>
            <option value="en">🇺🇸 {{ t('languages.en') }}</option>
            <option value="es">🇪🇸 {{ t('languages.es') }}</option>
          </select>
        </div>
      </div>
    </nav>

    <!-- Conteúdo -->
    <div class="container-fluid py-3">
      <PokemonFilter @filter="handleFilter" />

      <div class="row">
        <PokemonCard v-for="pokemon in filteredPokemons" :key="pokemon.name" :pokemon="pokemon" @select="showDetails" />
      </div>

      <!-- Loader -->
      <div ref="bottom" class="text-center py-3">
        <div v-if="loading && !isFilteringActive" class="spinner-border text-light" role="status">
          <span class="visually-hidden">{{ t('app.load_more') }}</span>
        </div>
      </div>
    </div>

    <PokemonDetailModal :pokemon="selectedPokemon" />
  </div>
</template>

<style scoped>
.container-fluid {
  background-color: #f44336 !important;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
