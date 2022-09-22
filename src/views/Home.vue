<template>
    <div>
        <div v-if="isLoading" class="min-vh-100 bg-black d-flex align-items-center justify-content-center">
            <div class="spinner-grow text-warning loading"></div>
        </div>

        <transition name="fade">
        <div  v-if="!isLoading" class="min-vh-100 text-light position-relative">
            <div class= "h-100 p-3 p-md-0 side-bar bg-black">
                <div class="px-2 py-2 text-danger position-sticky top-0 bg-black text-center font-monospace fw-bold fs-3">No Sleep Gang</div>
                <ul class="list-unstyled bg-dark">
                    <li v-for="(GoogleSpreadsheetRow, index) in streamers" :key="index">
                        <a v-bind:href="GoogleSpreadsheetRow.TWITCH" target="blank" class="text-light text-decoration-none px-3 py-2 d-flex flex-wrap align-items-start">
                            <img :src="`https://robohash.org/${GoogleSpreadsheetRow.NAME}?size=30x30`"  class="rounded-circle border me-2">
                            <div>
                                {{GoogleSpreadsheetRow.NAME}}
                                <span class="text-muted d-block text-decoration-none">@{{GoogleSpreadsheetRow.TWITCH.split('/').pop()}}</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            <main class="ps-md-3 bg-black">
                <div class="px-3 py-2">
                    <div class="latest-post text-center text-md-start">
                        <div class="mb-4 d-md-flex flex-wrap align-items-center justify-content-between">
                            <div>
                                <a class="px-2 text-light text-decoration-none d-inline-flex align-items-center" href="https://discord.gg/bQcva2bCXJ" target="blank" aria-label="discord">
                                    <small>NSG</small><img class="ms-2" src="@/assets/discord-logo.png" alt="" height="30">
                                </a>
                                <a class="px-2 text-light text-decoration-none d-inline-flex align-items-center" href="https://discord.gg/z83AaZuc6z" target="blank" aria-label="discord">
                                    <small>NSG-Show</small><img class="ms-2" src="@/assets/discord-logo.png" alt="" height="30">
                                </a>

                                <a class="px-2 text-light text-decoration-none d-inline-flex align-items-center" href="https://discord.gg/f5axpKQ8cT" target="blank" aria-label="discord">
                                    <small>SBT Official</small><img class="ms-2" src="@/assets/discord-logo.png" alt="" height="30">
                                </a>
                            </div>

                            <div class="px-2 d-md-flex bg-black flex-wrap align-items-center">
                                <div class="me-4 small mb-2 my-2">Play with us : </div>
                                <a href="https://splinterlands.com" title="https://splinterlands.com" target="blank" class="bg-dark py-1 px-3 my-2 d-inline-block small me-2 rounded rounded-pill text-light text-decoration-none">Splinterlands</a>
                                <a href="https://www.risingstargame.com" title="https://www.risingstargame.com" target="blank" class="bg-dark py-1 px-3 my-2 d-inline-block small me-2 rounded rounded-pill text-light text-decoration-none">Rising Stargame</a>
                                <a href="https://fadedmonsuta.io" title="https://fadedmonsuta.io" target="blank" class="bg-dark py-1 px-3 my-2 d-inline-block small me-2 rounded rounded-pill text-light text-decoration-none">Faded Monsuta</a>
                                <a href="https://www.streamraiders.com" title="https://www.streamraiders.com" target="blank" class="bg-dark py-1 px-3 my-2 d-inline-block small me-2 rounded rounded-pill text-light text-decoration-none">Stream Raiders</a>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-5">
                            <iframe src="https://player.twitch.tv/?channel=splinterlandstv&parent=nosleepgang.netlify.app" frameborder="0" allowfullscreen="true" scrolling="no" height="480" width="854"></iframe>
                        </div>
                        <div class="row" v-if="posts.length">
                            <div
                                v-for="(GoogleSpreadsheetRow, index) in posts"
                                :key="index"
                                class="col-lg-6"
                            >
                                <div class="card mb-3 bg-dark post">
                                    <div class="row g-0">
                                        <div class="col-md-4 d-flex align-items-center">
                                            <a :href="GoogleSpreadsheetRow.LINK" target="blank" class="rounded-start thumbnail text-decoration-none" :style="`background-image: url('${GoogleSpreadsheetRow.THUMBNAIL}')`" v-if="GoogleSpreadsheetRow.THUMBNAIL"></a>
                                            <div v-else class="img-fluid p-3 text-center text-muted">No image available</div>
                                        </div>
                                        <div class="col-md-8">
                                        <div class="card-body">
                                            <a :href="GoogleSpreadsheetRow.LINK" target="blank" class="text-decoration-none">
                                                <p class="card-title mb-0 text-light">{{limitText(GoogleSpreadsheetRow.TITLE, 80)}}</p>
                                                <p class="text-muted mb-0 text-nowrap text-truncate">{{GoogleSpreadsheetRow.DESCRIPTION || ''}}</p>
                                            </a>
                                            <div class="mt-2 text-muted small text-end">
                                                {{GoogleSpreadsheetRow.AUTHOR}}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="py-5">
                            <p class="text-muted">No latest posts</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </transition>
    </div>
</template>

<script>
import { GoogleSpreadsheet } from 'google-spreadsheet';

const SHEET_ID = process.env.VUE_APP_SHEET_ID;
const CREDENTIALS = {
    private_key: process.env.VUE_APP_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.VUE_APP_EMAIL,
};
export default {
  name: 'Home',

  data () {
    return {
      streamers: [],
      posts: [],
      isLoading: true
    }
  },

  mounted () {
    this.loadData();
  },

  methods: {
    limitText (text, limit) {
        if (text && text.length > limit) {
            return `${String(text).slice(0, limit - 3)}...`
        }   
        return text;
    },
    getAuthorLink (link) {
        if(!link) return;
        const split = link.split('/').slice(0, -1).join('/');
        return split;
    },
    async loadData () {
        this.isLoading = true;
        const doc = new GoogleSpreadsheet(SHEET_ID);
        await doc.useServiceAccountAuth(CREDENTIALS);
        await doc.loadInfo();
        const sheetStreamers = doc.sheetsByTitle['streamers'];
        let streamersRandomized = await sheetStreamers.getRows();
        this.streamers = this.shuffle(streamersRandomized);
        const sheetPosts = doc.sheetsByTitle['posts'];
        this.posts = await sheetPosts.getRows();
        this.isLoading = false;
    },
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

            // swap elements array[i] and array[j]
            // we use "destructuring assignment" syntax to achieve that
            // you'll find more details about that syntax in later chapters
            // same can be written as:
            // let t = array[i]; array[i] = array[j]; array[j] = t
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
  }
}
</script>

<style scoped>

@media (min-width: 768px) {
    .side-bar {
        width: 300px;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
    }
    main {
        margin-left: 300px;
    }
    .post {
        height: 130px;
    }
}

.side-bar {
    overflow: hidden;
}

.side-bar:hover {
    overflow-y: auto;
}


.list-unstyled > li > div:hover {
    cursor: pointer;
}

.list-unstyled > li > div:hover {
    background-color: #6441a4;
}

.thumbnail {
    background-position: center;
    background-size: cover;
    height: 130px;
    width: 100%;
}

.loading {
    transform: scale(2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>