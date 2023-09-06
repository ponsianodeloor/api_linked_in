//llamamos a express
const express = require('express');

const fs = require('fs');

//iniciamos express
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(3000, () => {
   console.log('estoy escuchando por el puerto 3000');
});

//metodo GET
app.get('/', function (request, response) {
    response.send('Holi');
});

app.get('/movies', (req, res)=> {
    fs.readFile('movies.json', (error, file) =>{
        if(error){
            console.log('No se puede leer el archivo', error);
            return;
        }
        const movies = JSON.parse(file);
        return res.json(movies);
    });
});


//metodo post
app.post('/movies', (req, res)=>{
    fs.readFile('movies.json', (err, data)=>{
        if(err){
            console.log("Error no se puede leer el archivo")
        }
        const movies = JSON.parse(data);
        req.body.id = movies.length + 1;
        movies.push(req.body);

        //el array movies ahora contiene la nueva pelicula
        const newMovie = JSON.stringify(movies, null, 2);
        fs.writeFile('movies.json', newMovie, (err)=>{
            if(err){
                console.log("Ha ocurrido un error al escribir en el archivo");
            }
            return res.status(200).send("new movie added");
        });
    });
});

//metodo put
app.put('/movie/:id', function (request, response) {
    //obtener el id del endpoint
    const id = request.params.id;
    const {name, year} = request.body;

    fs.readFile('movies.json', (err, data)=>{
        if(err){
            console.log("Ha ocurrido un error al leer el archivo", err);
        }

        const movies = JSON.parse(data);
        movies.forEach(movie => {
            if(movie.id === Number(id)){

                if(name != undefined){
                    movie.name = name;
                }
                if(year != undefined){
                    movie.year = year;
                }

                const movieUpdated = JSON.stringify(movies, null, 2);
                fs.writeFile('movies.json', movieUpdated, (err)=>{
                    if(err){
                        console.log("Ha ocurrido un error al escribir en el archivo");
                    }
                    return response.status(200).send("Movie Edited");
                });

            }
        });
    });
});

app.delete('/movie/:id', function (request, response) {
    //obtener el id del endpoint
    const id = request.params.id;

    fs.readFile('movies.json', (err, data) => {
        if (err){
            console.log("Ha ocurrido un error al leer el fichero", err);
        }

        const movies = JSON.parse(data);

        movies.forEach(movie => {
            if (movie.id === Number(id)){
                movies.splice(movies.indexOf(movie), 1);
                const movieDeleted = JSON.stringify(movies, null, 2);

                fs.writeFile('movies.json', movieDeleted, (err) => {
                    if (err) {
                        console.log("Ha ocurrido un error al escribir")
                    }
                    return res.status(200).json({message : "Pelicula eliminada correctamente"});
                });
            }
        });
    });
});
