//test
export const setToken = ({commit},token) => {
    commit('INCREMENTTOKEN',token)
}
export const deleteToken = ({commit}) => {
    commit('DECREMENTTOKEN')
}

export const setMenu = ({commit},token) => {
    commit('INCREMENTMENU',token)
}
export const deleteMenu = ({commit}) => {
    commit('DECREMENTMENU')
}
