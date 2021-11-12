<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  background-image: url('./assets/moon.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  background-attachment: fixed;
}

@media (min-width: 768px) {
    .streamers { height: 100vh; }
  }

  .form-check-input:checked {
    background-color: #ffc107;
    border-color: #ffc107;
  }

  .container {  max-width: 800px !important; }

  .bg-dark { background-color: rgba(25, 23, 28, 0.775) !important; }

  .text-primary { color: #6441a4 !important; }
  .bg-primary { background-color: #6441a4 !important; }
  .btn-primary {
      background-color: #6441a4 !important;
      color: #fff !important;
  }

  .text-secondary { color: #0e9dd9 !important; }

  a:hover { background-color: #333 !important; }
  
  *::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      background-color: #0e9dd9;
  }

  *::-webkit-scrollbar {
      width: 6px;
      background-color: #0e9dd9;
  }

  *::-webkit-scrollbar-thumb { background-color: #6441a4; }

  #confetti-canvas { z-index: 1051; }
</style>