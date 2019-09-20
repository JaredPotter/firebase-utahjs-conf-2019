import { auth } from '../firebaseInit';

export const state = () => ({
    user: null
})

export const getters = {
    user(state) {
        return state.user;
    },
}

export const mutations = {
    setUser(state, user) {
        state.user = JSON.parse(JSON.stringify(user)); 
    }
}

export const actions = {
    login({ commit }, { username, password }) {
        return auth.signInWithEmailAndPassword(username, password)
            .then((user) => {
                commit('setUser', user);
                return;
            })
            .catch((error) => {
                debugger;
            });
    },
    logout({ commit }) {
        return auth.signOut()
          .then(() => {
              commit('setUser', null);
            return;
          });
    },
}