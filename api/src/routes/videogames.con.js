
const { Router } = require('express');
require ('dotenv').config();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { API_KEY } = process.env;
const axios = require ('axios');
const { Videogame, Genres } = require ('../db.js')
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const ApiGames  = async () => {
    try {
    const arrGames = [];
    for (let i = 1; i < 6; i++){
    const ApiUrl = `https://api.rawg.io/api/games?key=a00293488b2c45e682939739dd2ff8ca&page=${i}`;
    let Api = await axios.get(ApiUrl);
    Api.data.results.map (e => {
        arrGames.push({
            id: e.id,
            name : e.name,
            released: e.released,
            rating : e.rating,
            background_image : e.background_image,
            platforms: e.parent_platforms.map((e) => e.platform.name),
            genres : e.genres.map(e => e.name).join(" , "),
        });
    });
}
    return arrGames;
} catch (error) {
        return(error);
}
}


const DbGames = async () => {
    const infoDb = await Videogame.findAll({
       include: {
            model: Genres,
            attributes: ["name"],
            through: {
              attributes: [],
            },
        }
    });
    const mapInfoDb = infoDb?.map((e) => {
          return {
        id: e.id,
        name: e.name,
       background_image: e.background_image,
        genres: e.genres.map(e=>e.name).join(" , "),
        description: e.description,
        released: e.released,
        rating: e.rating,
        plataforms: e.platforms,
      };
    });
    return mapInfoDb;
  };

const GetAllGames = async () =>{
    const DataApi = await ApiGames();
    const DataBd = await DbGames();
    const AllData = DataApi.concat(DataBd);
    return AllData;
}
  
module.exports = GetAllGames;
