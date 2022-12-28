<template>
  <div id="app">

    <AppTemplate
      applicationName="Cashless Payment System">
      <template v-slot:navigation>

        <router-link to="/">Users</router-link>
        <router-link to="/transactions">Transactions</router-link>
        <router-link to="/login">Login</router-link>
        <template v-if="user_is_admin">
          <router-link to="/admin">Admin</router-link>
        </template>

      </template>
    </AppTemplate>



  </div>
</template>

<script>
// @ is an alias to /src
import {authentication} from '@/mixins/authentication.js'
import AppTemplate from '@moreillon/vue_application_template_flex'


export default {
  name: 'App',
  components: {
    AppTemplate,
  },
  mixins: [
    authentication,
  ],
  sockets: {
    connect() {
      console.log('socket connected')
    },
    user_list(data) {
      this.$store.commit('user_list',data)
    },
    user_created(data) {
      this.$store.commit('create_user',data)
    },
    user_deleted(data) {
      this.$store.commit('delete_user',data)
    },
    user_updated(data) {
      this.$store.commit('update_user',data)
    },
  },

  data(){
    return {


    }
  },
  mounted(){

  },
  methods: {

  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

header {
  display: flex;
  justify-content: space-between;
  color: white;
  background-color: #444444;
}
nav {
  display: flex;
}

nav a {
  padding: 0.5em;
  text-decoration: none;
  color: currentColor;
  transition: color 0.25s;
}

nav a:hover {
  color: #c00000;
}



main a {
  color: #c00000;
  font-weight: bold;
  text-decoration: none;
}



table{
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
  text-align: center;
}

tr:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

th, td {
  padding: 0.25em;
}
</style>
