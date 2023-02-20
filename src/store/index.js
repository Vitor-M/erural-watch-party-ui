import { createStore } from 'vuex'
import roomStore from './modules/roomStore'
import participantStore from './modules/participantStore'

const store = createStore({
  modules: {
    roomStore,
    participantStore
  }
})

export default store