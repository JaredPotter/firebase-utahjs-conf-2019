<template>
    <div class="profile-container">
        <div class="img">
            <img :src="profile.photo ? profile.photo : 'profile.svg'" :alt="profile.name">
            <h2 class="name">{{ profile.name }}</h2>
        </div>
        <div class="speaker-bio">
            <div class="tagline"><strong>Tagline:</strong> {{ profile.tagline }}</div>
            <div class="presentation"><strong>Title:</strong> {{ profile.presentation.title }}</div>
            <div class="description">
                <strong>Description:</strong>
                <!-- <a href=""> -->
                    <span class="shorted-description" @click="openDescriptionModal(profile.name)">
                        {{ getTrimmedDescription(profile.presentation.description) }}
                    </span>
                <!-- </a> -->


                <!-- <Tooltip
                    :content="profile.presentation.description"
                /> -->
                <!-- <button tooltip="tooltip content here" tooltip-position="left" > click here !! </button> -->

                
            </div>
            <div><strong>Theater:</strong> {{ profile.presentation.theater }}</div>
            <div><strong>Start Time:</strong> {{ profile.presentation.time }}</div>
            <div><strong>Length:</strong> {{ profile.presentation.length }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        profile: Object
    },
    methods: {
        getTrimmedDescription(string) {
            if(string) {
                const trimmed = string.substring(0, 50) + '...';

                return trimmed;
            }

            return '';
        },
        openDescriptionModal(name) {
            this.$emit('openDescriptionModal', name);
        }
    },
}
</script>

<style lang="scss">
.profile-container {
    width: 300px;
    padding: 5px;
    border: 1px solid black;
    margin-right: 10px;
    margin-bottom: 25px;
    display: flex;
    flex-direction: column;
    background: #2B2B2B;
    // justify-content: left;

    .speaker-bio {
        text-align: left;
    }

    .img {
        img {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border: 1px solid #F6DF5A;
        }
        
        .name {
            color: #F6DF5A;
        }
    }

    .description, .speaker-bio {
        color: #ccc;
        text-shadow: -1px 1px 0 rgba(0,0,0,0.25);
    }



    .description {
        position: relative;
        display: inline-block;
        // border-bottom: 1px dotted black; /* If you want dots under the hoverable text */

        .shorted-description {
            cursor: pointer;
            color: #F08D34;
        }
    }

    /* description text */
    .description .full-description {
        visibility: hidden;
        width: 450px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 10px 0;
        border-radius: 6px;
    
        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 1;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .description:hover .full-description {
        visibility: visible;
    }
}
</style>