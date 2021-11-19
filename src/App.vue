<template>
  <div id="app" class="bg-black">
    <router-view/>
  </div>
</template>

<style>
@media (min-width: 768px) {
    .streamers { height: 100vh; }
  }

  .form-check-input:checked {
    background-color: #ffc107;
    border-color: #ffc107;
  }

  .container {  max-width: 800px !important; }

  .bg-black { background-color: #171617 !important; }
  .bg-dark { background-color: #232222 !important; }

  .text-primary { color: #6441a4 !important; }
  .bg-primary { background-color: #6441a4 !important; }
  .btn-primary {
      background-color: #6441a4 !important;
      color: #fff !important;
  }

  .text-secondary { color: #0e9dd9 !important; }

  a:hover { background-color: #333 !important;}
  
  *::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      background-color: #171617;
  }

  *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background-color: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 5px;
    border: 2px solid #555;
  }

  #confetti-canvas { z-index: 1051; }
</style>