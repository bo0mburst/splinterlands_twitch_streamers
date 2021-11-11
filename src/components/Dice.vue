<template>
  <div class = "scene">
   <div class="cube" ref="cube">
        <div class="cube__face cube__face--1">
            <span class="dot dot1"></span>
        </div>
        <div class="cube__face cube__face--2">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>
        </div>
        <div class="cube__face cube__face--3">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>  
            <span class="dot dot3"></span>
        </div>
        <div class="cube__face cube__face--4">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>  
            <span class="dot dot3"></span>
            <span class="dot dot4"></span>
        </div>
        <div class="cube__face cube__face--5">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>  
            <span class="dot dot3"></span>
            <span class="dot dot4"></span>
            <span class="dot dot5"></span>
        </div>
        <div class="cube__face cube__face--6">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>  
            <span class="dot dot3"></span>
            <span class="dot dot4"></span>
            <span class="dot dot5"></span>
            <span class="dot dot6"></span>
        </div>
  </div>
  
  <button class="rollBtn" @click="rollDice">Roll the Dice</button>
</div>
</template>

<script>
export default {
    name: 'Dice',

    data () {
        return {
            currentClass: ''
        }
    },

    methods: {
        getRandom(max, min) {
            return (Math.floor(Math.random() * (max-min)) + min) * 90;
        },

        rollDice() {
            const min = 1;
            const max = 24;
            const xRand = this.getRandom(max, min);
            const yRand = this.getRandom(max, min);
                
            this.$refs['cube'].style.webkitTransform = 'translateZ(-100px) rotateX('+xRand+'deg) rotateY('+yRand+'deg)';
            this.$refs['cube'].style.transform = 'translateZ(-100px) rotateX('+xRand+'deg) rotateY('+yRand+'deg)';
        }
    }
}
</script>

<style lang="css" scoped>
* { box-sizing: border-box; }

body { 
  font-family: sans-serif;
  background:green;
  color:white;
}

.scene {
  width: 200px;
  height: 200px;
  margin: 20px;
  perspective:600px;
}

.rollBtn{
  background:black;
  color:white;
  border:none;
  margin:auto 0;
  font-size:1.5em;
  margin-top:1em;
  width:200px;
}

.cube {
  width:200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(-100px);
  transition: transform 0.5s;
}

.cube__face {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 4px solid gray;
}

.cube__face--1  { background: #222;  opacity: 0.90;}
.cube__face--3  { background: #222;   opacity: 0.90; }
.cube__face--2  {  background: #222;   opacity: 0.90; }
.cube__face--4  {  background: #222;   opacity: 0.90; }
.cube__face--5   {  background: #222;   opacity: 0.90; }
.cube__face--6 {  background: #222;  opacity: 0.90; }

.cube__face--1  { transform: rotateY(  0deg) translateZ(100px); }
.cube__face--2   { transform: rotateY(180deg) translateZ(100px); }
.cube__face--3  { transform: rotateY( 90deg) translateZ(100px); }
.cube__face--4   { transform: rotateY(-90deg) translateZ(100px); }
.cube__face--5   { transform: rotateX( 90deg) translateZ(100px); }
.cube__face--6 { transform: rotateX(-90deg) translateZ(100px); }

.dot {
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 15px;  
}

.cube__face--1 .dot1 { top: 85px; left: 85px; }
.cube__face--2 .dot1 { top: 45px; left: 45px; }
.cube__face--2 .dot2 { top: 125px; left: 125px; }
.cube__face--3 .dot1 { top: 45px; left: 45px; }
.cube__face--3 .dot2 { top: 85px; left: 85px; }
.cube__face--3 .dot3 { top: 125px; left: 125px; }
.cube__face--4 .dot1 { top: 45px; left: 45px; }
.cube__face--4 .dot2 { top: 45px; left: 125px; }
.cube__face--4 .dot3 { top: 125px; left: 45px; }
.cube__face--4 .dot4 { top: 125px; left: 125px; }
.cube__face--5 .dot1 { top: 45px; left: 45px; }
.cube__face--5 .dot2 { top: 45px; left: 125px; }
.cube__face--5 .dot3 { top: 85px; left: 85px; }
.cube__face--5 .dot4 { top: 125px; left: 45px; }
.cube__face--5 .dot5 { top: 125px; left: 125px; }
.cube__face--6 .dot1 { top: 45px; left: 45px; }
.cube__face--6 .dot2 { top: 45px; left: 85px; }
.cube__face--6 .dot3 { top: 45px; left: 125px; }
.cube__face--6 .dot4 { top: 125px; left: 45px; }
.cube__face--6 .dot5 { top: 125px; left: 85px; }
.cube__face--6 .dot6 { top: 125px; left: 125px; }

</style>