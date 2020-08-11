<template>
  <div class="Log">
    <h1>Logs</h1>

    <button
      type="button"
      v-on:click="clear_log()"
      v-if="user_is_admin">
      Clear log
    </button>

    <form class="filters_form" v-on:submit.prevent="get_log()">
      <h2>Query parameters</h2>

      <div class="date_filters_wrapper">
        <label>From</label>
        <datetime v-model="filters.start_date" type="datetime"/>
        <label>To</label>
        <datetime v-model="filters.end_date" type="datetime"/>
      </div>

      <div class="categories_wrapper">
        <div
          class="category"
          v-for="category in filters.categories"
          v-bind:key="category.label">
          <input type="checkbox" v-model="category.checked">
          <label>{{category.label}}</label>
        </div>
      </div>

      <input type="submit" value="Get logs">
    </form>

    <div class="">
      <h2>Query result</h2>
    </div>

    <div class="" v-if="entries.error">
      Error loading log
    </div>

    <div class="" v-else-if="entries.loading">
      Loading log...
    </div>

    <template v-else-if="entries.length > 0">

      <p class="">
        {{entries.length}} transactions, total {{currency}} {{transaction_total}}
      </p>



      <table>

        <tr>
          <th>Timestamp</th>
          <th>Description</th>
          <th>Amount</th>
          <th>User</th>
        </tr>

        <tr
          v-for="entry in entries"
          v-bind:key="entry._id"
          class="log_entry">
          <td>{{entry.timestamp}}</td>
          <td>{{entry.transaction_description}}</td>
          <td>{{entry.transaction_amount}}</td>

          <td v-if="entry.user[0]">{{entry.user[0].display_name}}</td>
          <td v-else>Deleted user</td>
        </tr>



      </table>
    </template>

    <div class="" v-else>
      No log entries
    </div>









  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
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
      entries: [],



      filters: {
        categories: [],
        start_date: null,
        end_date: null,
      }


    }
  },
  mounted(){
    this.get_distinct_descriptions();
  },
  methods: {
    get_distinct_descriptions(){
      this.axios.get(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/distinct_descriptions`)
      .then(response => {
        response.data.forEach((description) => {
          this.filters.categories.push({
            label: description,
            checked: true,
          })
        });
      })
      .catch(error => {
        console.log(error)
      })
    },
    get_log(){
      this.$set(this.entries,'loading',true)
      this.axios.get(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/log`, {
        params: {
          start_date: this.filters.start_date,
          end_date: this.filters.end_date,
          categories: this.filtered_categories,
        }
      })
      .then(response => {
        this.entries = response.data
      })
      .catch(error => {
        console.log(error)
        this.$set(this.entries,'error',true)
      })
      .finally(() => this.$set(this.entries,'loading',false))
    },
    clear_log(){
      if(confirm('Delete log?')){
        this.axios.delete(`${process.env.VUE_APP_MOREILLONPAY_API_URL}/log`)
        .then(response => {
          console.log(response.data)
          this.get_log()
        })
        .catch(error => {
          console.log(error)
        })
      }

    }
  },
  computed: {
    filtered_categories(){

      let checked_categories =this.filters.categories.filter(category => {
        return category.checked
      })

      return checked_categories.map(category => {
        return category.label
      })

    },
    transaction_total(){
      return this.entries.reduce((total, transaction) => {
        return total + transaction.transaction_amount;
      }, 0)
    },
    currency(){
      return process.env.VUE_APP_CURRENCY
    }


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
