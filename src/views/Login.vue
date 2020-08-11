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
      this.axios.post(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/login`, {
        username: this.username,
        password: this.password,
      })
      .then(response => {
        this.$cookies.set("moreillonpay_jwt", response.data.jwt, '14d', null, null)
        this.$store.commit('set_user',response.data.user)
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
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

}

form > * {
  margin: 0.5em 0;
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
