import express from "express";
import fs from "fs";
import bodyParser from "body-parser";


const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));//carpeta publica pel css
app.set('view engine','ejs');//Fem servir el motor ejs
app.set('views', './views'); //carpeta on desem els arxius .ejs

const readData = () => JSON.parse(fs.readFileSync('./db.json'));

const writeData = (data) => fs.writeFileSync('./db.json', JSON.stringify(data));


app.get('/products', (req, res) => {
    const user = { name: "Anmolpreet" };
    const htmlMessage = `
    <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
    <a href="https://www.example.com">Visita Example</a>`;
    const data = readData();
    res.render("products", { user, products: data.products, htmlMessage });
});




app.get("/", (req, res) => {
    res.send("Welcome to the my first API");
});


app.get("/products", (req, res) => {
    const data = readData();
    res.json(data.products);
});


app.get("/products/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const product = data.products.find(product => product.id === id); // Access data.products
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
});

app.post("/products", (req, res) => {
    const data = readData();
    const product = req.product;
    const newProduct = {
        id: data.products.length + 1,
        ...product
    };
    data.products.push(newProduct);
    writeData(data);
    res.json({message:"Producto añadido"});
});

app.put("/products/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const product = req.body;
    const index = data.products.findIndex(product => product.id === id);
    if (index === -1) {
        console.log(" Error 404: Producte no trobat");
        return
    } else {
        data.products[index] = {
            ...data.products[index],
            ...product
        };
        writeData(data);
        res.json({message:"Producto actualizado"});
    }
});

app.delete("/products/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.products.findIndex(product => product.id === id);
        data.products.splice(index, 1);
        writeData(data);
        res.json({message:"Producto eliminado"});
});


app.listen(3000, () => {
    console.log("Server listening in port 5000")
});