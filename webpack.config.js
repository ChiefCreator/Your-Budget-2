const config = {
    mode: "production",
    entry: {
        index: "./src/js/index.js",
        mainPage: "./src/js/main-page.js",
        operationsPage: "./src/js/operations-page.js",
        accountsPage: "./src/js/accounts-page.js",
        statisticsPage: "./src/js/statistics-page.js"
    },
    output: {
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};

module.exports = config;