export const authentication = {
  computed: {
    current_user(){
      return this.$store.state.current_user
    },
    user_is_admin(){
      this.current_user
      if(!this.current_user) return false
      else return this.current_user.isAdmin
    },
    user_is_current_user(){
      if(!this.current_user) return false
      else if(!this.user) return false
      else return this.current_user._id === this.user._id
    }
  }
};
