<template>
  <div id="wheel" class="min-vh-100">
    <grant :coords="coords" :backgroundPos="activeChar ? activeChar.sprite : ''" @stop="setActiveTile" :title="activeChar ? activeChar.name : ''"/>
  
    <div class="position-relative min-vh-100 bg-dark">
      <div class="px-3 mb-3 d-flex flex-wrap align-items-center justify-content-end">
        <div class="form-check form-switch" v-if="activeTiles === 'prizes'">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked v-model="isSubOnly" @change="init">
          <label class="form-check-label" :class="isSubOnly ? 'text-warning' :'text-light'" for="flexSwitchCheckChecked">
            {{isSubOnly ? 'Subscribers only prizes' : 'Followers prizes'}}
          </label>
        </div>

        <div class="ms-4 border border-warning p-1 rounded">
            <span class="text-warning me-2 small">#</span>
            <input type="number" id="inputPassword6" class="form-control py-0 d-inline-block" style="width: 5rem;" min="0" max="100" v-model="manualInput">
            <button class="btn btn-sm btn-warning py-0 ms-2" @click="moveCharacterManually">Go</button>
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
            <vue-win-Wheel :segments="options" @change="moveCharacter" ref="vue-wheel" />
        </div>

        <div class="col-md-8">
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="settingsModal">Settings</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-6">
                <strong>Add characters</strong>
                <div class="form-group">
                  <input type="text" class="form-control" @input="search($event)" placeholder="search name">
                </div>
                <div style="max-height: 500px; overflow-y: auto; overflow-x: hidden;">
                  <ul class="list-unstyled">
                    <li v-for="(character, charIndex) in characters" :key="charIndex" class="" :data-name="character.name">
                      <div class="row align-items-center">
                        <div class="col-8 d-flex align-items-center p">
                          <div class="form-check d-inline-block text-primary">
                            <input class="form-check-input" type="radio" name="active-character" :id="`radio-${charIndex}`" :value="character" v-model="activeChar" @change="changeActiveChar">
                            <label class="form-check-label" :for="`radio-${charIndex}`" />
                          </div>
                          <input type="text" class="form-control" v-model="character.name" @change="setCharacterName">
                        </div>
                        <div class="col-4">
                          <button class="btn btn-secondary p-1" type="button"  data-bs-toggle="modal" data-bs-target="#sprites" style="transform: scale(.5)" @click="charIdxToSetSprite = charIndex">
                            <div v-if="character.sprite" class="grant-picker" :style="character.sprite"></div>
                            <span v-else>Select sprite</span>
                          </button>
                          <button v-if="charIndex > 0" class="btn btn-link btn-sm text-danger" @click="removeChar(character.id)">x</button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="px-3 mb-4">
                  <button class="btn btn-primary btn-sm" @click="addCharacter">Add</button>
                </div>
              </div>
              <div class="col-lg-6">
                <strong>Prize list</strong>
                <p class="small text-muted">Enter your list of prizes here. 1 line per prize. If you have more than 1 of the same prize, you must enter it again.</p>
                <div class="row">
                  <div class="col-md-6">
                    <p>For Subscribers Only</p>
                    <textarea class="w-100" style="min-height: 300px;" v-model="list" @change="saveList"></textarea>
                  </div>
                  <div class="col-md-6">
                    <p>For Followers</p>
                    <textarea class="w-100" style="min-height: 300px;" v-model="list2" @change="saveList"></textarea>
                  </div>
                </div>
              </div>
            </div>
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

    <div class="modal fade" id="sprites" tabindex="-1" aria-labelledby="helpModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content bg-warning text-light">
          <div class="modal-header">
            <h5 class="modal-title text-dark" id="helpModal">Select sprite</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-wrap">
              <div v-for="(item, index) in 6" :key="`row1-${index}`" class="grant-picker" :style="`background-position: -${((item - 1) * 50) + 5}px 0`" @click="setCharacterSprite(`background-position: -${((item - 1) * 50) + 3}px 0`)"></div>
              <div v-for="(item, index) in 6" :key="`row2-${index}`" class="grant-picker" :style="`background-position: -${((item - 1) * 50) + 5}px 94px`" @click="setCharacterSprite(`background-position: -${((item - 1) * 50) + 3}px 94px`)"></div>
              <div v-for="(item, index) in 6" :key="`row3-${index}`" class="grant-picker" :style="`background-position: -${((item - 1) * 50) + 5}px 195px`" @click="setCharacterSprite(`background-position: -${((item - 1) * 50) + 3}px 195px`)"></div>
              <div v-for="(item, index) in 2" :key="`row4-${index}`" class="grant-picker" :style="`background-position: -${((item) * 50)+50}px -204px`" @click="setCharacterSprite(`background-position: -${((item) * 50)+50}px -204px`)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueWinWheel from '@/components/vue-winwheel.vue';
import Tiles from '@/components/Tiles.vue';
import Grant from "@/components/Grant";

export default {
  data(){
      return{
          activeChar: null,
          charIdxToSetSprite: 0,
          characters: [{
            id: 1,
            name: 'Default',
            sprite: 'background-position: 0 0;',
            pos: 0
          }],
          isSubOnly: true,
          list: '',
          list2: '',
          listOfNames: '',
          prizes: [],
          tiles: [],
          activeTile: 0,
          active: 0,
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
          ],
          coords: {x: 50, y: 50},
          manualInput: 0
      }
  },

  created () {
    this.init();
  },

  mounted () {
    this.characters = this.getCharacters();
    let id = localStorage.getItem('nosleepgang-active-char-idx')
    this.activeChar = id ? this.characters.filter(i => i.id === String(JSON.parse(id)))[0] : this.characters[0]
    this.active = this.activeChar.pos;
    this.moveCharacter(0);

    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
          this.coords= {x: 50, y: 50};
          this.moveCharacter(0)
        }, 1000)
    });
  },

  methods: {
    init () {
      let prizes = this.getPrizes()
      if (!prizes.sub) {
        this.setStorage('nosleepgang-sub-prizes', [])
        prizes.sub = []
      }
      if (!prizes.ff) {
        this.setStorage('nosleepgang-ff-prizes', [])
        prizes.ff = []
      }
      this.list = prizes.sub.join('\n')
      this.list2 = prizes.ff.join('\n')

      this.prizes = this.isSubOnly ? prizes.sub : prizes.ff

      this.generatePrizeItems(this.prizes);
    },

    moveCharacter (e) {
      if (!this.tiles.length) return;
      this.activeTile = 0
      let result = Number(this.active) +  Number(e);
      if (result > this.tiles.length) result -= this.tiles.length
      if (result > 0) {
        const el = this.$el.querySelector(`.tile:nth-child(${result})`)
        const tilePos = this.getOffset(el)
  
        setTimeout(() => {
          this.coords = tilePos;
          this.active = result;
          this.updateCharPos();
        }, 300)
      } else {
        setTimeout(() => {
          this.coords = {x: 50, y: 50};
          this.active = 0;
          this.updateCharPos();
        }, 300)
      }
    },

    setActiveTile () {
      this.activeTile = this.active;
    },

    getOffset(el) {
      if (!el) return;
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      const height = parseFloat(style.height, 10)
      const width = parseFloat(style.width, 10)
      return {
        x: (rect.left + window.scrollX) + (width/2),
        y: (rect.top + window.scrollY) + (height/2)
      };
    },

    updateCharPos () {
      const activeId = this.activeChar ? this.activeChar.id : 1
      const idx = this.characters.findIndex(i => i.id === activeId)
      this.characters[idx].pos = this.active;
      localStorage.setItem('nosleepgang-chars', JSON.stringify(this.characters))
    },

    getCharacters () {
      const characters = localStorage.getItem('nosleepgang-chars')
      if (!characters) return  this.characters
      return JSON.parse(characters)
    },

    setCharacterSprite(backgroundPos) {
      this.characters[this.charIdxToSetSprite].sprite = backgroundPos
      localStorage.setItem('nosleepgang-chars', JSON.stringify(this.characters))
    },

    setCharacterName () {
      localStorage.setItem('nosleepgang-chars', JSON.stringify(this.characters))
    },

    changeActiveChar() {
      localStorage.setItem('nosleepgang-active-char-idx', this.activeChar.id)
      this.active = this.activeChar.pos
      this.moveCharacter(0);
    },

    getPrizes () {
      const prizes = localStorage.getItem('nosleepgang-sub-prizes')
      const prizes2 = localStorage.getItem('nosleepgang-ff-prizes')
      const _names = localStorage.getItem('nosleepgang-names')
      const sub = prizes ? JSON.parse(prizes) : '';
      const ff = prizes2 ? JSON.parse(prizes2) : '';
      const names = _names ? JSON.parse(_names) : '';
      return {sub, ff, names};
    },

    setStorage (key, val) {
      let prizes = JSON.stringify(val);
      localStorage.setItem(key, prizes)
    },

    saveList () {
      const prizes = this.list.split('\n').filter(i => !!i)
      const prizes2 = this.list2.split('\n').filter(i => !!i)
      this.setStorage('nosleepgang-sub-prizes', prizes)
      this.setStorage('nosleepgang-ff-prizes', prizes2)
      this.list = prizes.join('\n')
      this.list2 = prizes2.join('\n')
      this.prizes = this.isSubOnly ? prizes : prizes2;
      this.generatePrizeItems(this.prizes);
    },

    generatePrizeItems (prizes) {
      this.tiles = []
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
      if(!tiles.length) return;
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
      this.active = 0;
      this.setActiveTile(0);
      this.coords= {x: 50, y: 50};
      this.$refs['vue-wheel'].hidePrize();
      this.updateCharPos();
    },

    removePrize (e) {
      let idx = this.prizes.findIndex(i => i === e);
      this.prizes.splice(idx, 1);
      if (this.isSubOnly) {
        this.setStorage('nosleepgang-sub-prizes', this.prizes)
        this.list = this.prizes.join('\n')
      } else {
        this.setStorage('nosleepgang-ff-prizes', this.prizes)
        this.list2 = this.prizes.join('\n')
      }
      this.generatePrizeItems(this.prizes);
    },

    moveCharacterManually() {
      this.manualInput = Math.max(0, Math.min(this.manualInput, 100));
      this.active = 0
      this.moveCharacter(this.manualInput)
    },

    getRandomString(length) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    },

    addCharacter () {
      const name = this.getRandomString(5)
      const id = `${Math.floor(Math.random() * 100)}${Date.now()}`
      const grantPicker = this.$el.querySelectorAll('.grant-picker');
      const spritePos = grantPicker[Math.floor(Math.random() * 20)].style.backgroundPosition;
      this.characters.push({
        id,
        name,
        sprite: `background-position: ${spritePos}`,
        pos: 0
      })
      localStorage.setItem('nosleepgang-chars', JSON.stringify(this.characters))
    },

    removeChar (id) {
      this.activeChar = this.characters[0];
      this.changeActiveChar();
      this.characters = this.characters.filter(i => i.id !== id);
    },

    search (e) {
      const li = this.$el.querySelectorAll('li[data-name]')

      li.forEach((i) => {
        i.style.display = ''
        if (!String(i.dataset.name).toLowerCase().includes(String(e.target.value).toLowerCase())) {
          i.style.display = 'none'
        }
      });
    }
  },

  components: {
    VueWinWheel,
    Tiles,
    Grant
  }
}
</script>

<style scoped>
.grant-picker {
  width: 50px;
  height: 50px;
  background-image: url('../assets/ghosts.svg');
  background-size: 310px;
}
</style>
