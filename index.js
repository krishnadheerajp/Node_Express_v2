const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const cors = require('cors')
// Importing models and other files
const userModel = require("./models/userModel")
const foodModel = require("./models/foodModel");
const trackingModel = require("./models/trackingModel");
const verifyToken = require("./verifyToken");

const app = express();

app.use(express.json());
app.use(cors())

// Endpoint for user registration
app.post("/register", (req, res) => {
    let user = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        if (!err) {
            bcrypt.hash(user.password, salt, async (err, hpass) => {
                if (!err) {
                    user.password = hpass;
                    try {
                        await userModel.create(user)
                        res.status(201).send({ message: "User Registered" });
                    } catch (error) {
                        console.log(error);
                        res.status(500).send({ message: "Some problem" });
                    }
                }
            });
        }
    })
});

// Endpoint for login
app.post("/login", async (req, res) => {
    let userCred = req.body;
    try {
        let user = await userModel.findOne({ where: { email: userCred.email } });
        if (user != null) {
            bcrypt.compare(userCred.password, user.password, (err, response) => {
                if (response === true) {
                    // generate a token and send it back
                    jwt.sign({ email: userCred.email }, "pkdkey", (err, token) => {
                        if (!err) {
                            res.send({message: "Success", token: token, name: user.name, userid: user.id });
                        }
                        else {
                            res.send({ message: "Some issue while generating token" });
                        }
                    })
                }
                else {
                    res.status(403).send({ message: "Invalid password" });
                }
            })
        }
        else {
            res.status(404).send({ message: "User with given email not found" });
        }
    }
    catch (err) {
        console.log(err);
    }

})

// Endpoint to get all the foods
app.get("/foods", verifyToken, async (req, res) => {
    try {
        let foodData = await foodModel.findAll();
        res.status(200).send(foodData);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Some problem" });
    }
})

// Endpoint to get food by name
app.get("/foods/:name", verifyToken, async (req, res) => {
    try {
        let foodData = await foodModel.findAll({ where: { name: { [Op.iLike]: `%${req.params.name}%` } } });
        if (foodData != null) {
            res.status(200).send(foodData);
        }
        else {
            res.status(404).send({ message: "Food with given name not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Some problem" });
    }
})

// Endpoint to track a food
app.post("/track", verifyToken, async (req, res) => {
    let trackedFood = req.body;
    try {
        await trackingModel.create(trackedFood)
        res.status(201).send({ message: "Food is getting tracked" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Some problem" });
    }
})

// Endpoint to fetch all the foods eaten by a person
app.get("/track/:id/:date", verifyToken, async (req, res) => {
    let userDate=req.params.date;
    try {
        let userFoodData = await trackingModel.findAll({
            where: { 
                user_id: req.params.id,
                createdAt: {
                    [Op.gte]: new Date(userDate),
                    [Op.lt]: new Date(new Date(userDate).setDate(new Date(userDate).getDate() + 1))
                }
            },   
            include: [
                { model: userModel, as: 'user' },
                { model: foodModel, as: 'food' }
              ]
        });
        if (userFoodData.length != 0) {
            res.status(200).send(userFoodData);
        }
        else {
            res.status(404).send({ message: "This user has not tracked any foods" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Some problem" });
    }
})

app.listen(8080, () => {
    console.log("server is up and runnning on port 8080");
})
