module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["import"],
  rules: {
    "no-var": "warn", //不允许使用 var 关键字
    "prefer-const": "warn", //要求使用 const 声明那些声明后不再被修改的变量
    "@typescript-eslint/no-var-requires": "warn", //不允许使用 require() 函数导入模块
    "@typescript-eslint/no-unused-vars": "warn", //不允许定义未使用的变量
    "vue/v-slot-style": "warn", //强制使用 v-slot 指令的“name”属性值风格
    "vue/attribute-hyphenation": "warn", //对模板中的自定义组件强制执行属性命名样式：my-prop="prop"
    "vue/html-closing-bracket-newline": "warn", //禁止html闭标签>内换行
    "no-console": "warn", //不允许使用 console

    "@typescript-eslint/ban-types": "off", //禁止使用指定的类型
    "@typescript-eslint/no-explicit-any": "off", //禁止使用any类型
    "@typescript-eslint/no-this-alias": "off", //禁止使用this别名
    "typescript-eslint/no-this-alias": "off", //禁止使用this别名
    "vue/multi-word-component-names": "off", //组件名称必须包含多个单词
    "vue/no-v-html": "off", //禁止使用v-html
    "vue/custom-event-name-casing": "off", //为自定义事件名称强制使用特定大小写
    "vue/require-default-prop": "off", //强制要求默认值
    "vue/no-template-shadow": "off", //禁止模板中的变量覆盖保留字
    "vue/v-on-event-hyphenation": "off", //强制事件名称驼峰命名

    //import排序
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
      },
    ],
    //属性排序
    "vue/attributes-order": [
      "warn",
      {
        order: [
          "DEFINITION",
          "LIST_RENDERING",
          "CONDITIONALS",
          "RENDER_MODIFIERS",
          "GLOBAL",
          "UNIQUE",
          "TWO_WAY_BINDING",
          "OTHER_DIRECTIVES",
          "OTHER_ATTR",
          "EVENTS",
          "CONTENT",
        ],
      },
    ],
  },
};
