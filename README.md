#  GO Terms viewer

FIXME: fill out a description of your tool here! :)

## Licence


### To set up locally for development

1. Clone the repo
2. `cd bluegenes-tool-go-terms` and then `npm install` to install dependencies.

All of the editable source files for css and js are in `src`. To bundle for prod, run the following commands:

#### CSS

Assuming [less](http://lesscss.org/) is installed globally:

```
npm run less
```

#### JS

Assuming [webpack](https://webpack.js.org/) is installed globally:

##### Single build:
```
npm run build
```


##### Dev build that auto-rebuilds saved files & provides test server:
Note that you'll still have to refresh the page yourself - we don't provide built-in hot-reloading.
```
npm run dev
```

This will serve your page at [http://localhost:3456](http://localhost:3456)
