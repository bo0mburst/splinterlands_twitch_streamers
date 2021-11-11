<template>
  <div id="wheel" class="min-vh-100">
    <day-night/>
    <div class="position-relative min-vh-100 bg-dark">
      <div class="px-3 mb-3 d-flex align-items-center justify-content-end">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked v-model="isSubOnly" @change="init">
          <label class="form-check-label" :class="isSubOnly ? 'text-warning' :'text-light'" for="flexSwitchCheckChecked">
            {{isSubOnly ? 'Subscribers only prizes' : 'Followers prizes'}}
          </label>
        </div>
        <button data-bs-toggle="modal" data-bs-target="#settingsModal" class="btn btn-lg text-warning bg-none" title="settings">
          <i class="fa fa-cog" aria-hidden="true"></i>
        </button>
        <button class="btn btn-lg text-warning bg-none" data-bs-toggle="modal" data-bs-target="#helpModal" title="help"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
        <button class="btn ms-4  btn-sm py-0 btn-warning" @click="shuffleTiles">Shuffle</button>
        <button class="ms-4 btn btn-sm py-0 btn-warning" @click="reset">Reset</button>
      </div>
      <div class="row w-100 mx-0">
        <div class="col-md-4">
            <vue-win-Wheel :segments="options" @change="setActiveTile" ref="vue-wheel" />
        </div>

        <div class="col-md-8 d-flex flex-column justify-content-center">
          <tiles
            v-if="tiles.length"
            :active="activeTile"
            :items="tiles"
            @remove="removePrize"
          />
          <div v-else>
            <p class="bg-black text-light text-center">Enter list of prizes in settings <i class="fa fa-cog" aria-hidden="true"></i></p>
          </div>
        </div>
      </div>
    </div>
    

    <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModal">Prize list</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted">Enter your list of prizes here. 1 line per prize. If you have more than 1 of the same prize, you must enter it again.</p>
            <div class="row">
              <div class="col-md-6">
                <p>For Subscribers Only</p>
                <textarea class="w-100" style="min-height: 300px;" v-model="list"></textarea>
              </div>
              <div class="col-md-6">
                <p>For Followers</p>
                <textarea class="w-100" style="min-height: 300px;" v-model="list2"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="saveList" data-bs-dismiss="modal">Save changes</button>
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
              <li>Enter your list of prizes. This will be randomize and distribute to all 100 tiles</li>
              <li>Click spin to pick random number.</li>
              <li>The active tile (glowing) will move based on the spin result.</li>
              <li>Click the new glowing tile to view reward pop up window</li>
              <li>Click the card in the pop up window to view the reward</li>
              <li>Click "Close" or "Remove & close" to remove the prize in the list</li>
            </ol>
            <p>Click "Shuffle" to randomize the prizes</p>
            <p>Click "Reset" to reset the active tile</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueWinWheel from '@/components/vue-winwheel.vue';
import Tiles from '@/components/Tiles.vue';
import DayNight from '@/components/DayNight.vue';

export default {
  data(){
      return{
          isSubOnly: true,
          list: '',
          list2: '',
          prizes: [],
          tiles: [],
          activeTile: 0,
          options:[
              {
                  textFillStyle: '#fff',
                  fillStyle: '#0e9dd9',
                  text:'One'
              },
              {
                  textFillStyle: '#fff',
                  fillStyle: '#6441a4',
                  text:'Two'
              },
              {
                  textFillStyle: '#fff',
                  fillStyle: '#0e9dd9',
                  text:'Three'
              },
              {
                  textFillStyle: '#fff',
                  fillStyle: '#6441a4',
                  text:'Four'
              },
              {
                  textFillStyle: '#fff',
                  fillStyle: '#0e9dd9',
                  text:'Five'
              },
              {
                  textFillStyle: '#fff',
                  fillStyle: '#6441a4',
                  text:'Six'
              }
          ]
      }
  },

  mounted () {
    this.init();
  },

  methods: {
    init () {
      let prizes = this.getPrizes()
      if (!prizes.sub) this.setPrizes('nosleepgang-sub-prizes', [])
      if (!prizes.ff) this.setPrizes('nosleepgang-ff-prizes', [])
      this.prizes = this.isSubOnly ? prizes.sub : prizes.ff
      this.list = prizes.sub.join('\n')
      this.list2 = prizes.ff.join('\n')
      this.generatePrizeItems(this.prizes);
    },
    setActiveTile (e) {
      let result = this.activeTile;
      for(let i = 0; i < Number(e); i++) {
        setTimeout(() => {
          result += 1;
          if (result > this.tiles.length) result -= this.tiles.length
          this.activeTile = result
        }, i * 500);
      }
    },

    getPrizes () {
      const prizes = localStorage.getItem('nosleepgang-sub-prizes')
      const prizes2 = localStorage.getItem('nosleepgang-ff-prizes')
      const sub = prizes ? JSON.parse(prizes) : '';
      const ff = prizes2 ? JSON.parse(prizes2) : '';
      return {sub, ff};
    },

    setPrizes (key, val) {
      let prizes = JSON.stringify(val);
      localStorage.setItem(key, prizes)
    },

    saveList () {
      const prizes = this.list.split('\n').filter(i => !!i)
      const prizes2 = this.list2.split('\n').filter(i => !!i)
      this.setPrizes('nosleepgang-sub-prizes', prizes)
      this.setPrizes('nosleepgang-ff-prizes', prizes2)
      this.list = prizes.join('\n')
      this.list2 = prizes2.join('\n')
      this.prizes = this.isSubOnly ? prizes : prizes2;
      this.generatePrizeItems(this.prizes);
    },

    generatePrizeItems (prizes) {
      if (!prizes || !prizes.length) return;
      let items = [];
      let shuffledPrizes = this.shuffle(prizes)
      while(items.length <= 100) {
        items = [...items, ...shuffledPrizes]
      }
      this.tiles = items.slice(0, 100);
    },

    shuffleTiles () {
      this.generatePrizeItems(this.prizes);
      const tiles = this.$el.querySelectorAll('.tile');
      for(let i = 0; i < 10; i++) {
        setTimeout(() => {
          tiles[i].classList.add('shuffled')
          tiles[i + 10].classList.add('shuffled')
          tiles[i + 20].classList.add('shuffled')
          tiles[i + 30].classList.add('shuffled')
          tiles[i + 40].classList.add('shuffled')
          tiles[i + 50].classList.add('shuffled')
          tiles[i + 60].classList.add('shuffled')
          tiles[i + 70].classList.add('shuffled')
          tiles[i + 80].classList.add('shuffled')
          tiles[i + 90].classList.add('shuffled')

          setTimeout(() => { 
            tiles[i].classList.remove('shuffled')
            tiles[i + 10].classList.remove('shuffled')
            tiles[i + 20].classList.remove('shuffled')
            tiles[i + 30].classList.remove('shuffled')
            tiles[i + 40].classList.remove('shuffled')
            tiles[i + 50].classList.remove('shuffled')
            tiles[i + 60].classList.remove('shuffled')
            tiles[i + 70].classList.remove('shuffled')
            tiles[i + 80].classList.remove('shuffled')
            tiles[i + 90].classList.remove('shuffled')
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
      this.activeTile = 0;
      this.$refs['vue-wheel'].hidePrize(); 
    },

    removePrize (e) {
      let idx = this.prizes.findIndex(i => i === e);
      this.prizes.splice(idx, 1);
      if (this.isSubOnly) {
        this.setPrizes('nosleepgang-sub-prizes', this.prizes)
        this.list = this.prizes.join('\n')
      } else {
        this.setPrizes('nosleepgang-ff-prizes', this.prizes)
        this.list2 = this.prizes.join('\n')
      }
      this.generatePrizeItems(this.prizes);
    }
  },

  components: {
    VueWinWheel,
    Tiles,
    DayNight
  }
}
</script>
