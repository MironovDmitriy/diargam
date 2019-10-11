const path = require("path");

module.exports = {
	entry: "./src/index.js",
	mode: "development",
	output: {
		filename: "./main.js"
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 9000,
		watchContentBase: true,
		progress: true,
	},
	devtool: 'source-map',
	resolve: {
		alias: {
			proj: path.resolve(__dirname, 'src') // для имени пути импорта
		},
		extensions: ['.js', '.ts'] // указываем какие расширения необходимо обрабатывать
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules | bower_components)/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: [
					"style-loader", // сам добавляет получившийся css в виде тега style в index.html
					{
						loader: "css-loader",
						options: {
							modules: true // позволяет использовать css стили только в тех модулях, куда они импортированы
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader"]
			},
		]
	}
}