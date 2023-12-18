import*as e from"https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.module.min.js";function t(e,t,i,s,o){return(e-t)*(o-s)/(i-t)+s}!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const i of e)if("childList"===i.type)for(const e of i.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const i="attribute vec3 position;uniform vec2 px;uniform vec2 bSpace;varying vec2 uv;precision highp float;void main(){vec3 pos = position;vec2 scale = 1. - bSpace * 2.;pos.xy = pos.xy * scale;uv = vec2(0.5)+(pos.xy)*0.5;gl_Position = vec4(pos, 1.);}",s="precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;vec2 spot_new = uv;vec2 vel_old = texture2D(velocity, uv).xy;vec2 spot_old = spot_new - vel_old * dt * ratio;vec2 vel_new1 = texture2D(velocity, spot_old).xy;vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;vec2 error = spot_new2 - spot_new;vec2 spot_new3 = spot_new - error / 2.;vec2 vel_2 = texture2D(velocity, spot_new3).xy;vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;vec2 newVel2 = texture2D(velocity, spot_old2).xy;gl_FragColor = vec4(newVel2, 0., 0.);}";const o=new class{constructor(){this.w=null,this.h=null,this.t=0,this.d=0,this.scene=new e.Scene,this.camera=new e.Camera,this.camera.position.z=2}init(){this.pRatio=Math.min(window.devicePixelRatio,2),this.resize(),this.rd=new e.WebGLRenderer({antialias:!0,powerPreference:"high-performance",alpha:!0,canvas:document.querySelector("#canvas")}),this.rd.autoClear=!1,this.rd.setSize(this.w,this.h),this.rd.setClearColor(0),this.rd.setPixelRatio(this.pRatio),this.rd.outputEncoding=e.sRGBEncoding,this.clock=new e.Clock,this.clock.start()}resize(){this.w=document.documentElement.clientWidth,this.h=window.innerHeight,this.rd&&this.rd.setSize(this.w,this.h)}update(){this.d=this.clock.getDelta(),this.t+=this.d}};const c=new class{constructor(){this.coord=new e.Vector2,this.coord_old=new e.Vector2,this.diff=new e.Vector2,this.count=0}init(){document.querySelector("#canvas").addEventListener("mousemove",this.onMouseMove.bind(this),!1),document.body.addEventListener("touchstart",this.onTouchStart.bind(this),!1),document.body.addEventListener("touchmove",this.onTouchMove.bind(this),!1)}setCoords(e,t){this.coord.set(e/o.w*2-1,-t/o.h*2+1)}onMouseMove(e){const t=document.querySelector("#canvas").getBoundingClientRect();this.setCoords(e.clientX-t.left,e.clientY-t.top)}onTouchStart(e){1===e.touches.length&&this.setCoords(e.touches[0].pageX,e.touches[0].pageY)}onTouchMove(e){1===e.touches.length&&this.setCoords(e.touches[0].pageX,e.touches[0].pageY)}update(){this.diff.subVectors(this.coord,this.coord_old),this.coord_old.copy(this.coord),0===this.coord_old.x&&0===this.coord_old.y&&this.diff.set(0,0),o.camera.rotation.y=this.coord_old.x*Math.PI*.02,o.camera.rotation.x=-this.coord_old.y*Math.PI*.02}};class r{constructor(e){var t;this.ps=e,this.us=null==(t=this.ps.material)?void 0:t.uniforms}init(){this.scene=new e.Scene,this.camera=new e.Camera,this.us&&(this.mat=new e.RawShaderMaterial(this.ps.material),this.geo=new e.PlaneGeometry(2.5,2.5),this.plane=new e.Mesh(this.geo,this.mat),this.scene.add(this.plane))}update(){o.rd.setRenderTarget(this.ps.output),o.rd.render(this.scene,this.camera),o.rd.setRenderTarget(null)}}class n extends r{constructor(e){super({material:{vertexShader:i,fragmentShader:s,uniforms:{bSpace:{value:e.ceScale},px:{value:e.ceScale},fboSize:{value:e.fboSize},velocity:{value:e.src.texture},dt:{value:e.dt}}},output:e.dst}),this.init()}init(){super.init(),this.createBoundary()}createBoundary(){const t=new e.BufferGeometry,i=new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]);t.setAttribute("position",new e.BufferAttribute(i,3));const o=new e.RawShaderMaterial({vertexShader:"attribute vec3 position;varying vec2 uv;uniform vec2 px;precision highp float;void main(){vec3 pos = position;uv = 0.5 + pos.xy * 0.5;vec2 n = sign(pos.xy);pos.xy = abs(pos.xy) - px * 1.;pos.xy *= n;gl_Position = vec4(pos, 1.);}",fragmentShader:s,uniforms:this.us});this.line=new e.LineSegments(t,o),this.scene.add(this.line)}update({dt:e,isB:t}){this.us.dt.value=e,this.line.visible=t,super.update()}}class a extends r{constructor(e){super({material:{vertexShader:i,fragmentShader:"precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0 = texture2D(velocity, uv-vec2(px.x, 0)).x;float x1 = texture2D(velocity, uv+vec2(px.x, 0)).x;float y0 = texture2D(velocity, uv-vec2(0, px.y)).y;float y1 = texture2D(velocity, uv+vec2(0, px.y)).y;float divergence = (x1-x0 + y1-y0) / 2.;gl_FragColor = vec4(divergence / dt);}",uniforms:{bSpace:{value:e.bSpace},velocity:{value:e.src.texture},px:{value:e.ceScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update({vel:e}){this.us.velocity.value=e.texture,super.update()}}class v extends r{constructor(e){super({output:e.dst}),this.init(e)}init(i){super.init();const s=new e.PlaneGeometry(1,1),o=new e.RawShaderMaterial({vertexShader:"precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos = position.xy * scale * 2. * px + center;vUv = uv;gl_Position = vec4(pos, 0., 1.);}",fragmentShader:"precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 circle = (vUv - 0.5) * 2.;float d = 1.-min(length(circle), 1.);d *= d;gl_FragColor = vec4(force * d, 0, 1);}",blending:e.AdditiveBlending,uniforms:{px:{value:i.ceScale},force:{value:new e.Vector2(0,0)},center:{value:new e.Vector2(0,0)},scale:{value:new e.Vector2(i.csize*t(window.innerWidth,320,1440,.5,1),i.csize*t(window.innerWidth,320,1440,.5,1))}}});this.mouse=new e.Mesh(s,o),this.scene.add(this.mouse)}update(e){const i=c.diff.x/2*e.mouse_force,s=c.diff.y/2*e.mouse_force,o=e.csize*t(window.innerWidth,320,1440,.5,1)*e.ceScale.x,r=e.csize*t(window.innerWidth,320,1440,.5,1)*e.ceScale.y,n=Math.min(Math.max(c.coord.x,-1+o+2*e.ceScale.x),1-o-2*e.ceScale.x),a=Math.min(Math.max(c.coord.y,-1+r+2*e.ceScale.y),1-r-2*e.ceScale.y),v=this.mouse.material.uniforms;v.force.value.set(i,s),v.center.value.set(n,a),v.scale.value.set(e.csize*t(window.innerWidth,320,1440,.5,1),e.csize*t(window.innerWidth,320,1440,.5,1)),super.update()}}class l extends r{constructor(e){super({material:{vertexShader:i,fragmentShader:"precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0 = texture2D(pressure, uv+vec2(px.x * 2.,  0)).r;float p1 = texture2D(pressure, uv-vec2(px.x * 2., 0)).r;float p2 = texture2D(pressure, uv+vec2(0, px.y * 2. )).r;float p3 = texture2D(pressure, uv-vec2(0, px.y * 2. )).r;float div = texture2D(divergence, uv).r;float newP = (p0 + p1 + p2 + p3) / 4. - div;gl_FragColor = vec4(newP);}",uniforms:{bSpace:{value:e.bSpace},pressure:{value:e.dst_.texture},divergence:{value:e.src.texture},px:{value:e.ceScale}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update({iterations:e}){let t,i;for(var s=0;s<e;s++)s%2==0?(t=this.ps.output0,i=this.ps.output1):(t=this.ps.output1,i=this.ps.output0),this.us.pressure.value=t.texture,this.ps.output=i,super.update();return i}}class u extends r{constructor(e){super({material:{vertexShader:i,fragmentShader:"precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float step = 1.;float p0 = texture2D(pressure, uv+vec2(px.x * step, 0)).r;float p1 = texture2D(pressure, uv-vec2(px.x * step, 0)).r;float p2 = texture2D(pressure, uv+vec2(0, px.y * step)).r;float p3 = texture2D(pressure, uv-vec2(0, px.y * step)).r;vec2 v = texture2D(velocity, uv).xy;vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;v = v - gradP * dt;gl_FragColor = vec4(v, 0., 1.);}",uniforms:{bSpace:{value:e.bSpace},pressure:{value:e.src_p.texture},velocity:{value:e.src_v.texture},px:{value:e.ceScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update({vel:e,pressure:t}){this.us.velocity.value=e.texture,this.us.pressure.value=t.texture,super.update()}}class p extends r{constructor(e){super({material:{vertexShader:i,fragmentShader:"precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 old = texture2D(velocity, uv).xy;vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2., 0)).xy;vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2., 0)).xy;vec2 new2 = texture2D(velocity_new, uv + vec2(0, px.y * 2.)).xy;vec2 new3 = texture2D(velocity_new, uv - vec2(0, px.y * 2.)).xy;vec2 new = 4. * old + v * dt * (new0 + new1 + new2 + new3);new /= 4. * (1. + v * dt);gl_FragColor = vec4(new, 0., 0.);}",uniforms:{bSpace:{value:e.bSpace},velocity:{value:e.src.texture},velocity_new:{value:e.dst_.texture},v:{value:e.viscous},px:{value:e.ceScale},dt:{value:e.dt}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update({viscous:e,iterations:t,dt:i}){let s,o;this.us.v.value=e;for(var c=0;c<t;c++)c%2==0?(s=this.ps.output0,o=this.ps.output1):(s=this.ps.output1,o=this.ps.output0),this.us.velocity_new.value=s.texture,this.ps.output=o,this.us.dt.value=i,super.update();return o}}class d{constructor(t){this.props=t,this.fbos={vel_0:null,vel_1:null,vel_viscous0:null,vel_viscous1:null,div:null,pressure_0:null,pressure_1:null},this.options={iPois:16,iVis:16,mForce:40,res:.5,csize:60,viscous:500,isB:!1,dt:.004,isViscous:!1},this.fboSize=new e.Vector2,this.ceScale=new e.Vector2,this.bSpace=new e.Vector2,this.init()}init(){this.calcSize(),this.createFBOs(),this.createShaderPass()}createFBOs(){const t=/(iPad|iPhone|iPod)/g.test(navigator.userAgent)?e.HalfFloatType:e.FloatType;for(let i in this.fbos)this.fbos[i]=new e.WebGLRenderTarget(this.fboSize.x,this.fboSize.y,{type:t})}createShaderPass(){this.advection=new n({ceScale:this.ceScale,fboSize:this.fboSize,dt:this.options.dt,src:this.fbos.vel_0,dst:this.fbos.vel_1}),this.externalForce=new v({ceScale:this.ceScale,csize:this.options.csize*t(window.innerWidth,320,1440,.5,1),dst:this.fbos.vel_1}),this.viscous=new p({ceScale:this.ceScale,bSpace:this.bSpace,viscous:this.options.viscous,src:this.fbos.vel_1,dst:this.fbos.vel_viscous1,dst_:this.fbos.vel_viscous0,dt:this.options.dt}),this.divergence=new a({ceScale:this.ceScale,bSpace:this.bSpace,src:this.fbos.vel_viscous0,dst:this.fbos.div,dt:this.options.dt}),this.poisson=new l({ceScale:this.ceScale,bSpace:this.bSpace,src:this.fbos.div,dst:this.fbos.pressure_1,dst_:this.fbos.pressure_0}),this.pre=new u({ceScale:this.ceScale,bSpace:this.bSpace,src_p:this.fbos.pressure_0,src_v:this.fbos.vel_viscous0,dst:this.fbos.vel_0,dt:this.options.dt})}calcSize(){const e=Math.round(this.options.res*o.w),t=Math.round(this.options.res*o.h),i=1/e,s=1/t;this.ceScale.set(i,s),this.fboSize.set(e,t)}resize(){this.calcSize();for(let e in this.fbos)this.fbos[e].setSize(this.fboSize.x,this.fboSize.y)}update(){this.bSpace.copy(this.ceScale),this.advection.update(this.options),this.externalForce.update({csize:this.options.csize*t(window.innerWidth,320,1440,.5,1),mouse_force:this.options.mForce,ceScale:this.ceScale});let e=this.fbos.vel_1;this.options.isViscous&&(e=this.viscous.update({viscous:this.options.viscous,iterations:this.options.iVis,dt:this.options.dt})),this.divergence.update({vel:e});const i=this.poisson.update({iterations:this.options.iPois});this.pre.update({vel:e,pressure:i})}}class h{constructor(){this.init()}init(){this.sim=new d,this.scene=o.scene,this.camera=o.camera,this.mat=new e.RawShaderMaterial({vertexShader:i,fragmentShader:"precision highp float;uniform sampler2D velocity;uniform float uT;\nvarying vec2 uv;\n#ifndef PI\n#define PI 3.14159265359\n#endif\n#ifndef TAU\n#define TAU 6.28318530718\n#endif\nfloat remap(float v, float iMin, float iMax, float oMin, float oMax) {return oMin + (v - iMin) * (oMax - oMin) / (iMax - iMin);}const float DUR = 4.;const float FTIME = 0.75;vec3 getC(vec3 cs[3],int id) {for (int i=0; i<3; i++) {if (i == id) return cs[i];}}\nvoid main(){vec3 cs[3];vec3 yCol = vec3(0.992,0.631,0.11);vec3 rCol = vec3(0.914,0.082,0.2);vec3 gCol = vec3(0.408,0.765,0.714);cs[0] = yCol;cs[1] = rCol;cs[2] = gCol;float tCyc = mod(uT, 3. * DUR);float seg = tCyc / DUR;int cIdx = int(seg);int nextIdx = int(mod(seg + 1., 3.));float fFac = fract(seg);if (fFac >= (1. - (FTIME / DUR))) {fFac = clamp(remap(fFac, 1. - (FTIME / DUR), 1., 0., 1.), 0., 1.);} else {fFac = 0.;}vec3 fCol = vec3(1.);float whFac = clamp(1. - 4. * (fFac - 0.5) * (fFac - 0.5), 0., 1.);vec3 cCol = mix(getC(cs, cIdx), getC(cs, nextIdx), clamp(fFac,0.,1.));cCol = mix(cCol, fCol, whFac);vec3 velocityColor = texture2D(velocity, uv).xyz;float strength = length(velocityColor);\n// ONLY YELLOW UNCOMMENT BELOW\ncCol = yCol;\ngl_FragColor = vec4(mix(vec3(0.), cCol, clamp(pow(strength, 7.), 0., 1.)), 1.);\n}\n",uniforms:{velocity:{value:this.sim.fbos.vel_0.texture},uT:{value:0},bSpace:{value:new e.Vector2}}}),this.o=new e.Mesh(new e.PlaneGeometry(2.5,2.5),this.mat),this.scene.add(this.o)}resize(){this.sim.resize()}render(){o.rd.setRenderTarget(null),o.rd.render(this.scene,this.camera)}update(){this.mat.uniforms.uT.value=o.clock.getElapsedTime(),this.sim.update(),this.render()}}class x{constructor(e){this.props=e}init(){const t=new Float32Array(3*this.props.count),i=new Float32Array(this.props.count);for(let e=0;e<this.props.count;e++)t[3*e+0]=1*(2*Math.random()-1),t[3*e+1]=1*(2*Math.random()-1),t[3*e+2]=.5*Math.random()+.5,i[e]=3;this.geo=new e.BufferGeometry,this.geo.setAttribute("position",new e.BufferAttribute(t,3)),this.geo.setAttribute("size",new e.BufferAttribute(i,1)),this.us={uT:{value:0}},this.mat=new e.ShaderMaterial({uniforms:this.us,transparent:!0,blending:e.AdditiveBlending,depthTest:!1,vertexShader:"vec4 pe(vec4 x){return mod(((x*34.)+1.)*x, 289.);}vec4 tay(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}float sn(vec3 v){const vec2  C = vec2(1./6., 1./3.) ;const vec4  D = vec4(0., 0.5, 1., 2.);vec3 i  = floor(v + dot(v, C.yyy) );vec3 x0 =   v - i + dot(i, C.xxx) ;vec3 g = step(x0.yzx, x0.xyz);vec3 l = 1. - g;vec3 i1 = min( g.xyz, l.zxy );vec3 i2 = max( g.xyz, l.zxy );vec3 x1 = x0 - i1 + 1. * C.xxx;vec3 x2 = x0 - i2 + 2. * C.xxx;vec3 x3 = x0 - 1. + 3. * C.xxx;i = mod(i, 289. );vec4 p = pe( pe( pe(  i.z + vec4(0., i1.z, i2.z, 1. ))+ i.y + vec4(0., i1.y, i2.y, 1. ))+ i.x + vec4(0., i1.x, i2.x, 1. ));float n_ = 1./7.;vec3  ns = n_ * D.wyz - D.xzx;vec4 j = p - 49. * floor(p * ns.z *ns.z);vec4 x_ = floor(j * ns.z);vec4 y_ = floor(j - 7. * x_ );vec4 x = x_ *ns.x + ns.yyyy;vec4 y = y_ *ns.x + ns.yyyy;vec4 h = 1. - abs(x) - abs(y);vec4 b0 = vec4( x.xy, y.xy );vec4 b1 = vec4( x.zw, y.zw );vec4 s0 = floor(b0)*2. + 1.;vec4 s1 = floor(b1)*2. + 1.;vec4 sh = -step(h, vec4(0.));vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;vec3 p0 = vec3(a0.xy,h.x);vec3 p1 = vec3(a0.zw,h.y);vec3 p2 = vec3(a1.xy,h.z);vec3 p3 = vec3(a1.zw,h.w);vec4 norm = tay(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));p0 *= norm.x;p1 *= norm.y;p2 *= norm.z;p3 *= norm.w;vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);m = m * m;return 42. * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );}\nuniform float uT;attribute float size;varying vec3 vPos;\nvoid main() {vec3 cPos = vec3(position.x +  sin(sn(position + uT * 0.01) + sn(position + uT * 0.1)),  position.y + cos(sn(position + uT * 0.2)) - 1., position.z);vec4 mvPos = modelViewMatrix * vec4( cPos, 1. );vPos = position;gl_PointSize = size * ( 1. / -mvPos.z );gl_Position = projectionMatrix * mvPos;}\n",fragmentShader:" precision highp float;\n#ifndef PI\n#define PI 3.14159265359\n#endif\n#ifndef TAU\n#define TAU 6.28318530718\n#endif\nfloat remap(float v, float iMin, float iMax, float oMin, float oMax) {return oMin + (v - iMin) * (oMax - oMin) / (iMax - iMin);}const float DUR = 4.;const float FTIME = 0.75;vec3 getC(vec3 cs[3],int id) {for (int i=0; i<3; i++) {if (i == id) return cs[i];}}vec4 pe(vec4 x){return mod(((x*34.)+1.)*x, 289.);}vec4 tay(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}float sn(vec3 v){const vec2  C = vec2(1./6., 1./3.) ;const vec4  D = vec4(0., 0.5, 1., 2.);vec3 i  = floor(v + dot(v, C.yyy) );vec3 x0 =   v - i + dot(i, C.xxx) ;vec3 g = step(x0.yzx, x0.xyz);vec3 l = 1. - g;vec3 i1 = min( g.xyz, l.zxy );vec3 i2 = max( g.xyz, l.zxy );vec3 x1 = x0 - i1 + 1. * C.xxx;vec3 x2 = x0 - i2 + 2. * C.xxx;vec3 x3 = x0 - 1. + 3. * C.xxx;i = mod(i, 289. );vec4 p = pe( pe( pe(           i.z + vec4(0., i1.z, i2.z, 1. ))         + i.y + vec4(0., i1.y, i2.y, 1. ))         + i.x + vec4(0., i1.x, i2.x, 1. ));float n_ = 1./7.;vec3  ns = n_ * D.wyz - D.xzx;vec4 j = p - 49. * floor(p * ns.z *ns.z);vec4 x_ = floor(j * ns.z);vec4 y_ = floor(j - 7. * x_ );vec4 x = x_ *ns.x + ns.yyyy;vec4 y = y_ *ns.x + ns.yyyy;vec4 h = 1. - abs(x) - abs(y);vec4 b0 = vec4( x.xy, y.xy );vec4 b1 = vec4( x.zw, y.zw );vec4 s0 = floor(b0)*2. + 1.;vec4 s1 = floor(b1)*2. + 1.;vec4 sh = -step(h, vec4(0.));vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;vec3 p0 = vec3(a0.xy,h.x);vec3 p1 = vec3(a0.zw,h.y);vec3 p2 = vec3(a1.xy,h.z);vec3 p3 = vec3(a1.zw,h.w);vec4 norm = tay(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));p0 *= norm.x;p1 *= norm.y;p2 *= norm.z;p3 *= norm.w;vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);m = m * m;return 42. * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),                              dot(p2,x2), dot(p3,x3) ) );}\nuniform float uT;\nvarying vec3 vPos;\nvoid main() {vec2 st = gl_PointCoord.xy;float r = 4.;vec3 cs[3];vec3 yCol = vec3(0.992,0.631,0.11);vec3 rCol = vec3(0.914,0.082,0.2);vec3 gCol = vec3(0.408,0.765,0.714);cs[0] = yCol;cs[1] = rCol;cs[2] = gCol;float tCyc = mod(uT, 3. * DUR);float seg = tCyc / DUR;int cIdx = int(seg);int nextIdx = int(mod(seg + 1., 3.));float fFac = fract(seg);if (fFac >= (1. - (FTIME / DUR))) {fFac = remap(fFac, 1. - (FTIME / DUR), 1., 0., 1.);} else {fFac = 0.;}vec3 fCol = vec3(1.);float whFac = clamp(1. - 4. * (fFac - 0.5) * (fFac - 0.5), 0., 1.);vec3 cCol = mix(getC(cs, cIdx), getC(cs, nextIdx), clamp(fFac,0.,1.));cCol = mix(cCol, fCol, whFac);\n// ONLY YELLOW UNCOMMENT BELOW\ncCol = yCol;\nfloat dTCenter = distance(st, vec2(0.5)) * r;float circ = clamp(1. - dTCenter, 0., 1.);float op = clamp(pow(circ, 4.) * (sn(vPos + uT) + 1.) , 0., 1.);gl_FragColor = vec4(cCol, op);\n          }\n        "}),this.ps=new e.Points(this.geo,this.mat),this.ps.position.z=1,o.scene.add(this.ps)}update(){this.mat.uniforms.uT.value=o.t}}new class{constructor(e){this.props=e,o.init(),c.init(),this.ps=new x({count:500}),this.ps.init(),this.init(),this.loop(),window.addEventListener("resize",this.resize.bind(this))}init(){this.props.$wrapper.prepend(o.rd.domElement),this.o=new h}resize(){o.resize(),this.o.resize()}render(){c.update(),o.update(),this.ps.update(),this.o.update()}loop(){this.render(),requestAnimationFrame(this.loop.bind(this))}}({$wrapper:document.body});
