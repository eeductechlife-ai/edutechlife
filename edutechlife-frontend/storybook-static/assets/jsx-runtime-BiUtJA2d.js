import{g as l}from"./_commonjsHelpers-Cpj98o6Y.js";import{r as _}from"./index-pP6CS22B.js";function c(o,r){for(var s=0;s<r.length;s++){const e=r[s];if(typeof e!="string"&&!Array.isArray(e)){for(const t in e)if(t!=="default"&&!(t in o)){const n=Object.getOwnPropertyDescriptor(e,t);n&&Object.defineProperty(o,t,n.get?n:{enumerable:!0,get:()=>e[t]})}}}return Object.freeze(Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}},f={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var m=_,y=Symbol.for("react.element"),d=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,j=m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,O={key:!0,ref:!0,__self:!0,__source:!0};function i(o,r,s){var e,t={},n=null,u=null;s!==void 0&&(n=""+s),r.key!==void 0&&(n=""+r.key),r.ref!==void 0&&(u=r.ref);for(e in r)x.call(r,e)&&!O.hasOwnProperty(e)&&(t[e]=r[e]);if(o&&o.defaultProps)for(e in r=o.defaultProps,r)t[e]===void 0&&(t[e]=r[e]);return{$$typeof:y,type:o,key:n,ref:u,props:t,_owner:j.current}}f.Fragment=d;f.jsx=i;f.jsxs=i;p.exports=f;var a=p.exports;const g=l(a),R=c({__proto__:null,default:g},[a]);export{a,R as j};
