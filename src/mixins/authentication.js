export const authentication = {
  computed: {
    user_is_admin(){
      if(!this.$store.state.current_user) return false
      else return this.$store.state.current_user.admin
    },
    user_is_current_user(){
      if(!this.$store.state.current_user) return false
      else if(!this.user) return false
      else return this.$store.state.current_user._id === this.user._id
    }
  }
};
