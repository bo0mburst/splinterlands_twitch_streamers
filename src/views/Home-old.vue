<template>
  <div id="home" class="bg-black">
    <section class="streamers py-3 d-flex flex-column">
      <header class="container text-white">
          <h1 class="display-5">Twitch Streamers</h1>
      </header>

      <div class="container py-3 px-0 bg-dark overflow-hidden rounded">
          <div class="d-md-flex h-100">
              <div class="px-3 col-md-6 text-center">
                  <img class="w-100" src="@/assets/mascott.png" alt="">
                  <div class="text-center mt-3">
                      <a class="h3 text-secondary text-decoration-none" href="https://discord.gg/bQcva2bCXJ" aria-label="discord">Join our discord channel</a>
                  </div>
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
    </section>
    

    <section class="container py-5 px-0" v-if="posts.length">
      <div class="p-3 bg-dark">
        <h4 class="display-5 px-2 pb-4 text-secondary border-bottom">Latest Posts</h4>
        <link-prevue
          v-for="(GoogleSpreadsheetRow, index) in posts"
          :key="index"
          :url="GoogleSpreadsheetRow.LINK"
          class="w-100">
          <template slot-scope="props">
            <div class="card mb-3 bg-dark">
              <div class="row g-0">
                <div class="col-md-4 d-flex align-items-center">
                  <img class="img-fluid rounded-start" :src="props.img" :alt="props.title" v-if="props.img"/>
                  <div v-else class="img-fluid p-3 text-center text-muted">No image available</div>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h4 class="card-title text-light">{{props.title || GoogleSpreadsheetRow.TITLE}}</h4>
                    <p class="text-secondary">{{props.description}}</p>
                    <a v-bind:href="props.url" class="btn btn-sm btn-primary">More</a>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </link-prevue>
        <!-- <ul class="list-unstyled list-group rounded">
          <li
            v-for="(GoogleSpreadsheetRow, index) in posts"
            :key="index"
            class="list-group-item bg-transparent"
          >
            <div class="text-warning">{{ GoogleSpreadsheetRow.AUTHOR }}</div>
            <div class="text-light">{{ GoogleSpreadsheetRow.TITLE }} <a class="text-primary text-wrap text-break" :href="GoogleSpreadsheetRow.LINK">View</a></div>
          </li>
        </ul> -->
      </div>
    </section>

    <small class="badge bg-warning text-dark opacity-25" id="brand">bo0mburst</small>
  </div>
</template>

<script>
import { GoogleSpreadsheet } from 'google-spreadsheet';
import LinkPrevue from 'link-prevue'

const SHEET_ID = process.env.VUE_APP_SHEET_ID;
const CREDENTIALS = {
    private_key: process.env.VUE_APP_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.VUE_APP_EMAIL,
};
export default {
  name: 'Home',
  
  components: {
    LinkPrevue
  },
  
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
  #home {
    position: relative;
  }

  #brand {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: scale(.8);
  }
</style>
