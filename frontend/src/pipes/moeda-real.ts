import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'moedaReal'
})
export class MoedaRealPipe implements PipeTransform{
	transform(value: string): string{
        let str = value + "";        
		return str.replace(/\./, ','); //replace . por ,
	}
}