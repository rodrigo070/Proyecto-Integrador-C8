const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const port = 3001;

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

// Routes

//Home - vistas generales
app.use('/', homeRouter);
//login - register - profile - carrito
app.use('/', userRouter);
//detalle del producto - listado de productos
app.use('/', productosRouter);
//admin
app.use('/admin', adminRouter)

app.use((req, res, next) => {
  res.status(404).render('errorPage', {error: "ERROR 404: La Pagina a la cual intenta acceder no existe o fue removida del sistema."});
})

app.listen(port, () => {
  console.log(`Servidor Corriendo en el Puerto = ${port}\ -> https://localhost:${port}`);
});