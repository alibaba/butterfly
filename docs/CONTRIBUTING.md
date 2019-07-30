# 为ButterFly做贡献

我们很乐意为您贡献源代码，让ButterFly变得越来越好。在您提交代码之前，请仔细阅读以下指南：
* [行为守则](https://github.com/alibaba/butterfly/blob/master/docs/CODE_OF_CONDUCT.md)
* [issue 规范](#issue-submit)
* [pull request 规范](#pull-request-guidelines)

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

