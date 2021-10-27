<template>
  <div id="app" class="bg-black">
    <section class="streamers py-3 d-flex flex-column">
      <header class="container text-white">
          <h1 class="display-5">Twitch Streamers</h1>
      </header>

      <div class="container py-3 px-0 bg-dark overflow-hidden rounded">
          <div class="d-md-flex h-100">
              <div class="px-3 col-md-6 text-center">
                  <img class="w-100" src="@/assets/mascott.png" alt="">
              </div>
              <div class="mt-5 mt-md-0 d-fkex flex-colum pb-md-5 mb-md-5 w-100 h-100 overflow-hidden">
                  <div class="px-3 d-flex align-items-center">
                      <div class="h3 text-primary">
                          <i class="fa fa-twitch"></i>
                      </div>
                      <h4 class="text-secondary ms-3">Join Us!</h4>
                  </div>
                  <div class="h-100 overflow-auto">
                    <div id="streamers" class="list-group">
                      <div class="mt-5 pt-5 text-center"  v-if="!streamers.length">
                        <div class="spinner-border text-warning" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>

                      <div
                        v-for="(GoogleSpreadsheetRow, index) in streamers"
                        :key="index"
                        class="p-1 mt-1 list-group-item bg-dark">
                          <div class="p-2 rounded d-flex flex-wrap align-items-center text-decoration-none text-warning">
                              <img :src="`https://robohash.org/${GoogleSpreadsheetRow.NAME}?size=30x30`"  class="rounded-circle border">
                              <div class="ms-3">
                                  <div class="h6 mb-0 d-none d-md-block">{{GoogleSpreadsheetRow.NAME}}</div>
                                  <small class="text-muted">
                                      @{{GoogleSpreadsheetRow.TWITCH.split('/').pop()}}
                                  </small>
                              </div>
                              <a class="ms-auto btn btn-sm py-0 btn-primary"  :href="GoogleSpreadsheetRow.TWITCH" target="blank">
                                  visit
                              </a>
                          </div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
      </div>

      <footer class="container px-md-0 d-md-flex justify-content-between">
          <a class="badge text-light bg-primary text-decoration-none" href="https://discord.gg/m34Em3ze" aria-label="discord">Join our discord channel</a>
      </footer>
    </section>
    

    <section class="container py-5 px-0" v-if="posts.length">
      <div class="p-3 bg-dark">
        <!-- <link-prevue
          v-for="(GoogleSpreadsheetRow, index) in posts"
          :key="index"
          url="https://vuejs.org/"
        ></link-prevue> -->
        <h4 class="display-5 px-2 pb-4 text-secondary border-bottom">Latest Posts</h4>
        <ul class="list-unstyled list-group rounded">
          <li
            v-for="(GoogleSpreadsheetRow, index) in posts"
            :key="index"
            class="list-group-item bg-transparent"
          >
            <div class="text-warning">{{ GoogleSpreadsheetRow.AUTHOR }}</div>
            <div class="text-light">{{ GoogleSpreadsheetRow.TITLE }} <a class="text-primary text-wrap text-break" :href="GoogleSpreadsheetRow.LINK">View</a></div>
          </li>
        </ul>
      </div>
    </section>

    <small class="badge bg-warning text-dark opacity-25" id="brand">bo0mburst</small>
  </div>
</template>

<script>
import { GoogleSpreadsheet } from 'google-spreadsheet';
// import LinkPrevue from 'link-prevue'

const SHEET_ID = process.env.VUE_APP_SHEET_ID;
const CREDENTIALS = {
    private_key: process.env.VUE_APP_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.VUE_APP_EMAIL,
};
export default {
  name: 'App',
  
  // components: {
  //   LinkPrevue
  // },
  
  data () {
    return {
      streamers: [],
      posts: []
    }
  },

  mounted () {
    this.loadData();
  },

  methods: {
    async loadData () {
      const doc = new GoogleSpreadsheet(SHEET_ID);
      await doc.useServiceAccountAuth(CREDENTIALS);
      await doc.loadInfo();
      const sheetStreamers = doc.sheetsByTitle['streamers'];
      this.streamers = await sheetStreamers.getRows();
      const sheetPosts = doc.sheetsByTitle['posts'];
      this.posts = await sheetPosts.getRows();
    }
  }
}
</script>

<style>
  #app {
    background-image: url('./assets/moon.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom  ;
    background-attachment: fixed;
    position: relative;
  }

  @media (min-width: 768px) {
    .streamers { height: 100vh; }
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

  #brand {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: scale(.8);
  }
</style>
