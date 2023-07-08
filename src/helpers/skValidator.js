
function secretKeyValidator(inputKey) {
    var regex = /^[a-zA-Z0-9_-]{32}$/;
  
    // Verifica se a chave fornecida corresponde ao formato esperado
    if (regex.test(inputKey)) {
      // Chave válida
      return true;
    } else {
      // Chave inválida
      return false;
    }
}
module.exports = {
    secretKeyValidator
}