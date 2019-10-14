import sectorsData from './sectorsData.js';
import brands from './brands.js';

const svg = d3.select('body').append('svg').attr('id', 'defsSvg');

sectorsData.forEach(x => {
	const outerLinearGradient = svg.append("defs")
		.append("linearGradient")
		.attr("id", "outerGradient" + x.outerGradientId)
		.attr('x1', '0%')
		.attr('x2', '0%')
		.attr('x1', '0%')
		.attr('x2', '100%');

		outerLinearGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", `#${x.outerStartColor}`);

		outerLinearGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", `#${x.outerEndColor}`);

	const innerLinearGradient = svg.append("defs")
		.append("linearGradient")
		.attr("id", "innerGradient" + x.innerGradientId)
		.attr('x1', '0%')
		.attr('x2', '0%')
		.attr('x1', '0%')
		.attr('x2', '100%');

		innerLinearGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", `#${x.innerStartColor}`);

		innerLinearGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", `#${x.innerEndColor}`);
});

brands.forEach(x => {
	const brandLinearGradient = svg.append("defs")
		.append("linearGradient")
		.attr("id", "brandGradient" + x.gradientId)
		.attr('x1', '0%')
		.attr('x2', '0%')
		.attr('x1', '0%')
		.attr('x2', '100%');

		brandLinearGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", `#${x.colorStart}`);

		brandLinearGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", `#${x.colorEnd}`);
});