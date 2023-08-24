<template>
  <div class="about">
    <div class="buttons mx-auto">
      <button class="btn" v-if="!isTurkishOn && !isAboutMeOn" @click="isTurkishOn = true">TR</button>
      <button class="btn" v-if="isTurkishOn && !isAboutMeOn" @click="isTurkishOn = false">EN</button>
      <button class="btn" v-if="!isAboutMeOn" @click="isAboutMeOn = true">About me</button>
      <button class="btn" v-if="isAboutMeOn && !isAboutmeTurkishOn" @click="isAboutmeTurkishOn = true">TR</button>
      <button class="btn" v-if="isAboutMeOn && isAboutmeTurkishOn" @click="isAboutmeTurkishOn = false">EN</button>
    </div>
    
    <div class="info">
      <div class="turkish mx-auto" v-if="isTurkishOn && !isAboutMeOn">
        <p>
          Bu Oyun bir arkadaşlarınız ile birlikte oynayabileceğiniz buton bazlı bir oyun. <br>
          Her oda iki kişinin oynaması için uygundur. <br>
          Her oyuncu her oyunda: <br>
          Super attack özelliğini 1 kere. <br>
          Heal özelliğini 2 kere. <br>
          Attack özelliğini ise oyun bitene kadar kullanabilir. <br>
          Oyunda beklenmedik bir anda Rastgele gerçekleşen bir etkinlik ile oyunu kaybedebilir veya kazanabilirsiniz.
        </p>
      </div>
      <div class="english mx-auto" v-if="!isTurkishOn && !isAboutMeOn">
        <p>
          This Game is a button based game that you can play with your friends. <br>
          Each room is suitable for two people to play. <br>
          Every player in every game: <br>
          Super attack feature once. <br>
          Heal feature 2 times. <br>
          He can use the Attack feature until the game is over. <br>
          You can lose or win the game with an unexpected event in the game.
        </p>
      </div>
      <div class="about-me-turkish" v-if="isAboutMeOn && isAboutmeTurkishOn ">
        <p>
          Merhaba! Ben Furkan. Bilgisayar Mühendisliği 2. sınıf öğrencisiyim. <br>
          Bu projeyi Socket.io ve Vue.js bilgilerimi geliştirmek için yaptım. <br>
          Benimle iletişime geçmek isterseniz sayfanın en altında Linkedin logosuna tıklayabilirisiniz
        </p>
        <button class="btn" @click="isAboutMeOn = false">Kapat</button>
      </div>
      <div class="about-me-english" v-if="isAboutMeOn && !isAboutmeTurkishOn">
        <p>
          Hello! I am Furkan. I am a 2nd year Computer Engineering student. <br>
          I made this project to improve my knowledge of Socket.io and Vue.js. <br>
          If you want to contact me, you can click the Linkedin logo at the bottom of the page.
        </p>
        <button class="btn" @click="isAboutMeOn = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTurkishOn: true,
      isAboutMeOn: false,
      isAboutmeTurkishOn: true
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

.info{
  margin-top: 100px;
}
.btn{
  margin: 20px;
  background-color: #183D3D;
  color: #ffff;
  width: 200px;
  gap: 50px;
 
}
.btn:hover{
  background-color: #255757;
 
}
</style>
