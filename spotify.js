
    document.getElementById("generatePlaylist").addEventListener("click", function() {
        const mood = document.getElementById("moodSelect").value;
        const genre = document.getElementById("genreSelect").value;
        const accessToken = "YOUR_SPOTIFY_ACCESS_TOKEN";  // Replace this with the actual token
      
        // Fetch recommendations based on mood and genre
        fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=20`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
          const trackIds = data.tracks.map(track => track.id);
      
          // Create a new playlist for the logged-in user
          return fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: 'My Mood Playlist'})
          })
          .then(response => response.json())
          .then(playlistData => {
            const playlistId = playlistData.id;
      
            // Add recommended tracks to the new playlist
            return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({uris: trackIds.map(id => `spotify:track:${id}`)})
            });
          });
        })
        .then(() => {
          alert('Playlist created successfully!');
        })
        .catch(error => {
          console.error("Something went wrong:", error);
          alert('Failed to create playlist.');
        });
      });
  