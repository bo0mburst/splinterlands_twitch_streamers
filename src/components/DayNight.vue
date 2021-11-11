<template>
    <div class="position-fixed vw-100 vh-100">
        <div id="sky"></div>
        <div class="sun"></div>
        <div class="moon"></div>
    </div>
</template>

<script>
export default {
    name: 'DayNight'
}
</script>

<style scoped>
@keyframes suntrack {	
  from { transform: rotate(-0.25turn); }
  to { transform: rotate(0.75turn); }
}
@keyframes sunpulse { 
   from { box-shadow: 0 0 100px #ff0, 0 0 100px #ff0; }
  to { box-shadow: 0 0 50px #ff0, 0 0 75px #ff0;  }
}
@keyframes moontrack {	
  from { transform: rotate(-0.75turn); }
  to { transform: rotate(0.25turn); }
}
@keyframes moonpulse { 
   from { box-shadow: 0 0 100px #eee, 0 0 100px #eee; }
  to { box-shadow: 0 0 50px #eee, 0 0 75px #eee;  }
}
body { margin: 0; 
  background-color: #002;
   min-height: 600vh;
  height:900%;
  overflow: hidden;
}
.sun {
  width: 15vw;
  height: 15vw;
  background: #ff0;
  background: radial-gradient(ellipse at center, #f90 0%,#fc0 60%,#ff0 100%);
  border-radius: 100%;
  position: absolute;
  bottom: -7vw;
  right: 7vw;
  transform-origin: -28vw 7vw;
  animation: suntrack 24s infinite linear, sunpulse 2s alternate infinite; 
}
.moon { 
  background: radial-gradient(ellipse at center, #fff 0%,#eec 60%,#ffe 100%);
  border-radius: 100%;
  width: 15vw;
  height: 15vw;
  position: absolute;
  border-radius: 100%;
  bottom: -7vw;
  right: 7vw;
  transform-origin: -28vw 7vw;
  animation: moontrack 23s infinite linear, moonpulse 2s alternate infinite; 
  opacity: .9;
}
#sky{
  position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 900%; 
    background-image: -webkit-linear-gradient(top, rgba(30,152,209,1) 0%, rgb(202, 229, 243) 11%, rgba(125, 185, 232, 0.82) 22%,
                                                   rgb(240, 231, 26) 33%, rgb(245, 86, 12) 44%,   rgba(197, 127, 81, 0.82) 55%,
                                                   rgba(5, 5, 5, 1) 66%,  rgb(54, 55, 56) 77%,    rgb(3, 3, 3) 100%);
  
    animation: changeSkyColor 12s linear infinite alternate; 
}
@keyframes changeSkyColor {
    0%{
        top: 0px;
    }
    100%  {
        top: -800%;
    }
}
</style>