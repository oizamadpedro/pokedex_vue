import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const typeList = ref([])

export function useTranslatedTypes() {
    const { locale } = useI18n()

    onMounted(async () => {
        const res = await fetch('https://pokeapi.co/api/v2/type')
        const { results } = await res.json()

        const allTypes = await Promise.all(
            results.map(async (t) => {
                const typeData = await fetch(t.url).then(res => res.json())
                return {
                    name: t.name,
                    translated: typeData.names.find(n => n.language.name === locale.value)?.name || t.name
                }
            })
        )

        typeList.value = allTypes.filter(t => !['shadow', 'unknown'].includes(t.name)) // remove tipos não usados
    })

    return {
        translatedTypes: computed(() => typeList.value)
    }
}
