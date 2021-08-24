const express = require('express');
const app = express();
let path = require('path');
const port = 3001;
let methodOverride = require('method-override');

// Routers - > maneja lo que se va a hacer en la vista (EJS "HTML")
let homeRouter = require('./routes/home');
let userRouter = require('./routes/user');
let productosRouter = require('./routes/products');
let adminRouter = require('./routes/admin');

// views engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MiddleWare
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(methodOverride('_method'));

// Routes - > desde aca indicamos las rutas -> las direcciones estan declaradas en los archivos js de rutas

//Home - local -
app.use('/', homeRouter);
//login - register - profile
app.use('/', userRouter);
//detalle del producto
app.use('/', productosRouter);
//admin
app.use('/', adminRouter)

app.listen(port, () => {
  console.log(`Servidor Corriendo en ${port}\ https://localhost:${port}`);
});