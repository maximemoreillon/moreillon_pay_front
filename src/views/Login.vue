<template>
  <div class="login">
    <h1>Login</h1>

    <!-- If not logged in -->
    <template v-if="!$store.state.current_user">
      <form class="" v-on:submit.prevent="login()">

        <div class="">
          <label>Username</label>
          <input type="text" v-model="username" placeholder="username">
        </div>
        <div class="">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="password">
        </div>


        <input type="submit" value="Login">
      </form>
    </template>

    <!-- If logged in -->
    <template v-else>
      <form class="" v-on:submit.prevent="logout()">
        <p>
          Logged in as {{$store.state.current_user.username}}
        </p>
        <input type="submit" value="Logout">
      </form>
    </template>


  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {

  },
  data(){
    return {
      username: '',
      password: '',
    }
  },
  mounted(){
  },
  methods: {
    login(){
      this.axios.post(`/auth/login`, {
        username: this.username,
        password: this.password,
      })
      .then( ({data}) => {
        this.$cookies.set("moreillonpay_jwt", data.jwt, '14d', null, null)
        this.$store.commit('set_user', data.user)
      })
      .catch(error => {
        alert('Login failed')
        if(error.response) console.error(error.response.data)
        else console.error(error)
      })
    },
    logout(){
      this.$cookies.remove("moreillonpay_jwt")
      this.$store.commit('set_user',null)
    }
  },

}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

form > div {
  display: flex;
}
label {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 5em;

  margin-right: 0.5em;
}
</style>
