import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PokemonCard from '@/components/PokemonCard.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createI18n } from 'vue-i18n'

const routes = [{ path: '/pokemon/:id', component: { template: 'MockPage' } }]
const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const messages = {
    en: { 'app.click_for_details': 'Click for details' },
    pt: { 'app.click_for_details': 'Clique para ver detalhes' },
    es: { 'app.click_for_details': 'Haz clic para más detalles' }
}

const mockPokemon = {
    id: 25,
    name: 'pikachu',
    speciesName: 'pikachu',
    sprites: {
        front_default: 'https://example.com/pikachu-front.png'
    },
    types: [
        {
            type: { name: 'electric' },
            translatedName: 'elétrico'
        }
    ]
}


const i18n = createI18n({
    legacy: false,
    locale: 'pt',
    fallbackLocale: 'en',
    messages
})

describe('PokemonCard.vue', () => {
    it('renderiza o nome do Pokémon corretamente', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(PokemonCard, {
            props: {
                pokemon: mockPokemon
            },
            global: {
                plugins: [router, i18n]
            }
        })

        expect(wrapper.text()).toContain('pikachu')
    })

    it('emite o evento ao clicar no card', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(PokemonCard, {
            props: {
                pokemon: mockPokemon
            },
            global: {
                plugins: [router, i18n]
            }
        })

        await wrapper.trigger('click')

        // Verifica se o evento foi emitido corretamente
        expect(wrapper.emitted('select')).toBeTruthy()
    })
})
