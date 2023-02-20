<template>
  <div class="container grid-xs my-1">
    <h2
      class="p-centered my-2 text-normal text-center p-2 s-rounded"
      v-if="formattedRoom && formattedRoom.name"
    >
      Room - {{ formattedRoom.name }}
      <span class="text-gray">#{{ formattedRoom.id }}</span>
    </h2>
    <div class="video-box">
      <div class="video-responsive my-1">
        <iframe
          class="s-rounded"
          :src="
            formattedRoom && formattedRoom.video_url
              ? formattedRoom.video_url
              : ''
          "
          allow="autoplay"
          id="video-player"
        ></iframe>
      </div>
      <div class="tile">
        <div class="tile-content">
          <div class="player-menu p-2">
            <button
              @click="handleVideoState"
              class="btn s-rounded btn-link text-light"
            >
              {{ videoState.isPlaying ? "Plause" : "Play" }} for everyone
            </button>
            <a class="float-right" @click="openModal"
              ><i class="icon icon-menu text-light text-bold my-1"></i
            ></a>
          </div>
        </div>
      </div>
      <!-- <button @click="sendSyncCommand('pause')" class="btn">Pause</button> -->
    </div>
    <RoomEditModal :v-if="showModal" @closeModal="showModal = false" />
  </div>
</template>

<script>
import RoomEditModal from "@/components/RoomEditModal.vue";
import { useStore } from "vuex";
import { computed, ref, onMounted, onBeforeUnmount, reactive } from "vue";
import io from "socket.io-client";

const videoState = reactive({
  isPlaying: false,
  currentTime: 0,
});

export default {
  name: "Room",
  components: { RoomEditModal },
  props: {
    roomId: {
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const showModal = ref(false);
    const currentRoom = computed(() => store.state.roomStore.currentRoom);

    const participant = computed(
      () => store.state.participantStore.participant
    );

    onMounted(() => {
      if (!currentRoom.value || currentRoom.value.id !== props.roomId) {
        store.dispatch("roomStore/getRoom", props.roomId);
      }

      const savedParticipant = JSON.parse(
        sessionStorage.getItem("participant") || "null"
      );
      if (savedParticipant) {
        store.commit("participantStore/setParticipant", savedParticipant);
      }

      refs.videoPlayer = document.getElementById("video-player");
      socket.connect();
      socket.emit("join", {
        room_id: parseInt(props.roomId).toString(),
        participant_id: participant.value.id,
      });
      socket.emit("list_participants", {
        room_id: parseInt(props.roomId).toString(),
      });
      console.log({
        room_id: parseInt(props.roomId).toString(),
        participant_id: participant.value.id,
      });
    });

    const openModal = () => {
      showModal.value = true;
    };

    const formattedRoom = computed(() => {
      if (currentRoom.value) {
        const regex =
          /(?:youtube.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu.be\/)([^"&?/ ]{11})/;
        const match = currentRoom.value.video_url.match(regex);
        const video_id = match ? match[1] : null;
        return {
          ...currentRoom.value,
          id: currentRoom.value.id.toString().padStart(4, "0"),
          video_url: `https://www.youtube.com/embed/${video_id}?enablejsapi=1`,
        };
      }
    });

    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
    socket.on("room_message", (data) => {
      console.log("Received message: ", data);
    });
    socket.on("participants_list", (data) => {
      console.log("Participantes message: ", data);
    });
    socket.on("play", (data) => {
      console.log("Received play command from server");
      videoState.isPlaying = true;
      videoState.currentTime = data.time;
      refs.videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    });
    socket.on("pause", (data) => {
      console.log("Received pause command from server");
      videoState.isPlaying = false;
      videoState.currentTime = data.time;
      refs.videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    });

    function handleVideoState() {
      if (videoState.isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }

    function playVideo() {
      const currentTime = videoState.currentTime;
      const payload = {
        room_id: parseInt(currentRoom.value.id).toString(),
        participant_id: participant.value.id,
        time: currentTime,
      };
      socket.emit("play", payload);
      videoState.isPlaying = true;
      refs.videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    }

    function pauseVideo() {
      const currentTime = videoState.currentTime;
      const payload = {
        room_id: parseInt(currentRoom.value.id).toString(),
        participant_id: participant.value.id,
        time: currentTime,
      };
      socket.emit("pause", payload);
      videoState.isPlaying = false;
      refs.videoPlayer.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    }

    const refs = {
      videoPlayer: null,
    };

    onBeforeUnmount(() => {
      socket.emit("leave", {
        room_id: parseInt(currentRoom.value.id).toString(),
        participant_id: participant.value.id,
      });
      socket.disconnect();
    });

    return {
      formattedRoom,
      participant,
      showModal,
      openModal,
      videoState,
      handleVideoState,
    };
  },
};
</script>

<style scoped>
h2 {
  width: 100%;
  font-size: 1.1rem;
  background-color: var(--purple-40);
}

.container.grid-xs {
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2rem;
}

.video-box iframe {
  width: 100%;
  border: 2px solid var(--purple-40);
}

.player-menu {
  width: 100%;
  background-color: var(--purple-40);
}

.player-menu i {
  font-size: large;
}
</style>
