function separar() {
    // Recogemos la palabra y convertimos tildes en letras normales
    palabra = document.getElementById("word").value;
    palabra = palabra.replace('ñ', '\0x1');
    palabra = palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    palabra = palabra.replace('\0x1', 'ñ');

    // Convertimos la palabra en un string de letras únicas
    letras = palabra.split("");

    // Si es una palabra, buscamos el total de cada letra y ejecutamos buscarPalabras()
    if (palabra.match("^[ña-zÑA-Z]*$")) {
        letrasTotal = [];
        letras.forEach(letra => {
            reg = new RegExp(letra, 'g');
            letrasTotal.push((palabra.match(reg) || []).length);
        });
        document.getElementById("noExiste").innerText = "";
        document.getElementById("wordsGoHere").innerText = "";
        buscarPalabras(palabra, letras, letrasTotal);
    } else {
        document.getElementById("noExiste").innerText = "El buscador contiene caracteres no alfabéticos";
    }
}

// Lee las palabras del documento, comprueba las letras y guarda las que coinciden para mostrarlas
function buscarPalabras(letras) {
    palabrasExistentes = [];
    fetch("palabras.txt")
        .then((res) => res.text())
        .then((text) => {
            palabras = text.split("\n");
            palabras.forEach(elemento => {
                elemento = elemento.replace('ñ', '\0x1');
                elemento = elemento.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                elemento = elemento.replace('\0x1', 'ñ');
                if (compararPalabra(letras, elemento) && elemento.length > 2 && !palabrasExistentes.includes(elemento)) {
                    palabrasExistentes.push(elemento);
                }
            });
            palabrasExistentes.sort(function (a, b) {
                return b.length - a.length;
            });
            mostrar(palabrasExistentes);
        })
        .catch((e) => console.error(e));
}

// Comprueba si las letras de la palabra espeficífica del documento coinciden con las del input
function compararPalabra(letras, palabra) {
    palabra = palabra.split("");
    for (var i = 0; i < letras.length; i++) {
        var index = palabra.indexOf(letras[i].toLowerCase());
        if (index !== -1) {
            palabra.splice(index, 1);
            if (!palabra.length) return true;
        }
    }
    return false;
}

var firstDone = false;

// Muestra las palabras encontradas en pantalla
function mostrar(palabras) {
    currentLength = palabras[0].length;

    document.getElementById("wordsGoHere").innerHTML += "<strong>" + currentLength + " letras</strong><br>";

    palabras.forEach(element => {
        element = element[0].toUpperCase() + element.slice(1);
        if (element.length < currentLength) {
            currentLength = element.length;
            document.getElementById("wordsGoHere").innerHTML += "<br><br> <strong>" + currentLength + " letras</strong><br>";
        }
        document.getElementById("wordsGoHere").innerHTML += element + "&nbsp;  ";
    });
}