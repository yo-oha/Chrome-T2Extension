import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'

type BrowserTarget = 'chrome' | 'firefox'

interface BuildEnv {
  browser?: BrowserTarget
}

const config = (env: BuildEnv): Configuration => {
  const browserTarget = env.browser ?? 'chrome'

  return {
    mode: (process.env.NODE_ENV ?? 'development') as Configuration['mode'],
    entry: {
      options: './src/options.tsx',
      authenticate: './src/authenticate.tsx',
      redirect: './src/redirect.ts',
      background: './src/background.ts',
      login_vpn: './src/login_vpn.ts',
    },
    output: {
      path: `${__dirname}/dist`,
      publicPath: './',
      filename: 'js/[name].js',
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: '.',
            to: '.',
            context: 'public',
          },
        ],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: '.',
            to: '.',
            context: `public_${browserTarget}`,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['options'],
        title: 'T2Extension Settings',
        filename: 'options.html',
        scriptLoading: 'blocking',
      }),
    ],
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-source-map',
    cache: false,
  }
}

export default config
