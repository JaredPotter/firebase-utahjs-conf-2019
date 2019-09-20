<template>
  <div id="app" class="app-container">
    <Modal 
      v-if="isModalVisable"
      @close="closeModal()"
    >
      <AddSpeakerModal
        v-if="modalType === 'addSpeaker'"
        @close="closeAddSpeakerModal()"
      />
      <PresentationModal
        v-if="modalType === 'presentation'"
        :presentation="presentation"
        @close="closePresentationModal()"
      />
    </Modal>
    <Login v-if="!user"/>
    <div v-if="user" class="primary">
      <div class="user-welcome">Welcome, {{ user.email }} - <button @click="logout()" class="button">Logout</button></div>
      <div class="top-bar">
        <img class="logo" src="header-logo.png" alt="UtahJs">
        <div class="title-box">
          <h1 class="title">UtahJs Conf 2019 - Speakers</h1>
        </div>
      </div>      
      <div class="black-bar">
        <span @click="openAddSpeakerModal()" class="add-a-speaker">Add a Speaker</span>
      </div>
      <div class="speaker-list">
        <Profile 
          v-for="profile in profiles" 
          :key="profile.name" 
          :profile="profile"
          class="profile"
          @openDescriptionModal="openDescriptionModal($event)"
        />
      </div>      
    </div>
  </div>
</template>

<script>
import Profile from './components/Profile.vue';
import Login from './components/Login.vue';
import Modal from './components/Modal.vue';
import AddSpeakerModal from './components/AddSpeakerModal.vue';
import PresentationModal from './components/PresentationModal.vue';

import { auth, firestore, storage } from '../firebaseInit';

export default {
  name: 'app',
  components: {
    Profile, Login, Modal, AddSpeakerModal, PresentationModal
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    openAddSpeakerModal() {
      this.modalType = 'addSpeaker';
      this.isModalVisable = true;
    },
    openDescriptionModal(name) {
      const speaker = this.profiles.find((s) => {
        return s.name === name;
      });

      this.presentation = speaker.presentation;
      this.modalType = 'presentation';
      this.isModalVisable = true;      
    },
    closeAddSpeakerModal() {
      this.fetchSpeakers(this.user);
      this.closeModal();
    },
    closePresentationModal() {
      this.closeModal();
    },
    closeModal() {
      this.isModalVisable = false;            
      this.modalType = '';
    },
    async fetchSpeakers(user) {
      if(user) {
        const docs = (await firestore.collection('speakers').get()).docs;;
        this.profiles = [];
    
        for(let doc of docs) {
          const speaker = doc.data();
    
          this.profiles.push(speaker);
        }
      }
    }
  },
  created() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
            // User is signed in.
            // Fetch Speakers.
            this.fetchSpeakers(user);
  
            this.$store.commit('setUser', user);
        } else {
          // No user is signed in.
          this.$store.commit('setUser', null);
        }
    });
  },
  computed: {
      user() {
          const result = this.$store.getters['user'];

          return result;
      }
  },   
  data() {
    return {
      isModalVisable: false,
      modalType: '',
      presentation: {},
      profiles: [{
        name: 'Jared Potter',
        presentation: 'The Best (free-ish) Platform for Personal Projects, Prototypes, and Enterprise Apps',
        description: `
          Come learn about Firebase, built on top of and ran by Google Cloud Services. Firebase has numerous ala carte tools and services.

          Firebase Services:
          -Authentication (user auth store out of the box)
          -Database (Firestore and Real-Time, NoSQL style)
          -Storage (Google Cloud storage bucket)
          -Hosting (website hosting w/ HTTPS out of the box)
          -Functions (Serverless Functions)
          Come learn about how you can quickly get started, and utilize some of these tools in your next project.        
        `,
        imgUrl: 'https://firebasestorage.googleapis.com/v0/b/utahjs-conf-2019-ff5b7.appspot.com/o/00100sPORTRAIT_00100_BURST20180621210836270_COVER.jpg?alt=media&token=e66f936e-e43b-4716-aeef-8943e6c7df0b'
      }]
    };
  }
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
}

.button {
  padding: 8px 12px;
  font-size: 16px;
  line-height: 1.42857143;
  border-radius: 4px;      
  cursor: pointer;
  border: 1px solid transparent;      
  background-color: #fe5621;
  color: white;
}

.app-container {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .primary {
    .user-welcome  {
      font-size: 18px;
      
      button {
        margin: 4px;
      }
    }
  }

  .top-bar {
    background: #2B2B2B;
    display: flex;
    align-items: center;

    .logo {
      padding-left: 15px;
      padding-bottom: 15px;
      padding-top: 15px;
      text-align: center;
    }

    .title-box {
      width: 100%;
      text-align: center;

      .title {
        font-size: 60px;
        font-weight: bold;
        color: #F7DD56;
        font-weight: bold;
        font-family: Domine, serif;
        margin-top: 22px;
        margin-bottom: 11px;
        margin-left: 10px;    
      }
    }
  }

  .black-bar {
    height: 50px;
    background: black;
    display: flex;
    align-items: center;

    .add-a-speaker {
      color: #F3DE70;
      font-size: 24px;
      margin-left: 25px;
      cursor: pointer;
      padding: 4px;
    }

    .add-a-speaker:hover {
      background: #F3DE70;
      color: black;
    }
  }

  .speaker-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-top: 20px;

    .profile {
      width: 20%;
      border: 1px solid;
      padding:6px;
      box-shadow: 2px 4px #888888;
    }
  }
}
</style>
