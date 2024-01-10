function separar() {
    //Recogemos la palabra y convertimos tildes en letras normales
    palabra = document.getElementById("word").value;
    palabra = palabra.replace('ñ', '\001');
    palabra = palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    palabra = palabra.replace('\001', 'ñ');

    //Convertimos la palabra en un string de letras únicas
    letras = palabra.split("");

    //Si es una palabra, buscamos el total de cada letra y ejecutamos buscarPalabras()
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

function buscarPalabras(palabra, letras) {
    palabrasExistentes = [];
    fetch("palabras.txt")
        .then((res) => res.text())
        .then((text) => {
            palabras = text.split("\n");
            palabras.forEach(elemento => {
                elemento = elemento.replace('ñ', '\001');
                elemento = elemento.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                elemento = elemento.replace('\001', 'ñ');
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