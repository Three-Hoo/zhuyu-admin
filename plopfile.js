module.exports = function generator(
  /** @type {import('plop').NodePlopAPI} */
  plop) {
  // plop generator code
  plop.setGenerator('table', {
    description: '生成',
    prompts: [{
        type: 'input',
        name: 'name',
        message: '输入表名'
    }, {
        type: 'input',
        name: 'cn_name',
        message: '输入模块名称'
    }, {
      type: 'input',
      name: 'path',
      message: '输入父模块'
    }, {
      type: 'checkbox',
      name: 'choose',
      message: '选择模板',
      choices: [{
        name: 'page',
        value: 0
      }, {
        name: 'controller',
        value: 1
      }, {
        name: 'source',
        value: 2
      }]
    }],
    actions: (anwsers) => {
      const defaultActions =[{
        type: 'add',
        path: 'src/pages/dashboard/{{ path }}/{{dashCase name}}.tsx',
        templateFile: 'plop-templates/table/page.hbs'
      }, {
        type: 'add',
        path: 'src/pages/api/{{dashCase name}}.tsx',
        templateFile: 'plop-templates/table/controller.hbs'
      }, {
        type: 'add',
        path: 'src/sources/{{dashCase name}}.tsx',
        templateFile: 'plop-templates/table/source.hbs'
      }]

      return anwsers.choose.map((item) => defaultActions[item])
    }
  })
};