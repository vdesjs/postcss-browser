import postcss from '../../dist/postcss'

const lazyResult = postcss().process('.title {color: red}')

lazyResult.then(res => {
  console.log(res)
})
