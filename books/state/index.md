# 状态管理

> 随着web项目逐渐复杂，各类框架基本已经占领了前端开发各个角落。然而大部分框架并没有直接提供状态管理的能力，面对复杂的业务场景，model的抽离已经变得迫在眉睫。所以各类状态管理库如同雨后春笋一般。如vuex redux mobx，也有基于这些二次开发的，如redux-react dva等等

## 说明
其实在vue笔记中已经写了vuex，但主要局限于api介绍。但是随着库的升级，虽然大部分api是向下兼容的，但难免出现新的api。不过整体来看，其思想一般不会有大的变化，因此此部分将着重介绍起思想，不过为了方便理解，其代码风格及api必然也会作一下介绍。

[redux](./redux.md)