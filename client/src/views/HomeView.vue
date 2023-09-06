<template>
  <section class="home-page">
    <div class="home">
      <img class="logo mx-auto" alt="Vue logo" src="../assets/logo.png">
    </div>
    <div class=" buttons">
      <button v-if="!isJoinRoomPopupVisible && !isCreateRoomPopupVisible" class="btn start-btn-create"
        @click="isCreateRoomPopupVisible = true">Create Room</button>
      <button v-if="!isJoinRoomPopupVisible && !isCreateRoomPopupVisible" class="btn start-btn-join"
        @click="isJoinRoomPopupVisible = true">Join Room</button>
    </div>
    <div class="create-room-popup mx-auto" v-if="isCreateRoomPopupVisible">
      <form @submit.prevent="onCreateRoomSubmit">
        <div class="form-group">
          <label for="roomName">Room Name</label>
          <input v-model="newRoom.name" id="roomName" class="form-control room-input" placeholder="Room Name"
            name="roomName" type="text">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="newRoom.password" id="password" class="form-control room-input" placeholder="Password"
            name="password" type="text">
        </div>
        <button type="submit" class="btn btn-create-room ">Create</button>
        <button class="btn btn-create-room-close " @click="isCreateRoomPopupVisible = false">Close</button>
      </form>
    </div>

    <div class="join-room-popup mx-auto" v-if="isJoinRoomPopupVisible && !isPasswordPopupVisible">
      <ul class="list-group room-list">
        <li class="list-group-item room-list-name" v-for="room in rooms" :key="room.shortId">
          <div class="room-info">
            <h1 class="join-room-name">{{ room.name }}</h1>
            <div class="join-room-btns">
              <button class="btn join-room-btn-password" @click="onPasswordPopup(room)">Enter Password</button>
              <button class="btn join-room-btn-join" @click="directJoinRoom(room)">Join</button>
            </div>
          </div>
        </li>
      </ul>
      <button class="btn join-room-popup-btn-close" v-if="!isPasswordPopupVisible"
        @click="isJoinRoomPopupVisible = false">Close</button>
      <br>
      <br>
      <br>
      <br>
    </div>


    <div class=" join-room-popup password-popup mx-auto" v-if="isPasswordPopupVisible">
      <form @submit.prevent="onJoinRoomSubmit">
        <div class="form-group">
          <label for="joinPassword">Password</label>
          <input v-model="joinPassword" id="joinPassword" class="form-control room-input" placeholder="Password"
            name="joinPassword" type="text">
        </div>
        <button type="submit" class="btn join-room-popup-btn-join">Join</button>
        <button class="btn join-room-popup-btn-close" @click="isPasswordPopupVisible = false">Close</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import router from '../router/index';
export default {
  computed: {
    ...mapGetters(['rooms'])
  },
  data() {
    return {
      isCreateRoomPopupVisible: false,
      newRoom: {
        name: '',
        password: '',
      },
      isJoinRoomPopupVisible: false,
      selectedRoomId: null,
      joinPassword: '',
      isPasswordPopupVisible: false,
      currentRoom: null
    }
  },
  methods: {
    ...mapActions(['createRoom', 'getRooms', 'joinRoom',]),
    async onCreateRoomSubmit() {
      try {
        const res = await this.createRoom(this.newRoom);
        if (res.data.room) {


          router.push({ name: 'Game', params: { roomId: res.data.room.shortId } });
        }
        this.isCreateRoomPopupVisible = false;
      } catch (error) {

        console.error('Error creating room:', error);
      }
    },

    onPasswordPopup(room) {
      this.currentRoom = room;
      this.selectedRoomId = room.shortId;
      this.isPasswordPopupVisible = true;
    },
    directJoinRoom(room) {
      if (room.requiresPassword) { // Assuming rooms have a 'requiresPassword' property
        this.onPasswordPopup(room);
      } else {
        this.selectedRoomId = room.shortId;
        this.joinPassword = ""; // No password for rooms that don't require one
        this.onJoinRoomSubmit();
      }
    },
    async onJoinRoomSubmit() {
      try {

        const result = await this.joinRoom({ roomId: this.selectedRoomId, password: this.joinPassword });
        if (result.success) {
          router.push({ name: 'Game', params: { roomId: this.selectedRoomId } });
        } else {
          console.error('Failed to join room:', result.error);

        }
      } catch (error) {
        console.error('Error joining room:', error);

      }
    }


  },


  created() {
    this.getRooms();
    document.body.style.backgroundColor = '#93B1A6'
  },
  beforeUnmount() {
    document.body.style.backgroundColor = '';
  }

}
</script>
<style scoped>
.btn {
  width: 200px;
  gap: 50px;
  margin: 10px;
}

.join-room-popup {
  width: 80%;
}



.create-room-popup {
  width: 80%;
}

.logo {
  width: 300px;
  height: 300px;
}

.room-list-name {
  background-color: #5C8374;
  display: flex;
  align-items: center;
  /* Center items vertically */
  justify-content: space-between;
  /* Separate h1 and buttons */
}

.join-room-btns {
  display: flex;
  flex-direction: column-reverse;
  /* Stack buttons upside down */
  gap: 10px;
  /* Add spacing between buttons */
}

.room-info {
  overflow: hidden;
  width: 100%;
}

.join-room-name {
  float: left;
  margin: 0;
  padding-top: 2rem;
}

.join-room-btns {
  float: right;
}


.join-room-btn-password {
  background-color: #93B1A6;
  color: #ffff;
}

.join-room-btn-password:hover {
  background-color: #556861;
}


.join-room-popup-btn-join,
.start-btn-create,
.room-input,
.btn-create-room {
  background-color: #5C8374;
  color: #ffff;
}

.join-room-popup-btn-join:hover,
.start-btn-create:hover,
.btn-create-room:hover {
  background-color: #38574b;

}

.start-btn-join,
.join-room-popup-btn-close,
.join-room-btn-join,
.btn-create-room-close {
  background-color: #183D3D;
  color: #ffff;
}

.start-btn-join:hover,
.join-room-popup-btn-close:hover,
.join-room-btn-join:hover,
.btn-create-room-close:hover {
  background-color: #255757;

}


@media (max-width: 600px) {
  .room-list-name {
    flex-direction: column;
  }

  .join-room-btns {
    align-items: flex-start;
  }

  .join-room-btns .join-room-btn {
    width: 75%;
  }
}</style>