const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = 3000



const listUser = [];

let cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`App ouvindo na porta: ${port}`)
})

function validaPeso(peso) {
    if (peso != undefined && peso != NaN) {
        return true;
    }
    throw ('Para calcular o IMC deve informar um peso valido!')
}

function validaAltura(altura) {
    if (altura != undefined && altura != NaN) {
        return true;
    }
    throw ('Para calcular o IMC deve informar uma altura valida!')
}

function calculaImc(peso, altura) {
    let alturaTratada = altura / 100;
    return (peso / (alturaTratada * alturaTratada)).toFixed(2);
}

function classificaImc(imc) {
    const objImc = {
        imc: imc,
        text: ''
    }

    if (imc < 17) {
        objImc.text = 'Muito Abaixo do Peso'
    } else if (imc > 17 && imc <= 18.49) {
        objImc.text = 'Abaixo do Peso'
    } else if (imc >= 18.5 && imc <= 24.99) {
        objImc.text = 'Peso Normal'
    } else if (imc >= 25 && imc <= 29.99) {
        objImc.text = 'Sobre Peso'
    } else if (imc >= 30 && imc <= 34.99) {
        objImc.text = 'Obesidade Grau 1'
    } else if (imc >= 34.99 && imc <= 39.99) {
        objImc.text = 'Obesidade Grau 2'
    } else {
        objImc.text = 'Obesidade Grau 3'
    }

    return objImc;
}

app.post('/imc', (req, res, next) => {
    console.log(req.body);

    try {
        if (validaAltura(req.body.altura) && validaPeso(req.body.peso)) {
            const imc = calculaImc(req.body.peso, req.body.altura);
            const imcClassificado = classificaImc(imc);
            console.log(imc, imcClassificado);
            // res.writeHead(200, { 'Content-Type': 'application/json' });
            res.json(imcClassificado);
            return res.end();
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

app.post('/user', (req, res, next) => {
    console.log(req.body);

    try {

        const user = new Object();

        user.id = req.body.id;
        user.name = req.body.name;
        user.imc = req.body.imc;
        user.classificacaoImc = req.body.classificacaoImc;

        listUser.push(user);

        console.log("listUser");
        console.log(listUser);

        res.json(user);
        res.writeHead(202, { 'Content-Type': 'application/json' });

        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

app.get('/user', (req, res, next) => {
    console.log(req.body);

    try {

        res.json(listUser);
        res.writeHead(200, { 'Content-Type': 'application/json' });

        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

app.get('/user/:id', (req, res, next) => {
    console.log(req.body);

    try {

        let id = req.body.id;

        const user = findUser(listUser, id);

        res.json(user);
        res.writeHead(200, { 'Content-Type': 'application/json' });

        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

app.delete('/user/:id', (req, res, next) => {
    console.log(req.body);

    try {

        let id = req.body.id;
        deleteUser(listUser, id);
        res.json("Deletado com Sucesso!!!");
        res.writeHead(200, { 'Content-Type': 'application/json' });

        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

app.put('/user/:id', (req, res, next) => {
    console.log(req.body);

    try {

        let id = req.body.id;

        const user = findUser(listUser, id);

        user["name"] = req.body.name;
        user["imc"] = req.body.imc;
        user["classificacaoImc"] = req.body.classificacaoImc;


        res.json("Atualizado com Sucesso!!!");
        res.writeHead(200, { 'Content-Type': 'application/json' });

        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

function findUser(listUser, id) {

    const user = listUser.map(function (usr) {
        if (usr.id == id) {
            return usr;
        }

    })

    return user;
}

function deleteUser(array, id) {
    let indice = array.indexOf(id);
    array.splice(indice, 1);
}