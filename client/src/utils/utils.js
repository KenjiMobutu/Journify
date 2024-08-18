
function formatPrice(value) {
  const firstDecimal = Math.floor(value * 10) % 10;  // Récupère le premier chiffre après la virgule

  if (firstDecimal >= 5) {
    return Math.ceil(value);  // Arrondit à l'unité supérieure
  } else {
    return parseFloat(value.toFixed(1));  // Affiche le premier chiffre après la virgule
  }
}

export default formatPrice ;
