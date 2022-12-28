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


        <!-- Top up via credit card (Stripe)-->
        <!-- NOT WORKING YET! -->
        <!-- <template v-if="user_is_current_user">
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
                ref="stripeElement"
                :pk="publishableKey"
                :amount="amount"
                @token="tokenCreated"
                @loading="loading = $event"/>
            </td>
          </tr>
        </template> -->

      </table>

      <template v-if="user_is_current_user || user_is_admin">
        <h2>Password update</h2>
        <table>
            <tr>
              <td>Password update</td>
              <td>
                <form @submit.prevent="updatePassword()">
                  <input type="password" v-model="newPassword" placeholder="New password">
                  <button type="submit">Update</button>
                </form>
              </td>
            </tr>
        </table>
      </template>


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
              v-model="user.isAdmin"
              :disabled="user_is_current_user">
            </td>
          </tr>
          <tr>
            <td>Update user</td>
            <td>
              <button type="button" v-on:click="update_user()">Save</button>
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
import { authentication } from '@/mixins/authentication.js'
import { currency } from '@/mixins/currency.js'
// import { StripeElements } from 'vue-stripe-checkout';

export default {
  name: 'User',
  components: {
    // StripeElements
  },
  mixins: [
    authentication,
    currency,
  ],
  data(){
    return {
      loading: false,
      amount: 0,
      processing: false,
      newPassword: '',

      // Stripe related stuff
      publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
      token: null,
      charge: null
    }
  },
  mounted(){

  },
  methods: {
    top_up(){
      if(!confirm(`Top up user ${this.user.display_name} with ${process.env.VUE_APP_CURRENCY} ${this.amount}?`)) return

      this.processing = true

      const body = {
        user_id: this.user._id,
        amount: this.amount,
        description: `Top up from ${this.current_user.username}`
      }

      this.axios.post(`/transactions`, body)
      .then( () => {
        this.amount = 0
        this.processing = false
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(`There was an error operating the transaction`)
      })
      
    },
    update_user(){
      this.axios.patch(`users/${this.user_id}`, this.user)
      .then(() => {
        alert('User updated successfully')
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(error)
      })
    },

    delete_user(){
      if(confirm(`Delete user ${this.user.display_name}`)){
        this.axios.delete(`/users/${this.user_id}`)
        .then( () => {
          this.$router.push({name: 'Users'})
        })
        .catch(error => {
          if(error.response) console.log(error.response.data)
          else console.log(error)
        })
      }
    },
    async updatePassword(){
      try {
        const url = `/users/${this.user_id}/password`
        const body = { newPassword: this.newPassword }
        await this.axios.patch(url, body)
        alert('password update successful')
      } catch (error) {
        console.error(error)
        alert('Password update failed')
      }
    },
    // Stripe methods (CURRENTLY NOT WORKING)
    stripe_submit () {
      if(!confirm(`Top up account with ${this.amount}?`)) return
      this.$refs.stripeElement.submit();
    },
    tokenCreated (token) {
      this.token = token;
      this.charge = {
        source: token.id,
        amount: this.amount,
        description: 'MoreillonPay Top up'
      }
      this.sendTokenToServer(this.charge);
    },
    sendTokenToServer (charge) {
      // CURRENTLY NOT WORKING
      this.axios.post(`/stripe_charge`,{charge})
      .then(response => console.log(response.data))
      .catch(error => console.log(error))

    }
  },
  computed: {
    user(){
      return this.$store.state.users.find((user) => {
        return user._id === this.$route.params.user_id
      })
    },
    user_id(){
      return this.user._id
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
