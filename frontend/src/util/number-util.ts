export class NumberUtil {

   static addZerosEsquerda(valor){
      var re = /\D/g; 
      var newValor = valor.replace(re, ''); //limpa a formatacao
      console.log("Antes: "+valor+" Depois: "+newValor);
      
      //add zeros a esquerda
      if(newValor.length == 0){
        newValor = "000";
      }
      if(newValor.length == 1){
        newValor = "00"+newValor;
      }
      if(newValor.length == 2){
        newValor = "0"+newValor;
      }

      if(newValor.length == 4){
        if(newValor.indexOf(0) == 0){
          newValor = newValor.substr(1);
        }
      }

      if(newValor.length > 4){
        newValor = newValor.substr(newValor.length - 4); //fica só com os últimos 4 digitos 
      }
      return newValor;
  }

  static formataMoeda(valor){
      let newstr2 = this.addZerosEsquerda(valor);

      let strend = newstr2.substr(newstr2.length - 2); // pega os dois ultimos campos da string
      let strbeging = newstr2.substr(0, newstr2.length - 2); // pega o inicio
      valor = strbeging + "," + strend;

      console.log("valor: "+valor);

      return valor;
  }
}