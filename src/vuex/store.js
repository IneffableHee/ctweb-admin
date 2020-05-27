import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
	token: sessionStorage.getItem('token'),
	menu:[],
}

// 定义所需的 mutations
const mutations = {
	INCREMENTTOKEN(state, token) {
		state.token = token;
	},
	DECREMENTTOKEN(state) {
		state.token = "";
	},
	INCREMENTMENU(state, menu) {
		state.menu = menu;
	},
	DECREMENTMENU(state) {
		state.menu = [];
	}
}

// 创建 store 实例
export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations
})
