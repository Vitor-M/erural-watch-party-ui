<template>
  <div class="modal modal-sm" :class="{ active: show }">
    <a
      class="modal-overlay"
      aria-label="Close"
      @click="$emit('closeModal')"
    ></a>
    <div class="modal-container" role="document">
      <div class="modal-header">
        <div class="modal-title h5">Room Settings</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <form @submit.prevent="createOrUpdateRoom" id="room-form">
            <div class="form-group">
              <label class="form-label" for="input-room-name">Room name</label>
              <input
                class="form-input"
                id="input-room-name"
                type="text"
                placeholder="Name"
                v-model="formRoom.name"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="input-example-7"
                >Youtube link</label
              >
              <input
                class="form-input"
                id="input-example-7"
                type="text"
                placeholder="video url"
                v-model="formRoom.video_url"
              />
            </div>
          </form>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" type="submit" form="room-form">
          {{ formRoom.id ? "Update" : "Create and Enter" }}</button
        ><a class="btn btn-link" aria-label="Close" @click="$emit('closeModal')"
          >Close</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, reactive, onMounted } from "vue";
import router from "@/router";

export default {
  name: "RoomEditModal",

  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const store = useStore();
    const room = computed(() => store.state.roomStore.currentRoom);

    const formRoom = reactive({
      id: room.value ? room.value.id : "",
      name: room.value ? room.value.name : "",
      video_url: room.value ? room.value.video_url : "",
    });

    onMounted(() => {
      if (room.value) {
        formRoom.id = room.value.id;
        formRoom.name = room.value.name;
        formRoom.video_url = room.value.video_url;
      }
    });

    const createOrUpdateRoom = async () => {
      if (formRoom.id) {
        await store.dispatch("roomStore/updateRoom", formRoom);
      } else {
        await store.dispatch("roomStore/createRoom", formRoom);
        router.push("/room");
      }
    };

    return {
      createOrUpdateRoom,
      formRoom,
    };
  },
};
</script>
