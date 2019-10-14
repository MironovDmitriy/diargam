import './css/normalize.css';
import './css/index.css';
import './defs.js';

import sectorsData from './sectorsData.js';
// import labelsData from './labelsData.js';
import brands from './brands.js';

const width = 1800;
const height = 1000;
const DURATION = 4000;

/* Зона для размещения графических эллементов */
const svg = d3.select('#svgArea').append('svg').attr('height', height).attr('width', width).attr('id', 'svg');
const bigCircleArea = svg.append('g').attr('transform', `translate(${width/2.8},${height/2.2})`).attr('id', 'bigCircleArea');
const brandArea = svg.append('g').attr('transform', `translate(${width/1.3},${height/1.45})`).attr('id', 'brandArea');

const color = d3.scale.category10();

const arc = d3.svg.arc().padAngle(0.015);
const brandArc = d3.svg.arc().padAngle(0.05);

var pie = d3.layout.pie().value(function(d) {
	return d.value;
});

const bigSector = bigCircleArea.selectAll('g')
	.data(sectorsData)
	.enter()
	.append('g')
	.attr('id', (d, i) => 'bigSector' + i);

const outerPath = bigSector.append('g')
	.style('fill', d => `url(#outerGradient${d.outerGradientId})`)
	.selectAll("path")
	.data(d => pie(d.outer)).enter().append('path')
	.attr("d", function(d, i, j) {
	return arc.innerRadius(115).outerRadius(d => d.data.radius).startAngle(d.data.startAngle).endAngle(d.data.endAngle)(d)
}).attr('id', d => 'outerPath' + d.data.id);

bigSector.append('g').selectAll('text')
	.data(d => pie(d.outer)).enter()
	.append('text')
	.append('textPath')
	.attr("alignment-baseline", "before-edge")
	.attr('xlink:href', (d, i) => '#outerPath' + d.data.id)
	.text(d => d.data.name);

const ribGroup = bigSector.append('g').style('fill', d => `url(#innerGradient${d.innerGradientId})`);

const rib = ribGroup.selectAll("g")
	.data(d => pie(d.childrens))
	.enter().append("g");

rib.append('path')
	.attr("d", function(d, i, j) {
		// console.log(d)
	return arc.innerRadius(115).outerRadius(d.data.radius).startAngle(d.data.startAngle).endAngle(d.data.endAngle)(d);
});

const middlePath = bigSector.append('g')
	.style('fill', d => `url(#innerGradient${d.innerGradientId})`)
	.selectAll("path")
	.data(d => pie(d.childrens))
	.enter().append("path")
	.attr("d", function(d, i, j) {
	return arc.innerRadius(85).outerRadius(110).startAngle(d.data.startAngle).endAngle(d.data.endAngle)(d);
});

const innerGroup = bigSector.append('g')
	.style('fill', d => `url(#innerGradient${d.innerGradientId})`);

	innerGroup.selectAll("path")
	.data(d => pie(d.inner))
	.enter().append("path")
	.attr("d", function(d, i, j) {
	return arc.innerRadius(40).outerRadius(80).startAngle(d.data.startAngle).endAngle(d.data.endAngle)(d);
});

const brandSector = brandArea.selectAll('g')
	.data(pie(brands))
	.enter()
	.append('g')
	.attr('class', 'brandSector')
	.style('stroke', d => d.data.borderColor)
	.style('stroke-width', '3')
	.style('fill', d => `url(#brandGradient${d.data.gradientId})`)

const brandPath = brandSector.append('path')
	.attr("d", function(d, i, j) {
	return brandArc.innerRadius(0).outerRadius(200).startAngle(d.data.startAngle).endAngle(d.data.endAngle)(d)
}).attr('id', (d, i) => 'brandPath' + i)

// brandSector.append('svg:image')
// 	.attr("xlink:href", d => {
// 		console.log(d)
// 		return d.data.img
// 	})
// 	.attr("height", 150)
// 	.attr("width", 150)
// 	.attr('transform', d => 'translate(' + brandArc.centroid(d) + ')');

for (let i = 0; i < brands.length; i++) {
	const img = document.createElement('img');
	img.setAttribute('src', brands[i].img);
	img.setAttribute('title', brands[i].name);
	// img.addEventListener('click', selectBrand)
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

var degree = 0;
function infiniteLoop(g) {
	if (g[0][0]['id'] === 'bigSector0') {
			degree = degree < 360 ? degree + 40 : 45;
			const selectedSectorId = getMaxRightElement(getHtmlElements(sectorsData));

			d3.selectAll('.brandSector').filter(d => {
				return d.data.sectorsMatch.find(x => x === selectedSectorId)
			}).call(selectBrand);

			d3.selectAll('.brandSector').filter(d => {
				return !d.data.sectorsMatch.find(x => x === selectedSectorId)
			}).call(removeSelectedBrand);
		}

	g.transition().duration(DURATION).attr('transform', 'rotate(' + degree + ', 0, 0)')
	.each('end', function() { d3.select(this).call(infiniteLoop) })
};

function selectBrand(g) {
	g.transition().duration(500)
	.attr('transform', d => {
		const a = (d.data.endAngle + d.data.startAngle) / 2;
		const dx = 20 * Math.sin(a);
		const dy = -20 * Math.cos(a);
		return 'translate(' + dx + ',' + dy + ')';
	})
	// g.append('text')
	// .append('textPath')
	// .attr('xlink:href', (d, i) => {
	// 	console.log(d)
	// 	return '#brandPath' + i
	// })
	// .text(d => d.data.money)
	// .attr('fill', 'black');
};

function removeSelectedBrand(g) {
	g.transition().duration(200)
	.attr('transform', 'translate(0, 0)');

	// g.append('text')
	// .append('textPath')
	// .attr('xlink:href', (d, i) => '#brandPath' + i)
	// .text(d => d.data.money)
	// .attr('fill', 'black');
};

const getHtmlElements = data => {
	let arr = [];

	for (let i = 0; i < data.length; i++) {
		arr.push(document.getElementById(data[i].id));
	};

	return arr;
}

const getMaxRightElement = elems => {
	let maxCoord = 0;
	let maxTopCoord = 0;
	let selectedEl = null;

	for (let i = 0; i < elems.length; i++) {
		let elementCoord = elems[i].getBoundingClientRect().right + elems[i].getBoundingClientRect().left;
		let elementTopCoord = elems[i].getBoundingClientRect().top;
		if (elementCoord > maxCoord) {
			maxCoord = elementCoord;
			maxTopCoord = elementTopCoord;
			selectedEl = elems[i];
		}
	};

	return selectedEl.id;
};


bigSector.call(infiniteLoop);