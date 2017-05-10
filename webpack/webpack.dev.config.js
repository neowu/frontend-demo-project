module.exports = {
    devtool: 'cheap-module-source-map',

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        overlay: {
            errors: true,
            warnings: true,
        },
    }
};