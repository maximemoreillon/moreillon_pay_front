import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'

Vue.component('datetime', Datetime);

axios.defaults.baseURL = process.env.VUE_APP_MOREILLONPAY_API_URL
const socket = io(`${process.env.VUE_APP_MOREILLONPAY_API_URL}`);

Vue.use(VueSocketIOExt, socket);
Vue.use(VueCookies)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false


router.beforeEach((to, from, next) => {

  // deal with authentication header
  let jwt = Vue.$cookies.get("moreillonpay_jwt")
  if(jwt) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

    axios.get(`/users/self`)
    .then(response => {
      store.commit('set_user',response.data)
    })
    .catch(error => {
      if(error.response) console.log(error.response.data)
      else console.log(error)
    })
  }
  else {
    delete axios.defaults.headers.common['Authorization']
    store.commit('set_user',null)
  }

  next();

})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
