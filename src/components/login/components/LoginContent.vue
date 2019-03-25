<template>
  <div class="content">
    <input type="text" placeholder="请输入账号" v-model="phone">
    <input type="password" placeholder="请输入密码" v-model="password">
    <div class="login" @click="login">登录</div>
    <div class="problem">
      <router-link tag="span" to="/register">注册会员</router-link>
      <router-link tag="span" to="/retrieve">找回密码</router-link>
    </div>
  </div>
</template>

<script>
import router from "@/router";
export default {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    async login() {
      if (!this.phone || !this.password) {
        this.$toasted.error("请输入完善信息", { icon: "error" }).goAway(2000);
        return;
      }
      try {
        // await等待一个异步返回的结果 如果没有await 会报user is undefined 获取不到
        let res = await this.http.post("/api/login", {
          username: this.phone,
          password: this.password
        });
        if (res.code == 200) {
          this.$store.commit("loginbanner", res.data.banners);
          this.$store.dispatch("login", res.data.user);
          this.$toasted.success("登录成功").goAway(1500);
          this.$router.replace({ name: "home" });
        } else {
          this.$toasted.error(res.message, { icon: "error" }).goAway(2000);
        }
      } catch (error) {
        this.$toasted.error(error.message, { icon: "error" }).goAway(2000);
      }
    }
  }
};
</script>

<style scoped>
.content {
  width: 4rem;
  height: 3.7rem;
  margin: 0 auto;
}
.content > :nth-child(1) {
  margin-bottom: 0.1rem;
  background: url("../../../../public/image/phonenumber.png") no-repeat center;
  background-size: 0.4rem 0.48rem;
  background-position: 0.16rem;
}
.content > :nth-child(2) {
  margin-bottom: 0.1rem;
  background: url("../../../../public/image/passwordicon.png") no-repeat center;
  background-size: 0.4rem 0.42rem;
  background-position: 0.16rem;
}
.content input {
  width: 100%;
  height: 0.8rem;
  border: 1px solid black;
  border-radius: 0.2rem;
  padding: 0.05rem 0rem 0.05rem 0.6rem;
}
.login {
  width: 100%;
  height: 0.8rem;
  border-radius: 0.2rem;
  background: url("../../../../public/image/smallbutton.png") no-repeat center;
  background-size: 100% 0.8rem;
  margin-top: 0.62rem;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.3rem;
  color: #ffffff;
}
.problem {
  width: 100%;
  height: 0.44rem;
  display: flex;
  justify-content: space-between;
}
.problem span {
  width: 1.2rem;
  height: 0.44rem;
  line-height: 0.44rem;
  text-align: center;
  font-size: 0.24rem;
}
</style>