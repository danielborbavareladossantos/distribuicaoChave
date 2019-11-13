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

const post = async (req, res, next) => {
    
    try {
        
        //*****validacoes*****
        if (req.body.nome == null || req.body.nome == "")
            throw new Error('Campo nome inválido!');
        
        if (req.body.chave == null || req.body.chave == "")
            throw new Error('Campo chave inválido!');

        //*****implementacao*****
        const filePath = path.join(__dirname, '..', 'files', req.file.filename);

        //faz leitura do arquivo
        const texto = await lerFile(filePath);

        //*****retorno*****
        res.render('index', { title: 'Result AES', result: texto });

    } catch (error) {
        var texto = "Não foi possível encriptar o texto, Erro: "+error.message;
        res.render('index', { title: 'Error AES', result: texto });
    }

};

const EncriptyKey = async (req, res, next) => {
    const key = new NodeRSA();
    const input = Buffer.from('test', 'utf8');
    const keyData = '-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlJ/m4gXb4/QxCvjxvq+U ZUWMxk77Cb3dZ9BYIJg925GfiWXg1chgzsHddr2H5KlrnhK94aDIR58h0RCJUGep +GJXgIoOvAY2EdKYu5wtzzaQJTqZffrVw/Msa9pzxILqaDiI9GgLswyGYdqPRP/0 3z9pox/IhwoN/47pbmYwNqB1HHx/zNMPcQrzgdItFmSUsWLRGn/Db429j800F+Gs LdGhnSwtiiVhpIr6f+we5vmDxtaMH0GEHUiRMXgM/XLpuQQOP/C4tkvj3/hex+9C QFGgdN1agMrzY0BAayLxRmxR5vtPSwsu3+W0Idh/kE96ytbAA+G089Z/1Jo7qxYF fwIDAQAB -----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public-pem');

    const encrypted = key.encrypt(input);

    var texto = "Chave encriptada! encrypted: \n"+encrypted.toString('base64');
    res.render('index', { title: 'Gerar Chave', result: texto });
}

const DecriptyKey = async (req, res, next) => {
    const key = new NodeRSA();
    const input = Buffer.from('GIBejSQIdcZZOPKF1OCBlzvXjYC1Z3Bw1OJrapWGtwmaf4WRScUF2ju2cORDRF8Fp0Y8ePzawW95WIxL7AV1BFCJ5Lh66IJ6mCxEDAbMhzAiuIGz0J1RGDtAJI6XmLbMMMJ924La5AO4BxB43JUaK1qcDPPWRkWM0nRm0g2QfmF+oeHzPJ73gs2Dv8S3LtXU6/BMLcjP9Ivg99cTxl4kXYeXLdscjIo8/Dnyg/Y4WJg6XlmgeJA7L7fyA+uBf0cwKPuMXjhjfssBKeYjeowPrlYZjg0xfDbFA0+Zmuo6bUXPOwtnQ5FpVIJOky7Nbre+eU09MZxBS7uWaE72BUVvsg==', 'base64');
    const keyData = '-----BEGIN RSA PRIVATE KEY----- MIIEpAIBAAKCAQEAlJ/m4gXb4/QxCvjxvq+UZUWMxk77Cb3dZ9BYIJg925GfiWXg 1chgzsHddr2H5KlrnhK94aDIR58h0RCJUGep+GJXgIoOvAY2EdKYu5wtzzaQJTqZ ffrVw/Msa9pzxILqaDiI9GgLswyGYdqPRP/03z9pox/IhwoN/47pbmYwNqB1HHx/ zNMPcQrzgdItFmSUsWLRGn/Db429j800F+GsLdGhnSwtiiVhpIr6f+we5vmDxtaM H0GEHUiRMXgM/XLpuQQOP/C4tkvj3/hex+9CQFGgdN1agMrzY0BAayLxRmxR5vtP Swsu3+W0Idh/kE96ytbAA+G089Z/1Jo7qxYFfwIDAQABAoIBAQCMISOQUdPcXp1q 6gMMNgGlZmjvhQIeUjyRqBefS8tu3SNdaYgOKOpVpuXHEbYx+yczmBodxPlwxfId awj8nXDdduNnl0ODNhv+u+Aza3Kpn5lS8KhN5pVsNjfYzNRAIOsgLsW6Iut8+r8t PeO9O9NGNkTEf7AS2oEORlGDPKgSp898H04VlA9u08ES4+ctExyAW3tte4Bc7V81 3KPQd9Zbl4W3qODSefsgwlnvxh2hdx9lm2a6VkoqaWCg6O3cbkgNw/I6Ry/JJaVk tIcmONK8RAh+8H6rw/d9y3gMydWpAnFGndnjIokbJg1SUsOQl2Mo9fjC76ATguWb GHRz+W3JAoGBANeBjOj1/P0VdowQdIEMTIGCXczxB09TI2hiRQ8poKY+PhSRCbLU GN2zmDIrAq1t6MB+HctkAch8QJLUaGoqlUWfC8uazyz0fQKOjCPgcUL5Q6o650ve wDGmbX8ohlnItCpAkLBk1QvcLtOWcZjSwMIxps0FDgLi53ZUMNKulRfNAoGBALCN KlpG/77/NwV0QPCn5k+dmsUcH0BVjGRJUcw5eLjtm+O46WyS4ToSl3fNwCCqXCIA nidGn5y8Zcp5tSVG5N1JfF4+qRm1DM/EURTlvnMxssaB6aNYRfabfSYXZ6Nj8xEv vWIfHSH+FEiA1CPl3nutpRboRVaEi1GdWr/5n+57AoGBAJTlDVZnnsO9cIqVU+lV dgaE7AoM/d/wsSYNv2kaecRifMH485p6sDN9QkpnLRJmPcnBWRSNpC3Aq1zHJN01 Tq0rlhq2ey20PirmEi03hQmg7v9Oc0AYRvIG6uBQP4MJCHGo6k71W702A6Rs7U+J TWTeqUA9ndCgtQssYA8wUBKBAoGAGTI8Th/91btElfGuZun/U3NxqBnIV/0diR5x nwzArtuyOMCmB4m6vPf0R/PELKVDetLNv1sz4kF84XWXJZfFh9M5/ZVButp81pX0 4F+dW4FHO09FEbvCWFx+ctY6QzY7dUNz6rH4DWbebC5+mBTxOINioS9K3fsSivZD AkzUx0sCgYALastRMBA+e6BVK4OW3NWYCSFewKhz/ZNlr8X7aS0I+hAglrHY28SU 4VXCzNdGuf5RI57tGwCLoWSr0MutyTgFmyZyeCbOB8Yg647gG7c4ufkLfvUFoG73 ko/vMYojBEwuKcwMuX+fSd1fwXXcHUb34Jgr9S7PSRM6iclck8lC2A== -----END RSA PRIVATE KEY-----';
    key.importKey(keyData, 'pkcs1-pem');

    const decrypted = key.decrypt(input);

    var texto = "Chave encriptada! \n decrypted: \n"+decrypted.toString('utf8');
    res.render('index', { title: 'Gerar Chave', result: texto });
}

const getGerarChaves = async (req, res, next) => {
    var NodeRSA = require('node-rsa');
    var key = new NodeRSA().generateKeyPair();
    var publicKey = key.exportKey('pkcs8-public-pem');
    var privateKey = key.exportKey('pkcs1-pem');

    var texto = "Chave foi gerada com sucesso! \n"+publicKey+"\n"+privateKey+"\n n: "+key.keyPair.n+"\n e: "+key.keyPair.e;
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
    DecriptyKey:DecriptyKey
}