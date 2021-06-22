import resolve from 'rollup-plugin-node-resolve';
import { version } from './package.json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bifrost-angularjs.js',
    format: 'umd',
    name: "bifrost",
    banner: '/* bifrost-angularjs [v' + version + '] ' + (new Date()).toDateString() + '*/',
  },
  plugins: [resolve()]
};
