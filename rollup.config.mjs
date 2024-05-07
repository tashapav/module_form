import typescript from 'rollup-plugin-typescript2'
import css from 'rollup-plugin-import-css';

import pkg from './package.json' assert{type: 'json'}

export default {
    input: 'src/index.tsx',
    output: [
    {
        file: pkg.main,
        exports: 'named',
        sourcemap: true,
        strict: false
    },
    ],
    plugins: [
        typescript({ objectHashIgnoreUnknownHack: true }),
        css({
            output: 'styles.css',
        }),
    ],
    external: ['react', 'react-dom']
}