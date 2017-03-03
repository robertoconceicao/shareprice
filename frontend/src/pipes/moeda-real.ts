import {Pipe, PipeTransform} from '@angular/core';
import { NumberUtil } from '../util/number-util';

@Pipe({
	name: 'moedaReal'
})
export class MoedaRealPipe implements PipeTransform{
	transform(value: string): string{		
        //let str = (Number.parseFloat(value) * 100) + "";        
		let x = Number.parseFloat(value).toFixed(2);
		return NumberUtil.formataMoeda(x);		
	}
}