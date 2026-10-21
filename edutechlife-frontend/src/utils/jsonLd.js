// Serializa un objeto para un <script type="application/ld+json">.
// JSON.stringify no escapa «<», así que un texto con «</script>» cerraría la
// etiqueta y dejaría ejecutar lo que venga después. Se escapan «<» y los
// separadores de línea Unicode; el JSON resultante sigue siendo equivalente.
const SEPARADOR_LINEA = new RegExp(String.fromCharCode(0x2028), "g");
const SEPARADOR_PARRAFO = new RegExp(String.fromCharCode(0x2029), "g");

export function serializarJsonLd(esquema) {
  return JSON.stringify(esquema)
    .replace(/</g, "\\u003c")
    .replace(SEPARADOR_LINEA, "\\u2028")
    .replace(SEPARADOR_PARRAFO, "\\u2029");
}
