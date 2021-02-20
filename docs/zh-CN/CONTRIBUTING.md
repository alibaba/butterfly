# 为ButterFly做贡献

我们很乐意为您贡献源代码，让ButterFly变得越来越好。在您提交代码之前，请仔细阅读以下指南：
* [行为守则](./CODE_OF_CONDUCT.md)
* [issue 规范](#issue-submit)
* [pull request 规范](#pull-request-guidelines)
* [代码提交规范](#code-commit)
## <a name='issue-submit'></a> issue 规范
* 在您提交问题之前，请先搜索存档，检查是否已存在问题。

* 检查问题是否已经修复，请使用master存储库中的最新版本开发。

* 尽可能在报告中详细的说明问题情况，例如，你的环境是什么？什么浏览器和操作系统遇到的问题？其他浏览器是否有不同的显示错误？您期望结果如何？最好能重现错误，提供明确的步骤或者一个demo。


## <a name="pull-request-guidelines"></a>pull  request 规范

* 请先fork一份到自己的项目下，不要直接在仓库下建分支。

* commit信息要以`[组件名]：描述信息`的形式填写，例如`[canvas]:fix xxx bug`。

* 如果您已经修复了错误或者添加了应测试的代码，请添加测试！

* 确保提交PR之前请先rebase，保持commit记录的整洁性。

* 确保PR是提交到`dev`分支，而不是`master`分支。

* 如果修复的是bug，请在PR中给出描述信息。

## <a name="code-commit"></a>代码提交规范
commit 信息分类标准
* feat：新功能
* fix：修补bug
* docs：文档
* style： 格式（不影响代码运行的变动）
* refactor：重构（即不是新增功能，也不是修改bug的代码变动）
* test：增加测试
* chore：构建过程或辅助工具的变动
  
**例如**
```bash
git add xxx
git commit -m 'feat: 新增xxx功能'
git commit -m 'fix: 修复xxx问题'
git commit -m 'docs: 添加xxx文档/xxx文档更新'
git commit -m 'style: 代码风格调整'
git commit -m 'refactor: xxx函数逻辑重构'
git commit -m 'test: xxx功能添加测试'
git commit -m 'chore: webpack 打包模块升级'
```

