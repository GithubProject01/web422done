/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: ______________________ Student ID: ______________ Date: ________________
* Heroku Link: _______________________________________________________________
*
********************************************************************************/ 

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");

const myData = dataService("mongodb+srv://Web322Pracctice:Webprac@123@cluster0.z0ljp.mongodb.net/sample_supplies?retryWrites=true&w=majority");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req, res) => {
    // req.body = newData;
    myData.addNewSale(req.body).then((addSale) => {
        console.log(addSale);
        res.json(addSale);
    }).catch(err => {
        console.log("catch save error: " ,err);
        res.json({
            message: err
        });
    });
});


// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: http://127.0.0.1:3000/api/sales?page=1&perPage=5 )
app.get("/api/sales", (req, res) => {
    myData.getAllSales(req.query.page, req.query.perPage).then((data) => {
        res.json(data);
    }).catch(err => {
        res.json({
            message: err
        });
    });
});


// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: http://127.0.0.1:3000/api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req, res) => {
    console.log(req.params.id);
    myData.getSaleById(req.params.id).then(sale => {
        res.json(sale);
    }).catch(err => {
        res.json({
            message: err
        });
    });
});


// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: http://127.0.0.1:3000/api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req, res) => {
    myData.getSaleById(req.params.id).then((addSale) => {
        if (addSale != null) {
            myData.updateSaleById(req.body, req.params.id).then((msg) => {
                res.json(msg);
            }).catch(err => {
                res.json({
                    message: err
                });
            });
        }
    }).catch(err => {
        res.json({
            message: err
        });
    });
});


// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: http://127.0.0.1:3000/api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req, res) => {
    myData.deleteSaleById(req.params.id).then((msg) => {
        res.json(msg);
    }).catch(err => {
        console.log(err);
        res.json({
            message: err
        });
    });
});
// ************* Initialize the Service & Start the Server

myData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});