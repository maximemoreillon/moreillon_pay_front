<template>
  <div class="Log">
    <h1>Transactions</h1>
    <table>

      <tr>
        <th>Time</th>
        <th>Amount</th>
        <th>Description</th>
        <th>User</th>
      </tr>

      <tr
        v-for="transaction in transactions"
        :key="transaction._id"
        class="log_entry">
        <td>{{ transaction.time}}</td>
        <td>{{ transaction.description}}</td>
        <td>{{ transaction.amount}}</td>
        <td>{{ transaction.user_id}}</td>
      </tr>



    </table>
  </div>
</template>

<script>
import {authentication} from '@/mixins/authentication.js'

export default {
  name: 'Log',
  components: {

  },
  mixins: [
    authentication,
  ],
  data(){
    return {
      transactions: [],
      loading: false,
    }
  },
  mounted(){
    this.getTransactions()
  },
  methods: {
    async getTransactions() {
      this.loading = true
      try {
        const {data: transactions} = await this.axios.get('/transactions')
        this.transactions = transactions
      } catch (error) {
        console.error(error)
        alert('Failed to query transactions')
      } finally {
        this.loading = false
      }
    }
  },
  computed: {



  }
}
</script>

<style scoped>

.date_filters_wrapper{
  display: flex;
}
.date_filters_wrapper > *{
  margin-right: 1em;
}
.date_filter {
  display: flex;
}

.categories_wrapper {
  margin: 1em 0;
  border: 1px solid #dddddd;
  max-height: 10vh;
  overflow-y: auto;
}

.category {
  margin: 0.25em;
}
</style>
