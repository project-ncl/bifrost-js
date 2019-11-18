import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bifrost-angularjs.js',
      format: 'umd',
      name: "bifrost"
    },
    plugins: [resolve()]
  };
