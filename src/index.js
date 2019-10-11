import sectorsData from './sectorsData.js';
import labelsData from './labelsData.js';

const width = 1900;
const height = 1000;
const DURATION = 2000;

var state = {
	selectedSector: null,
};

/* Зона для размещения графических эллементов */
const svg = d3.select('body').append('svg').attr('height', height).attr('width', width).attr('id', 'svg');
const bigCircleArea = svg.append('g').attr('transform', `translate(${width/3.5},${height/2})`);
const labelCircleArea = svg.append('g').attr('transform', `translate(${width/1.3},${height/1.5})`);

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
const arc = d3.svg.arc().outerRadius(d => d.data.radius).innerRadius(0).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const bigSectorPath = bigSectorGroup.append('path')
	.attr('d', arc)
	.attr('id', (d, i) => 'arc' + i)
	.style('fill', d => color(d.data.browser));

/* Внутренние большие секторы*/
const innerArc = d3.svg.arc().outerRadius(100).innerRadius(50).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const innerSectorPath = bigSectorGroup.append('path')
	.attr('d', innerArc)
	.attr('id', (d, i) => 'innerArc' + i)
	.style('fill', 'green');

/* Секторы для текста */
const textArc = d3.svg.arc().outerRadius(d => d.data.radius - 20).innerRadius(150).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const textSectorPath = bigSectorGroup.append('path')
	.attr('d', textArc)
	.attr('id', (d, i) => 'textArc' + i)
	.style('fill', 'none');

 /* Линия для текста */
bigSectorGroup.append('text')
	.append('textPath')
	.attr('xlink:href', (d, i) => '#textArc' + i)
	.text(d => d.data.name);

for (let i = 0; i < sectorsData.length; i++) {
	const sector = d3.selectAll('.bigSectorGroup').filter('#bigArc' + i);

/* Внутренние малые секторы */
	const innerSmallArc = d3.svg.arc().outerRadius(200).innerRadius(105).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
	sector.append('g').selectAll('.smallInnerArc')
	.data(pie(sectorsData[i]['childrens'])).enter()
	.append('g')
	.attr('class', 'smallInnerArc')
	.append('path')
	.attr('d', innerSmallArc)
	.style('fill', 'green');

	/* Продольные секторы */
	const ribArc = d3.svg.arc().outerRadius(400).innerRadius(205).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
	const ribGroup = sector.append('g').selectAll('.rib')
	.data(pie(sectorsData[i]['childrens'])).enter()
	.append('g')
	.attr('class', 'rib');

	ribGroup.append('path')
	.attr('d', ribArc)
	.style('fill', 'orange');

	ribGroup.append('text')
	.attr('transform', d => {
		const angle = (d.data.endAngle + d.data.startAngle) / 2;
		return 'translate(' + ribArc.centroid(d) + ') rotate(' + (angle * 180 / Math.PI - 90) + ')'
	})
	.text(d => d.data.name);
};

/* Остановка анимации мышкой и выбор сектора */
bigSectorGroup.on('mousedown', function(d) {
	const select = d3.select(this);
	state.selectedSector = select[0][0]['id'];
	d3.selectAll('.bigSectorGroup').interrupt();
})

/* Остановка анимации пальцем и выбор сектора */
bigSectorGroup.on('touchstart', function(d) {
	const select = d3.select(this);
	state.selectedSector = select[0][0]['id'];
	d3.selectAll('.bigSectorGroup').interrupt();
})

function infiniteLoop(g) {
	console.log(g);
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

/* Группа для одного сектора брэндов*/
const labelSectorGroup = labelCircleArea.selectAll('.labelSectorGroup')
	.data(pie(labelsData)).enter()
	.append('g')
	.attr('id', (d, i) => 'labelArc' + i)
	.attr('class', 'labelSectorGroup');

/* Все секторы брэндов*/
const labelArc = d3.svg.arc().outerRadius(d => d.data.radius).innerRadius(0).startAngle(d => d.data.startAngle).endAngle(d => d.data.endAngle);
const labelSectorPath = labelSectorGroup.append('path')
	.attr('d', labelArc)
	.attr('id', (d, i) => 'labelArc' + i)
	.style('fill', d => color(d.data.browser));


const getHtmlElements = data => {
	let arr = [];

	for (let i = 0; i < data.length; i++) {
		arr.push(document.getElementById(data[i].id));
	};

	return arr;
}

const getMaxRightElement = elems => {
	let maxRightSide = 0;
	let result = null;

	for (let i = 0; i < elems.length; i++) {
		if (elems[i].getBoundingClientRect().right > maxRightSide) {
			maxRightSide = elems[i].getBoundingClientRect().right;
			result = elems[i];
		}
	};

	// state.selectedSector = result;
	const selectedNumber = result.id.slice(-1);
	console.log(selectedNumber);
	d3.selectAll('.labelSectorGroup').call(removeSelectedBrand);
	d3.selectAll('.labelSectorGroup').filter('#labelArc' + selectedNumber).call(changeSelectedBrand);
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
	g.transition().duration(300)
	.attr('transform', 'translate(0, 0)');
};

/* Запуск движения и вычисления самого правого сектора */

const timer = setInterval(() => {
	getMaxRightElement(getHtmlElements(sectorsData));
}, 1000);

bigSectorGroup.call(infiniteLoop)





	// var box = elem.getBoundingClientRect();
	// console.log(box);
	//   return {
	//     top: box.top + pageYOffset,
	//     left: box.left + pageXOffset,
	//     bottom: box.bottom + pageYOffset,
	//   };


// root.x = d3.selectAll('#bigArc0').attr('cx');
// root.y = d3.selectAll('#bigArc0').attr('cy');
// console.log(d3.select('#bigArc0')[0]);


// function dragmove(d) {
// 	const x = d3.event.x;
// 	const y = d3.event.y;
// 	console.log("x: " + x, 'y: ' + y);
// 	const center = {
// 		x: 0,
// 		y: 0,
// 	}
// 	let degree = Math.atan(x - center.x, y - center.y);
// 	d3.select(this).attr('transform', 'rotate(' + degree + ')')
// 	// d3.select(this).attr({
// 	// 	x: coordinates[0] - 50,
// 	// 	y: coordinates[1] - 25
// 	// })
// }

// const drag = d3.behavior.drag()
// 	// .on("dragstart", dragstart)
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