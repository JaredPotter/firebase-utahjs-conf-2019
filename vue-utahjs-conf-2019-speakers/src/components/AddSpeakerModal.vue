<template>
    <div class="add-speaker-modal-container">
      <div class="add-speaker">
        <div v-show="isLoading" class="loading">
          <img src="/loading.svg" class="loading-icon" ref="loadingIconRef">
        </div>       
        <div class="form">
          <h2>Add a Speaker</h2>
          <div class="field">
            <label for="name">Profile Picture:</label>
            <input v-show="!photoFile" name="name" accept="image/jpg" style="color: white;" type="file" @change="fileChanged($event)">
            <div class="photo-name" v-show="photoFile">{{ photoFile.name }} <span @click="photoFile = ''" style="color: red;">X</span> </div>
          </div>
          <div class="field">
            <label for="name">Name:</label>
            <input name="name" type="text" v-model="form.name">
          </div>
          <div class="field">
            <label for="tagline">Tagline:</label>
            <input name="tagline" type="text" v-model="form.tagline">
          </div>
          <div class="field">
            <label for="presentationTitle">Presentation Title:</label>
            <input name="presentationTitle" type="text" v-model="form.presentationTitle">
          </div>
          <div class="field">
            <label for="presentationDescription">Presentation Description:</label>
            <textarea name="presentationDescription" v-model="form.presentationDescription" cols="30" rows="10"></textarea>
          </div>
          <div class="button-box">
            <button @click="saveSpeaker()" class="button">Save</button>          
          </div>
        </div> 
      </div>
    </div>
</template>

<script>
import { firestore, storage } from '../../firebaseInit';
import uuidv4 from 'uuid/v4';
import { TweenMax } from 'gsap';

export default {
    data() {
        return {
            photoFile: '',
            form: {
                name: '',
                tagline: '',
                presentationTitle: '',
                presentationDescription: '',
            },            
            isLoading: false,
        };
    },
    methods: {
        fileChanged(e) {
            this.photoFile = e.target.files[0];
        },        
        saveSpeaker() {
        // Validate fields.
        if(
          !this.photoFile ||
          !this.form.name ||
          !this.form.tagline ||
          !this.form.presentationTitle ||
          !this.form.presentationDescription
        ) {
          // Failed validation.
          alert('Validation Error: Ensure All Required Fields.');

          return;
        }

        this.isLoading = true;

        // Start Loading Spinner
        TweenMax.to(this.$refs.loadingIconRef, 2.5, {rotation:'360', ease:Linear.easeNone, repeat: -1, paused: false});

        // Upload image.
        let storageRef = storage.ref();
        const uuid = uuidv4();
        let photoRef = storageRef.child(`profiles/${uuid}.jpg`);
        const file = this.photoFile;

        photoRef.put(file).then((snapshot) => {
            console.log('Uploaded a file!');

            photoRef.getDownloadURL().then((url) => {
            const speaker = {
                name: this.form.name,
                tagline: this.form.tagline,
                photo: url,
                presentation: {
                  description: this.form.presentationDescription,
                  title: this.form.presentationTitle,
                  length: '30 min',
                  theater: 'Theater 13',
                  time: '1:00 PM'
                }
            };
            
            firestore.collection('speakers').add(speaker).then((result) => {
                // Close modal.
                this.$emit('close');
            })
            .catch((error) => {
                debugger;
              });
            });
        });
      }        
    }
}
</script>

<style lang="scss">
.add-speaker-modal-container {
  position: relative;
  
  .loading {
    height: 100%;
    width: 100%;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading-icon {
      width: 50%;
      height: 50%;
      
      z-index: 101;
  }   

  .add-speaker {
    width: 100%;
    background: #2B2B2B;
    padding: 10px;
    position: relative;
      
    .form {
      display: flex;
      flex-direction: column;

      .field {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }   

      label, h2 {
        color: #F3DE70;
      }    

      h2 {
        font-size: 50px;
      }

      label {
        font-size: 26px;
      }      
    }        
  }

  button {
    width: 20%;
    font-size: 26px;
  }

    input {
        background-color: #fff;
        border: 0;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: rgba(0,0,0,.87);
        font-size: 16px;
        font-weight: 400;
        line-height: 20px;
        margin: 0;
        max-width: 100%;
        outline: 0;
        padding: 8px!important;
        -webkit-transition: box-shadow .15s;
        transition: box-shadow .15s;
        vertical-align: middle;
        -webkit-appearance: none;
        -webkit-box-shadow: 0 0 0 2px transparent inset, 0 0 0 1px #e0e0e0 inset;
        box-shadow: 0 0 0 2px transparent inset, 0 0 0 1px #e0e0e0 inset;
        width: 390px;
        max-height: 36px;        
    }  

    .photo-name {
      color: white;

      span {
        color: red;
        cursor: pointer;
      }
    }
}
</style>