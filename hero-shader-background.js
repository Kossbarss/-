// Paper Design MeshGradient 0.0.77, matching the supplied component's actual output.
;(function(){
'use strict';
const hero=document.querySelector('.hero');
if(!hero||hero.dataset.paperMeshExact==='true')return;
const probe=document.createElement('canvas');
if(!probe.getContext('webgl2'))return;
const VS=`#version 300 es
precision mediump float;
layout(location=0) in vec4 a_position;
uniform vec2 u_resolution;
out vec2 v_objectUV;
void main(){
 gl_Position=a_position;
 vec2 uv=gl_Position.xy*.5;
 float side=min(u_resolution.x,u_resolution.y);
 v_objectUV=uv*(u_resolution/vec2(side));
}`;
const FS=`#version 300 es
precision mediump float;
uniform float u_time;
uniform vec4 u_colors[10];
uniform float u_colorsCount;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;
in vec2 v_objectUV;
out vec4 fragColor;
vec2 rotate(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
float hash21(vec2 p){p=fract(p*vec2(.3183099,.3678794))+.1;p+=dot(p,p+19.19);return fract(p.x*p.y);}
float valueNoise(vec2 st){vec2 i=floor(st),f=fract(st);float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float noise(vec2 n,vec2 seedOffset){return valueNoise(n+seedOffset);}
vec2 getPosition(int i,float t){float a=float(i)*.37;float b=.6+fract(float(i)/3.)*.9;float c=.8+fract(float(i+1)/4.);return .5+.5*vec2(sin(t*b+a),cos(t*c+a*1.5));}
void main(){
 vec2 uv=v_objectUV;uv+=.5;vec2 grainUV=uv*1000.;
 float grain=noise(grainUV,vec2(0.));float mixerGrain=.4*u_grainMixer*(grain-.5);
 const float firstFrameOffset=41.5;float t=.5*(u_time+firstFrameOffset);
 float radius=smoothstep(0.,1.,length(uv-.5));float center=1.-radius;
 for(float i=1.;i<=2.;i++){uv.x+=u_distortion*center/i*sin(t+i*.4*smoothstep(.0,1.,uv.y))*cos(.2*t+i*2.4*smoothstep(.0,1.,uv.y));uv.y+=u_distortion*center/i*cos(t+i*2.*smoothstep(.0,1.,uv.x));}
 vec2 uvRotated=uv-.5;float angle=3.*u_swirl*radius;uvRotated=rotate(uvRotated,-angle)+.5;
 vec3 color=vec3(0.);float opacity=0.;float totalWeight=0.;
 for(int i=0;i<10;i++){if(i>=int(u_colorsCount))break;vec2 pos=getPosition(i,t)+mixerGrain;vec3 colorFraction=u_colors[i].rgb*u_colors[i].a;float opacityFraction=u_colors[i].a;float dist=length(uvRotated-pos);dist=pow(dist,3.5);float weight=1./(dist+1e-3);color+=colorFraction*weight;opacity+=opacityFraction*weight;totalWeight+=weight;}
 color/=max(1e-4,totalWeight);opacity/=max(1e-4,totalWeight);
 float grainOverlay=valueNoise(rotate(grainUV,1.)+vec2(3.));grainOverlay=mix(grainOverlay,valueNoise(rotate(grainUV,2.)+vec2(-1.)),.5);grainOverlay=pow(grainOverlay,1.3);
 float grainOverlayV=grainOverlay*2.-1.;vec3 grainOverlayColor=vec3(step(0.,grainOverlayV));float grainOverlayStrength=u_grainOverlay*abs(grainOverlayV);grainOverlayStrength=pow(grainOverlayStrength,.8);color=mix(color,grainOverlayColor,.35*grainOverlayStrength);opacity+=.5*grainOverlayStrength;opacity=clamp(opacity,0.,1.);fragColor=vec4(color,opacity);
}`;
function rgb(hex){const h=hex.slice(1);return[parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255,1];}
function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const m=gl.getShaderInfoLog(s)||'compile error';gl.deleteShader(s);throw new Error(m);}return s;}
function program(gl){const v=shader(gl,gl.VERTEX_SHADER,VS),f=shader(gl,gl.FRAGMENT_SHADER,FS),p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'link error');return p;}
function layer(host,colors,speed){
 const c=document.createElement('canvas');c.style.cssText='display:block;width:100%;height:100%';c.setAttribute('aria-hidden','true');host.appendChild(c);
 const gl=c.getContext('webgl2',{alpha:true,antialias:false});if(!gl)throw new Error('WebGL2 unavailable');const p=program(gl);gl.useProgram(p);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 const loc=n=>gl.getUniformLocation(p,n),L={time:loc('u_time'),res:loc('u_resolution'),colors:loc('u_colors[0]'),count:loc('u_colorsCount'),dist:loc('u_distortion'),swirl:loc('u_swirl'),mix:loc('u_grainMixer'),overlay:loc('u_grainOverlay')};
 gl.uniform4fv(L.colors,new Float32Array(colors.flatMap(rgb)));gl.uniform1f(L.count,colors.length);gl.uniform1f(L.dist,.8);gl.uniform1f(L.swirl,.1);gl.uniform1f(L.mix,0);gl.uniform1f(L.overlay,0);
 let w=0,h=0,frame=0,last=performance.now(),raf=0,active=true,dead=false;
 function resize(){const r=host.getBoundingClientRect(),d=Math.max(1,window.devicePixelRatio||1),scale=Math.max(d,2);let nw=Math.max(1,Math.round(r.width*scale)),nh=Math.max(1,Math.round(r.height*scale));const max=1920*1080*4,pix=nw*nh;if(pix>max){const cap=Math.sqrt(max/pix);nw=Math.round(nw*cap);nh=Math.round(nh*cap);}if(nw===w&&nh===h)return;w=nw;h=nh;c.width=w;c.height=h;gl.viewport(0,0,w,h);gl.useProgram(p);gl.uniform2f(L.res,w,h);}
 function draw(now){if(dead||!active)return;frame+=(now-last)*speed;last=now;resize();gl.useProgram(p);gl.uniform1f(L.time,frame*.001);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,6);raf=requestAnimationFrame(draw);}
 function setActive(v){if(dead||v===active)return;active=v;if(v){last=performance.now();raf=requestAnimationFrame(draw);}else{cancelAnimationFrame(raf);raf=0;}}
 resize();raf=requestAnimationFrame(draw);return{resize,setActive,dispose(){dead=true;cancelAnimationFrame(raf);gl.deleteBuffer(b);gl.deleteProgram(p);c.remove();}};
}
const mount=document.createElement('div');mount.className='hero-paper-exact-shaders';mount.setAttribute('aria-hidden','true');mount.style.cssText='position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:#000';
const base=document.createElement('div'),over=document.createElement('div');base.style.cssText='position:absolute;inset:0';over.style.cssText='position:absolute;inset:0;opacity:.6';mount.append(base,over);hero.prepend(mount);
let layers=[];try{layers=[layer(base,['#000000','#06b6d4','#0891b2','#164e63','#f97316'],.3),layer(over,['#000000','#ffffff','#06b6d4','#f97316'],.2)];}catch(e){layers.forEach(x=>x.dispose());mount.remove();console.error('Paper MeshGradient failed',e);return;}
const style=document.createElement('style');style.dataset.feature='hero-paper-mesh-exact-077';style.textContent='.hero.hero-paper-mesh-exact{background:#000!important;isolation:isolate}.hero.hero-paper-mesh-exact>.hero-glow{display:none!important}.hero.hero-paper-mesh-exact>.container{position:relative;z-index:1}.hero.hero-paper-mesh-exact .hero-panorama-fade--left{background:linear-gradient(90deg,#000 3%,transparent 100%)}.hero.hero-paper-mesh-exact .hero-panorama-fade--right{background:linear-gradient(270deg,#000 3%,transparent 100%)}';document.head.appendChild(style);hero.classList.add('hero-paper-mesh-exact');hero.dataset.paperMeshExact='true';
const ro='ResizeObserver'in window?new ResizeObserver(()=>layers.forEach(x=>x.resize())):null;ro&&ro.observe(hero);
const io='IntersectionObserver'in window?new IntersectionObserver(e=>layers.forEach(x=>x.setActive(Boolean(e[0]&&e[0].isIntersecting)&&!document.hidden)),{threshold:.01}):null;io&&io.observe(hero);
document.addEventListener('visibilitychange',()=>layers.forEach(x=>x.setActive(!document.hidden&&hero.getBoundingClientRect().bottom>0)));
})();
