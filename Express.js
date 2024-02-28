const express= require('express');
const bodyParser = require('body-parser');
const port = 3000;


let products = [
  { id: 1, name: 'iPhone 12 Pro', price: 1099.99 },
  { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
  { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
  { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
  { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
];

const app = express();
app.use(bodyParser.json());

app.get('/products', (req,res) => {
  res.json(products);
})

app.get('/products/search',(req,res) => {
  const {q, minPrice, maxPrice} = req.query;
  let filtredProducts = products;
  if(q){
    filtredProducts = filtredProducts.filter(product => product.name.toLowerCase().includes(q.toLowerCase()));
  }
  if(minPrice){
    filtredProducts= filtredProducts.filter(product => product.price >= (minPrice));
  }
  if(maxPrice){
    filtredProducts = filtredProducts.filter(product => product.price <= (maxPrice));
  }
  res.json(filtredProducts);
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Both name and price are required for creating a new product' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
  };
  products.push(newProduct);
  res.status(201).json({ message: 'Product added successfully', products });
});

app.put('/products/:id',(req,res) => {
  const productId = parseInt(req.params.id);
  const {name, price} = req.body;
  const productIndex = products.findIndex(p => p.id === productId);
  if(productIndex === -1){
    return res.status(404).json({ error: 'Product not found'});
  }
  products[productIndex].name = name || products[productIndex].name;
  products[productIndex].price = price || products[productIndex].price;
  res.json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const initialProductsLength = products.length;
  products = products.filter(product => product.id !== productId);
  if (initialProductsLength === products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({message: 'Product deleted successfully'});
});

app.get('/products/:id', (req,res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});


app.listen(port, () => {
  console.log(`Server is running on port 3000 `);
});
