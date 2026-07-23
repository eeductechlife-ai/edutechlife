import{B as t}from"./BadgeCard-1FSje-dW.js";import{B as a}from"./ialab-uFly0nZp.js";import"./jsx-runtime-BiUtJA2d.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-pP6CS22B.js";import"./index-uFCH20xC.js";import"./proxy-kvGusxNo.js";import"./I18nProvider-DVs6NFH8.js";const u={title:"IALab/Gamification/BadgeCard",component:t,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{earned:{control:"boolean"},isNewlyEarned:{control:"boolean"},dateEarned:{control:"date"},onClick:{action:"clicked"}}},e=Object.keys(a),r={args:{badge:{id:e[0],...a[e[0]]},earned:!0,dateEarned:new Date().toISOString(),isNewlyEarned:!1}},n={args:{badge:{id:e[1],...a[e[1]]},earned:!0,dateEarned:new Date().toISOString(),isNewlyEarned:!0}},s={args:{badge:{id:e[2],...a[e[2]]},earned:!1,dateEarned:null,isNewlyEarned:!1}},d={args:{badge:{id:"first_lesson",...a.first_lesson},earned:!0,dateEarned:"2026-01-15T10:30:00Z",isNewlyEarned:!1}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    badge: {
      id: badgeKeys[0],
      ...BADGE_INFO[badgeKeys[0]]
    },
    earned: true,
    dateEarned: new Date().toISOString(),
    isNewlyEarned: false
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    badge: {
      id: badgeKeys[1],
      ...BADGE_INFO[badgeKeys[1]]
    },
    earned: true,
    dateEarned: new Date().toISOString(),
    isNewlyEarned: true
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    badge: {
      id: badgeKeys[2],
      ...BADGE_INFO[badgeKeys[2]]
    },
    earned: false,
    dateEarned: null,
    isNewlyEarned: false
  }
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    badge: {
      id: 'first_lesson',
      ...BADGE_INFO['first_lesson']
    },
    earned: true,
    dateEarned: '2026-01-15T10:30:00Z',
    isNewlyEarned: false
  }
}`,...d.parameters?.docs?.source}}};const y=["Earned","NewlyEarned","Locked","FirstLesson"];export{r as Earned,d as FirstLesson,s as Locked,n as NewlyEarned,y as __namedExportsOrder,u as default};
