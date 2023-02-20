<template>
  <div class="container grid-xs py-2">
    <form @submit.prevent="filterRooms">
      <div class="input-group">
        <input type="text" v-model="filterTerm" class="form-input" />
        <button
          class="btn btn-primary input-group-btn"
          type="submit"
          :class="{
            [loading]: loading,
          }"
        >
          Search
        </button>
      </div>
    </form>
    <p class="text-center py-2 text-gray">Search a room by name or id</p>
    <div class="rooms">
      <table
        class="table table-striped table-hover text-center table-scrollable"
      >
        <thead>
          <tr>
            <th class="bg-gray">Room id</th>
            <th class="bg-gray">Name</th>
            <th class="bg-gray">Watch</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in formattedRooms" :key="room.id">
            <td>#{{ room.id }}</td>
            <td>{{ room.name }}</td>
            <td>
              <router-link
                :to="{ name: 'room', params: { roomId: room.id } }"
                class="btn"
                >Participate</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button class="sticky-btn btn btn-success p-fixed" @click="openModal">
      Create a new room
    </button>
    <RoomEditModal :v-if="showModal" @closeModal="showModal = false" />
  </div>
</template>

<script>
import RoomEditModal from "@/components/RoomEditModal.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "app",
  components: { RoomEditModal },
  setup() {
    const store = useStore();
    const showModal = ref(false);
    const filterTerm = ref("");
    const router = useRouter();

    onMounted(() => {
      store.dispatch("roomStore/loadRooms");
      const savedParticipant = JSON.parse(
        sessionStorage.getItem("participant")
      );
      if (savedParticipant) {
        store.commit("participantStore/setParticipant", savedParticipant);
      } else {
        router.push("/profile");
      }
    });

    const filterRooms = () => {
      store.dispatch("roomStore/filterRooms", filterTerm.value);
    };

    const openModal = () => {
      showModal.value = true;
    };

    const rooms = computed(() => store.state.roomStore.rooms);
    const loading = computed(() => store.state.roomStore.loading);

    const formattedRooms = computed(() => {
      return rooms.value.map((room) => {
        return {
          ...room,
          id: room.id.toString().padStart(4, "0"),
        };
      });
    });

    return {
      rooms,
      loading,
      formattedRooms,
      filterTerm,
      showModal,
      filterRooms,
      openModal,
    };
  },
};
</script>

<style scoped>
.todo-list {
  padding-top: 2rem;
}

.container.grid-xs {
  max-width: 712px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.rooms {
  height: 60vh;
  overflow-y: auto;
}

.rooms thead th {
  position: sticky;
  top: 0;
  z-index: 999;
}

.sticky-btn {
  margin: 2rem auto;
  bottom: 0;
  box-shadow: 0px 0px 14px 2px rgba(71, 70, 70, 0.5);
}
</style>
