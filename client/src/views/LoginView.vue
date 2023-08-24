<template>
    <div class="container">
      <h1>LOGIN</h1>
      <div>
        <form @submit.prevent="loginUser">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="text" placeholder="email" name="email" v-model="email" class="login-input form-control">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="password" name="password" v-model="password" class="login-input form-control">
          </div>
          <input type="submit" class="btn" value="Login">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to="/register" class="card-link">Need an account ?</router-link>
        </form>
      </div>
    </div>
  </template>
  <script>
  import { mapActions } from 'vuex';
  export default{
    data(){
      return{
        email:"",
        password:""
      };
      
    },
    methods:{
      ...mapActions(['login']),
      loginUser(){
        
        let user ={
          email:this.email,
          password:this.password
        }
        this.login(user)
        .then(res=>{
          if(res.data.success){
            this.$router.push("/");
          }
        })
        .catch(err=>{
          console.log(err);
        })
      }
    },
    created() {
      document.body.style.backgroundColor = '#93B1A6'
    },
    beforeUnmount() {
      document.body.style.backgroundColor = '';
    }
  }
</script>

<style scoped>
.btn{
  margin: 10px;
  background-color: #183D3D;
  color: #ffff;
  width: 200px;
  gap: 50px;
 
}
.btn:hover{
  background-color: #255757;
 
}

.login-input{
  background-color: #5C8374;
  color: #ffff;
}
 
</style>