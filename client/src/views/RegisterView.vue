<template>
    <div class="container">
      <h1>REGISTER</h1>
      <div>
        <form @submit.prevent="registerUser">
         
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" placeholder="email" name="email" v-model="email" class="register-input form-control">
          </div>
          <div class="form-group">
            <label for="userName">User Name</label>
            <input id="userName" type="text" placeholder="User Name" name="userName" v-model="userName" class="register-input form-control">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="password" name="password" v-model="password" class="register-input form-control">
          </div>
          <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <input id="confirm_password" type="password" placeholder="Confirm Password" name="confirm_password" v-model="confirm_password" class="register-input form-control">
          </div>
          <button class="btn btn-register">Register</button>
          <router-link to="/login" class="btn btn-link btn-login card-link">Have you already an account?</router-link>
        </form>
        <br>
        <br>
        <br>
        <br>
      </div>
    </div>
  </template>
  <script>
  import { mapActions } from 'vuex';
  export default{
    data(){
      return{
        userName:"",
        email:"",
        password:"",
        confirm_password:""
      };
    },
    methods:{
      ...mapActions(['register']),
      registerUser(){
        let user={
            userName:this.userName,
            email:this.email,
            password:this.password,
            confirm_password:this.confirm_password
        };
        this.register(user).then(res => {
    
    if (res.data.success) {
      this.$router.push("login");
    }
  });
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
  
  width: 200px;
  gap: 50px;
 
}

.btn-register{
  background-color: #183D3D;
  color: #ffff;
}
.btn-register:hover{
  background-color: #255757;
 
}

.btn-login{
  background-color: #5C8374;
  color: #ffff;}
.btn-login:hover{
  background-color: #38574b;
}

.register-input{
  background-color: #5C8374;
  color: #ffff;
}
</style>