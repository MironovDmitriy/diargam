import skolkovo from './image/logo/skolkovo.png';
import minpromtorg from './image/logo/minpromtorg.png';
import fci from './image/logo/fci.png';
import rfrit from './image/logo/rfrit.png';
import rvk from './image/logo/rvk.png';

const brands = [{
	name: 'skolkovo',
	x: 100,
	y: 140,
	img: skolkovo,
	gradientId: '1',
	colorStart: 'ad6ab1',
	colorEnd: 'dec4a3',
	gradientDegree: '125deg',
	borderColor: '9c4b98',
	startAngle: 1.0,
	endAngle: 2.5,
	sectorsMatch: ['bigSector0'],
	money: '1млрд',
}, {
	name: 'minpromtorg',
	x: 100,
	y: 310,
	img: minpromtorg,
	gradientId: '2',
	colorStart: '92b86b',
	colorEnd: 'e5cfa6',
	gradientDegree: '180deg',
	borderColor: '3b8e1a',
	startAngle: 2.5,
	endAngle: 3.5,
	sectorsMatch: ['bigSector1'],
	money: '2млрд',
}, {
	name: 'fci',
	x: 100,
	y: 480,
	img: fci,
	gradientId: '3',
	colorStart: 'de9783',
	colorEnd: 'f3c371',
	gradientDegree: '270deg',
	borderColor: 'd84d48',
	startAngle: 3.5,
	endAngle: 5.2,
	sectorsMatch: ['bigSector2'],
	money: '3млрд',
}, {
	name: 'rfrit',
	x: 100,
	y: 650,
	img: rfrit,
	gradientId: '4',
	colorStart: '95bbc8',
	colorEnd: 'e38b81',
	gradientDegree: '180deg',
	borderColor: 'df2b36',
	startAngle: 5.2,
	endAngle: 6.2,
	sectorsMatch: ['bigSector3'],
	money: '1млрд',
}, {
	name: 'rvk',
	x: 100,
	y: 820,
	img: rvk,
	gradientId: '5',
	colorStart: '77bfd7',
	colorEnd: 'ae83dd',
	gradientDegree: '90deg',
	borderColor: '2ba3e0',
	startAngle: 6.2,
	endAngle: 7.29,
	sectorsMatch: ['bigSector4'],
	money: '2млрд',
}];

export default brands;