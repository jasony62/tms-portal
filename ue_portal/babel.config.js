module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'tms-vue-ui',
        style: true
      },
      'tms-vue-ui'
    ]
  ]
}
