import axios from 'axios'


const state = {
  rooms: [],
  currentRoom: null,
  loading: false
};

const mutations = {
  setRooms(state, rooms) {
    state.rooms = rooms
  },
  setLoading(state, status) {
      state.loading = status
  },
  setCurrentRoom(state, room) {
    state.currentRoom = room
  }
};

const actions = {
  async loadRooms({ commit }) {
    commit('setLoading', true)
    const response = await axios.get('http://localhost:5000/watch/rooms')
    const data = response.data
    commit('setRooms', data)
    commit('setLoading', false)
  },

  async filterRooms({ commit }, filter ) {
    commit('setLoading', true)
    const filter_attribute = !isNaN(filter) ? 'id' : 'name'
    const response = await axios.get(`http://localhost:5000/watch/rooms/search?${filter_attribute}=${filter}`)
    const data = response.data
    commit('setRooms', data)
    commit('setLoading', false)
  },

  async createRoom({ commit }, room) {
    try {
      const response = await axios.post('http://localhost:5000/watch/room', room);
      const data = response.data
      commit('setCurrentRoom', data)
    } catch (error) {
      console.error(error);
    }
  },

  async updateRoom({ commit }, room) {
    try {
      const response = await axios.put(`http://localhost:5000/watch/room/${room.id}`, room);
      const data = response.data
      commit('setCurrentRoom', data)
    } catch (error) {
      console.error(error);
    }
  },

  async getRoom({ commit }, roomId) {
    try {
      const response = await axios.get(`http://localhost:5000/watch/room/${roomId}`);
      const data = response.data
      commit('setCurrentRoom', data)
    } catch (error) {
      console.error(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
