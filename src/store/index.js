import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_user: null,
    users: [],
  },
  mutations: {
    set_user(state, user){
      state.current_user = user
    },
    user_list(state, users){
      state.users = users
    },
    delete_user(state, data){
      let user_index = state.users.findIndex((user) => {
        return user._id === data._id
      })

      if(user_index) state.users.splice(user_index,1)
    },
    create_user(state, data){
      state.users.push(data)
    },
    update_user(state, data){
      let user_index = state.users.findIndex((user) => {
        return user._id === data._id
      })

      if(typeof user_index !== 'undefined') Vue.set(state.users, user_index, data)
    },
  },
  actions: {
  },
  modules: {
  }
})
