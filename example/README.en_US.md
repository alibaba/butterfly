# Butterfly Demos

## Dev

```shell
$ npm install (yarn) 
$ npm start
```

## How to write demo?

> Each directory under `demo` is a standalone demo for butterfly dag. They can not import each other.

(1) Create a uniq directory and create file `index.jsx`(entry)，`package.json`(description and dependences).The decriptions about that two files are list below.

- index.jsx

`#root` element is used to bind element. Other rules can be found in https://stackblitz.com/

- package.json

```json
{
  "name": "demo English name",
  "cn_name": "demo Chinese name",
  "description": "demo English description",
  "cn_description": "demo Chinese description",
  "dependencies": {}
}
```

(2)Run the project, and you can find your demo in page `demo`. Just to make it available.