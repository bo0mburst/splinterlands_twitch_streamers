<template>
  <div id="wheel" class="min-vh-100">
    <div class="position-relative min-vh-100 bg-dark">
      <div class="px-3 mb-3 d-flex flex-wrap align-items-center justify-content-end">
        <button data-bs-toggle="modal" data-bs-target="#settingsModal" class="btn btn-lg text-warning bg-none" title="settings">
          <i class="fa fa-cog" aria-hidden="true"></i>
        </button>
        <button class="btn btn-lg text-warning bg-none" data-bs-toggle="modal" data-bs-target="#helpModal" title="help"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
        <button class="btn ms-4  btn-sm py-0 btn-warning" @click="shuffleTiles">Shuffle</button>
      </div>
      <div class="row w-100 mx-0">
        <div class="col-md-4">
            <vue-win-Wheel :segments="options"  @change="setActiveTile($event)" ref="vue-wheel" />
        </div>

        <div class="col-md-8">
          <tiles
            v-if="tiles.length"
            :active="activeTile"
            :items="tiles"
            @remove="removePrize"
          />
          <div v-else>
            <p class="bg-black text-light text-center">Enter list of names in settings <i class="fa fa-cog" aria-hidden="true"></i></p>
          </div>
        </div>
      </div>
    </div>
    

    <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModal">Settings</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
                <span class="me-2 small"># of tiles</span>
                <input type="number" class="form-control py-0 d-inline-block" style="width: 5rem;" min="0" v-model="numberOfTiles" @change="changeNumberOfTiles">
            </div>
            <strong>Names</strong>
            <p>Enter list of names</p>
            <textarea class="w-100"  style="min-height: 300px;" v-model="listOfNames" @change="saveList"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="helpModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="helpModal">How it works:</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ol>
              <li>Click settings <i class="fa fa-cog" aria-hidden="true"></i></li>
              <li>Enter your list of names. This will be randomize and distribute to specified # of tiles</li>
              <li>Click spin to pick random number.</li>
              <li>The active tile (glowing) will move based on the spin result.</li>
              <li>Click the new glowing tile to view reward pop up window</li>
              <li>Click the card in the pop up window to view</li>
              <li>Click "Close" or "Remove & close" to remove it in the list</li>
            </ol>
            <p>Click "Shuffle" to randomize the prizes</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueWinWheel from '@/components/vue-winwheel.vue';
import Tiles from '@/components/Tiles.vue';
export default {
  data(){
      return{
          numberOfTiles: 100,
          listOfNames: '',
          prizes: [],
          tiles: [],
          activeTile: 0,
          active: 0,
          options:[],
      }
  },

  created () {
    this.init();
    
  },

  watch: {
      numberOfTiles () {
          
        this.generateWheelOptions()
        this.$nextTick(() =>{
            this.$refs['vue-wheel'].resetWheel();
        })
      }
  },

  methods: {
    init () {
      let names = this.getPrizes()
     
      if (!names) {
        this.setStorage('nosleepgang-names', [])
        names = []
      }
      this.listOfNames = names.join('\n')

      this.numberOfTiles = this.getNumberOfTiles()


     this.prizes = names
      this.generatePrizeItems(this.prizes);
      this.generateWheelOptions()

    },

    generateWheelOptions () {
        let opt = []
        for(let i = 0; i < this.numberOfTiles; i++) {
            let text = String(i + 1)
            let randomColor = Math.floor(Math.random()*16777215).toString(16);
            if (i % 2 === 0) {
                opt.push({
                  textFillStyle: `#000`,
                  fillStyle: `#${randomColor}`,
                  text
              })
            } else {
                opt.push({
                  textFillStyle: `#000`,
                  fillStyle: `#${randomColor}`,
                  text
              },)
            }
        }
        this.options = [...opt]
    },

    getNumberOfTiles() {
      const numberOfTiles =  localStorage.getItem('nosleepgang-number-of-tiles')
      if (!numberOfTiles) {
        this.setStorage('nosleepgang-number-of-tiles', 100)
        return 100
      }
      return JSON.parse(numberOfTiles)
    },

    changeNumberOfTiles (e) {
      this.setStorage('nosleepgang-number-of-tiles',e.target.value)
      this.generatePrizeItems(this.prizes);
    },

    setActiveTile (e) {
      this.activeTile = e;
    },

    getPrizes () {
      const _names = localStorage.getItem('nosleepgang-names')
      const names = _names ? JSON.parse(_names) : '';
      return names;
    },

    setStorage (key, val) {
      let prizes = JSON.stringify(val);
      localStorage.setItem(key, prizes)
    },

    saveList () {
        const names = this.listOfNames.split('\n').filter(i => !!i)
        this.setStorage('nosleepgang-names', names)
        this.listOfNames = names.join('\n')
        this.prizes = names
        this.generatePrizeItems(this.prizes);
    },

    generatePrizeItems (prizes) {
      this.tiles = []
      if (!prizes || !prizes.length) return;
      let items = [];
      let shuffledPrizes = this.shuffle(prizes)
      while(items.length <= this.numberOfTiles) {
        items = [...items, ...shuffledPrizes]
      }
      this.tiles = items.slice(0, this.numberOfTiles);
    },

    shuffleTiles () {
      this.generatePrizeItems(this.prizes);
      const tiles = this.$el.querySelectorAll('.tile');
      if(!tiles.length) return;
      for(let i = 0; i < this.numberOfTiles; i++) {
        setTimeout(() => {
          tiles[i].classList.add('shuffled')

          setTimeout(() => { 
            tiles[i].classList.remove('shuffled')
          }, 50)
        }, i * 50  + 50 )
      }
    },

    shuffle(array) {
      let currentIndex = array.length,  randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]]
      }

      return array;
    },

    reset () {
      this.active = 0;
      this.setActiveTile(0);
      this.$refs['vue-wheel'].hidePrize();
    },

    removePrize (e) {
        let idx = this.prizes.findIndex(i => i === e);
        this.prizes.splice(idx, 1);
        this.setStorage('nosleepgang-names', this.prizes)
        this.listOfNames = this.prizes.join('\n')
        this.generatePrizeItems(this.prizes);
    },
  },

  components: {
    VueWinWheel,
    Tiles,
  }
}
</script>