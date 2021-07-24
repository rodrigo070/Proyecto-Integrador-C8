const express = require('express')
const app = express();
const port = 3000
const path = require('path')

app.use(express.static("public"))

/* rutas */

app.get('/', (req, res)=>{res.sendFile(path.join(__dirname,('')))}) 

app.get('/',(req,res)=>{res.sendFile(path.join(__dirname,''))}) 

app.get('/',(req,res)=>{res.sendFile(path.join(__dirname,''))}) 

app.get('/',(req,res)=>{res.sendFile(path.join(__dirname,''))}) 

/* puerto */
app.listen(port,()=>{console.log(`servidor activo en el puerto ${port}\n http://localhost:${port}`)})

