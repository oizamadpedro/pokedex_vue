<template>
  <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-3" @click="$emit('select', pokemon)" style="cursor: pointer">
    <div class="card text-center shadow-sm h-100">
      <img :src="pokemon.sprites?.front_default" class="card-img-top" :alt="pokemon.speciesName" />
      <div class="card-body p-2">
        <div class="text-muted small mb-1">#{{ formatId(pokemon.id) }}</div>
        <h6 class="text-capitalize mb-1">{{ pokemon.name }}</h6>

        <p class="small text-muted text-capitalize mb-1">
          {{ pokemon.speciesName }}
        </p>
        <div>
          <span class="badge me-1 mb-1 text-capitalize" :class="'bg-' + typeColor(type.type.name)"
            v-for="(type, i) in pokemon.types" :key="i">
            {{ type.translatedName }}
          </span>
        </div>

        <p class="small text-muted text-capitalize">
          {{ t('app.click_for_details') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineProps(['pokemon'])

const { t } = useI18n()

function formatId(id) {
  return id.toString().padStart(3, '0')
}

function typeColor(type) {
  const map = {
    fire: 'danger',
    water: 'info',
    grass: 'success',
    electric: 'warning',
    normal: 'secondary',
    poison: 'dark',
    flying: 'primary',
    bug: 'success',
    ground: 'warning',
    rock: 'dark',
    psychic: 'danger',
    ghost: 'secondary',
    ice: 'info',
    dragon: 'primary',
    dark: 'dark',
    steel: 'secondary',
    fairy: 'pink'
  }
  return map[type] || 'light'
}
</script>

<style scoped>
.card {
  border-radius: 15px;
  background-color: #f5f5f5;
  border: none;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
}

.card-img-top {
  max-height: 100px;
  object-fit: contain;
  padding: 1rem;
}

.badge {
  font-size: 0.7rem;
}
</style>
