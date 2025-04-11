<template>
    <form @submit.prevent="applyFilter" class="row g-2 align-items-end mb-3 text-white">
        <!-- Nome -->
        <div class="col-sm-6 col-md-3">
            <label class="form-label">{{ t('filter.name') }}</label>
            <input v-model="filters.name" type="text" class="form-control"
                :placeholder="t('filter.name_placeholder')" />
        </div>

        <!-- ID -->
        <div class="col-sm-6 col-md-2">
            <label class="form-label">{{ t('filter.id') }}</label>
            <input v-model="filters.id" type="number" class="form-control" :placeholder="t('filter.id_placeholder')" />
        </div>

        <!-- Tipo -->
        <div class="col-sm-6 col-md-3">
            <label class="form-label">{{ t('filter.type') }}</label>
            <select class="form-select" v-model="filters.type">
                <option value="">{{ t('filter.type_placeholder') }}</option>
                <option v-for="type in translatedTypes" :key="type.name" :value="type.name">
                    {{ type.translated }}
                </option>
            </select>
        </div>

        <!-- Espécie -->
        <div class="col-sm-6 col-md-3">
            <label class="form-label">{{ t('filter.species') }}</label>
            <input v-model="filters.species" type="text" class="form-control"
                :placeholder="t('filter.species_placeholder')" />
        </div>

        <!-- Botão -->
        <div class="col-sm-6 col-md-1 d-grid">
            <button type="submit" class="btn btn-light">{{ t('filter.button') }}</button>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['filter'])
const { t, locale } = useI18n()

const filters = ref({
    name: '',
    id: '',
    type: '',
    species: ''
})

function applyFilter() {
    emit('filter', { ...filters.value })
}

const translatedTypes = ref([])

const localPtTypeMap = {
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

async function loadTypes(localeCode) {
    const res = await fetch('https://pokeapi.co/api/v2/type')
    const { results } = await res.json()

    const allTypes = await Promise.all(
        results.map(async (t) => {
            const typeData = await fetch(t.url).then(res => res.json())
            let translated = localeCode === 'pt'
                ? localPtTypeMap[t.name] || t.name
                : typeData.names.find(n => n.language.name === localeCode)?.name || t.name
            return { name: t.name, translated }
        })
    )

    translatedTypes.value = allTypes.filter(t => !['shadow', 'unknown'].includes(t.name))
}

watch(locale, async (newLocale) => {
    await loadTypes(newLocale)
}, { immediate: true })
</script>

<style scoped>
.form-label {
    font-weight: 600;
}
</style>