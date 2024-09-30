let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Initialize SQLite database connection
(async () => {
  db = await open({
    filename: "./Backend/database.sqlite",
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// function to fetch all artworks
async function fetchAllArtworks(){
 let query = "SELECT * FROM artworks";
 let response = await db.all(query, []);
 return { artworks: response };
}

// Route to fetch all artworks
app.get("/artworks", async (req, res)=>{
  try{
    const results = await fetchAllArtworks();

    if(results.artworks.length === 0){
      res.status(404).json({ message: "No Artworks Found." });
    }

    res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
});

// function to fetch artwork by artist
async function fetchArtworksByArtist(artist){
  let query = "SELECT id, title, artist, year from artworks WHERE artist = ?";
  let response = await db.all(query, [artist]);
  return { artworks: response };
}

// Route to fetch artwork by artist
app.get("/artworks/artist/:artist", async (req, res)=>{
 let artist = req.params.artist;
 try{
   const results = await fetchArtworksByArtist(artist);
   
   if(results.artworks.length === 0){
     res.status(404).json({ message: "No Artworks Found for this Artist: " + artist });
   }

   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch artworks by year
async function fetchArtworksByYear(year){
  let query = "SELECT id, title, artist, year FROM artworks WHERE year = ?";
  let response = await db.all(query, [year]);
  return { artworks: response };
}

// Route to fetch artworks by year
app.get("/artworks/year/:year", async (req, res)=>{
 let year = req.params.year;
 try{
   const results = await fetchArtworksByYear(year);
   
   if(results.artworks.length === 0){
     res.status(404).json({ message: "No Artworks Found for this Year: " + year });
   }

   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch artworks by medium
async function fetchArtworksByMedium(medium){
  let query = "SELECT id, title, artist, medium FROM artworks WHERE medium = ?";
  let response = await db.all(query, [medium]);
  return { artworks: response };
}

// Route to fetch artworks by medium
app.get("/artworks/medium/:medium", async (req, res)=>{
 let medium = req.params.medium;
 try{
   const results = await fetchArtworksByMedium(medium);

   if(results.artworks.length === 0){
     res.status(404).json({ message: "No Artworks Found for Medium: " + medium });
   }

   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));