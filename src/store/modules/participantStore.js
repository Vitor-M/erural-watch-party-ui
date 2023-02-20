import axios from 'axios'


const state = {
  participant: {
    id: null,
    name: '',
    profile_src: '',
    room_id: null
  }
};

const mutations = {
  setParticipant(state, participant) {
    Object.assign(state.participant, participant)
  },
  updateParticipantRomm(state, room) {
      state.participant.room_id = room.id
  }
};

const actions = {
  async createParticipant({ commit }, participant) {
    try {
      commit('setParticipant', participant)
      const response = await axios.post('http://localhost:5000/watch/participants', state.participant);
      const data = response.data
      commit('setParticipant', data)
      sessionStorage.setItem('participant', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  },

  async updateParticipant({ commit }, participant) {
    try {
      commit('setParticipant', participant)
      const response = await axios.put(`http://localhost:5000/watch/participants/${state.participant.id}`, state.participant);
      const data = response.data
      commit('setParticipant', data)
      sessionStorage.setItem('participant', JSON.stringify(data));
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
