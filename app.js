import express from "express";
import bodyParser from "body-parser";
import { mongoose, Schema, model } from "mongoose";
import path from "path"

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const URI = "mongodb+srv://swapnilshah30901:swapnil96871@cluster0.uvg1m9l.mongodb.net/groccery_management_system?retryWrites=true&w=majority"

// Define a Mongoose schema for the grocery items
const groceryItemSchema = new Schema({
    name: String,
    quantity: Number,
});

const GroceryItem = model('GroceryItem', groceryItemSchema);

// POST endpoint to add grocery items to the inventory
app.post('/add-item', async (req, res) => {
    try {
        const newItemData = req.body;

        if (!newItemData.name || !newItemData.quantity) {
            return res.status(400).json({ error: 'Name and quantity are required for the item.' });
        }

        const newItem = new GroceryItem(newItemData);
        await newItem.save();

        res.status(201).json({ message: 'Item added successfully.', item: newItem });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// GET endpoint to retrieve all items in the inventory
app.get('/get-items', async (req, res) => {
    try {
        const items = await GroceryItem.find();
        res.status(200).json({ inventory: items });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () =>
    mongoose.connect(URI)
        .then(() => console.log("Server is running 🚀 on port number 3000"))
        .catch((error) =>
            console.log("Server is running, but database connection failed... ")
        )
);