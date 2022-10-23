<template>
    <div>
        <div v-if="isLoading" class="min-vh-100 bg-black d-flex align-items-center justify-content-center">
            <div class="spinner-grow text-warning loading"></div>
        </div>

        <transition name="fade">
        <div  v-if="!isLoading" class="min-vh-100 text-light position-relative">
            <div class= "h-100 d-flex flex-column p-3 p-md-0 side-bar bg-black">
                <div class="px-2 py-2 side-bar-header text-danger bg-black text-center font-monospace fw-bold fs-3">No Sleep Gang</div>
                <div class="h-100 flex-fill side-bar-list">
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
            </div>

            <main class="ps-md-3 bg-black">
                <div class="latest-post text-center text-md-start">
                    <div class="px-3 py-2 mb-4 d-md-flex flex-wrap align-items-center justify-content-between main-page-header bg-black">
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
                    <div class="d-flex align-items-center justify-content-center mb-5 twitch-wrapper">
                        <iframe src="https://player.twitch.tv/?channel=splinterlandstv&parent=nosleepgang.netlify.app" frameborder="0" allowfullscreen="true" scrolling="no" height="100%" width="100%"></iframe>
                    </div>
                    <div class="bg-darker px-3 py-2">
                        <div v-if="isPostLoading" class="py-5 bg-black d-flex align-items-center justify-content-center">
                            <div class="spinner-grow text-warning loading"></div>
                        </div>
                        <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-4" v-if="!isPostLoading && posts.length">
                            <div
                                class="col"
                                v-for="(post, index) in posts"
                                :key="index"
                            >
                                <div class="card bg-dark h-100">
                                    <img :src="post.image" class="card-img-top thumbnail" alt="..." v-if="post.image">
                                    <div v-else class="text-center thumbnail d-flex align-items-center justify-content-center w-100 text-muted">
                                        No image available
                                    </div>
                                    <div class="card-body">
                                        <a :href="post.url"  class="card-title text-secondary text-decoration-none" target="blank" >
                                            <h5>{{limitText(post.title, 150)}}</h5>
                                        </a>
                                        <p class="card-text">{{limitText(post.description, 200) || ''}}</p>
                                        
                                    </div>
                                    <div class="card-footer d-flex justify-content-between flex-wrap">
                                        <small>Author: {{post.author}}</small>
                                        <small class="text-muted">{{post.created}}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!isPostLoading && !posts.length" class="py-5">
                            <p class="text-muted">No latest posts</p>
                        </div>
                    </div>
                </div>
            </main>

            <p class="text-end mb-0 mt-5"><span class="small px-1 text-light bg-primary">by: bo0mburst  @nevermeltice</span></p>
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
      isLoading: true,
      isPostLoading: true,
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
        const sheetPeakdUsers = doc.sheetsByTitle['peakd_users'];
        const users = await sheetPeakdUsers.getRows();
        this.isLoading = false;

        this.isPostLoading = true;
        let posts = [];

        for (const {USERS} of users) {
            const res = await this.getPost(USERS);
            if (!res.length) return
            const post = res[0]
            const json = post.json_metadata;
            const image = json.image ? json.image[0] : 'https://peakd.com/static/img/peakd_logo_home.695a58db.svg';
            const title = post.title.length > 50 ? `${post.title}...` : post.title;
            const author = post.author;
            const description = json.description ? json.description : '...';
            const url = post.url;
            const created = new Date(post.created).toDateString();

            posts.push({
                image,
                title,
                author,
                description,
                url,
                created,
            })
        }

        posts.sort((a, b) => {
            return new Date(b.created) - new Date(a.created)
        });
        this.posts = [...posts];
        this.isPostLoading = false;
    },

    async getPost (account) {
        const res = await fetch("https://api.hive.blog", {
            body: `{"jsonrpc":"2.0", "method":"bridge.get_account_posts", "params":{"sort": "blog", "account": "${account}", "limit": 1}, "id":1}`,
            method: "POST"
        });
  
        const {result} = await res.json();
        return result;
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

.side-bar-list {
    overflow: auto;
    max-height: 300px;
}

.side-bar-header {
    position: relative;
}

.list-unstyled > li > div:hover {
    cursor: pointer;
}

.list-unstyled > li > div:hover {
    background-color: #6441a4;
}

.thumbnail {
    height: 300px;
    width: 100%;
    object-fit: cover;
    object-position: top;
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

.twitch-wrapper {
    height: 350px;
}
@media (min-width: 768px) {
    .main-page-header {
        position: sticky;
        top: 0;
        z-index: 999;
    }
    .side-bar {
        max-height: 100%;
        width: 300px;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
    }

    .side-bar-list {
        overflow: hidden;
        max-height: unset;
    }

    .side-bar-list:hover {
        overflow-y: auto;
    }

    .side-bar-header {
        position: sticky;
    }
    main {
        margin-left: 300px;
    }
    .post {
        height: 130px;
    }

    .twitch-wrapper {
        width: 100%;
        margin: 0 auto;
        height: 500px;
        max-width: 1440px;
    }
}
</style>