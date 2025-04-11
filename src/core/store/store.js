import { createStore } from 'vuex'

export default createStore({
    state: {
        contador: 0
    },
    mutations: {
        incrementar(state) {
            state.contador++
        }
    },
    actions: {
        incrementarAsync({ commit }) {
            setTimeout(() => {
                commit('incrementar')
            }, 1000)
        }
    },
    getters: {
        contadorDobrado: (state) => state.contador * 2
    }
})