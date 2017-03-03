export class NumberUtil {

   static addZerosEsquerda(valor){
      valor +="";
      let resp = valor.replace(/\./g, ''); //limpa a formatacao      
      var newValor = resp.replace(/\D/g, ''); //limpa a formatacao
      
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

      /*

      if(newValor.length == 4){
        if(newValor.indexOf('0') == 0){
          newValor = newValor.substr(1);
        }
      }
      */

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
      return valor;
  }

  static calculaPrecoPorlitro(ml, valor){     
     let litro = 1000;
     let x = ((valor / ml) * litro);                   
     let resp = Number.parseFloat(x+"").toFixed(2);
     return this.formataMoeda(resp);
  }
}