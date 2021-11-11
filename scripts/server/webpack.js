const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const getConfig = require('../webpack/dev');
const loaders = require('../webpack/loaders');
const { parseMD } = require('../utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { getBabelConfig } = require('build-scripts-config');

const babelConfig = getBabelConfig();

const babelLoader = loaders.js(babelConfig);
const loadersPath = path.join(__dirname, 'loaders');
const cwd = process.cwd();

module.exports = function getWebpackConfig(options) {
    const config = getConfig();
    const { componentName, componentPath, disableAnimation, lang, dir, devA11y, mode } = options;

    const indexPath = path.join(componentPath, lang === 'zh' ? 'index.md' : 'index.en-us.md');
    const demoPaths = glob.sync(path.join(componentPath, 'demo', '*.md'));
    const themePaths = glob.sync(path.resolve(componentPath, 'theme/**/*.jsx'));
    const adaptorPaths = glob.sync(path.resolve(componentPath, 'adaptor/*.jsx'));
    const entry = getEntry([indexPath, ...demoPaths, ...themePaths, ...adaptorPaths], componentName, mode);
    config.entry = entry;
    config.mode = 'development';

    config.output = {
        path: path.resolve(__dirname, '/'),
        publicPath: '/',
        filename: pathData => {
            return '[name].js';
        },
    };

    config.resolveLoader = {
        alias: {
            'index-loader': path.join(loadersPath, 'index/index.js'),
            'demo-loader': path.join(loadersPath, 'demo/index.js'),
            'theme-loader': path.join(loadersPath, 'theme/index.js'),
            'adaptor-loader': path.join(loadersPath, 'adaptor/index.js'),
        },
    };

    const babelLoaderIndex = config.module.rules.findIndex(rule => {
        return rule.test.toString().indexOf('js') > -1;
    });
    config.module.rules[babelLoaderIndex] = babelLoader;

    let links = getLinks(demoPaths);
    links = [
        {
            href: componentName,
            title: '首页',
            filename: 'index',
        },
        {
            href: null,
            title: '使用示例',
            filename: 'Usage',
        },
    ].concat(links);

    links.push({
        href: null,
        title: '主题配置',
        filename: 'Usage of theme',
    });

    if (themePaths.length) {
        const docsPath = path.join(cwd, 'docs');
        if (componentName === 'core') {
            themePaths.forEach(themePath => {
                links.push({
                    href: path.relative(docsPath, themePath).replace(/\.jsx$/, '.html'),
                    title: path.basename(themePath, '.jsx'),
                });
            });
        } else {
            links.push({
                href: path.relative(docsPath, themePaths[0]).replace(/\.jsx$/, '.html'),
                title: 'Theme Demo',
            });
            links.push({
                href: path.relative(docsPath, themePaths[0]).replace(/index\.jsx$/, 'config.html'),
                title: 'Config Theme Demo',
            });
        }
    }

    if (adaptorPaths.length) {
        const docsPath = path.join(cwd, 'docs');
        links.push({
            href: path.relative(docsPath, adaptorPaths[0]).replace(/\.jsx$/, '.html'),
            title: 'Adaptor Demo',
        });
    }

    config.module.rules.push({
        test: /docs\/[^/]+\/index\.(en-us\.)?md$/,
        use: [
            {
                loader: 'index-loader',
                options: {
                    links,
                    lang,
                    dir,
                },
            },
        ],
    });
    config.module.rules.push({
        test: /docs\/[^/]+\/demo\/.+\.md$/,
        use: [
            babelLoader,
            {
                loader: 'demo-loader',
                options: {
                    links,
                    disableAnimation,
                    lang,
                    dir,
                    devA11y,
                },
            },
        ],
    });
    config.module.rules.push({
        test: /theme\/.+\.jsx$/,
        use: [
            babelLoader,
            {
                loader: 'theme-loader',
                options: {
                    disableAnimation,
                    componentName,
                },
            },
        ],
    });
    config.module.rules.push({
        test: /adaptor\/.+\.jsx$/,
        use: [
            babelLoader,
            {
                loader: 'adaptor-loader',
                options: {},
            },
        ],
    });

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    );
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

    config.plugins.unshift(new MiniCssExtractPlugin());

    config.optimization = {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: 'all',
                },
            },
        },
    };

    config.externals = {
        react: 'var window.React',
        'react-dom': 'var window.ReactDOM',
        moment: 'var window.moment',
    };

    return config;
};

function getEntry(entryPaths, componentName, mode) {
    const entry = entryPaths.reduce((ret, entryPath) => {
        const name = path.basename(entryPath, path.extname(entryPath));
        const entryName = path.join(path.dirname(path.relative(process.cwd(), entryPath)), name);
        let cssArr = [];
        // 通过 mode 判断引入的样式文件
        if (mode === 'css') {
            cssArr = [
                path.join(process.cwd(), 'lib', componentName, 'variable.css'),
                path.join(process.cwd(), 'lib', componentName, 'style2.js'),
                path.join(process.cwd(), 'lib', 'core2', 'index.css'),
            ];
        } else if (componentName !== 'core') {
            cssArr = [path.join(process.cwd(), 'src', componentName, 'style.js')];
        }

        ret[entryName] = [
            'webpack/hot/dev-server',
            // css var should only be included once.
            // import it from 'src/core/index-noreset.scss'
            // will produce many duplicates,
            // making dev app slow
            // path.join(process.cwd(), 'src', 'core', 'css-var-def.scss'),
            ...cssArr,
            entryPath,
        ];
        return ret;
    }, {});

    return entry;
}

function getLinks(demoPaths) {
    const demoMetas = demoPaths.reduce((ret, demoPath) => {
        const content = fs.readFileSync(demoPath, 'utf8');
        const result = parseMD(content, demoPath);
        ret[demoPath] = result.meta;
        return ret;
    }, {});
    const demoOrders = demoPaths.reduce((ret, demoPath) => {
        const meta = demoMetas[demoPath];
        let order = 9999;
        if (meta) {
            const number = parseInt(meta.order, 10);
            if (!isNaN(number)) {
                order = number;
            }
        }
        ret[demoPath] = order;
        return ret;
    }, {});
    const orderedDemoPaths = demoPaths.sort((prev, next) => demoOrders[prev] - demoOrders[next]);
    return orderedDemoPaths.map(demoPath => {
        const href = path.relative(path.join(cwd, 'docs'), demoPath).replace(/\.md$/, '.html');
        let title = (demoMetas[demoPath] || {}).title;
        if (!title) {
            title = path.basename(demoPath, '.md');
        }

        return { href, title, filename: path.basename(demoPath, '.md') };
    });
}
