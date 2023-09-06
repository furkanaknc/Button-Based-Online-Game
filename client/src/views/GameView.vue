<template>
  <div class="game-room" v-if="user">
    <div v-if="playerHealth > 0 && opponentHealth > 0">
      <h3>{{ playerName }}'s Health: {{ playerHealth }}</h3>
      <div class="health-bar">
        <div class="health-fill" :style="{ width: playerHealth + '%' }"></div>
      </div>

      <h3>{{ opponentName }}'s Health: {{ opponentHealth }}</h3>

      <div class="health-bar">
        <div class="health-fill opponent" :style="{ width: opponentHealth + '%' }"></div>
      </div>

      <div v-if="turn">
        <button class="btn btn-primary" @click="handleButton1" :disabled="!turn">Basic Attack</button>
        <button class="btn btn-warning" @click="handleButton2" :disabled="!turn || button2Used">Super Attack</button>
        <button class="btn btn-danger" v-if="!specialButtonUsed" @click="handleSpecialButton">
          {{ specialButtonText }}
        </button>
        <button class="btn btn-success" @click="handleButton3" :disabled="!turn || button3Count >= 2">Heal</button>
        <button class="btn btn-secondary" @click="surrender" :disabled="!turn">Surrender</button>
        <h2>You have {{ timeLeft }} seconds to act.</h2>
      </div>
      <div v-else>
        <h2>Waiting for opponent's move...</h2>
      </div>
      <button class="btn btn-sound" @click="toggleSound">{{ soundOn ? 'Sound Off' : 'Sound On' }}</button>
      <div class="mt-4">
        <div class="card">
          <div class="card-header game-log-text">Game Logs</div>
          <ul class="list-group list-group-flush">
            <li v-for="log in gameLogs" :key="log.id" class="list-group-item game-log-list">
              <h3 id="game-logs">{{ log.message }}</h3>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <div v-if="playerHealth <= 0">
      <h1>You lost!</h1>
      <router-link class="btn route-btn" to="/"> HOME</router-link>
    </div>

    <div v-if="opponentHealth <= 0">
      <h1>You won!</h1>
      <router-link class="btn route-btn" to="/"> HOME</router-link>
    </div>
  </div>
  <br>
  <br>
  <br>
  <br>
</template>

<script>
import io from 'socket.io-client';
import { mapActions, mapGetters } from "vuex";


export default {
  computed: {
    ...mapGetters(['user', 'userName']),
    playerName() {
      return this.userName
    },
    specialButtonText() {
      switch (this.specialButton) {
        case 'damage30':
          return 'Damage Opponent by 30';
        case 'swapHealths':
          return 'Swap Health with Opponent';
        case 'heal30':
          return 'Heal Yourself by 30';
        case 'heal50':
          return 'Heal Yourself by 50'
        case 'damage40':
          return 'Damage Opponent by 40';
        default:
          return 'Use Special Move';
      }
    }
  },

  data() {
    return {
      socket: null,
      turn: false,
      playerHealth: 100,
      opponentHealth: 100,
      button2Used: false,
      button3Count: 0,
      specialButton: '',
      specialButtonUsed: false,
      timer: null,
      timeLeft: 5,
      gameLogs: [],
      logCounter: 0,
      opponentName: 'Enemy',
      soundOn: true,
      pingSound: new Audio(require('@/assets/pingSound.mp3')),
      damageSound: new Audio(require('@/assets/damageSound.mp3')),
      healSound: new Audio(require('@/assets/healSound.mp3')),
      swapSound: new Audio(require('@/assets/swapSound.mp3')),
    };
  },
  methods: {
    ...mapActions(['getProfile']),
    addLog(message) {
      this.gameLogs.unshift({ id: this.logCounter++, message });
      if (this.gameLogs.length > 10) {
        this.gameLogs.pop();
      }
    },
    connectSocket(roomId) {
      this.socket = io({ withCredentials: true });
      this.socket.emit('set-username', this.userName);
      this.socket.emit('join-room', roomId);

      this.socket.on('start-game', (data) => {
        this.opponentName = data.opponentName;
        this.initializeGame();
      });

      this.socket.on('turn', () => {
        this.turn = true;
        this.startTimer();
      });

      this.socket.on('log-message', (message) => {
        this.addLog(message);
      });


      this.socket.on('damage-received', (damage) => {
        this.playerHealth -= damage;
        this.turn = false;
        this.stopTimer();
        if (this.soundOn) {
          this.damageSound.play();
        }
      });

      this.socket.on('healed', (health) => {
        this.playerHealth += health;
        this.turn = false;
        this.stopTimer();
      });


      this.socket.on('opponent-healed', (health) => {
        this.opponentHealth += health;
        if (this.soundOn) {
          this.healSound.play();
        }
      });

      this.socket.on('opponent-surrendered', () => {
        this.opponentHealth = 0;
      });

      this.socket.on('health-swapped', () => {
        [this.playerHealth, this.opponentHealth] = [this.opponentHealth, this.playerHealth];
        if (this.soundOn) {
          this.swapSound.play();
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error("Failed to connect:", error);

      });

      this.socket.on('connect', () => {

      });
    },

    initializeGame() {
      this.assignSpecialButton();
    },
    toggleSound() {
      this.soundOn = !this.soundOn;
      if (!this.soundOn && this.pingSound) {
        this.pingSound.pause();
        this.pingSound.currentTime = 0;
      }
    },

    startTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timeLeft = 10;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          if (this.soundOn) { this.pingSound.play(); }
          this.timeLeft--;
        } else {
          this.surrender();
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timeLeft = 10;
    },

    randomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomEvent() {
      let randomChance = Math.random();


      if (randomChance <= 0.10) {
        let damageValue = this.randomBetween(1, 50);
        this.socket.emit('random-damage', { damage: damageValue, roomId: this.$route.params.roomId, userName: this.user.userName });
        this.opponentHealth -= damageValue;
        this.turn = false;
        this.stopTimer();
      } else if (randomChance <= 0.15) {
        this.socket.emit('swap-health', { roomId: this.$route.params.roomId, userName: this.user.userName });
        [this.playerHealth, this.opponentHealth] = [this.opponentHealth, this.playerHealth];
        this.turn = false;
        this.stopTimer();
      } else if (randomChance <= 0.20) {
        let healValue = this.randomBetween(10, 20);
        this.socket.emit('random-heal', { health: healValue, roomId: this.$route.params.roomId, userName: this.user.userName });
        this.playerHealth += healValue;
        this.turn = false;
        this.stopTimer();
      }

    },
    assignSpecialButton() {
      const buttons = ['damage30', 'swapHealths', 'heal30', 'heal50', 'damage40'];
      this.specialButton = buttons[Math.floor(Math.random() * buttons.length)];
    },

    handleSpecialButton() {
      if (!this.specialButton || this.specialButtonUsed) {
        console.log("Special button not assigned or already used.");
        return;
      }

      const specialActions = {
        'damage30': () => {
          this.opponentHealth -= 30;
          this.socket.emit('damage', { damage: 30, roomId: this.$route.params.roomId, userName: this.user.userName });
          this.turn = false;
          this.stopTimer();
        },
        'swapHealths': () => {
          const tempHealth = this.playerHealth;
          this.playerHealth = this.opponentHealth;
          this.opponentHealth = tempHealth;
          this.socket.emit('swap-health', { roomId: this.$route.params.roomId, userName: this.user.userName });
          this.startTimer();

        },
        'heal30': () => {
          this.socket.emit('heal', { health: 30, roomId: this.$route.params.roomId, userName: this.user.userName });
          this.stopTimer();
        },
        'heal50': () => {
          this.socket.emit('heal', { health: 50, roomId: this.$route.params.roomId, userName: this.user.userName });
          this.stopTimer();
        },
        'damage40': () => {
          this.opponentHealth -= 40;
          this.socket.emit('damage', { damage: 40, roomId: this.$route.params.roomId, userName: this.user.userName });
          this.turn = false;
          this.stopTimer();
        }
      };

      if (specialActions[this.specialButton]) {
        console.log(`Executing special action: ${this.specialButton}`);
        specialActions[this.specialButton]();
        this.specialButtonUsed = true;

      }
    },


    button1() {
      const damage = this.randomBetween(1, 10);
      this.socket.emit('damage', { damage, roomId: this.$route.params.roomId, userName: this.user.userName });
      this.opponentHealth -= damage;
      this.turn = false;
      this.stopTimer();
      //this.addLog(`${this.playerName} damaged for ${damage} points.`);

    },

    button2() {
      const damage = this.randomBetween(10, 50);
      this.socket.emit('damage', { damage, roomId: this.$route.params.roomId, userName: this.user.userName });
      this.opponentHealth -= damage;
      this.button2Used = true;
      this.turn = false;
      this.stopTimer();
      //this.addLog(`${this.playerName} damaged for ${damage} points.`);


    },

    button3() {
      const health = this.randomBetween(20, 30);
      const effectiveHeal = Math.min(100 - this.playerHealth, health); // Don't allow health to exceed 100
      this.socket.emit('heal', { health: effectiveHeal, roomId: this.$route.params.roomId, userName: this.user.userName });
      // this.playerHealth += effectiveHeal;
      this.button3Count++;
      this.turn = false;
      this.stopTimer();
      //this.addLog(`${this.playerName} healed for ${health} points.`);

    },

    surrender() {
      const roomId = this.$route.params.roomId;
      this.socket.emit('surrender', { roomId, userName: this.user.userName });
      this.playerHealth = 0;
      this.turn = false;
      this.stopTimer();
    },

    handleButton1() {
      this.randomEvent();
      this.button1();
    },
    handleButton2() {
      this.randomEvent();
      this.button2();
    },
    handleButton3() {
      this.randomEvent();
      this.button3();
    },

  },
  async created() {
    await this.getProfile();
    const roomId = this.$route.params.roomId;
    this.connectSocket(roomId);
    document.body.style.backgroundColor = '#93B1A6';
  },
  beforeUnmount() {
    this.pingSound.pause();
    this.pingSound.currentTime = 0;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    if (this.socket) this.socket.disconnect();
    document.body.style.backgroundColor = ''
  }
}
</script>

<style scoped>
.health-bar {
  width: 100%;
  height: 20px;
  background-color: #ddd;
  margin: 10px 0;
  border-radius: 10px;
}

.health-fill {
  height: 100%;
  background-color: green;
  transition: width 0.5s ease;
  border-radius: 10px;
}

.health-fill.opponent {
  background-color: red;
}

.route-btn,
.btn-sound {
  background-color: #183D3D;
  color: #fff;
}

.route-btn:hover,
.btn-sound:hover {
  background-color: #255757;
}

.btn {
  width: 200px;
  gap: 50px;
  margin: 10px;
}

.game-log-list {
  background-color: #183D3D;
  color: #fff;
}

.game-log-text {
  background-color: #5C8374;
  color: #fff;
}
</style>

