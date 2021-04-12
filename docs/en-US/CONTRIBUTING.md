# Contribute to ButterFly

We are happy to contribute source code to you and make ButterFly getting better and better. Please read the following guidelines carefully before you submit your code.：
* [Code of Conduct](./CODE_OF_CONDUCT.md)
* [Issue rule](#issue-submit)
* [Pull request rule](#pull-request-guidelines)
* [Code submission specification](#code-commit)
## <a name='issue-submit'></a> Issue rule
* Before you submit a question, search the archive to see if there is a problem.

* Check if the issue has been fixed, please use the latest version of the master repository to develop.

* As much as possible in the report to explain the problem, for example, what is your environment? What browser and operating system are experiencing problems? Do other browsers have different display errors? What do you expect from the results? It's best to reproduce the error, provide clear steps or a demo.


## <a name="pull-request-guidelines"></a>Pull request rule

* Please fork a copy to your own project, do not build branches directly under the warehouse.

* The commit information should be filled in as `[component name]: description information`, for example `[canvas]:fix xxx bug`.

* If you have fixed the bug or added a code to test, add a test!

* Be sure to rebase before submitting the PR to keep the commit records clean.

* Make sure the PR is committed to the `dev` branch instead of the `master` branch.

* If the bug is fixed, please give a description in the PR.

## <a name="code-commit"></a>Code submission specification

commit information classification standard
* feat：new feature description
* fix：fix bug description
* docs：document description
* style： style description（Changes that do not affect code operation）
* refactor：refactor description（It's not a new feature or a code change to modify a bug）
* test：test description
* chore：Change of construction process or auxiliary tools

  
**For example**
```bash
git add xxx
git commit -m 'feat: add xxx feature'
git commit -m 'fix: fix xxx problem'
git commit -m 'docs: add xxx document or xxx document update'
git commit -m 'style: code style adjustment'
git commit -m 'refactor: xxx the function logic refactor'
git commit -m 'test: add xxx feature test'
git commit -m 'chore: webpack package module upgrade'
```
