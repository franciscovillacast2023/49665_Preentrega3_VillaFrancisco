//Variable que mantiene el estado visible del carrito
var carritoVisible = false;

//Solicitud de productos al server
let producto;

async function fetchProductosJSON() {
    let res = await fetch("./productos.json");
    let data = await res.json();
    producto = data;
    return data;
}

fetchProductosJSON().then(() => {
    // Usar los datos recuperados en la variable producto
    console.log(producto); 
    
    // Hacer una copia del arreglo producto
    let productoArreglo = [...producto];
    console.log(productoArreglo);

    // Obtén una referencia al contenedor de elementos
    let contenedorItems = document.querySelector(".contenedor-items");

    //Imprimir productos en pantalla
    productoArreglo.forEach(producto => {
        // Genera el contenido HTML para cada producto y se agrega al contenedor
        contenedorItems.innerHTML += `
        <div class="item" id="${producto.id}">
            <span class="titulo-item">${producto.title}</span>
            <img src="${producto.image}" alt="" class="img-item">
            <span class="precio-item">$${producto.price}</span>
            <button class="boton-item">Agregar al Carrito</button>
        </div>`;
    });
    console.log('Carga del Ready');
    //Esperamos que todos los elementos de la pàgina cargen para ejecutar el script
    if(document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ready)
    }else{
        ready();
    }
});

let cantidad = 1;

function ready(){
    
    //Se agrega funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(var i=0;i<botonesEliminarItem.length; i++){
        var button = botonesEliminarItem[i];
        button.addEventListener('click',eliminarItemCarrito);
    }

    //Se agrega funcionalidad a los botones sumar cantidad
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for(var i=0;i<botonesSumarCantidad.length; i++){
        var button = botonesSumarCantidad[i];
        button.addEventListener('click',sumarCantidad);
    }

    //Se agrega funcionalidad a los botones restar cantidad
    var botonesRestarCantidad = document.getElementsByClassName('.restar-cantidad');
    for(var i=0;i<botonesRestarCantidad.length; i++){
        var button = botonesRestarCantidad[i];
        button.addEventListener('click',restarCantidad);
    }

    //Se agrega funcionalidad a los botones agregar al carrito
    var botonesAgregarAlCarrito = document.querySelectorAll('.boton-item');
    for(var i=0; i<botonesAgregarAlCarrito.length;i++){
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    //Se agrega funcionalidad a los boton comprar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click',pagarClicked)
}
//Se eliminan todos los elementos del carrito y luego se oculta
function pagarClicked(){
    
    alert("Muchas Gracias por su compra");
    //Se eliminan todos los elementos del carrito
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild)
    }
    // Se actualiza el total del carrito
    actualizarTotalCarrito();
    // Se oculta el carrito
    ocultarCarrito();
    // Se Limpia el localStorage ya que el carrito está vacío
    localStorage.removeItem('carrito');
}
//Funcion para controlar el click de agregar al carrito
function agregarAlCarritoClicked(event){
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    var cantidad = 1;
    console.log(imagenSrc);

    agregarItemAlCarrito(titulo, precio, imagenSrc, cantidad);
    // Se guarda el carrito en localStorage
    guardarCarritoEnLocalStorage(); 
    hacerVisibleCarrito();
}

//Funcion que hace visible el carrito
function hacerVisibleCarrito(){
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items =document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

//Funcion que agrega un item al carrito
function agregarItemAlCarrito(titulo, precio, imagenSrc){
    var item = document.createElement('div');
    item.classList.add = ('item');
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //Se revisa si el item ingresado se encuentra o no en el carrito
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for(var i=0;i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText==titulo){
            alert("Lo sentimos. El item ya se encuentra agregado en el carrito. Si desea aumentar la cantidad puede realizarlo en el mismo carrito");
            return;
        }
    }
    console.log(precio);
    console.log(cantidad);

    let precioCantidad = parseInt(precio) * parseInt(cantidad)

    //Se dibuja el item agregado en el carrito
    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //Se agrega la funcionalidad eliminar al nuevo elemento/item             
     item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    //Se agrega la funcionalidad restar al nuevo elemento/item 
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click',restarCantidad);

    //Se agrega la funcionalidad sumar al nuevo elemento/item 
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click',sumarCantidad);

    //Se actualiza el monto total del carrito
    actualizarTotalCarrito();

    //Se actualiza el localstorage luego de agregar un elemento
    guardarCarritoEnLocalStorage();

    //Se actualiza la cantidad de elementos en el carrito
    actualizarCantidadCarrito();
}
//Se aumenta en una unidad la cantidad del elemento seleccionado
function sumarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}
//Se resta en una unidad la cantidad del elemento seleccionado
function restarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

//Se elimina el elemento/item seleccionado en el carrito
function eliminarItemCarrito(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    //Se actualiza el total del carrito
    actualizarTotalCarrito(); 
    //Se verifica si el carrito esta vacío y se actualiza el localStorage
    if (document.getElementsByClassName('carrito-items')[0].childElementCount === 0) {
        localStorage.removeItem('carrito');
    } else {
        guardarCarritoEnLocalStorage();
    }
    ocultarCarrito();

    //Se actualiza la cantidad de elementos en el carrito
    actualizarCantidadCarrito();
}
//Funcion que controla si hay elementos en el carrito. En caso de no existir el carrito se oculta.
function ocultarCarrito(){
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount==0){
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;
    
        var items =document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}
//Se actualiza el total del carrito
function actualizarTotalCarrito(){
    //Se selecciona el contenedor carrito
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;
    //Se recorre cada elemento del carrito para actualizar el total
    for(var i=0; i< carritoItems.length;i++){
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        //Se quita el simbolo peso y el punto de milesimos.
        var precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        console.log(precio);
        var cantidad = cantidadItem.value;
        total = total + (precio * cantidad);

    }

    total = Math.round(total * 100) / 100;
    //Se redondea el total y muestra el valor entero
    var totalSinDecimales = Math.floor(total);

    console.log("Total con decimales:", total);
    console.log("Total sin decimales:", totalSinDecimales);

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + totalSinDecimales.toLocaleString("es") + "";
    
}

//Funcion que actualiza la cantidad de elementos en el carrito
function actualizarCantidadCarrito() {
    var cantidadElementos = document.getElementsByClassName('carrito-item').length;
    var cantidadCarritoSpan = document.querySelector('.cantidad-carrito');
    cantidadCarritoSpan.textContent = cantidadElementos;
}

//Funcion para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    var carritoData = carritoItems.innerHTML;
    localStorage.setItem('carrito', carritoData);
}

//Funcion para cargar el carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    var carritoData = localStorage.getItem('carrito');
    
    if (carritoData) {
        carritoItems.innerHTML = carritoData;
        var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
        for (var i = 0; i < botonesEliminarItem.length; i++) {
            var button = botonesEliminarItem[i];
            button.addEventListener('click', eliminarItemCarrito);
        }
        var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
        for (var i = 0; i < botonesSumarCantidad.length; i++) {
            var button = botonesSumarCantidad[i];
            button.addEventListener('click', sumarCantidad);
        }
        var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
        for (var i = 0; i < botonesRestarCantidad.length; i++) {
            var button = botonesRestarCantidad[i];
            button.addEventListener('click', restarCantidad);
        }
        
        //Se actualiza el total después de cargar los datos desde el localStorage
        actualizarTotalCarrito();

        //Se actualiza la cantidad de elementos del carrito
        actualizarCantidadCarrito();
        
        //Se hace visible el carrito si tiene elementos
        hacerVisibleCarrito();
    } else {
        //Se oculta el carrito si no hay elementos
        ocultarCarrito();
    }
}

//Se llama a la función para cargar el carrito desde localStorage cuando la página está lista
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cargarCarritoDesdeLocalStorage();
        ready();
    });
} else {
    cargarCarritoDesdeLocalStorage();
    ready();
}






