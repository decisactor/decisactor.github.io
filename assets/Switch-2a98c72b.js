import{c as h,_,b as s,t as n,g as a,j as r,n as i,o}from"./index-eba71058.js";const g={data(){return{left:0,color:h}},computed:{style(){return{float:this.float,height:`${this.height}px`,width:`${this.width*2}px`,backgroundColor:this.color,border:`1px solid ${this.color}`}}},props:{_on:{},off:{},float:{},margin:{},padding:{},width:{default:16},height:{default:16}},methods:{click(l){return this.left=this.left?0:this.width,this.color=this.color=="lightgray"?h:"lightgray",this.$emit("switch",this.left?this.off:this._on,this._on,this.off),l}},emits:["switch"]};const u={key:0,class:"on"},m={key:1,class:"off"};function y(l,c,t,w,f,e){return o(),s("section",{class:"switches",style:i({padding:`${t.padding}px`,margin:`${t.margin}px`})},[t._on?(o(),s("span",u,n(t._on),1)):a("",!0),r("section",{class:"switch",style:i(e.style),onClick:c[0]||(c[0]=(...d)=>e.click&&e.click(...d))},[r("section",{class:"center",style:i({width:`${t.width}px`,height:`${t.height}px`,left:`${f.left}px`})},null,4)],4),t.off?(o(),s("span",m,n(t.off),1)):a("",!0)],4)}const k=_(g,[["render",y]]);export{k as default};
