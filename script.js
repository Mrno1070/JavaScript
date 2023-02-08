// CONSTANETS GLOBALES
const BtnCrSsnNode = document.getElementById("botonCerSesion");
const BtnInSsnNode = document.getElementById("botonIniSesion");
const popupNode = document.getElementById("popup");
const cartelIniSsnNode = document.getElementById("CartelIniSesion");
const userNode = document.getElementById("user");

const $foco = document.querySelector("#body");

// VARIABLES GLOBALES
let entr1 = "", entr2 = "";
let cantChar = 0;
let operador = "", resultado = "", vecHistorial = [];

let VecHistJson = "";

let numNegativo = false, flagError = false, flagProgresion = false, flagComa = false;

let user = "", pass = "", pass2 = "", ValPass = "";
let flagSesion = false;

let keyValue = "", comparer;

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '0ae70833eemsh8077157dd919a45p1c3456jsnd9fd10eed184',
        'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com'
    }
};

const encodedParams = new URLSearchParams();

// UTILIDADES

function valoresIngresados() {
    let x = ((entr1 != "") && (entr1 != "-") && (entr2 != "")) ? true : false;
    console.log("Valores ingresador va a soltar = " + x);
    return x;
}

function _signoVacio() {
    return (operador == "") ? true : false;
}

function _resultadoVacio() {
    return (resultado == "") ? true : false;
}

function _entr1Vacia() {
    return ((entr1 == "") || (entr1 == "-")) ? true : false;
}

function _entradasIngresadas() {
    return (((entr1 != "") || (entr1 != "-")) && (entr2 != "")) ? true : false;
}

// DETECTAR TECLADO

document.addEventListener('keydown', (event) => {
    //document.getElementById("CalcularResultado").focus(); REVISAR     

    $foco.focus();

    keyValue = event.key;
    console.log(keyValue);

    Interpretar(keyValue);

    ActualizarVisor();

}, false);

// MODIFICAR EL HTML

function CambiarHtml(id, dato) {
    document.getElementById(id).innerHTML = dato;
}

function ActualizarVisor() {
    CambiarHtml("entr1", entr1);
    CambiarHtml("entr2", entr2);
    CambiarHtml("signo", operador)
    CambiarHtml("resultado", resultado);
    CambiarHtml("historial", vecHistorial.join('<br/><br/>'));
}

// FUNCIONES DE BORRADO 

function BorrarUltimo() {

    if (_signoVacio()) {
        entr1 = entr1.substring(0, entr1.length - 1);
    } else {
        if (entr2.length < 1) {
            operador = "";
        }
        entr2 = entr2.substring(0, entr2.length - 1);
    }

    ActualizarVisor();
}

function BorrarTodo(opcion) {
    entr1 = "";
    entr2 = "";
    signo = "";
    operador = "";
    resultado = "";
    numNegativo = true
    cantChar = 0;

    ActualizarVisor();
}

// CALCULADORA

function Interpretar(keyValue) {
    let x = parseFloat(keyValue);

    switch (x) {
        case 1: { }
        case 2: { }
        case 3: { }
        case 4: { }
        case 5: { }
        case 6: { }
        case 7: { }
        case 8: { }
        case 9: { }
        case 0:
            {
                if (_resultadoVacio()) {
                    EscribirNum(x);
                } else {
                    BorrarTodo();
                    EscribirNum(x);
                }
                break;
            }
        default:
            {
                switch (keyValue) {
                    case "Backspace":
                        {
                            if (_resultadoVacio()) {
                                BorrarUltimo();
                            } else {
                                BorrarTodo();
                            }
                            break;
                        }
                    case "Enter":
                        {

                            if (_resultadoVacio()) {
                                CalcularResultado();
                                ActualizarVisor();
                            }

                            break;
                        }
                    case "+":
                        {
                            Operar(keyValue);
                            break;
                        }
                    case "-":
                        {
                            if (entr1 == "") {
                                numNegativo = true;
                                entr1 = "-";
                                CambiarHtml("entr1", "-");
                            }
                            else {
                                Operar(keyValue);
                            }
                            break;
                        }
                    case "*":
                        {
                            Operar(keyValue);
                            break;
                        }
                    case "/":
                        {
                            Operar(keyValue);
                            break;
                        }
                    case "Delete":
                        {
                            BorrarTodo(0);
                            break;
                        }
                    case "DMR":
                        {
                            DMR();
                            break;
                        }
                }
            }
    }
}

function DMR() {
    fetch('https://numbersapi.p.rapidapi.com/random/trivia?min=10&max=20&fragment=true&json=true', options)
        .then(response => response.json())
        .then(response => {
            console.log(response);

            Swal.fire({
                icon: 'question',
                title: 'Dato!',
                text: response.text + " -> " + response.number,
                confirmButtonText: 'Wow!'
            })

        })
        .catch(err => console.error(err));
}

function EscribirNum(num) {
    if (cantChar <= 13) {

        if (_signoVacio()) {

            entr1 = entr1 + num;
            CambiarHtml("entr1", entr1);
            console.log("entr1 = " + entr1);
            cantChar++;

        } else {
            entr2 = entr2 + num;
            CambiarHtml("entr2", entr2);
            console.log("entr2 = " + entr2);
            cantChar++;
            flagError = false;
        }

    } else {

        Swal.fire({
            icon: 'error',
            title: 'Alerta!',
            text: 'Cantidad maxima de caracteres alcanzada',
            footer: 'Utilice menos de 14 cifras para las operaciones'
        })
        BorrarUltimo;

    }
}

function ModificarSigno(signo) {
    operador = signo;
    console.log("operador = " + operador);
    CambiarHtml("signo", signo);
    cantChar = 0;
}

function Operar(keyValue) {
    if (_entr1Vacia()) {

        Swal.fire({
            icon: 'error',
            title: 'Alerta!',
            text: 'Ingrese el pimer numero para operar!'
        })

    } else {

        if (valoresIngresados()) {
            CalcularResultado();
            entr1 = "" + resultado;
            entr2 = "";
            ModificarSigno(keyValue);
            resultado = "";
            cantChar = "";
            ActualizarVisor();
            flagProgresion = true;
        } else {
            ModificarSigno(keyValue);
        }
    }
}

function CalcularResultado() {
    if (_entradasIngresadas()) {
        switch (operador) {
            case "+":
                {
                    resultado = parseFloat(entr1) + parseFloat(entr2);
                    break;
                }
            case "-":
                {

                    resultado = parseFloat(entr1) - parseFloat(entr2);
                    break;
                }
            case "*":
                {

                    resultado = parseFloat(entr1) * parseFloat(entr2);
                    break;
                }
            case "/":
                {

                    resultado = parseFloat(entr1) / parseFloat(entr2);
                    resultado = resultado.toFixed(3);
                    if (resultado != parseFloat(resultado)) {
                        flagComa = true;
                    }
                    break;
                }
            default:
                {
                    resultado = "Error";
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!'
                    })
                    flagError = true;
                    break;
                }
        }

        numNegativo = false;


        if (flagSesion) {

            let cuenta = entr1 + "</br>" + operador + " " + entr2 + "</br>--------------</br>" + resultado;

            vecHistorial.push(cuenta);
        }
    }
}

function MostrarPopUp() {
    popupNode.style.display = "flex";
}

function OcultarPopup() {
    popupNode.style.display = "none";
}

function CerrarSesion() {

    if (flagSesion) {
        Swal.fire({

            title: "Cerrar sesion",
            text: "¿Desea cerrar su sesion?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar",
            cancelButtonText: "Cancelar"

        })
            .then(resultado => {

                if (resultado.value) {

                    console.log("Entre a cerrar la sesion")

                    GuardarDatos(vecHistorial);

                    for (let i = vecHistorial.length; i > 0; i--) {
                        vecHistorial.pop();
                        console.log("Se borra dato de historial " + vecHistorial);
                    }

                    ActualizarVisor();

                    BtnCrSsnNode.style.display = "none";
                    BtnInSsnNode.style.display = "inline";
                    OcultarPopup();
                    userNode.style.display = "none";
                    flagSesion = false;

                    Swal.fire({
                        title: "Sesion cerrada",
                        icon: 'success',
                        confirmButtonText: "Ok!"
                    });
                }
                else {
                    Swal.fire({
                        title: 'Operacion cancelada',
                        icon: 'error'
                    });
                }
            });
    }
}

function GuardarDatos(vecHistorial) {
    VecHistJson = JSON.stringify(vecHistorial);
    datosUser = {
        p: pass,
        h: VecHistJson
    };
    let JSONdatosUser = JSON.stringify(datosUser);
    localStorage.setItem(user, JSONdatosUser)
}

function IniciarSesion() {

    Swal.fire({

        title: "Ingresa tu usario:",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Siguiente",
        cancelButtonText: "Cancelar"

    }).then(resultado => {

        if (resultado.value) {

            user = resultado.value;

            if (localStorage.getItem(user) != null) {

                datosUser = JSON.parse(localStorage.getItem(user));
                ValPass = datosUser.p;

                Swal.fire({

                    title: "Ingresa tu constraseña:",
                    input: "text",
                    showCancelButton: true,
                    confirmButtonText: "Guardar",
                    cancelButtonText: "Cancelar"

                }).then(resultado => {

                    if (resultado.value) {

                        pass = resultado.value;

                        if (pass == ValPass) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Bienvenido!',
                                text: 'Ha iniciado sesion correctamente.'
                            })
                            flagSesion = true;
                            OcultarPopup();
                            userNode.style.display = "inline";
                            CambiarHtml("user", "Usuario: " + user);
                            BtnInSsnNode.style.display = "none";
                            BtnCrSsnNode.style.display = "inline";

                            vecHistorial = JSON.parse(datosUser.h);

                            CambiarHtml("historial", vecHistorial.join('<br/><br/>'));

                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Alerta!',
                                text: 'Credenciales invalidas!',
                                footer: 'Creese una cuenta o verifique las mismas.'
                            })
                        }
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Alerta!',
                    text: 'Ese nombre de usario no pertenece a ninguna cuenta!',
                    footer: 'Por favor, registrese o verifique sus credenciales'
                })
            }
        }
        else {
            Swal.fire({
                title: 'Operacion cancelada',
                icon: 'error'
            });
        }
    });
}

function Registrarse() {

    Swal.fire({

        title: "Tu usuario",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar"

    }).then(resultado => {

        if (resultado.value) {

            user = resultado.value;

            do {

                Swal.fire({

                    title: "Tu constraseña",
                    input: "text",
                    showCancelButton: true,
                    confirmButtonText: "Guardar",
                    cancelButtonText: "Cancelar",

                    inputValidator: contra => {
                        if (!contra) {

                            return "Por favor escribe tu contraseña";

                        }
                        else {

                            return undefined;

                        }
                    }

                }).then(resultado => {

                    if (resultado.value) {

                        pass = resultado.value;

                        if (user == pass) {
                            Swal.fire({
                                icon: "warning",
                                title: "OJO!",
                                text: "La contraseña no puede ser igual al nombre de usuario!",
                                confirmButtonText: "Ok!"
                            });
                        } else {

                            Swal.fire({
                                icon: 'success',
                                title: 'Registro exitoso!',
                                text: 'Ya puede iniciar sesion con sus credenciales'
                            })

                            const datosUser = {
                                p: pass,
                                h: VecHistJson
                            };

                            JSONdatosUser = JSON.stringify(datosUser);

                            localStorage.setItem(user, JSONdatosUser);

                        }
                    }
                });

            } while (user == pass)

        }
        else {
            Swal.fire({
                title: 'Operacion cancelada',
                icon: 'error'
            });
        }
    });
}

function Cls() {
    Swal.fire({
        title: "¿Desea eliminar los datos?",
        text: "Esto eliminara los datos de usuario y sus historiales",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    })
        .then(resultado => {
            if (resultado.value) {
                // Hicieron click en "Sí"
                localStorage.clear();

                Swal.fire({
                    title: "Datos borrados",
                    icon: 'success',
                    confirmButtonText: "Genial"
                });
            } else {
                // Dijeron que no
                console.log("*NO se elimina la venta*");
            }
        });
    localStorage.clear();
}
