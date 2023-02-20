import { createStore } from 'vuex'
import participantStore from './modules/participantStore'

const store = createStore({
  modules: {
    participantStore
  }
})

export default store