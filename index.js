const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x5vlu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {

    try {
        await client.connect()
        const database = client.db('tour-booking')
        const servicesCollection = database.collection('services');
        const ordersCollection = client.db("tourOrders").collection("orders");



        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });



        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)

        })

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        // delete API
        app.delete('/services/:id', async (req, res) => {
            const id = (req.params.id);
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result);



        })

        app.post('/addOrder', (req, res) => {
            const newOrder = req.body;
            console.log('Adding new event', newOrder);
            ordersCollection.insertOne(newOrder)
                .then(result => {
                    console.log('Inserted count', result.insertedCount);
                    res.send(result.insertedCount > 0)
                })
        })


        // app.get('/addOrder', (req, res) => {

        //     const document = ordersCollection.find({}).toArray(documents)
        //     res.send(document)
        // })
        app.get('/addOrder', async (req, res) => {
            const document = servicesCollection.find({});
            const serv = await document.toArray();
            res.send(serv);
        });


        // app.get('/orderedProduct', (req, res) => {
        //     ordersCollection.find({})
        //         .toArray((documents) => {
        //             // console.log(documents);
        //             res.send(documents);
        //         })
        // })


        // app.get('/orderedProduct', (req, res) => {
        //     ordersCollection.find({})
        //         .toArray((err, documents) => {
        //             console.log(documents);
        //             res.send(documents);
        //         })
        // })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('tour booking server');

});
app.get('/', (req, res) => {
    res.send('tour booking updated');

});

app.listen(port, () => {
    console.log('server rouning at port', port)
})