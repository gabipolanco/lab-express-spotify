require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get("/", (req, res) => {
    res.render("index")
  });

  app.get('/artist-search',(req,res) => {
    const {search} = req.query
    spotifyApi.searchArtists(search)
  .then(data => {
    const arr= data.body.artists.items
    console.log('The received data from the API: ', arr);
    res.render('artist-search-results',  {arr} )
  })

  .catch(err => console.log('The error while searching artists occurred: ', err))
  })

  app.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    spotifyApi
        .getArtistAlbums(id)
        .then((data) => {
            const { items } = data.body.artists.items;
            res.render("albums", { albums: items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
