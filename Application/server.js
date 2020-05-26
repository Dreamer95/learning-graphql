require('dotenv').config();
const express = require("express");
const expressGraphQL = require("express-graphql");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/my-graphql', expressGraphQL({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send('Hello World')
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qtzqq.mongodb.net/
${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Hello GraphQL')
        })
    })
    .catch((err) => {
        console.log('Error connect mongodb', err)
    })
