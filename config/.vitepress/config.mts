import { defineConfig } from "vitepress";

export default defineConfig({
  title: "CoCoFaith",
  description: "CoCoFaith v3 使用与开发文档",
  lang: "zh-CN",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/coconut-water.png",
    siteTitle: "CoCoFaith",
    nav: [
      { text: "使用", link: "/start/what-is-cocofaith", activeMatch: "^/(start|config)/" },
      {
        text: "开发",
        activeMatch: "^/develop/",
        items: [
          { text: "Core", link: "/develop/core/" },
          { text: "Business", link: "/develop/business/" },
          { text: "Adapter", link: "/develop/adapter/" },
        ],
      },
    ],
    sidebar: {
      "/start/": usageSidebar(),
      "/config/": usageSidebar(),
      "/develop/core/": coreDevSidebar(),
      "/develop/business/": businessDevSidebar(),
      "/develop/adapter/": adapterDevSidebar(),
      "/develop/": developHomeSidebar(),
    },
    search: { provider: "local" },
    outline: { label: "本页目录", level: [2, 3] },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: {
      text: "最后更新",
      formatOptions: { dateStyle: "medium", timeStyle: "short" },
    },
  },
});

function usageSidebar() {
  return [
    {
      text: "开始",
      items: [
        { text: "什么是 CoCoFaith", link: "/start/what-is-cocofaith" },
        { text: "基础环境", link: "/start/environment" },
        { text: "快速开始", link: "/start/quick-start" },
        { text: "部署", link: "/start/deployment" },
      ],
    },
    { text: "Core", items: [{ text: "Core 配置", link: "/config/core" }] },
    { text: "Business", items: [{ text: "Business 配置", link: "/config/business" }] },
    { text: "Adapter", items: [{ text: "Adapter 配置", link: "/config/adapter-qq" }] },
  ];
}

function developHomeSidebar() {
  return [
    {
      text: "开发",
      items: [
        { text: "总体架构", link: "/develop/architecture" },
        { text: "Core", link: "/develop/core/" },
        { text: "Business", link: "/develop/business/" },
        { text: "Adapter", link: "/develop/adapter/" },
      ],
    },
  ];
}

function coreDevSidebar() {
  return [
    {
      text: "Core 开发",
      items: [
        { text: "总览", link: "/develop/core/" },
      ],
    },
    {
      text: "起步",
      items: [
        { text: "环境搭建", link: "/develop/core/setup" },
        { text: "项目结构", link: "/develop/core/project-structure" },
        { text: "启动与生命周期", link: "/develop/core/runtime" },
      ],
    },
    {
      text: "基础",
      items: [
        { text: "Gameplay SDK", link: "/develop/core/gameplay-sdk" },
        { text: "事件与 Hook", link: "/develop/core/hooks" },
        { text: "配置与热重载", link: "/develop/core/config-reload" },
      ],
    },
    {
      text: "服务",
      items: [
        { text: "服务地图", link: "/develop/core/services" },
        { text: "事务与原子作用域", link: "/develop/core/transactions" },
        { text: "Business Scope", link: "/develop/core/business-scope" },
        { text: "注册表与加成", link: "/develop/core/registries-bonuses" },
      ],
    },
    {
      text: "数据库",
      items: [
        { text: "表结构", link: "/develop/core/database" },
        { text: "迁移与数据原则", link: "/develop/core/data-principles" },
      ],
    },
    {
      text: "参考",
      items: [
        { text: "接口参考", link: "/develop/core/api-reference" },

      ],
    },
  ];
}

function businessDevSidebar() {
  return [
    {
      text: "Business 开发",
      items: [
        { text: "总览", link: "/develop/business/" },
        { text: "玩法开发", link: "/develop/business/gameplay" },
      ],
    },
  ];
}

function adapterDevSidebar() {
  return [
    {
      text: "Adapter 开发",
      items: [
        { text: "总览", link: "/develop/adapter/" },
        { text: "平台接入", link: "/develop/adapter/platform" },
      ],
    },
  ];
}
