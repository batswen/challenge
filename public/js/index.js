const ZEICHENFELD = document.getElementById("zeichenfeld")
const FARBAUSWAHL = document.getElementById("farbauswahl")
const DATEINAME = document.getElementById("dateiname")
const FÜLLEN = document.getElementById("füllen")
const context = document.getElementById("original").getContext("2d")

// "Dawnbringer 16"-Palette (https://lospec.com/palette-list/dawnbringer-16)
// const FARBEN = ["#140c1c", "#442434", "#30346d", "#4e4a4e", "#854c30", "#346524", "#d04648", "#757161", "#597dce", "#d27d2c", "#8595a1", "#6daa2c", "#d2aa99", "#6dc2ca", "#dad45e", "#deeed6"]

// "Commodore C64"-Palette (https://lospec.com/palette-list/commodore64)
const FARBEN = ["#000000", "#626262",  "#898989",  "#adadad",  "#ffffff",  "#9f4e44",  "#cb7e75",  "#6d5412",  "#a1683c",  "#c9d487",  "#9ae29b",  "#5cab5e",  "#6abfc6",  "#887ecb",  "#50459b",  "#a057a3"]
let aktuelleFarbe = FARBEN[0]

// Bei Größenauswahl neues Zeichenfeld erstellen
document.getElementById("größe").addEventListener("change", () => zeichenfeldErstellen())

// Fake Download
document.getElementById("save-png").addEventListener("click", () => {
    const a = document.createElement("A")
    a.download = DATEINAME.value
    a.href = context.canvas.toDataURL("image/png")
    a.click()
    a.remove()
})

function aktuelleFarbeEinstellen(farbindex) {
    aktuelleFarbe = FARBEN[farbindex]
    context.fillStyle = aktuelleFarbe
}

function bereichFüllen(x, y) {
    const alteFarbe = document.getElementById(`div-${x}${y}`).style.backgroundColor
    const STACK = []
    STACK.push([x, y])
    while (STACK.length > 0) {
        ;[x, y] = STACK.pop()
        const element = document.getElementById(`div-${x}${y}`)
        // x und y können negativ sein, element ist evtl ungültig
        if (element && alteFarbe === element.style.backgroundColor) {
            context.fillRect(x, y, 1, 1)
            element.style.backgroundColor = aktuelleFarbe
            STACK.push([x + 1, y])
            STACK.push([x - 1, y])
            STACK.push([x    , y + 1])
            STACK.push([x    , y - 1])
        }
    }
}

function feldFärben(element, x, y) {
    if (FÜLLEN.checked) {
        FÜLLEN.checked = false
        bereichFüllen(x, y)
        return
    }
    element.style.backgroundColor = aktuelleFarbe
    context.fillRect(x, y, 1, 1)
}

function farbauswahlErstellen() {
    let ausgewählt = false, nr = 0
    for (const farbe of FARBEN) {
        const LABEL = document.createElement("LABEL")
        LABEL.setAttribute("for", farbe)
        LABEL.setAttribute("onclick", `aktuelleFarbeEinstellen(${nr++})`)
        LABEL.classList.add("farbe")
        LABEL.style.backgroundColor = farbe
        const FARBKNOPF = document.createElement("INPUT")
        FARBKNOPF.setAttribute("id", farbe)
        FARBKNOPF.setAttribute("type", "radio")
        FARBKNOPF.setAttribute("name", "farbauswahl")
        if (!ausgewählt) {
            ausgewählt = true
            FARBKNOPF.setAttribute("checked", "checked")
        }
        FARBKNOPF.classList.add("d-none")
        FARBAUSWAHL.appendChild(FARBKNOPF)
        FARBAUSWAHL.appendChild(LABEL)
    }
}

function zeichenfeldErstellen() {
    ZEICHENFELD.innerHTML = ""
    größe = parseInt(document.getElementById("größe").value)
    context.canvas.width = größe
    context.canvas.height = größe
    ZEICHENFELD.style.setProperty("--grid-size", größe)
    for (let y = 0; y < größe; y++) {
        for (let x = 0; x < größe; x++) {
            const DIV = document.createElement("DIV")
            DIV.classList.add("pixel")
            DIV.style.backgroundColor = FARBEN[0]
            DIV.setAttribute("id", `div-${x}${y}`)
            DIV.setAttribute("onclick", `feldFärben(this, ${x}, ${y})`)
            ZEICHENFELD.appendChild(DIV)
        }
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
}

farbauswahlErstellen()
aktuelleFarbeEinstellen(0)
zeichenfeldErstellen()