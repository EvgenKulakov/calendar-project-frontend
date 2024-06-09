import { createStore } from 'vuex'

export default createStore({
    state: {
        projectData: null
    },
    mutations: {
        setProjectData(state, data) {
            state.projectData = data
        }
    },
    actions: {
        updateProjectData({ commit }, data) {
            commit('setProjectData', data)
        }
    },
    getters: {
        getProjectData: state => state.projectData
    }
})
