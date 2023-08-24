import axios from "axios";
import router from "../router/index";

const state = {
    token: localStorage.getItem('token') || '',
    user: {},
    status: '',
    rooms: [],
    createdRoom: null,
    error: null
};

const getters = {
    isLoggedIn: state => !!state.token,
    authState: state => state.status,
    user: state => state.user,
    error: state => state.error,
    rooms: state => state.rooms,
};

const actions = {
    // Login Action
    async login({
        commit
    }, user) {
        commit('auth_request');
        try {
            let res = await axios.post('/api/users/login', user)
            
            if (res.data.success) {
                const token = res.data.token;
                const user = res.data.user;
               
               
                localStorage.setItem('token', token);
                // Set the axios defaults
                axios.defaults.headers.common['Authorization'] = token;
                commit('auth_success', token, user);
            }
            return res;
        } catch (err) {
            commit('auth_error', err);
        }
    },
    // Register User
    async register({
        commit
    }, userData) {
        try {
            commit('register_request');
            let res = await axios.post('/api/users/register', userData);
            if (res.data.success !== undefined) {
                commit('register_success');
            }
            return res;
        } catch (err) {
            commit('register_error', err)
        }
    },
    async getProfile({ commit }) {
        commit('profile_request');
        try {
            let res = await axios.get('/api/users/profile');

            if (res.data.user) {
                commit('user_profile_success', res.data.user);
            } else {
                commit('user_profile_error', 'Failed to fetch user profile');
            }

            return res;
        } catch (error) {
            commit('user_profile_error', 'Failed to fetch user profile');
            console.error("Failed to fetch user profile:", error);
        }
    },


    // Logout the user
    async logout({
        commit
    }) {
        await localStorage.removeItem('token');
        commit('logout');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login');
        return
    },
    async createRoom({ commit }, roomData) {
        commit('room_request');
        try {
            let res = await axios.post('/api/rooms/create-room', roomData);
            commit('room_success', res.data.room);
            return res;
        } catch (err) {
            commit('room_error', err);
        }
    },

    async getRooms({ commit }) {
        commit('rooms_request');
        try {
            let res = await axios.get('/api/rooms/rooms');
            commit('rooms_success', res.data.rooms);
        } catch (err) {
            commit('rooms_error', err);
        }
    },
    async joinRoom({ commit }, { roomId, password }) {
        commit('join_room_request');
        try {
            let res = await axios.post('/api/rooms/verify', { roomId, password });
            
            if (res.data.isPasswordCorrect) {
                commit('join_room_success');
                return { success: true };
            } else {
                commit('join_room_error', 'Password Incorrect');
                return { success: false, error: 'Password Incorrect' };
            }
        } catch (error) {
            commit('join_room_error', error.response.data.msg || 'Failed to verify room password');
            console.error("Failed to verify room password:", error);
            throw error;
        }
    }
    
    
   
    
};

const mutations = {
    auth_request(state) {
        state.error = null
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.token = token;
        state.user = user;
        state.status = 'success';
        state.error = null;
    },
    
    auth_error(state, err) {
        state.error = err.response.data.msg
    },
    register_request(state) {
        state.error = null
        state.status = 'loading'
    },
    register_success(state) {
        state.error = null;
        state.status = 'success';
      },      
    register_error(state, err) {
        state.error = err.response.data.msg
    },
    profile_request(state) {
        state.status = 'loading';
        state.error = null;
    },

    user_profile_success(state, user) {
        state.user = user;
        state.status = 'success';
        state.error = null;
    },

    user_profile_error(state, error) {
        state.status = 'error';
        state.error = error;
    },
 

    logout(state) {
        state.error = null
        state.status = ''
        state.token = ''
        state.user = ''
        state.role = ''
    },
    room_request(state) {
        state.error = null;
        state.status = 'loading';
    },

    room_success(state, room) {
        state.createdRoom = room;
        state.status = 'success';
        state.error = null;
    },

    room_error(state, err) {
        state.error = err.response.data.msg;
    },
    rooms_request(state) {
        state.error = null;
        state.status = 'loading';
    },

    
    rooms_success(state, rooms) {
        state.rooms = rooms;
        state.status = 'success';
        state.error = null;
    },

    
    rooms_error(state, err) {
        state.error = err.response.data.msg;
    },
    join_room_request(state) {
        state.error = null;
        state.status = 'loading';
    },
    
    join_room_success(state) {
        state.status = 'success';
        state.error = null;
    },
    
    join_room_error(state, error) {
        state.status = 'error';
        state.error = error;
    },
      
   
};

export default {
    state,
    actions,
    mutations,
    getters
};
