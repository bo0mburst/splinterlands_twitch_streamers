<template>
  <div class="grunt" v-bind:style="styles">
      <div class="character-wrapper w-100 h-100" :class="this.animationName">
        <div :style="backgroundPos" class="character w-100 h-100"></div>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        backgroundPos: {
            type: String,
            default: 'background-position: 0 0;'
        },
        coords: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        coords (val) {
            this.move(val.x, val.y)
        }
    },
    data () {
		return {
			x:              50,
			y:              50,
			animationName:  '',
			transitionTime: 0
		}
	},

    computed: {
		styles () {
			return {
				transform:  `translate3d(${this.x - 25}px, ${this.y - 25}px, 0)`,
				transition: `all ${this.transitionTime}s linear`,
				// animation:  `${this.animationName} .8s steps(4) infinite`,
			}
		}
	},

    methods: {
		move (x, y) {
			this.x = x;
			this.y = y;

			var currentCoords = {
				x: Math.floor(this.$el.getBoundingClientRect().left + 25),
				y: Math.floor(this.$el.getBoundingClientRect().top  + 25)
			}

			var yDist     = this.y - currentCoords.y;
			var xDist     = this.x - currentCoords.x;
			var direction = this.getCardinal(Math.atan2(yDist, xDist) * 180 / Math.PI);

			this.animationName  = `walk-${direction}`;
			this.transitionTime = Math.sqrt(xDist * xDist + yDist * yDist) / 200;
            setTimeout(() => {
                this.$emit('stop');
            }, this.transitionTime * 1000);
		}
	},

    mounted () {
		this.$el.addEventListener("transitionend", () => {
			this.animationName = '';
		}, false);

		// Private methods

		this.getCardinal = function(angle) {
			var directions = ["SE", "S", "SW", "W", "NW", "N", "NE", "E"];
			var index      = angle - 22.5;
			index < 0      && (index += 360);
			index          = parseInt(index / 45);

			return(directions[index]);
		};
	}
}
</script>

<style>
.grunt {
  position: absolute;
  height: 50px;
  width: 50px;
  z-index: 999;
  pointer-events: none;
}

.walk-SW,
.walk-NW,
.walk-W { transform: scaleX(-1); }
.walk-NE,
.walk-SE,
.walk-E { transform: scaleX(1); }

.character {
  background-image: url('../assets/ghosts.svg');
  background-size: 310px;
  animation: bounce .3s linear infinite;
}

@keyframes bounce {
    from {
        transform: translateY(0)
    }
    to {
        transform: translateY(10px);
    }
}
</style>