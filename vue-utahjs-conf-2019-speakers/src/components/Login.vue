<template>
    <div class="outer-container">
        <div class="login-container">
            <form @submit.prevent class="login">
                <h1>Utahjs Speaker Login</h1>
                <div class="row">
                    <label>Username*</label>
                    <input 
                        type="text" 
                        v-model="username"
                        name="username"
                    >
                </div>
                <div class="row">
                    <label>Password*</label>
                    <input 
                        type="password" 
                        v-model="password"
                        name="password"
                    >
                </div>
                <button :disabled="false" @click="login()" class="button">LOGIN</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    computed: {
        user() {
            let user = this.$store.getters['user'];

            return user;
        }
    },
    // watch: {
    //     user(value) {
    //         if(value != null) {
    //         }
    //     }
    // },    
    methods: {
        login() {
            let payload = {
                username: this.username,
                password: this.password
            };

            this.$store.dispatch('login', payload);
        }
    },
}
</script>

<style lang="scss" scoped>
.outer-container {
    height: 100%;
    width: 100%;
	display: flex;
	justify-content: center;
    background: url('/mount-wire.jpg');
    // background: url('/dark-canyon.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;    
    

    label, h1 {
        color: white;
    }

    label {
        font-size: 24px;
        font-weight: bold;
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

    .login-container {
        width: 30%;

        .login {
            margin-top: 35px;
            background-color: #2B2B2B;
            grid-area: center;

            h1 {
                padding-top: 20px;
                font-size: 46px;
            }

            .row {

                display: flex;
                justify-content: space-between;
                padding: 20px;
            }

            button {
                margin-bottom: 15px;
            }
        }
    }
}
</style>
