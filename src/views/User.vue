<template>
  <div class="user">

    <h1 v-if="user">{{user.display_name}} <span v-if="user_is_current_user">(you)</span></h1>
    <h1 v-else>User info</h1>

    <template v-if="user">

      <table>
        <tr>
          <td>Balance</td>
          <td class="balance_cell">{{currency}} {{user.balance}}</td>
        </tr>


        <!-- Top up via credit card-->
        <template v-if="user_is_current_user">
          <tr>
            <td>Top up</td>
            <td>
              <input type="number" v-model.number="amount">
              <button @click="stripe_submit()">Top up</button>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <stripe-elements
                ref="elementsRef"
                :pk="publishableKey"
                :amount="amount"
                @token="tokenCreated"
                @loading="loading = $event"/>
            </td>
          </tr>
        </template>
      </table>


      <!-- Admin area -->
      <template v-if="user_is_admin">
        <h2>Admin area</h2>
        <table>
          <tr>
            <td>Card UUID</td>
            <td>
              <span
                class="card_uuid"
                v-on:click="update_card_uuid()">{{user.card_uuid}} (click to edit)</span>
            </td>
          </tr>

          <tr>
            <td>Cash top-up</td>
            <td>
              <form
                class="top_up_form"
                v-on:submit.prevent="top_up()">
                <input type="number" v-model.number="amount">
                <input
                  type="submit"
                  value="Top up"
                  v-bind:disabled="processing || !amount">
              </form>
            </td>
          </tr>


          <tr>
            <td>Admin</td>
            <td>
              <input
              type="checkbox"
              v-model="user.admin"
              v-on:change="update_admin_rights()"
              v-bind:disabled="!user_is_admin || user_is_current_user">
            </td>
          </tr>

          <tr>
            <td>Delete user</td>
            <td>
              <button
                type="button"
                v-on:click="delete_user()">Delete user</button>
            </td>
          </tr>
        </table>

      </template>



    </template>

    <div class="" v-else>
      User does not exist
    </div>



  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import {authentication} from '@/mixins/authentication.js'
import {currency} from '@/mixins/currency.js'
import { StripeElements } from 'vue-stripe-checkout';

export default {
  name: 'User',
  components: {
    StripeElements
  },
  mixins: [
    authentication,
    currency,
  ],
  data(){
    return {
      amount: 0,
      processing: false,

      // Stripe related stuff
      loading: false,
      publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
      token: null,
      charge: null
    }
  },
  mounted(){

  },
  methods: {
    top_up(){
      if(confirm(`Top up user ${this.user.display_name} with ${process.env.VUE_APP_CURRENCY} ${this.amount}?`)){
        this.processing = true
        this.axios.post(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/transaction`, {
          user_id: this.user._id,
          transaction_amount: this.amount,
          transaction_description: `Top up from ${this.$store.state.current_user.username}`
        })
        .then( () => {
          this.amount = 0
          this.processing = false
        })
        .catch(error => {
          if(error.response) console.log(error.response.data)
          else console.log(error)
          alert(`There was an error operating the transaction`)
        })
      }
    },
    update_admin_rights(){
      this.axios.post(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/update_admin_rights`, {
        user_id: this.user._id,
        admin: this.user.admin,
      })
      .then(() => {})
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(error)
      })
    },
    update_card_uuid(){
      let card_uuid = prompt('New UUID')
      if(card_uuid) {
        this.axios.post(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/update_card_uuid`, {
          user_id: this.user._id,
          card_uuid: card_uuid,
        })
        .then(() => {})
        .catch(error => {
          if(error.response) console.log(error.response.data)
          else console.log(error)
          alert(error)
        })
      }

    },
    delete_user(){
      if(confirm(`Delete user ${this.user.display_name}`)){
        this.axios.delete(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/user`, {
          params: {user_id: this.user._id,}
        })
        .then( () => {
          this.$router.push({name: 'Users'})
        })
        .catch(error => {
          if(error.response) console.log(error.response.data)
          else console.log(error)
        })
      }
    },
    // Stripe methods
    stripe_submit () {
      if(confirm(`Top up account with ${this.amount}?`)){
        this.$refs.elementsRef.submit();
      }
    },
    tokenCreated (token) {
      this.token = token;
      this.charge = {
        source: token.id,
        amount: this.amount,
        description: 'Moreillonpay Top up'
      }
      this.sendTokenToServer(this.charge);
    },
    sendTokenToServer (charge) {
      this.axios.post(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/stripe_charge`,{charge: charge})
      .then(response => console.log(response.data))
      .catch(error => console.log(error))

    }
  },
  computed: {
    user(){
      return this.$store.state.users.find((user) => {
        return user._id === this.$route.query.id
      })
    }
  },
}
</script>

<style scoped>
table {
  table-layout: fixed;
  text-align: left;
}

.balance_cell {
  font-weight: bold;
}

.card_uuid {
  cursor: pointer;
}

.card_uuid:hover {
  color: #c00000;
}
</style>
