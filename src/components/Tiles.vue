<template>

<div>
    <div class="d-flex flex-wrap p-2">
        <button
            v-for="(item, index) in items"
            :key="index"
            class="tile btn p-1 btn-dark d-flex align-items-center justify-content-center" :style="`${
                items.length < 5 ? 'height: 200px; width: 50%;' :
                items.length < 10 ? 'height: 190px; width: 30%;' :
                items.length < 20 ? 'height: 180px; width: 20%;' :
                items.length < 30 ? 'height: 150px; width: 10%;' :
                items.length < 50 ? 'height: 100px; width: 10%;' :
                'height: 60px; width: 10%;'
            }`"
            @click="view(index, item)"
            :class="{'active' : active == index + 1 }"
            data-bs-toggle="modal" data-bs-target="#prizeModal"
        >
        
            <h5>{{index + 1}}</h5>
        </button>
    </div>

    <div class="modal fade " id="prizeModal" tabindex="-1"  aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-transparent">
          <div class="modal-body">
            <div class="text-center text-warning h3 mb-5">Congratulations!!!</div>
            <div class="d-flex align-items-center justify-content-center">
                <div class="flip-card" @click="open" :class="{'open' : isOpen, 'is-url' : validURL(viewItem)}" @mouseover="cardHover" @mouseout="cardBlur" >
                    <div class="flip-card-inner">
                        <div class="flip-card-front bg-primary d-flex align-items-center justify-content-center">
                            <!-- <div class="display-3 text-light">
                                {{ viewIndex + 1 }}
                            </div> -->
                            <img class="mx-auto d-inline-block" src="@/assets/NO-SLEEP-GANG.gif" alt="" style="height: 100%;">
                        </div>
                        <div class="flip-card-back bg-warning d-flex align-items-center justify-content-center">
                            <div class="h4 text-dark">
                                <a
                                    class="small text winner"
                                    v-if="validURL(viewItem)"
                                    :href="viewItem"
                                    target="_blank"
                                >{{viewItem}}</a>

                                <span v-else>
                                    {{ viewItem }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-evenly mt-5">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="closeAndRemove(viewItem)">Remove & Close</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="close">Close Only</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio src="@/assets/wow.mp3" id="audio-wow"></audio>
    <audio src="@/assets/drum-roll.mp3" id="audio-roll"></audio>
</div>
</template>
<script>

export default {
    props: {
        items:{
            type: Array,
            default: () => []
        },
        active: {
            type: Number,
            default: 0
        }
    },

    data () {
        return {
            viewIndex: undefined,
            viewItem: undefined,
            isOpen: false
        }
    },

    methods: {
        view (index, item) {
            this.isOpen = false;
            this.viewIndex = index
            this.viewItem = item
        },
        open () {
            this.isOpen = true;
            this.$confetti.start({
                particles: [
                    {
                        type: 'rect',
                    },
                ],
                defaultColors: [
                    '#6441a4',
                    '#0e9dd9'
                ],
            });
            this.cardBlur();
            const audio = document.querySelector("#audio-wow");
            audio.volume = .1;
            audio.play();
        },
        closeAndRemove (viewItem) {
            this.$emit('remove', viewItem);
            this.close();
        },

        close () {
            this.$confetti.stop()
        },

        cardHover () {
            if(this.isOpen) return;
            const audio = document.querySelector("#audio-roll");
            audio.volume = .1;
            audio.play();
        },
        cardBlur () {
            const audio = document.querySelector("#audio-roll");
            audio.pause();
            audio.currentTime = 0;
        },

         validURL(str) {
            try { return Boolean(new URL(str)); }
            catch(e){ return false; }
        }
    }
}
</script>

<style>
    .tile {
        background-color: #19171cc6;
        color: #fff;
        box-shadow: none;
        transition: box-shadow 0.3s, background-color 0.3s;
    }
    .tile.active {
        z-index: 2;
        box-shadow: 0 0 50px yellow;
    }
    .tile.shuffled {
        background-color: #000 !important;
        color: #e1ad1d;
    }
    
    .flip-card {
        box-shadow: 0 0 25px ;
        border-radius: 40px;
        background-color: transparent;
        width: 200px;
        height: 200px;
        perspective: 1000px; /* Remove this if you don't want the 3D effect */
        cursor: pointer;
    }

    .flip-card.open.is-url {
        width: 500px;
    }

    /* This container is needed to position the front and back side */
    .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
    }

    /* Do an horizontal flip when you move the mouse over the flip box container */
    .flip-card.open .flip-card-inner {
        transform: rotateY(180deg);
    }

    /* Position the front and back side */
    .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
        border-radius: 20px;
        animation: glow 1s infinite alternate;
        z-index: inherit;
    }
    /* Style the back side */
    .flip-card-back {
        transform: rotateY(180deg);
    }

    @keyframes glow {
        from {
            box-shadow: 0 0 100px -20px #e1ad1d;
        }
        to {
            box-shadow: 0 0 100px 20px #e1ad1d;
        }
    }

    a.winner:hover {
        background-color: transparent !important;
    }
</style>