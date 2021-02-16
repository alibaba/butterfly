# Butterfly Demos

## Dev

```shell
$ npm install (cnpm install) 
$ npm start
```

## 如何写Demo

> 目录 `demo` 下存放着所有的 `demo`，每一个文件夹为独立的`demo`，互相之间没有关联

(1) 创建一个文件夹，然后创建文件`index.jsx`(入口文件)，`package.json`(依赖声明文件)。下面是两个文件的要求：

- index.jsx

可以使用`#root`元素进行绑定，其他规则参考：https://stackblitz.com/ 的官方说明

- package.json

```json
{
  "name": "demo英文名",
  "cn_name": "demo中文名",
  "description": "demo英文描述",
  "cn_description": "demo中文描述",
  "dependencies": {}
}
```

(2)启动项目，在`示例`中，它将会被自动加载，将它调试到可运行即可。