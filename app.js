// utility method
function getQueryParameters(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) { return n = n.split("="), this[n[0]] = n[1], this }.bind({}))[0];
}

// app code
let app = new Vue({
    el: "#app",
    data: {
        app: {
            clientId: 'eb652d287e6e4ed4a108c5c96ed8c609',
            baseUrl: 'https://api.spotify.com/v1/',
            authUrl: 'https://accounts.spotify.com/authorize'
        },
        search: {
            string: null,
            results: []
        },
        user: {
            id: null,
            tokenDetails: window.location.hash ? getQueryParameters(window.location.hash.substring(1)) : null
        },
        playlist: {
            id: null,
            name: 'New Playlist',
            tracks: []
        }
    },
    computed: {
        authed: function () {
            return this.user.tokenDetails !== null;
        }
    },
    watch: {
        "search.string": function (newVal, oldVal) {
            if (newVal.length < 3) {
                this.search.results = [];
                return;
            }
            this.$http.get(`${this.app.baseUrl}search?q=${encodeURI(newVal)}&type=track`, { headers: { 'Authorization': `${this.user.tokenDetails.token_type} ${this.user.tokenDetails.access_token}` } }).then(response => {
                this.search.results = response.body.tracks.items.slice(0, 3);
            });
        }
    },
    methods: {
        selectTrack: function (track) {
            if (this.playlist.tracks.includes(track)) return;
            this.playlist.tracks.push(track);
        },
        createPlaylist: function () {
            const playlist = {
                name: this.playlist.name,
                public: false,
                description: 'Created with Spotify Playlist Curator'
            }
            this.$http.post(`${this.app.baseUrl}users/${this.user.id}/playlists`, JSON.stringify(playlist), { headers: { 'Authorization': `${this.user.tokenDetails.token_type} ${this.user.tokenDetails.access_token}`, 'Content-Type': 'application/json' } }).then(response => {
                this.playlist.id = response.body.id;
                this.addSongsToPlaylist();
            });
        },
        addSongsToPlaylist: function () {
            this.$http.put(`${this.app.baseUrl}users/${this.user.id}/playlists/${this.playlist.id}/tracks`, JSON.stringify({ uris: this.playlist.tracks }), { headers: { 'Authorization': `${this.user.tokenDetails.token_type} ${this.user.tokenDetails.access_token}`, 'Content-Type': 'application/json' } });
        },
        auth: function () {
            window.location.replace(`${this.app.authUrl}?scope=playlist-modify-private&response_type=token&client_id=${this.app.clientId}&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080`);
        }
    },
    created: function () {
        this.$http.get(`${this.app.baseUrl}me`, { headers: { 'Authorization': `${this.user.tokenDetails.token_type} ${this.user.tokenDetails.access_token}` } }).then(response => {
            this.user.id = response.body.id;
        });
    }
});