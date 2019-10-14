import './css/normalize.css';
import './css/index.css';
import './defs.js';

import sectorsData from './sectorsData.js';
import labelsData from './labelsData.js';
import brands from './brands.js';
import cat1 from './image/cat1.jpg';
import cat2 from './image/cat2.jpg';
import cat2_1 from './image/cat2.1.jpg';

// var event = new CustomEvent('changeSector');
const width = 1800;
const height = 1000;
const DURATION = 4000;
var isBigCircleAreaShown = true;

var state = {
	selectedSector: null,
};

/* Зона для размещения графических эллементов */
const svg = d3.select('#svgArea').append('svg').attr('height', height).attr('width', width).attr('id', 'svg');
const bigCircleArea = svg.append('g').attr('transform', `translate(${width/2.8},${height/2.2})`).attr('id', 'bigCircleArea');
const labelCircleArea = svg.append('g').attr('transform', `translate(${width/1.3},${height/1.45})`).attr('id', 'labelCircleArea');

const color = d3.scale.category10();

/* Функция генерации круговой диаграммы на основании данных*/
const pie = d3.layout.pie().value(d => d);

/* Группа для одного сектора */
const bigSectorGroup = bigCircleArea.selectAll('.bigSectorGroup')
	.data(pie(sectorsData)).enter()
	.append('g')
	.attr('id', (d, i) => 'bigArc' + i)
	.attr('class', 'bigSectorGroup');

/* Наружные большие секторы */
const arc = d3.svg.arc().outerRadius(d => d.data.radius).innerRadius(30).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const bigSectorPath = bigSectorGroup.append('path')
	.attr('d', arc)
	.attr('id', (d, i) => 'arc' + i)
	.attr('class', 'bigArcPath')
	.style('fill', d => color(d.data))
	.style('stroke', 'white')
	.style('stroke-width', '2px');

/* Внутренние большие секторы*/
const innerArc = d3.svg.arc().outerRadius(95).innerRadius(30).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const innerSectorPath = bigSectorGroup.append('path')
	.attr('d', innerArc)
	.attr('id', (d, i) => 'innerArc' + i)
	.style('fill', 'green')
	

/* Секторы для текста */
const textArc = d3.svg.arc().outerRadius(d => d.data.radius - 20).innerRadius(150).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const textSectorPath = bigSectorGroup.append('path')
	.attr('d', textArc)
	.attr('id', (d, i) => 'textArc' + i)
	.attr('class', 'textArcPath')
	.style('fill', 'none');

 /* Линия для текста */
bigSectorGroup.append('text')
	.append('textPath')
	.attr('xlink:href', (d, i) => '#textArc' + i)
	.text(d => d.data.name);

for (let i = 0; i < sectorsData.length; i++) {
	console.log('i: ' + i)
	const sector = d3.selectAll('.bigSectorGroup').filter('#bigArc' + i);

/* Внутренние малые секторы */
	const innerSmallArc = d3.svg.arc().outerRadius(140).innerRadius(100).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
	sector.append('g').selectAll('.smallInnerArc')
	.data(pie(sectorsData[i]['childrens'])).enter()
	.append('g')
	.attr('class', 'smallInnerArc')
	.append('path')
	.attr('d', innerSmallArc)
	.style('fill', 'green');

	/* Продольные секторы */
	const ribArc = d3.svg.arc().outerRadius(d => {
		console.log(d.data)
		return d.data.radius
	}).innerRadius(145).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);


	const ribGroup = sector.append('g').selectAll('.rib')
			.data(pie(sectorsData[i]['childrens'])).enter()
			.append('g')
			.attr('class', 'rib');

	for (let j = 0; j < sectorsData[i]['childrens'].length; j++) {
		console.log('j: ' + j)
			ribGroup.append('path')
			.attr('d', ribArc)
			.style('fill', `url(#linear-gradient${sectorsData[i]['childrens'][j]})`);

	ribGroup.append('text')
			.attr('transform', d => {
				const angle = (d.data.endAngle + d.data.startAngle) / 2;
				return 'translate(' + ribArc.centroid(d) + ') rotate(' + (angle * 180 / Math.PI - 90) + ')'
			})
			.text(d => d.data.name);
	}
};

/* Остановка анимации мышкой и выбор сектора */
bigSectorGroup.on('click', function(d) {
	if (isBigCircleAreaShown) {
		const select = d3.select(this);
		console.log(d.data.company)
		state.selectedSector = select[0][0]['id'];
		d3.selectAll('.bigSectorGroup').interrupt();
		d3.selectAll('.labelSectorGroup').call(removeSelectedBrand);
		d3.selectAll('.labelSectorGroup').filter('#' + d.data.company).call(changeSelectedBrand);
	} else {
		d3.selectAll('#bigCircleArea').call(enableBigCircleArea);
		d3.selectAll('.bigArcPath').call(zoomElement);
		d3.selectAll('.textArcPath').call(zoomElement);
		d3.selectAll('.rib').call(zoomElement);
		isBigCircleAreaShown = true;
	}
})

/* Остановка анимации пальцем и выбор сектора */
bigSectorGroup.on('touchstart', function(d) {
	if (isBigCircleAreaShown) {
		const select = d3.select(this);
		console.log(d.data.company)
		state.selectedSector = select[0][0]['id'];
		d3.selectAll('.bigSectorGroup').interrupt();
		d3.selectAll('.labelSectorGroup').call(removeSelectedBrand);
		d3.selectAll('.labelSectorGroup').filter('#' + d.data.company).call(changeSelectedBrand);
	} else {
		d3.selectAll('#bigCircleArea').call(enableBigCircleArea);
		d3.selectAll('.bigArcPath').call(zoomElement);
		d3.selectAll('.textArcPath').call(zoomElement);
		d3.selectAll('.rib').call(zoomElement);
		isBigCircleAreaShown = true;
	}
})

/* Группа для одного сектора брэндов*/
const labelSectorGroup = labelCircleArea.selectAll('.labelSectorGroup')
	.data(pie(labelsData)).enter()
	.append('g')
	.attr('id', d => d.data.name)
	.attr('class', 'labelSectorGroup');

/* Все секторы брэндов*/
const labelArc = d3.svg.arc().outerRadius(d => d.data.radius).innerRadius(0).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const labelSectorPath = labelSectorGroup.append('path')
	.attr('d', labelArc)
	.attr('id', (d, i) => 'labelArc' + i)
	.style('fill', d => color(d.data.browser))
	.style('stroke', 'black')
	.style('stroke-width', '2px');

labelSectorGroup
	.append('text').attr('transform', d => {
		const angle = (d.data.endAngle + d.data.startAngle) / 2;
		return 'translate(' + labelArc.centroid(d) + ') rotate(' + (angle * 180 / Math.PI - 90) + ')'
	}).text(d => d.data.name);

/* Нажатие на сектор брэнда */
labelSectorGroup.on('click', function(d) {
	if (isBigCircleAreaShown)
		d3.selectAll('#bigCircleArea').call(disableBigCircleArea);
		d3.selectAll('.bigArcPath').call(scaleElement);
		d3.selectAll('.textArcPath').call(scaleElement);
		d3.selectAll('.rib').call(scaleElement);
		isBigCircleAreaShown = false;
});


/* Логотипы брэндов */
for (let i = 0; i < brands.length; i++) {
	const img = document.createElement('img');
	img.setAttribute('src', brands[i].img);
	img.setAttribute('title', brands[i].name);
	img.addEventListener('click', selectBrand)
	img.style.borderRadius = '50%';
	img.style.background = `linear-gradient(${brands[i].gradientDegree}, #${brands[i].colorStart}, #${brands[i].colorEnd})`;
	img.style.width = '100px';
	img.style.height = '100px';
	img.style.margin = '3px';
	img.style.border = `2px solid #${brands[i].borderColor}`;
	img.className = 'circleBrand';

	const root = document.getElementById('circleArea');
	root.append(img);
}

function selectBrand(event) {
	if (isBigCircleAreaShown)
		console.log(event.srcElement.title)
		showBrand();
		d3.selectAll('#bigCircleArea').call(disableBigCircleArea);
		d3.selectAll('.bigArcPath').call(scaleElement);
		d3.selectAll('.textArcPath').call(scaleElement);
		d3.selectAll('.rib').call(scaleElement);
		isBigCircleAreaShown = false;
};

function showBrand(brandName) {
	svg.append('img').attr('src', cat2).attr('transform', 'translate(200, 200)');

	// const root = document.getElementById('svgArea');
	// const imgOne = document.createElement('img');
	// imgOne.setAttribute('src', cat2);
	// imgOne.style.width = '100px';
	// imgOne.style.height = '100px';
	// root.append(imgOne);

	// const imgTwo = document.createElement('img');
	// imgTwo.setAttribute('src', cat2_1);
	// imgTwo.style.width = '100px';
	// imgTwo.style.height = '100px';
	// root.append(imgTwo);
};

/* Функции анимации */
function infiniteLoop(g) {
	console.log(d3.select('#bigArc0'))
	g.transition().duration(DURATION).attr('transform', 'rotate(45, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(90, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(135, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(180, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(225, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(270, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(315, 0, 0)')
	.transition().duration(DURATION).attr('transform', 'rotate(360, 0, 0)')
	.each('end', function() { d3.select(this).call(infiniteLoop) })
};

function changeSelectedBrand(g) {
	g.transition().duration(500)
	.attr('transform', d => {
		const a = (d.data.endAngle + d.data.startAngle) / 2;
		const dx = 20 * Math.sin(a);
		const dy = -20 * Math.cos(a);
		return 'translate(' + dx + ',' + dy + ')';
	})
};

function removeSelectedBrand(g) {
	g.transition().duration(200)
	.attr('transform', 'translate(0, 0)');
};

function disableBigCircleArea(g) {
	g.transition().duration(1000).attr('transform', d => {
		return 'translate(' + width/1.3 + ',' + height/5 + ') scale(0.4, 0.4)'
	});
};

function scaleElement(g) {
	g.transition().duration(1500).attr('transform', 'scale (0)');
};

function zoomElement(g) {
	g.transition().duration(1500).attr('transform', 'scale (1)');
};

function enableBigCircleArea(g) {
	g.transition().duration(1000).attr('transform', `translate(${width/2.8},${height/2.2})`)
};




// const getHtmlElements = data => {
// 	let arr = [];

// 	for (let i = 0; i < data.length; i++) {
// 		arr.push(document.getElementById(data[i].id));
// 	};

// 	return arr;
// }

// window.onload = () => {
// 	console.log('windowLoad');
// 	getMaxRightElement(getHtmlElements(sectorsData));
// };

// document.addEventListener('changeSector', () => {
// 	console.log('newEvent')
// 	console.log(state.selectedSector)
// 	d3.selectAll('.labelSectorGroup').filter('#labelArc' + state.selectedSector).call(changeSelectedBrand);
// 	getMaxRightElement(getHtmlElements(sectorsData));
// });

// const getMaxRightElement = elems => {
// 	console.log('getMaxRightElement')
// 	let maxRightSide = 0;
// 	let result = null;

// 	for (let i = 0; i < elems.length; i++) {
// 		if (elems[i].getBoundingClientRect().right > maxRightSide) {
// 			maxRightSide = elems[i].getBoundingClientRect().right;
// 			result = elems[i];
// 		}
// 	};

// 	state.selectedSector = result.id.slice(-1);
// 	console.log("New selected sector is: " + state.selectedSector)

// 	document.dispatchEvent(event);
// 	// const selectedNumber = result.id.slice(-1);
// 	// console.log(selectedNumber);
// 	// d3.selectAll('.labelSectorGroup').call(removeSelectedBrand);
// 	// d3.selectAll('.labelSectorGroup').filter('#labelArc' + selectedNumber).call(changeSelectedBrand);
// };



/* Запуск движения и вычисления самого правого сектора */

// const timer = setInterval(() => {
// 	getMaxRightElement(getHtmlElements(sectorsData));
// }, 1000);

// bigSectorGroup.call(infiniteLoop);





	// var box = elem.getBoundingClientRect();
	// console.log(box);
	//   return {
	//     top: box.top + pageYOffset,
	//     left: box.left + pageXOffset,
	//     bottom: box.bottom + pageYOffset,
	//   };

/* Вращение диаграмы */

// function dragmove(d) {
// 	// let htmlRoot = document.getElementById('html').getBoundingClientRect(); // размеры тега html;
// 	// console.log(htmlRoot)
// 	const el = document.getElementById(d.data.id).getBoundingClientRect(); // размеры выбранного сектора;
	
// 	console.log('x: ' + d3.event.x + ' y: ' + d3.event.y)
// 	// const diffY = event.pageY - el.top;
// 	// const diffX = event.pageX - el.left;


// 	const x = d3.event.x;
// 	const y = d3.event.y;

// 	let degree = Math.atan(y / x) * 180 / Math.PI; // переводим радинаы в градусы;
// 	degree = x < 0 ? degree + 180 : degree; // если указатель превысил половину окружности градусов;
// 	d3.selectAll('.bigSectorGroup').attr('transform', `rotate(${degree})`)
// }

// const drag = d3.behavior.drag()
// 	// .on("dragstart", dragmove)
// 	.on("drag", dragmove)
// 	// .on("dragend", dragend);

// bigSectorGroup.call(drag)


// function dragstart() {
// 	console.log('dragstart');
// 	d3.select(this).style("border", '1px solid red');
// }


// function dragend() {
// 	console.log('dragend');
// 	d3.select(this).style("border", null);
// }

// d3.select("svg")
// 	.append("rect")
// 	.attr({x: 100, y: 100, width: 100, height: 50})
// 	.call(drag);