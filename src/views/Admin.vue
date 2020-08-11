<template>
  <div class="create_user">

    <h1>Admin</h1>
    <template v-if="user_is_admin">
      <h2>Create user</h2>

      <!-- user creation form -->
      <form
        class="user_creation_form"
        v-on:submit.prevent="create_user()">
        <input type="text" v-model="username" placeholder="username">
        <input type="password" v-model="password" placeholder="password">
        <input type="password" v-model="password_confirm" placeholder="password_confirm">
        <input type="text" v-model="card_uuid" placeholder="card_uuid">
        <input type="submit">
      </form>


      <h2>Device JWT</h2>
      <p>
        <input type="text" :value="jwt" readonly>
      </p>
    </template>
    <div class="" v-else>
      Unauthorized
    </div>



  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import {authentication} from '@/mixins/authentication.js'

export default {
  name: 'Admin',
  components: {

  },
  mixins: [
    authentication,
  ],
  data(){
    return {
      // user creation form
      username: '',
      password: '',
      password_confirm: '',
      card_uuid: '',
      jwt: null,
    }
  },
  mounted(){
    this.get_device_jwt()
  },
  methods: {
    create_user(){
      if(this.password !== this.password_confirm) return alert('password no match!')

      this.axios.post(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/create_user`, {
        username: this.username,
        password: this.password,
        card_uuid: this.card_uuid,
      })
      .then( () => {
        // Clear fields
        this.username = ''
        this.password = ''
        this.card_uuid = ''
        this.password_confirm = ''

        // redirect to users page
        this.$router.push({name: 'Users'})
      })
      .catch(error => {
        console.log(error)
      })
    },
    get_device_jwt(){
      this.axios.get(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/device_jwt`)
      .then( (response) => {
        this.jwt = response.data
      })
      .catch(error => {
        console.log(error)
      })
    }

  },
  computed: {

  }
}
</script>

<style scoped>


.user_creation_form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user_creation_form > * {
  margin: 0.25em 0;
}



</style>
