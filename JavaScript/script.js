/*TERCERA PRE-ENTREGA*/
class Producto {
    constructor(producto,cantidad){
        this.id=producto.id;
        this.nombre=producto.nombre;
        this.precio=producto.precio;
        this.stock=producto.stock;
        this.imagen=producto.imagen;
        this.subTotal=producto.subTotal;
        this.cantidad=cantidad;
    }
    sumarCantidadComprada(){
        this.stock--;
        this.cantidad++;
    }
    restarCantidadComprada(){
        this.cantidad--;
        this.stock++;
    }
    actualizarSubTotal(){
        this.subTotal = this.precio*this.cantidad;
    }
}

const productos=[
    {
        id:0,
        nombre: "Pantalones vaqueros",
        precio: 88.05,
        subTotal:88.05,
        stock: 10,
        imagen: "../imagenes/productos/pantalonVaquero.jpg"
    },
    {
        id:1,
        nombre: "Pantalones Cargo",
        precio: 125.3,
        subTotal:125.3,
        stock: 10,
        imagen: "../imagenes/productos/pantalonCargo.jpg"
    },
    {
        id:2,
        nombre: "Cárdigan cuello en V",
        precio: 123.38,
        subTotal:123.38,
        stock: 10,
        imagen: "../imagenes/productos/cardiganV.jpg"
    },
    {
        id:3,
        nombre: "Abrigo de pana",
        precio: 130.93,
        subTotal: 130.93,
        stock: 10,
        imagen: "../imagenes/productos/abrigoPana.jpg",
    },
    {
        id:4,
        nombre: "Abrigo acolchado de algodón",
        precio: 123.95,
        stock: 10,
        subTotal:123.95,
        imagen: "../imagenes/productos/abrigoAlgodon.jpg",
    }
]


function cargarProductos(){
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    for (const producto of productos){
        let card = document.createElement("div");
        card.innerHTML=`
                        <div class="producto">
                            <img class="producto-imagen" src="${producto.imagen}" alt="">
                            <div class="producto-info">
                            <h3 class="producto-titulo">${producto.nombre}</h3>
                            <p class="producto-precio">S/.${producto.precio} PEN</p>
                            <p class="producto-stock" id="stock${producto.id}">Stock: ${producto.stock} unidades</p>
                            <button id="agregar${producto.id}" class="agregar">Agregar</button>
                            </div>
                        </div>
                        `;
        contenedorProductos.appendChild(card);

        let boton = document.getElementById(`agregar${producto.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(producto.id));
    }
}

let carrito;

function recuperarCarritoStorage(){
    let carritoRecuperado = JSON.parse(localStorage.getItem("carritoEnStorage"));

    if(carritoRecuperado){
        let arreglo=[];
        for(const objetoProducto of carritoRecuperado){
            let productoEnCarrito = new Producto (objetoProducto, objetoProducto.cantidad);
            productoEnCarrito.actualizarSubTotal();
            arreglo.push(productoEnCarrito);
        }
        imprimirCarrito(arreglo);

        return arreglo;
    }
    return [];
}

function agregarAlCarrito(idProducto){
    let productoAgregado = carrito.find((productoYaAgregado)=>productoYaAgregado.id === idProducto);

    if(productoAgregado){
        let indice = carrito.findIndex((elemento) => elemento.id === productoAgregado.id);
        carrito[indice].sumarCantidadComprada();
        carrito[indice].actualizarSubTotal();
    }else{
        let prod = new Producto(productos[idProducto], 1)
        carrito.push(prod);
        prod.stock--;
    }
    
    localStorage.setItem("carritoEnStorage",JSON.stringify(carrito));
    imprimirCarrito(carrito);
    
    console.log(carrito);
}

function imprimirCarrito(carritoArreglo){
    let totalPagar = obtenerPrecioTotal(carritoArreglo);
    let contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.innerHTML="";

    let tablaCarrito = document.createElement("div");

    tablaCarrito.innerHTML=`
                            <table id="tablaCarrito" class="table table-striped">
                                <thead>         
                                    <tr>
                                        <th>Item</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>SubTotal</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>

                                <tbody id="bodyTabla">
                                </tbody>
                            </table>
                            `;

    contenedorCarrito.appendChild(tablaCarrito);

    let bodyTabla = document.getElementById("bodyTabla");
    for(let producto of carritoArreglo){
        let datos = document.createElement("tr");
        datos.innerHTML=`
                        <td>${producto.nombre}</td>
                        <td>${producto.cantidad}</td>
                        <td>S/. ${producto.precio}</td>
                        <td>S/. ${producto.subTotal}</td>
                        <td><button id="eliminar${producto.id}" class="btn">Eliminar</button></td>
                        `;
        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${producto.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(producto.id))
    }

    let accionesCarrito = document.getElementById("acciones-carrito");
    accionesCarrito.innerHTML=`
                                <h5>PrecioTotal: $${totalPagar}</h5></br>
                                <button id="vaciarCarrito" onclick="eliminarCarrito()" class="btn btn-dark">Vaciar Carrito</button>
                                `;
}

function obtenerPrecioTotal(arreglo){
    let total=arreglo.reduce((total,elemento)=>total+elemento.subTotal,0);
    return total.toFixed(2);
}

function eliminarDelCarrito(id){
    let productor = carrito.find((producto)=>producto.id===id);
    let indice = carrito.findIndex((elemento)=>elemento.id===productor.id);
    console.log(productor);
    
    if(productor.cantidad>1){
        carrito[indice].restarCantidadComprada();
        carrito[indice].actualizarSubTotal();
    }else{
        carrito.splice(indice,1);
    }
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirCarrito(carrito);
}

function eliminarCarrito(){
    carrito=[];
    localStorage.removeItem("carritoEnStorage");
    document.getElementById("carrito").innerHTML="";
    document.getElementById("acciones-carrito").innerHTML="";
}

cargarProductos();
carrito = recuperarCarritoStorage();

