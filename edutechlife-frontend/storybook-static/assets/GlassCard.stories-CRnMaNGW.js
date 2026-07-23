import{a as e}from"./jsx-runtime-BiUtJA2d.js";import{r as N}from"./index-pP6CS22B.js";import{m as c}from"./proxy-kvGusxNo.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l=N.memo(({children:d,className:p="",hover:u=!1,padding:x="lg",as:n="div",animate:g=!1,delay:f=0,...i})=>{const m=`
    relative overflow-hidden
    bg-white/85 backdrop-blur-xl
    border border-[#E2E8F0]/60
    shadow-[0_4px_24px_rgba(0,75,99,0.04)]
    rounded-2xl
    transition-all duration-300 ease-out
    ${u?"hover:shadow-[0_8px_40px_rgba(0,75,99,0.08)] hover:border-[#4DA8C4]/30":""}
    ${{sm:"p-4",md:"p-6",lg:"p-8",xl:"p-10"}[x]}
    ${p}
  `.trim().replace(/\s+/g," "),h=c[n]||c.div;if(g)return e.jsx(h,{className:m,initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4,delay:f,ease:[.25,.46,.45,.94]},...i,children:d});const v=n;return e.jsx(v,{className:m,...i,children:d})});l.displayName="GlassCard";l.__docgenInfo={description:"",methods:[],displayName:"GlassCard",props:{className:{defaultValue:{value:"''",computed:!1},required:!1},hover:{defaultValue:{value:"false",computed:!1},required:!1},padding:{defaultValue:{value:"'lg'",computed:!1},required:!1},as:{defaultValue:{value:"'div'",computed:!1},required:!1},animate:{defaultValue:{value:"false",computed:!1},required:!1},delay:{defaultValue:{value:"0",computed:!1},required:!1}}};const w={title:"UI/GlassCard",component:l,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{padding:{control:"select",options:["sm","md","lg","xl"]},hover:{control:"boolean"},animate:{control:"boolean"},delay:{control:{type:"number",min:0,max:1,step:.1}}}},a={args:{children:e.jsxs("div",{className:"w-64",children:[e.jsx("p",{className:"text-petroleum font-medium",children:"Contenido de la tarjeta"}),e.jsx("p",{className:"text-slate-500 text-sm mt-2",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit."})]}),padding:"lg"}},t={args:{...a.args,hover:!0}},s={args:{...a.args,animate:!0,delay:.2}},r={args:{children:e.jsxs("div",{className:"w-48 text-center",children:[e.jsx("p",{className:"text-petroleum font-bold text-lg",children:"42"}),e.jsx("p",{className:"text-slate-500 text-xs",children:"Completed"})]}),padding:"sm"}},o={args:{children:e.jsxs("div",{className:"w-80",children:[e.jsx("h3",{className:"text-xl font-black text-petroleum",children:"Premium Card"}),e.jsx("p",{className:"text-slate-500 mt-2",children:"With extra large padding for featured content that needs more breathing room."})]}),padding:"xl",hover:!0,animate:!0}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="w-64"><p className="text-petroleum font-medium">Contenido de la tarjeta</p><p className="text-slate-500 text-sm mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p></div>,
    padding: 'lg'
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    hover: true
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    animate: true,
    delay: 0.2
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="w-48 text-center"><p className="text-petroleum font-bold text-lg">42</p><p className="text-slate-500 text-xs">Completed</p></div>,
    padding: 'sm'
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="w-80"><h3 className="text-xl font-black text-petroleum">Premium Card</h3><p className="text-slate-500 mt-2">With extra large padding for featured content that needs more breathing room.</p></div>,
    padding: 'xl',
    hover: true,
    animate: true
  }
}`,...o.parameters?.docs?.source}}};const E=["Default","WithHover","Animated","Small","ExtraLarge"];export{s as Animated,a as Default,o as ExtraLarge,r as Small,t as WithHover,E as __namedExportsOrder,w as default};
