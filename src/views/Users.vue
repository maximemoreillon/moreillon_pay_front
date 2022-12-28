<template>
  <div class="users">

    <h1>Users</h1>

    <template v-if="$store.state.users.length > 0">

      <table class="users_table">

        <tr>
          <th>User</th>
          <th>Balance</th>
        </tr>

        <tr
          class="user"
          v-for="user in sorted_users"
          v-bind:key="user._id"
          v-on:click="$router.push({name: 'User', params: {user_id: user._id}})">

          <td class="display_name">{{user.display_name}}</td>
          <td class="balance">{{user.balance}}</td>

        </tr>

      </table>

    </template>

    <div class="" v-else>
      No user
    </div>

  </div>
</template>

<script>
import {authentication} from '@/mixins/authentication.js'

export default {
  name: 'Users',
  components: {

  },
  mixins: [
    authentication,
  ],
  data(){
    return {

    }
  },
  mounted(){

  },
  methods: {


  },
  computed: {
    sorted_users(){
      return this.$store.state.users.slice().sort((a, b) => b.balance - a.balance);
    }
  }
}
</script>

<style scoped>

.user {
  transition: background-color 0.25s;
  cursor: pointer;
}

.user:hover {
  background-color: #eeeeee;
}




</style>
