import{B as a}from"./Breadcrumbs-Bk46b2kh.js";import"./jsx-runtime-BiUtJA2d.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-pP6CS22B.js";import"./I18nProvider-DVs6NFH8.js";import"./chunk-4N6VE7H7-2PeBHMWe.js";const p={title:"IALab/Breadcrumbs",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{segments:{control:"object"},separator:{control:"text"},size:{control:"text"}}},r=[{label:"Inicio",icon:"fa-home",onClick:()=>{}},{label:"Módulo 1",icon:"fa-book"}],e={args:{segments:r}},o={args:{segments:[{label:"Inicio",icon:"fa-home",onClick:()=>{}},{label:"Módulo 2",icon:"fa-robot"},{label:"ChatGPT",icon:"fa-code"}]}},s={args:{segments:r,separator:"›",size:"text-sm"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    segments: sampleSegments
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    segments: [{
      label: 'Inicio',
      icon: 'fa-home',
      onClick: () => {}
    }, {
      label: 'Módulo 2',
      icon: 'fa-robot'
    }, {
      label: 'ChatGPT',
      icon: 'fa-code'
    }]
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    segments: sampleSegments,
    separator: '›',
    size: 'text-sm'
  }
}`,...s.parameters?.docs?.source}}};const d=["Default","ThreeLevels","CustomSeparator"];export{s as CustomSeparator,e as Default,o as ThreeLevels,d as __namedExportsOrder,p as default};
