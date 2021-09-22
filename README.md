# PostCSS

Bundle the postcss to the esmodule and translate node to the browser

## use

yarn add -D postcss-browser

```
import postcss from "../../dist/postcss"

const lazyResult = postcss().process(".title {color: red}")

lazyResult.then(res => {
  console.log(res)
})

```
