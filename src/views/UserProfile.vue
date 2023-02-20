<template>
  <div class="container grid-xs">
    <h2 class="p-centered text-normal text-center p-2 s-rounded">
      Participant Profile
    </h2>
    <form
      class="form-group profile-form"
      @submit.prevent="createOrUpdateParticipant"
    >
      <div class="input-group">
        <input
          type="text"
          class="form-input text-center"
          placeholder="Display name"
          v-model="formUser.name"
        />
      </div>
      <div class="columns">
        <div v-for="index in 12" :key="index" class="column col-3 text-center">
          <img
            size="120"
            class="s-circle profile-img"
            v-bind:src="'src/assets/avatar_icon/Clipped-' + index + '.png'"
            @click="changeSelectedImg(index)"
            :class="{ selected: selectedImg === index }"
          />
        </div>
      </div>
      <button class="btn btn-primary btn-save p-centered my-2" type="submit">
        {{ formUser.id ? "Update Profile" : "Start a new session" }}
      </button>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, reactive, onMounted, ref } from "vue";
import router from "@/router";

export default {
  name: "Profile",

  setup() {
    const store = useStore();
    const participant = computed(
      () => store.state.participantStore.participant
    );

    const formUser = reactive({
      id: participant.value ? participant.value.id : "",
      name: participant.value ? participant.value.name : "",
      profile_src: participant.value ? participant.value.profile_src : "",
    });

    onMounted(() => {
      const savedParticipant = JSON.parse(
        sessionStorage.getItem("participant") || "null"
      );
      if (savedParticipant) {
        store.commit("participantStore/setParticipant", savedParticipant);
        formUser.id = savedParticipant.id;
        formUser.name = savedParticipant.name;
        formUser.profile_src = savedParticipant.profile_src;
      }
    });

    const createOrUpdateParticipant = async () => {
      if (formUser.id) {
        await store.dispatch("participantStore/updateParticipant", formUser);
      } else {
        await store.dispatch("participantStore/createParticipant", formUser);
      }
      router.push("/");
    };

    const selectedImg = ref(null);

    function changeSelectedImg(index) {
      formUser.profile_src = `src/assets/avatar_icon/Clipped-'${index}.png`;
      selectedImg.value = index;
    }

    return {
      createOrUpdateParticipant,
      changeSelectedImg,
      formUser,
      selectedImg,
    };
  },
};
</script>

<style scoped>
.container.grid-xs {
  max-width: 712px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}

h2 {
  width: 100%;
  font-size: 1.1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-form input {
  border: 1px solid var(--purple-40);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
}

.profile-img {
  border: 1.8px solid var(--purple-40);
  width: 140px;
}

.profile-img:hover {
  cursor: pointer;
  background-color: var(--purple-40);
}

.btn-save {
  width: 50%;
}
</style>
