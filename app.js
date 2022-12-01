const express = require('express'); //Usado para criar o servidor HTTP
const { randomUUID } = require("crypto"); //Usado para criar ID's aleatórios
const fs = require('fs'); //Usado para ler e salvar o arquivo JSON
const cors = require('cors'); //Usado para definir permissão CORS


//Iniciando servidor HTTP
const app = express();
app.use(express.json());


//Definindo permissão de acesso para qualquer endereço no CORS
app.use(cors({
    origin: '*'
}));

//Array de Posts
let posts = [];

//Ler arquivo JSON com os posts e salvar no Array
fs.readFile("posts.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        posts = JSON.parse(data);
        console.log(posts)
    }
})

//Salvar posts no arquivo JSON
function postFile() {
    fs.writeFile("posts.json", JSON.stringify(posts), (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Post Inserido com sucesso!");
        }
    });
}

//Usada para formatar zero a esquerda na Data
function adicionaZero(numero) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}


// Inserir um novo Post
app.post("/posts", (request, response) => {

    //Recuperando informações do front e salvando em constantes
    const { title, article, cover, user } = request.body;

    //Salvar data atual
    const timeElapsed = new Date(Date.now());

    // Converter data para formato brasileiro
    const format = {
        dd: adicionaZero(timeElapsed.getDate()),
        mm: adicionaZero(timeElapsed.getMonth() + 1),
        yyyy: timeElapsed.getFullYear(),
        HH: adicionaZero(timeElapsed.getHours()),
        MM: adicionaZero(timeElapsed.getMinutes()),
    };
    const date = "" + format.dd + "/" + format.mm + "/" + format.yyyy + ", " + format.HH + ":" + format.MM

    //Criar Objeto post
    const post = ({
        title,
        article,
        cover,
        user,
        date,
        id: randomUUID()
    });

    //Adcionar objeto post no array e salvar no arquivo JSON
    posts.push(post);
    postFile();

    return response.json(post);
})


//Buscar todos os Posts
app.get("/posts", (request, response) => {
    return response.json(posts);
})

//Buscar um Post em Especifico
app.get("/posts/:id", (request, response) => {
    //Recuperar ID do post do front end e buscar ele no array
    const { id } = request.params;
    const post = posts.find(post => post.id === id);
    return response.json(post);
})

//Alterar um post
app.put("/posts/:id", (request, response) => {
    //Recuperando informações de id e novos dados do post do front end
    const { id } = request.params;
    const { title, article, cover, user } = request.body;

    const timeElapsed = new Date(Date.now());

    // Data about date
    const format = {
        dd: adicionaZero(timeElapsed.getDate()),
        mm: adicionaZero(timeElapsed.getMonth() + 1),
        yyyy: timeElapsed.getFullYear(),
        HH: adicionaZero(timeElapsed.getHours()),
        MM: adicionaZero(timeElapsed.getMinutes()),
    };
    const date = "" + format.dd + "/" + format.mm + "/" + format.yyyy + ", " + format.HH + ":" + format.MM

    const index = posts.findIndex(post => post.id === id);

    //editando o objeto post, mantendo o ID atual
    posts[index] = {
        ...posts[index],
        title,
        article,
        cover,
        user,
        date
    }

    postFile();

    return response.json({ message: "Post alterado com sucesso!" });

})

//Deletar Post
app.delete("/posts/:id", (request, response) => {

    //Recuperar ID do post do front end e buscar ele no array
    const { id } = request.params;
    const index = posts.findIndex(post => post.id === id);

    //Removendo post do array
    posts.splice(index, 1);
    //removendo post do arquivo
    postFile();

    return response.json({ message: "Post Removido com Sucesso" });
})

//Definindo porta do servidor HTTP
app.listen(4002, () => console.log("Servidor está rodando no endereço http://localhost:4002"));