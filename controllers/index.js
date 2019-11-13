/*
    Describe: Classe para controle das rotas do index.
    Authors: 
        - Daniel Borba Varela dos Santos
        - Bruno Henrique de Borba
    Created: 27/10/2019
    Updated: 27/10/2019
*/

//native libs
const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');
const md5 = require('md5');

const post = async (req, res, next) => {
    
    try {
  
        //*****implementacao*****
        const filePath = path.join(__dirname, '..', 'files', req.file.filename);

        //faz leitura do arquivo
        const texto = await lerFile(filePath);

        var texto_md5 = md5(texto);

        EncriptyKey(texto_md5);

        //*****retorno*****
        res.render('index', { title: 'Sistemas Seguros', result: "Gerado arquivo binário!" });

    } catch (error) {
        var texto = "Não foi possível encriptar o texto, Erro: "+error.message;
        res.render('index', { title: 'Error Sistemas Seguros', result: texto });
    }

};

const EncriptyKey = async (texto) => {
    const key = new NodeRSA();
    fs.readFile("publicKeyA.pem", {encoding: 'utf-8'}, async (err,data) => {
        if (!err) {
            key.importKey(data, 'pkcs8-public-pem');
            const encrypted = key.encrypt(texto);
            var texto_v = encrypted.toString('base64');
            await fs.writeFile("assinatura.bin", texto_v, (err) => {
                if(err)
                    return console.log(err);
                console.log("The file was saved!");
            });
            
        } else {
            console.log(err);
        }
    });
}

const DecriptyKey = async (req, res, next) => {
    const key = new NodeRSA();
    fs.readFile("privateKeyA.pem", {encoding: 'utf-8'}, async (err,data) => {
        if (!err) {
            key.importKey(data, 'pkcs1-pem');
            fs.readFile("assinatura.bin", {encoding: 'utf-8'}, async (err,data) => {
                if (!err) {
                    const decrypted = key.decrypt(data);
                    var texto = decrypted.toString('utf8');
                    res.render('index', { title: 'Resultado: ', result: texto });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

const DecriptyKeyB = async (req, res, next) => {
    const key = new NodeRSA();
    fs.readFile("privateKeyB.pem", {encoding: 'utf-8'}, async (err,data) => {
        if (!err) {
            key.importKey(data, 'pkcs1-pem');
            fs.readFile("assinatura.bin", {encoding: 'utf-8'}, async (err,data) => {
                if (!err) {
                    const decrypted = key.decrypt(data);
                    var texto = decrypted.toString('utf8');
                    res.render('index', { title: 'Resultado: ', result: texto });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

const getGerarChaves = async (req, res, next) => {
    var NodeRSA = require('node-rsa');
    var key = new NodeRSA().generateKeyPair();
    var publicKey = key.exportKey('pkcs8-public-pem');
    var privateKey = key.exportKey('pkcs1-pem');

    var texto = "Chaves geradas!";

    await fs.writeFile("publicKeyA.pem", publicKey, (err) => {

        if(err)
            return console.log(err);
    
        console.log("The file was saved!");
    });

    await fs.writeFile("privateKeyA.pem", privateKey, (err) => {

        if(err)
            return console.log(err);
    
        console.log("The file was saved!");
    });

    var key = new NodeRSA().generateKeyPair();
    var publicKey = key.exportKey('pkcs8-public-pem');
    var privateKey = key.exportKey('pkcs1-pem');

    await fs.writeFile("publicKeyB.pem", publicKey, (err) => {

        if(err)
            return console.log(err);
    
        console.log("The file was saved!");
    });

    await fs.writeFile("privateKeyB.pem", privateKey, (err) => {

        if(err)
            return console.log(err);
    
        console.log("The file was saved!");
    });
    
    res.render('index', { title: 'Gerar Chave', result: texto });
}

const lerFile = (filePath) => {

    return new Promise(resolve => {

        fs.readFile(filePath, {encoding: 'utf-8'}, (err,data) => {

            if (!err)
                return resolve(data);
            else
                return resolve(err.message);
            
        });
        
    });
    
}


module.exports = {
    post:post,
    getGerarChaves:getGerarChaves,
    EncriptyKey:EncriptyKey,
    DecriptyKey:DecriptyKey,
    DecriptyKeyB:DecriptyKeyB,
}