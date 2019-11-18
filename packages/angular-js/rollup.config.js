import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
      file: 'bower-dist/bifrost-angular-js.js',
      format: 'umd',
      name: "bifrost"
    },
    plugins: [resolve()]
  };
