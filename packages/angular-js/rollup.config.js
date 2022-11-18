import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bifrost-angularjs.js',
    format: 'umd',
    name: "bifrost",
    banner: '/* bifrost-angularjs [v' + process.env.npm_package_version + '] ' + (new Date()).toDateString() + '*/',
  },
  plugins: [resolve()]
};
