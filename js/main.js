'use strict';var _Mathfloor=Math.floor,_NumberisInteger=Number.isInteger;'serviceWorker'in navigator&&navigator.serviceWorker.register('/sw.js').then(function(L){L.onupdatefound=function(){var T=L.installing;T.onstatechange=function(){switch(T.state){case'installed':if(navigator.serviceWorker.controller){var W=document.createElement('div');W.classList.add('sw-notice'),W.setAttribute('data-sw','updated'),W.setAttribute('role','status'),W.setAttribute('aria-live','polite'),W.textContent='Content has been added or updated, refresh to get it!',document.body.appendChild(W)}else{var z=document.createElement('div');z.classList.add('sw-notice'),z.setAttribute('data-sw','offline'),z.setAttribute('role','status'),z.setAttribute('aria-live','polite'),z.textContent='Content is now available offline!',document.body.appendChild(z)}break;case'redundant':console.error('Redundant ServiceWorker');}}}}).catch(function(q){console.error('Error during service worker registration:',q)});var Options=class{constructor(L={}){this.options=L,this._find=(q,T,M)=>{const W=T.split('.'),z=W[0];return q.hasOwnProperty(T)?q[T]:q.hasOwnProperty(z)?'object'==typeof q[z]?(W.shift(),this._find(q[z],W.join('.'),M)):q[z]:M}}get(L,q){return this._find(this.options,L,q)}};function nodeMap(L,q){return Array.prototype.map.call(L,q)}function idleRun(L){if('requestIdleCallback'in window)window.requestIdleCallback(L);else{const q=Date.now();return setTimeout(()=>{L({didTimeout:!1,timeRemaining:()=>{return Math.max(0,50-(Date.now()-q))}})},1)}}function getActiveSlide(){const L=location.hash.split('/');return L.shift(),{section:parseInt(L[0]),slide:parseInt(L[1]),fragment:parseInt(L[2])}}var Matrix=class{constructor(){const L=document.currentScript.src.split('?'),q=L[0];let T={};1<L.length&&(T=buildOptions(L[1])),document.location.search&&(T=buildOptions(document.location.search.substr(1))),this._script=q,this._options=T,this._notes=!1,this._raw={stage:document.querySelector('._stage'),groups:document.querySelectorAll('._stage--group'),slides:document.querySelectorAll('._stage--slide')},this._slides=nodeMap(this._raw.groups,(z)=>{const H=z.querySelectorAll('._stage--slide');return nodeMap(H,(B)=>{const F=B.querySelectorAll('.fragment');return 0===F.length?B:[B].concat(nodeMap(F,(K)=>K))})});const M=document.createElement('div'),W=this._raw.stage;M.classList.add('stage-fright'),W.parentNode.replaceChild(M,W),M.appendChild(W)}get slides(){return this._slides}get stage(){return this._raw.stage}get script(){return this._script}get options(){return this._options}get notes(){return this._notes}set notes(L){return this._notes=L,L}};function buildOptions(L,q){let T=q||{};if(L){const M=`{"${decodeURI(L).replace(/&/g,'","').replace(/=/g,'":"')}"}`,W=JSON.parse(M,(z,H)=>{if(parseFloat(H).toString()===H)return parseFloat(H);try{return JSON.parse(H)}catch(B){return H}return H});T=Object.assign(W,T)}return T}var init=function(){const L=getActiveSlide();(isNaN(L.section)||isNaN(L.slide))&&history.pushState(null,null,`#/${0}/${0}`)},translate=function(L,q,T){const M=document.querySelector('._stage');let W=L,z=q;if(!(L&&q)&&0!==L&&0!==q){const F=getActiveSlide();L||(W=F.section),q||(z=F.slide)}const B=document.querySelector(`[data-slide="${z}"][data-section="${W}"]`).querySelectorAll('.fragment');for(let F=0;F<T;F++)B[F].setAttribute('data-active',!0);M.style.transform=`translateX(${-100*W}vw) translateY(${-100*z}vh)`},nav=class{static next(L){const T=getActiveSlide();let M=T.section,W=T.slide,z=T.fragment;return next(M,W,z,L)}static previous(L){const T=getActiveSlide();let M=T.section,W=T.slide,z=T.fragment;return previous(M,W,z,L)}static left(L){const T=getActiveSlide();let M=T.section,W=T.slide,z=T.fragment;return left(M,W,z,L)}static right(L){const T=getActiveSlide();let M=T.section,W=T.slide,z=T.fragment;return right(M,W,z,L)}static move(L,q,T){return translate(L,q,T)}};function move(L){let q=`#/${L.section}/${L.slide}`;const T=document.querySelector(`[data-slide="${L.slide}"][data-section="${L.section}"]`).querySelectorAll('.fragment[data-active]').length;isNaN(L.fragment)?(updateProgress(L.section,L.slide),translate(L.section,L.slide),0!==T&&(updateProgress(L.section,L.slide,T),L.fragment=T,q+=`/${T}`)):(updateProgress(L.section,L.slide,L.fragment),0!==L.fragment&&(q+=`/${L.fragment}`));const M=L.matrix.slides[L.section][L.slide].length-1;return _NumberisInteger(M)&&isNaN(L.fragment)&&(L.fragment=0),history.pushState(null,null,q),sendMessage(L.matrix.notes,{position:{section:L.section+1,slide:L.slide+1,fragment:L.fragment,fragmentTotal:M,sectionTotal:L.matrix.slides.length,slideTotal:L.matrix.slides[L.section].length}}),sendNotes(L.section,L.slide,L.matrix),{section:L.section,slide:L.slide,fragment:L.fragment}}function right(L,q,T,M){let W=L,z=q;return sendMessage(M.notes,{move:'right'}),W=nextSection(W,M),z>lastSlide(W,M)&&(z=0),move({section:W,slide:z,matrix:M})}function left(L,q,T,M){let W=L,z=q;return sendMessage(M.notes,{move:'left'}),W=previousSection(W),z>lastSlide(W,M)&&(z=0),move({section:W,slide:z,matrix:M})}function previous(L,q,T,M){let W=L,z=q;if(sendMessage(M.notes,{move:'previous'}),Array.isArray(M.slides[W][z])){let H=M.slides[W][z][0].querySelectorAll('.fragment[data-active]');if(H){const B=H.length-1;if(0<=B)return H[B].removeAttribute('data-active'),move({section:W,slide:z,fragment:B,matrix:M})}}return z-=1,0>z&&(W=previousSection(W),z=0===W?0:lastSlide(W,M)),move({section:W,slide:z,matrix:M})}function next(L,q,T,M){let W=L,z=q,H=T;const B=M.slides.length;if(sendMessage(M.notes,{move:'next'}),Array.isArray(M.slides[W][z])){let F=M.slides[W][z][0].querySelector('.fragment:not([data-active])');if(F){const K=M.slides[W][z][0].querySelectorAll('.fragment[data-active]').length+1;return F.setAttribute('data-active',!0),move({section:W,slide:z,fragment:K,matrix:M})}}if(z+=1,H=void 0,z>lastSlide(W,M)){W=nextSection(W,M);let F=lastSlide(W,M);W===B-1&&z>F?z=F:W<=B-1&&(z=0)}return move({section:W,slide:z,fragment:H,matrix:M})}function previousSection(L){let q=L;return q-=1,0>q&&(q=0),q}function nextSection(L,q){let T=L;const M=q.slides.length;return T+=1,T>=M&&(T=M-1),T}function lastSlide(L,q){const M=q.slides[L].length;return M-1}function openNotes(L){const q={go:getActiveSlide()},T=L.slides[q.go.section][q.go.slide].length-1;let M=q.go.fragment;_NumberisInteger(T)&&isNaN(q.go.fragment)&&(M=0);const W={position:{section:q.go.section+1,slide:q.go.slide+1,fragment:M,fragmentTotal:T,sectionTotal:L.slides.length,slideTotal:L.slides[q.go.section].length}},z=window.location;slideMessage(L);const H=window.open(`${z.origin}${z.pathname}?notes=true`,'Stage Fright - Notes','width=1100,height=700');return setTimeout(()=>{sendMessage(H,q),sendMessage(H,W),sendNotes(q.go.section,q.go.slide,L)},1e3),H}function body(){const L=window.location,q=`
<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
<div class="_speaker-notes">
  <!-- Slide Preview -->
  <!-- Current Slide -->
  <div class="_speaker-notes--current">
    <iframe class="_speaker-notes--current-slide" src="${L.origin}${L.pathname}?progress=false&responsive=true&listen=true${L.hash}" frameborder="0" height="1024" width="1280"></iframe>
  </div>

  <!-- Upcoming Slide Slide -->
  <div class="_speaker-notes--upcoming">
    <span class="_speaker-notes--label">Upcoming:</span>
    <iframe class="_speaker-notes--upcoming-slide" src="${L.origin}${L.pathname}?progress=false&responsive=true&listen=true${L.hash}" frameborder="0" height="1024" width="1280"></iframe>
  </div>

  <!-- Controls -->
  <div class="_speaker-notes--controls">
    <div class="controls">
      <div class="controls--time">
        <h4 class="controls--label">Time <span class="controls--reset">Click to Reset</span></h4>
        <div class="timer">
          <span class="timer--hours">00</span><span class="timer--minutes">:00</span><span class="timer--seconds">:00</span>
        </div>
        <div class="clock">
          <span class="clock--value">0:00 AM</span>
        </div>
        <div class="controls--clear"></div>
      </div>
      <div class="controls--position">
        <p class="controls--fragment">Fragment <span class="controls--fragment-current"></span>/<span class="controls--fragment-total"></span></p>

        <p class="controls--slide">Slide <span class="controls--slide-current"></span>/<span class="controls--slide-total"></span></p>

        <p class="controls--section">Section <span class="controls--section-current"></span>/<span class="controls--section-total"></span></p>

      </div>
    </div>
  </div>

  <article class="_speaker-notes--notes">
    <div class="slide-notes">
      <h4 class="slide-notes--label">Notes</h4>
      <div class="slide-notes--content"></div>
    </div>
  </article>

</div>
`;return document.body.innerHTML=q,q}function sendNotes(L,q,T){let M=document.querySelector(`[data-slide="${q}"][data-section="${L}"] ._stage--notes`);return M=M?M.innerHTML:'<p></p>',sendMessage(T.notes,{notes:M}),M}function timing(){function L(){const K=new Date,V=K.getTime()-B.getTime(),D=_Mathfloor(V/3600000),U=_Mathfloor(V/60000%60),G=_Mathfloor(V/1e3%60);T.textContent=K.toLocaleTimeString('en-US',{hour12:!1,hour:'2-digit',minute:'2-digit'}),M.textContent=q(D),W.textContent=`:${q(U)}`,z.textContent=`:${q(G)}`,0>=D?M.setAttribute('data-mute',!0):M.removeAttribute('data-mute'),0>=U?W.setAttribute('data-mute',!0):W.removeAttribute('data-mute')}function q(K){const V=`00${parseInt(K)}`;return V.substring(V.length-2)}const T=document.querySelector('.clock--value'),M=document.querySelector('.timer--hours'),W=document.querySelector('.timer--minutes'),z=document.querySelector('.timer--seconds'),H=document.querySelector('.controls--time');let B=new Date;L();let F=setInterval(L,1e3);H.addEventListener('click',()=>{B=new Date,clearInterval(F),M.textContent=q(0),W.textContent=`:${q(0)}`,z.textContent=`:${q(0)}`,F=setInterval(L,1e3)})}function sendMessage(L,q){const T=window.location;L&&L.postMessage(q,T.origin)}function slideMessage(L){window.addEventListener('message',(q)=>{const T=q.origin||event.originalEvent.origin;return T===window.location.origin?q.data.move?nav[q.data.move](L):void 0:void 0},!1)}function notesMessage(){const L=document.querySelector('._speaker-notes--current-slide'),q=document.querySelector('._speaker-notes--upcoming-slide'),T=document.querySelector('.controls--fragment'),M=document.querySelector('.controls--fragment-current'),W=document.querySelector('.controls--fragment-total'),z=document.querySelector('.controls--slide-current'),H=document.querySelector('.controls--slide-total'),B=document.querySelector('.controls--section-current'),F=document.querySelector('.controls--section-total'),K=document.querySelector('.slide-notes--content'),V=window.opener;sendMessage(V,'Speaker Notes Opened'),document.addEventListener('keydown',(D)=>{(38===D.keyCode||33===D.keyCode||!0===D.shiftKey&&32===D.keyCode)&&sendMessage(V,{move:'previous'}),(40===D.keyCode||34===D.keyCode||32===D.keyCode)&&sendMessage(V,{move:'next'})}),window.addEventListener('message',(D)=>{const U=D.origin||event.originalEvent.origin;if(U===window.location.origin){if(D.data.position&&(z.textContent=D.data.position.slide,H.textContent=D.data.position.slideTotal,B.textContent=D.data.position.section,F.textContent=D.data.position.sectionTotal,_NumberisInteger(D.data.position.fragmentTotal)?(T.setAttribute('data-active',!0),M.textContent=D.data.position.fragment,W.textContent=D.data.position.fragmentTotal):(T.removeAttribute('data-active'),M.textContent=1,W.textContent=1)),D.data.move&&(sendMessage(L.contentWindow,{move:D.data.move}),sendMessage(q.contentWindow,{move:D.data.move})),D.data.go){console.log(D.data.go);let G=`#/${D.data.go.section}/${D.data.go.slide}`;D.data.go.fragment&&(G+=`/${D.data.go.fragment}`),L.src+=G,q.src+=G,sendMessage(q.contentWindow,{move:'next'})}D.data.notes&&(K.innerHTML=D.data.notes)}},!1)}var progress=function(L){idleRun(()=>{const q=document.createElement('nav');q.classList.add('progress');const T=getActiveSlide();let M=0;L.slides.forEach((W)=>{const z=document.createElement('div');z.setAttribute('data-section',M),z.classList.add('progress--section');let H=0;W.forEach((B)=>{const F=document.createElement('a');F.href=`#/${M}/${H}`,F.classList.add('progress--slide'),F.setAttribute('data-slide',H),F.setAttribute('data-section',M),F.setAttribute('tabindex','-1'),F.textContent=`Section ${M}, Slide ${H}`,Array.isArray(B)&&(F.style.opacity=.5,F.setAttribute('data-fragments',B.length-1)),T.section===M&&T.slide===H&&F.setAttribute('data-active','true'),z.appendChild(F),Array.isArray(B)?(B[0].setAttribute('data-slide',H),B[0].setAttribute('data-section',M),T.section===M&&T.slide===H&&B[0].setAttribute('data-active',!0)):(B.setAttribute('data-slide',H),B.setAttribute('data-section',M),T.section===M&&T.slide===H&&B.setAttribute('data-active',!0)),H++}),q.appendChild(z),M++}),!1!==L.options.progress&&document.body.appendChild(q),translate(T.section,T.slide,T.fragment),updateProgress(T.section,T.slide,T.fragment)}),window.addEventListener('hashchange',()=>{const T=getActiveSlide();updateProgress(T.section,T.slide,T.fragment),translate(T.section,T.slide,T.fragment),sendMessage(L.notes,{go:T})})};function updateProgress(L,q,T){const M=document.querySelectorAll('[data-active]:not(.fragment)'),W=document.querySelectorAll(`[data-section="${L}"][data-slide="${q}"`),z=document.querySelector('.progress--slide[data-active]');if(z)if(T){const H=parseInt(z.getAttribute('data-fragments'));T===H?(z.style.transitionProperty='none',z.style.opacity=1):(z.style.transitionProperty='none',z.style.opacity=.5)}else z.style.transitionProperty='all',nodeMap(M,(H)=>{H.removeAttribute('data-active')}),nodeMap(W,(H)=>{H.setAttribute('data-active','true')})}var keys=function(L,q){function T(V){return 37===V.keyCode?nav.left(L):39===V.keyCode?nav.right(L):38===V.keyCode?nav.previous(L):40===V.keyCode?nav.next(L):void 0}function M(V){return!0===V.shiftKey&&32===V.keyCode?nav.previous(L):32===V.keyCode?nav.next(L):void 0}function W(V){if(83===V.keyCode)return L.notes=openNotes(L),L}function z(V,D,U){!0===V?D(U):'ctrl'===V?U.ctrlKey&&D(U):'alt'===V?U.altKey&&D(U):'meta'===V&&U.metaKey&&D(U)}const H=q.get('navigation.arrows',!0),B=q.get('navigation.remote',!0),F=q.get('navigation.spacebar',!0),K=q.get('notes',!0);document.addEventListener('keydown',(V)=>{if(!L.stage.hasAttribute('data-overlay')){if(z(H,T,V),!0===B){if(33===V.keyCode)return nav.previous(L);if(34===V.keyCode)return nav.next(L)}return z(F,M,V),void z(K,W,V)}})},overview=function(L){let q=!1;const T=L._raw.slides;document.addEventListener('keydown',(M)=>{if(27===M.keyCode){function W(U){const G=U.target.closest('[data-section][data-slide]');let R=G.getAttribute('data-section'),J=G.getAttribute('data-slide');z(T),L.stage.removeAttribute('data-overlay'),history.pushState(null,null,`#/${R}/${J}`),updateProgress(R,J),translate(R,J),q=!1}function z(U){nodeMap(U,(G)=>{G.removeEventListener('click',W)})}if(q=!q,!1==q)return L.stage.removeAttribute('data-overlay'),z(T),void translate();const H=window.innerWidth,B=window.innerHeight,F=L.stage.scrollWidth,K=L.stage.scrollHeight,V=H/F,D=B/K;if(V<=D){L.stage.style.transform=`scale(${H/(F+64/V)})`,L.stage.style.transformOrigin=`32px ${K*V/2-32}px`}else{let G=hwidth/(F+64/D);L.stage.style.transform=`scale(${G})`,L.stage.style.transformOrigin=`${F*D/2-32}px 32px`}L.stage.setAttribute('data-overlay','true'),nodeMap(T,(U)=>{U.addEventListener('click',W)})}})},stageFright=function(L){const q=new Options(L),T=new Matrix;T.options.notes?(body(),timing(),notesMessage()):(init(),progress(T),keys(T,q),overview(T)),T.options.listen&&slideMessage(T),T.options.responsive&&(document.documentElement.style.fontSize='1.5vw')},commonjsGlobal='undefined'==typeof window?'undefined'==typeof global?'undefined'==typeof self?{}:self:global:window;function createCommonjsModule(L,q){return q={exports:{}},L(q,q.exports),q.exports}var prism=createCommonjsModule(function(L){var q='undefined'==typeof window?'undefined'!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{}:window,T=function(){var M=/\blang(?:uage)?-([\w-]+)\b/i,W=0,z=q.Prism={manual:q.Prism&&q.Prism.manual,disableWorkerMessageHandler:q.Prism&&q.Prism.disableWorkerMessageHandler,util:{encode:function(F){return F instanceof H?new H(F.type,z.util.encode(F.content),F.alias):'Array'===z.util.type(F)?F.map(z.util.encode):F.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\u00a0/g,' ')},type:function(F){return Object.prototype.toString.call(F).match(/\[object (\w+)\]/)[1]},objId:function(F){return F.__id||Object.defineProperty(F,'__id',{value:++W}),F.__id},clone:function(F,K){var V=z.util.type(F);switch(K=K||{},V){case'Object':if(K[z.util.objId(F)])return K[z.util.objId(F)];var D={};for(var U in K[z.util.objId(F)]=D,F)F.hasOwnProperty(U)&&(D[U]=z.util.clone(F[U],K));return D;case'Array':if(K[z.util.objId(F)])return K[z.util.objId(F)];var D=[];return K[z.util.objId(F)]=D,F.forEach(function(G,R){D[R]=z.util.clone(G,K)}),D;}return F}},languages:{extend:function(F,K){var V=z.util.clone(z.languages[F]);for(var D in K)V[D]=K[D];return V},insertBefore:function(F,K,V,D){D=D||z.languages;var U=D[F];if(2==arguments.length){for(var G in V=arguments[1],V)V.hasOwnProperty(G)&&(U[G]=V[G]);return U}var R={};for(var J in U)if(U.hasOwnProperty(J)){if(J==K)for(var G in V)V.hasOwnProperty(G)&&(R[G]=V[G]);R[J]=U[J]}return z.languages.DFS(z.languages,function(Y,$){$===D[F]&&Y!=F&&(this[Y]=R)}),D[F]=R},DFS:function(F,K,V,D){for(var U in D=D||{},F)F.hasOwnProperty(U)&&(K.call(F,U,F[U],V||U),'Object'!==z.util.type(F[U])||D[z.util.objId(F[U])]?'Array'!==z.util.type(F[U])||D[z.util.objId(F[U])]||(D[z.util.objId(F[U])]=!0,z.languages.DFS(F[U],K,U,D)):(D[z.util.objId(F[U])]=!0,z.languages.DFS(F[U],K,null,D)))}},plugins:{},highlightAll:function(F,K){z.highlightAllUnder(document,F,K)},highlightAllUnder:function(F,K,V){var D={callback:V,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};z.hooks.run('before-highlightall',D);for(var U,G=D.elements||F.querySelectorAll(D.selector),R=0;U=G[R++];)z.highlightElement(U,!0===K,D.callback)},highlightElement:function(F,K,V){for(var D,U,G=F;G&&!M.test(G.className);)G=G.parentNode;G&&(D=(G.className.match(M)||[,''])[1].toLowerCase(),U=z.languages[D]),F.className=F.className.replace(M,'').replace(/\s+/g,' ')+' language-'+D,F.parentNode&&(G=F.parentNode,/pre/i.test(G.nodeName)&&(G.className=G.className.replace(M,'').replace(/\s+/g,' ')+' language-'+D));var R=F.textContent,J={element:F,language:D,grammar:U,code:R};if(z.hooks.run('before-sanity-check',J),!J.code||!J.grammar)return J.code&&(z.hooks.run('before-highlight',J),J.element.textContent=J.code,z.hooks.run('after-highlight',J)),z.hooks.run('complete',J),void 0;if(z.hooks.run('before-highlight',J),K&&q.Worker){var Y=new Worker(z.filename);Y.onmessage=function($){J.highlightedCode=$.data,z.hooks.run('before-insert',J),J.element.innerHTML=J.highlightedCode,V&&V.call(J.element),z.hooks.run('after-highlight',J),z.hooks.run('complete',J)},Y.postMessage(JSON.stringify({language:J.language,code:J.code,immediateClose:!0}))}else J.highlightedCode=z.highlight(J.code,J.grammar,J.language),z.hooks.run('before-insert',J),J.element.innerHTML=J.highlightedCode,V&&V.call(F),z.hooks.run('after-highlight',J),z.hooks.run('complete',J)},highlight:function(F,K,V){var D={code:F,grammar:K,language:V};return z.hooks.run('before-tokenize',D),D.tokens=z.tokenize(D.code,D.grammar),z.hooks.run('after-tokenize',D),H.stringify(z.util.encode(D.tokens),D.language)},matchGrammar:function(F,K,V,D,U,G,R){var J=z.Token;for(var Y in V)if(V.hasOwnProperty(Y)&&V[Y]){if(Y==R)return;var $=V[Y];$='Array'===z.util.type($)?$:[$];for(var Q=0;Q<$.length;++Q){var X=$[Q],Z=X.inside,ee=!!X.lookbehind,te=!!X.greedy,ne=0,ae=X.alias;if(te&&!X.pattern.global){var ie=X.pattern.toString().match(/[imuy]*$/)[0];X.pattern=RegExp(X.pattern.source,ie+'g')}X=X.pattern||X;for(var de,re=D,se=U;re<K.length;se+=K[re].length,++re){if(de=K[re],K.length>F.length)return;if(!(de instanceof J)){if(te&&re!=K.length-1){X.lastIndex=se;var le=X.exec(F);if(!le)break;for(var oe=le.index+(ee?le[1].length:0),ue=le.index+le[0].length,ce=re,pe=se,ge=K.length;ge>ce&&(ue>pe||!K[ce].type&&!K[ce-1].greedy);++ce)pe+=K[ce].length,oe>=pe&&(++re,se=pe);if(K[re]instanceof J)continue;me=ce-re,de=F.slice(se,pe),le.index-=se}else{X.lastIndex=0;var le=X.exec(de),me=1}if(le){ee&&(ne=le[1]?le[1].length:0);var oe=le.index+ne,le=le[0].slice(ne),ue=oe+le.length,fe=de.slice(0,oe),he=de.slice(ue),ye=[re,me];fe&&(++re,se+=fe.length,ye.push(fe));var ve=new J(Y,Z?z.tokenize(le,Z):le,ae,le,te);if(ye.push(ve),he&&ye.push(he),Array.prototype.splice.apply(K,ye),1!=me&&z.matchGrammar(F,K,V,re,se,!0,Y),G)break}else if(G)break}}}}},tokenize:function(F,K){var V=[F],D=K.rest;if(D){for(var U in D)K[U]=D[U];delete K.rest}return z.matchGrammar(F,V,K,0,0,!1),V},hooks:{all:{},add:function(F,K){var V=z.hooks.all;V[F]=V[F]||[],V[F].push(K)},run:function(F,K){var V=z.hooks.all[F];if(V&&V.length)for(var D,U=0;D=V[U++];)D(K)}}},H=z.Token=function(F,K,V,D,U){this.type=F,this.content=K,this.alias=V,this.length=0|(D||'').length,this.greedy=!!U};if(H.stringify=function(F,K,V){if('string'==typeof F)return F;if('Array'===z.util.type(F))return F.map(function(R){return H.stringify(R,K,F)}).join('');var D={type:F.type,content:H.stringify(F.content,K,V),tag:'span',classes:['token',F.type],attributes:{},language:K,parent:V};if(F.alias){var U='Array'===z.util.type(F.alias)?F.alias:[F.alias];Array.prototype.push.apply(D.classes,U)}z.hooks.run('wrap',D);var G=Object.keys(D.attributes).map(function(R){return R+'="'+(D.attributes[R]||'').replace(/"/g,'&quot;')+'"'}).join(' ');return'<'+D.tag+' class="'+D.classes.join(' ')+'"'+(G?' '+G:'')+'>'+D.content+'</'+D.tag+'>'},!q.document)return q.addEventListener?(z.disableWorkerMessageHandler||q.addEventListener('message',function(F){var K=JSON.parse(F.data),V=K.language,D=K.code,U=K.immediateClose;q.postMessage(z.highlight(D,z.languages[V],V)),U&&q.close()},!1),q.Prism):q.Prism;var B=document.currentScript||[].slice.call(document.getElementsByTagName('script')).pop();return B&&(z.filename=B.src,z.manual||B.hasAttribute('data-manual')||('loading'===document.readyState?document.addEventListener('DOMContentLoaded',z.highlightAll):window.requestAnimationFrame?window.requestAnimationFrame(z.highlightAll):window.setTimeout(z.highlightAll,16))),q.Prism}();L.exports&&(L.exports=T),'undefined'!=typeof commonjsGlobal&&(commonjsGlobal.Prism=T),T.languages.markup={comment:/<!--[\s\S]*?-->/,prolog:/<\?[\s\S]+?\?>/,doctype:/<!DOCTYPE[\s\S]+?>/i,cdata:/<!\[CDATA\[[\s\S]*?]]>/i,tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,inside:{punctuation:[/^=/,{pattern:/(^|[^\\])["']/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},T.languages.markup.tag.inside['attr-value'].inside.entity=T.languages.markup.entity,T.hooks.add('wrap',function(M){'entity'===M.type&&(M.attributes.title=M.content.replace(/&amp;/,'&'))}),T.languages.xml=T.languages.markup,T.languages.html=T.languages.markup,T.languages.mathml=T.languages.markup,T.languages.svg=T.languages.markup,T.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(?:;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^{}\s][^{};]*?(?=\s*\{)/,string:{pattern:/("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},property:/[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,important:/\B!important\b/i,function:/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},T.languages.css.atrule.inside.rest=T.languages.css,T.languages.markup&&(T.languages.insertBefore('markup','tag',{style:{pattern:/(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,lookbehind:!0,inside:T.languages.css,alias:'language-css',greedy:!0}}),T.languages.insertBefore('inside','attr-value',{"style-attr":{pattern:/\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:T.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:T.languages.css}},alias:'language-css'}},T.languages.markup.tag)),T.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(?:true|false)\b/,function:/[a-z0-9_]+(?=\()/i,number:/\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/},T.languages.javascript=T.languages.extend('clike',{keyword:/\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,number:/\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,function:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,operator:/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/}),T.languages.insertBefore('javascript','keyword',{regex:{pattern:/((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[[^\]\r\n]+]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,lookbehind:!0,greedy:!0},"function-variable":{pattern:/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,alias:'function'},constant:/\b[A-Z][A-Z\d_]*\b/}),T.languages.insertBefore('javascript','string',{"template-string":{pattern:/`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,greedy:!0,inside:{interpolation:{pattern:/\${[^}]+}/,inside:{"interpolation-punctuation":{pattern:/^\${|}$/,alias:'punctuation'},rest:null}},string:/[\s\S]+/}}}),T.languages.javascript['template-string'].inside.interpolation.inside.rest=T.languages.javascript,T.languages.markup&&T.languages.insertBefore('markup','tag',{script:{pattern:/(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,lookbehind:!0,inside:T.languages.javascript,alias:'language-javascript',greedy:!0}}),T.languages.js=T.languages.javascript,T.languages.scss=T.languages.extend('css',{comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,lookbehind:!0},atrule:{pattern:/@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,inside:{rule:/@[\w-]+/}},url:/(?:[-a-z]+-)*url(?=\()/i,selector:{pattern:/(?=\S)[^@;{}()]?(?:[^@;{}()]|&|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}]+[:{][^}]+))/m,inside:{parent:{pattern:/&/,alias:'important'},placeholder:/%[-\w]+/,variable:/\$[-\w]+|#\{\$[-\w]+\}/}}}),T.languages.insertBefore('scss','atrule',{keyword:[/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,{pattern:/( +)(?:from|through)(?= )/,lookbehind:!0}]}),T.languages.scss.property={pattern:/(?:[\w-]|\$[-\w]+|#\{\$[-\w]+\})+(?=\s*:)/i,inside:{variable:/\$[-\w]+|#\{\$[-\w]+\}/}},T.languages.insertBefore('scss','important',{variable:/\$[-\w]+|#\{\$[-\w]+\}/}),T.languages.insertBefore('scss','function',{placeholder:{pattern:/%[-\w]+/,alias:'selector'},statement:{pattern:/\B!(?:default|optional)\b/i,alias:'keyword'},boolean:/\b(?:true|false)\b/,null:/\bnull\b/,operator:{pattern:/(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,lookbehind:!0}}),T.languages.scss.atrule.inside.rest=T.languages.scss,!function(){'undefined'!=typeof self&&self.Prism&&self.document&&T.languages.markup&&(T.plugins.UnescapedMarkup=!0,T.hooks.add('before-highlightall',function(M){M.selector+=', [class*=\'lang-\'] script[type=\'text/plain\'], [class*=\'language-\'] script[type=\'text/plain\'], script[type=\'text/plain\'][class*=\'lang-\'], script[type=\'text/plain\'][class*=\'language-\']'}),T.hooks.add('before-sanity-check',function(M){if((M.element.matches||M.element.msMatchesSelector).call(M.element,'script[type=\'text/plain\']')){var W=document.createElement('code'),z=document.createElement('pre');return z.className=W.className=M.element.className,M.element.dataset&&Object.keys(M.element.dataset).forEach(function(H){Object.prototype.hasOwnProperty.call(M.element.dataset,H)&&(z.dataset[H]=M.element.dataset[H])}),M.code=M.code.replace(/&lt;\/script(>|&gt;)/gi,'</script>'),W.textContent=M.code,z.appendChild(W),M.element.parentNode.replaceChild(z,M.element),M.element=W,void 0}var z=M.element.parentNode;!M.code&&z&&'pre'==z.nodeName.toLowerCase()&&M.element.childNodes.length&&'#comment'==M.element.childNodes[0].nodeName&&(M.element.textContent=M.code=M.element.childNodes[0].textContent)}))}(),!function(){function M(B){this.defaults=H({},B)}function W(B){return B.replace(/-(\w)/g,function(F,K){return K.toUpperCase()})}function z(B){for(var F=0,K=0;K<B.length;++K)B.charCodeAt(K)=='\t'.charCodeAt(0)&&(F+=3);return B.length+F}var H=Object.assign||function(B,F){for(var K in F)F.hasOwnProperty(K)&&(B[K]=F[K]);return B};M.prototype={setDefaults:function(B){this.defaults=H(this.defaults,B)},normalize:function(B,F){for(var K in F=H(this.defaults,F),F){var V=W(K);'normalize'!=K&&'setDefaults'!==V&&F[K]&&this[V]&&(B=this[V].call(this,B,F[K]))}return B},leftTrim:function(B){return B.replace(/^\s+/,'')},rightTrim:function(B){return B.replace(/\s+$/,'')},tabsToSpaces:function(B,F){return F=0|F||4,B.replace(/\t/g,Array(++F).join(' '))},spacesToTabs:function(B,F){return F=0|F||4,B.replace(new RegExp(' {'+F+'}','g'),'\t')},removeTrailing:function(B){return B.replace(/\s*?$/gm,'')},removeInitialLineFeed:function(B){return B.replace(/^(?:\r?\n|\r)/,'')},removeIndent:function(B){var F=B.match(/^[^\S\n\r]*(?=\S)/gm);return F&&F[0].length?(F.sort(function(K,V){return K.length-V.length}),F[0].length?B.replace(new RegExp('^'+F[0],'gm'),''):B):B},indent:function(B,F){return B.replace(/^[^\S\n\r]*(?=\S)/gm,Array(++F).join('\t')+'$&')},breakLines:function(B,F){F=!0===F?80:0|F||80;for(var K=B.split('\n'),V=0;V<K.length;++V)if(!(z(K[V])<=F)){for(var R,D=K[V].split(/(\s+)/g),U=0,G=0;G<D.length;++G)R=z(D[G]),U+=R,U>F&&(D[G]='\n'+D[G],U=R);K[V]=D.join('')}return K.join('\n')}},L.exports&&(L.exports=M),'undefined'!=typeof T&&(T.plugins.NormalizeWhitespace=new M({"remove-trailing":!0,"remove-indent":!0,"left-trim":!0,"right-trim":!0}),T.hooks.add('before-sanity-check',function(B){var F=T.plugins.NormalizeWhitespace;if(!B.settings||!1!==B.settings['whitespace-normalization']){if((!B.element||!B.element.parentNode)&&B.code)return B.code=F.normalize(B.code,B.settings),void 0;var K=B.element.parentNode,V=/\bno-whitespace-normalization\b/;if(B.code&&K&&'pre'===K.nodeName.toLowerCase()&&!V.test(K.className)&&!V.test(B.element.className)){for(var Y,D=K.childNodes,U='',G='',R=!1,J=0;J<D.length;++J)Y=D[J],Y==B.element?R=!0:'#text'===Y.nodeName&&(R?G+=Y.nodeValue:U+=Y.nodeValue,K.removeChild(Y),--J);if(B.element.children.length&&T.plugins.KeepMarkup){var $=U+B.element.innerHTML+G;B.element.innerHTML=F.normalize($,B.settings),B.code=B.element.textContent}else B.code=U+B.code+G,B.code=F.normalize(B.code,B.settings)}}}))}()}),Editor=class{constructor(L='  '){this.indent=L,this._isString=(q)=>{return'[object String]'===Object.prototype.toString.call(q)},this._run=(q,T={})=>{const M=this._isString(q)?document.querySelectorAll(q):q;for(let W=0;W<M.length;W++)this._scaffold(M[W],!0,T)},this._scaffold=(q,T,M={})=>{const W=document.createElement('textarea'),z=document.createElement('pre'),H=document.createElement('code'),B=document.createElement('style'),F=document.createElement('div'),K=q.dataset.language||M.language||'markup',V=q.textContent,D=this._language(K);M.enableAutocorrect||(W.setAttribute('spellcheck',!1),W.setAttribute('autocapitalize','off'),W.setAttribute('autocomplete','off'),W.setAttribute('autocorrect','off')),q.classList.add('editor'),W.classList.add('editor--textarea'),z.classList.add('editor--pre'),H.classList.add('editor--code',`language-${D}`),B.classList.add('editor--live'),F.classList.add('editor--live'),F.setAttribute('markup',!0),/iPad|iPhone|iPod/.test(navigator.platform)&&(H.style.paddingLeft='3px'),M.rtl&&(W.setAttribute('dir','rtl'),z.setAttribute('dir','rtl')),M.lineNumbers&&(z.classList.add('line-numbers','editor--numbered-pre'),z.classList.remove('editor--pre'),W.classList.add('editor--numbered-textarea'),W.classList.remove('editor--textarea')),q.innerHTML='',q.appendChild(W),q.appendChild(z),z.appendChild(H),W.value=V;const U=this._render(H,W);return M.live&&K.match(/css/)?(q.appendChild(B),B.innerText=U):M.live&&K.match(/markup/)&&(q.appendChild(F),F.innerHTML=U),this._input(q),q},this._input=(q)=>{const T=q.querySelector('.editor--textarea'),M=q.querySelector('.editor--pre'),W=q.querySelector('.editor--code'),z=q.querySelector('.editor--live');T.addEventListener('scroll',(H)=>{window.requestAnimationFrame(()=>{M.scrollTop=H.target.scrollTop})}),T.addEventListener('input',(H)=>{const B=H.target;B.value=B.value.replace(/\t/g,this.indent);const F=this._render(W,T);z&&(z.hasAttribute('markup')?z.innerHTML=B.value:z.innerText=F)}),T.addEventListener('keydown',(H)=>{const B=H.target,F=B.selectionStart,K=B.selectionEnd,V=B.value;if('Enter'===H.key){H.preventDefault();const D=[V.slice(0,F+1),'  \n',V.slice(F+1)].join('');B.value=D,B.selectionStart=F+3,B.selectionEnd=K+3;const U=new Event('input',{bubbles:!0,cancelable:!0});B.dispatchEvent(U)}})},this._scroll=(q,T)=>{q.addEventListener('scroll',(M)=>{const W=Math.flow(M.target.scrollTop);0>navigator.userAgent.toLowerCase().indexOf('firefox')&&(M.target.scrollTop=W),T.style.transformY=`-${W}px`})},this._render=(q,T)=>{const M=T.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');return q.innerHTML=M,Prism.highlightElement(q),M},this._language=(q)=>{return q.match(/html|xml|xhtml|svg/)?'markup':q.match(/js|worklet/)?'javascript':q}}run(L,q){return this._run(L,q)}},REPL=class{constructor(L,q,T){this.target=L,this.parent=document.querySelector(L),this.options=q,this.type=T,this.optKeys=Object.keys(q),this.inputEvent=new Event(`input`,{bubbles:!0,cancelable:!0}),this.active=this.optKeys[0],this.repl={},this.switcherOptions=['worklet','js','css','html'],this.buildREPL()}buildREPL(){const L=document.createElement('div'),q=document.createElement('select'),T=document.createElement('h4'),M=document.createElement('p'),W=document.createElement('div'),z=document.createElement('div'),H=document.createElement('div'),B=document.createElement('div');L.classList.add('repl--menu'),T.classList.add('repl--title'),M.classList.add('repl--features'),q.classList.add('repl--switcher'),W.classList.add('repl--editor'),W.setAttribute('data-language','worklet'),z.classList.add('repl--editor'),z.setAttribute('data-language','js'),H.classList.add('repl--editor'),H.setAttribute('data-language','css'),B.classList.add('repl--editor'),B.setAttribute('data-language','markup');const F={};if(1<this.optKeys.length)for(const D of this.optKeys)F[D]=document.createElement('button'),F[D].classList.add('repl--menu-item'),F[D].setAttribute('data-type',D),F[D].textContent=D,F[D].addEventListener('click',this.menuHandler()),L.appendChild(F[D]);'props'===this.type?(z.style.zIndex=100,this.switcherOptions.shift()):W.style.zIndex=100;for(const D of this.switcherOptions){const U=document.createElement('option');U.value=D,U.text=D,q.appendChild(U)}q.addEventListener('input',this.swapEditors()),this.parent.classList.add('repl'),this.parent.appendChild(L),this.parent.appendChild(T),this.parent.appendChild(M),this.parent.appendChild(q),'props'!==this.type&&this.parent.appendChild(W),this.parent.appendChild(z),this.parent.appendChild(H),this.parent.appendChild(B);const K=new Editor;K.run(`${this.target} .repl--editor`,{live:!1});const V={worklet:W.querySelector('.editor--textarea'),js:z.querySelector('.editor--textarea'),css:H.querySelector('.editor--textarea'),html:B.querySelector('.editor--textarea')};'props'===this.type&&delete V.worklet,this.repl.editors=V,this.repl.switcher=q,this.repl.title=T,this.repl.features=M,this.repl.menu=this.parent.querySelectorAll('.repl--menu-item'),this.repl.previous=null,this.resetEditors(this.active)}resetEditors(L){const q=this.options[L];this.repl.title.innerText=q.name,this.repl.features.innerText=q.features.join(', ');for(const T of this.repl.menu)delete T.dataset.active,T.dataset.type===L&&(T.dataset.active=!0,this.active=L);for(const T in q)this.repl.editors[T]&&(this.repl.editors[T].value=q[T],this.repl.editors[T].addEventListener('input',this.replPreview()),this.repl.editors[T].dispatchEvent(this.inputEvent))}swapEditors(){const L=this.repl;return function(q){const T=q.target.value;for(const M in L.editors)L.editors[M].closest('.repl--editor').style.zIndex=M===T?100:0}}menuHandler(){const L=this;return function(q){console.log(L.repl);const T=q.target,M=T.getAttribute('data-type');L.resetEditors(M),L.repl.switcher.value='props'===L.type?'js':'worklet',L.repl.switcher.dispatchEvent(L.inputEvent)}}replPreview(){const L=this.repl,q=this.parent,T=this.type;return function(){const M={};for(const z in L.editors)M[z]=L.editors[z].value;let W=`<head><style>${M.css}</style>`;W+='props'===T?`<script type="text/javascript">${M.js}</script></head>`:`<script language="worklet">
            ${M.worklet}
          </script>
          <script type="module">
          // In-page Worklet pattern from @DasSurma
          // https://glitch.com/edit/#!/aw-bug-hunt?path=delay.html:39:0
          function blobWorklet() {
            const src = document.querySelector('script[language="worklet"]').innerHTML;
            const blob = new Blob([src], {type: 'text/javascript'});
            return URL.createObjectURL(blob);
          }

          async function init() {
            await CSS.${T}Worklet.addModule(blobWorklet());

            ${M.js}
          }

          init();

          </script>
        </head>`,W+=`<body>${M.html}</body>`,window.requestAnimationFrame(()=>{L.previous&&L.previous.remove();const z=document.createElement('iframe');z.classList.add('repl--preview'),q.appendChild(z),z.contentWindow.document.open(),z.contentWindow.document.write(W),z.contentWindow.document.close(),L.previous=z})}}};const propsSettings={"gradient transition":{name:'Gradient Transition',features:['Transitioning a registered property lets us use transitions in gradients!'],js:`CSS.registerProperty({
  name: '--registered',
  syntax: '<color>',
  inherits: true,
  initialValue: 'purple',
});`,css:`.registered {
  --registered: #c0ffee;
  background: linear-gradient(white, var(--registered));
  transition: --registered 1s;
  height: 3em;
}

.registered:hover,
.registered:focus {
  --registered: #bada55;
}

.unregistered {
  --unregistered: #c0ffee;
  background: linear-gradient(white, var(--unregistered));
  transition: --unregistered 1s;
  height: 3em;
}

.unregistered:hover,
.unregistered:focus {
  --unregistered: #bada55;
}

button {
  width: 100%;
  cursor: pointer;
  font-size: 2em;
}

button + button {
  margin-top: 1em;
}`,html:`<button class="unregistered">
  Unregistered
</button>
<button class="registered">
  Registered
</buttom>`}},paintSettings={circle:{name:'Circle',features:['Draw basic shapes and style them with custom properties'],worklet:`registerPaint('circle', class {
  static get inputProperties() { return ['--circle-color']; }
  paint(ctx, size, properties) {
    // Get fill color from property
    const color = properties.get('--circle-color');

    // Determine the center point and radius.
    const xCircle = size.width / 2;
    const yCircle = size.height / 2;
    const radiusCircle = Math.min(xCircle, yCircle) - 2.5;

    // Draw the circle \o/
    ctx.beginPath();
    ctx.arc(xCircle, yCircle, radiusCircle, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
});`,js:`CSS.registerProperty({
  name: '--circle-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'red',
});`,css:`.circle {
  --circle-color: green;
  background-image: paint(circle);
  height: 80vh;
  width: 100vw;
}`,html:`<div class="circle"></div>`},tabs:{name:'Tabs',features:['Build reusable components that extend standard CSS and make adjustments with input arguments'],worklet:`registerPaint('tab', class {
  static get inputProperties() {
    return [
      'background-color',
      'border-image-outset',
      '--tab-multiplier',
    ];
  }

  static get inputArguments() {
    return ['*'];
  }

  paint(ctx, size, props, args) {
    const bkg = props.get('background-color');
    const offset = parseInt(props.get('border-image-outset').toString());
    const m = props.get('--tab-multiplier').value;
    const sides = args[0].toString();

    const x = 10 * m;
    const y = 5.6 * m;

    if (sides === 'right' || sides === 'middle') {
      const yoff = size.height - offset - x;
      const xoff = offset - x;

      ctx.beginPath();
      ctx.moveTo(0.0 + xoff, x + yoff);
      ctx.lineTo(x + xoff, x + yoff);
      ctx.lineTo(x + xoff, 0.0 + yoff);
      ctx.bezierCurveTo(x + xoff, y + yoff, y + xoff, x + yoff, 0.0 + xoff, x + yoff);
      ctx.closePath();
      ctx.fillStyle = bkg;
      ctx.fill();
    }

    if (sides === 'left' || sides === 'middle') {
      const yoff = size.height - offset - x;
      const xoff = size.width - offset;

      ctx.beginPath();
      ctx.moveTo(x + xoff, x + yoff);
      ctx.lineTo(0.0 + xoff, x + yoff);
      ctx.lineTo(0.0 + xoff, 0.0 + yoff);
      ctx.bezierCurveTo(0.0 + xoff, y + yoff, y + xoff, x + yoff, x + xoff, x + yoff);
      ctx.closePath();
      ctx.fillStyle = bkg;
      ctx.fill();
    }
  }
});`,js:`CSS.registerProperty({
  name: '--tab-multiplier',
  syntax: '<number>',
  inherits: true,
  initialValue: 1,
});

const buttons = document.querySelectorAll('.tabs--tab button');
const sections = document.querySelectorAll('.tabs--section');

for (const button of buttons) {
  button.addEventListener('click', swap);
}

function swap(e) {
  const target = e.target;
  const targetFor = target.getAttribute('for');

  // Set Active attribute on section
  for (const section of sections) {
    if (section.id === targetFor) {
      section.setAttribute('data-active', true);
    } else {
      section.removeAttribute('data-active');
    }
  }

  // Set Active attribute on tab
  for (const button of buttons) {
    if (button === target) {
      button.closest('.tabs--tab').setAttribute('data-active', true);
    } else {
      button.closest('.tabs--tab').removeAttribute('data-active');
    }
  }
};`,css:`.tabs--tab {
  border-image-outset: 30px;
  border-image-slice: 0 fill;
  border-image-source: paint(tab, middle);
}

.tabs--tab:first-of-type {
  border-image-source: paint(tab, left);
  margin-right: var(--tab-margin);
}

.tabs--tab:last-of-type {
  border-image-source: paint(tab, right);
  margin-left: var(--tab-margin);
}

.tabs--tab:nth-of-type(2) {
  background: orange;
}

.tabs--tab:nth-of-type(3) {
  background: green;
  color: white;
}

.tabs--tab:nth-of-type(4) {
  background: blue;
  color: white;
}

.tabs {
  --tab-multiplier: 1;
  --tab-margin: 1px;
  padding-left: 0;
  margin-bottom: 0;
  font-size: 1.5em;
}

.tabs--tab {
  background: red;
  border-radius: 5px 5px 0 0;
  border-radius: 5px 5px 0 0;
  display: inline-block;
  font-size: 1em;
  padding: .15em .25em;
  position: relative;
  margin: 0
  padding: 0;
}

.tabs--tab:not(:first-of-type):not(:last-of-type) {
  margin-left: var(--tab-margin);
  margin-right: var(--tab-margin);
}

.tabs--tab button {
  color: inherit;
  text-decoration: none;
  padding: inherit;
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
}

.tabs--tab[data-active='true'] {
  z-index: 2;
}

.tabs--container {
  position: relative;
}

.tabs--section {
  height: 25vh;
  position: absolute;
  width: 100vw;
  z-index: -1;
  padding: .25em 1em;
  box-sizing: border-box;
}

.tabs--section[data-active='true'] {
  z-index: 0;
}

#first {
  background: red;
}

#second {
  background: orange;
}

#third {
  background: green;
  color: white;
}

#fourth {
  background: blue;
  color: white;
}`,html:`<ul class="tabs">
  <li class="tabs--tab" data-active="true"><button for="first">First</button></li>
  <li class="tabs--tab"><button for="second">Second</button></li>
  <li class="tabs--tab"><button for="third">Third</button></li>
  <li class="tabs--tab"><button for="fourth">Fourth</button></li>
</ul>
<div class="tabs--container">
  <section class="tabs--section" data-active="true" id="first">
    <p>The first section! Isn't this cool?</p>
  </section>
  <section class="tabs--section" id="second">
    <p>The second section! Isn't this cool?</p>
  </section>
  <section class="tabs--section" id="third">
    <p>The third section! Isn't this cool?</p>
  </section>
  <section class="tabs--section" id="fourth">
    <p>The fourth section! Isn't this cool?</p>
  </section>
</div>`},"generative art":{name:'Generative Art',features:['Apply generative art principles to make dynamic backgrounds'],worklet:`// Based on the amazing work by Tim Holman (@twholman)
// https://www.youtube.com/watch?v=4Se0_w0ISYk&list=PLZriQCloF6GDuXF8RRPd1mIl9W2QXF-sQ&index=11

registerPaint('art', class {
  static get inputProperties() {
    return [
      '--art-color',
      '--art-steps',
      '--art-alpha'
    ];
  }


  draw(ctx, x, y, width, height) {
    const leftToRight = Math.random() >= 0.5;

    if( leftToRight ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
    }

    ctx.stroke();
  }

  paint(ctx, size, props) {
    const color = props.get('--art-color');
    const step = props.get('--art-steps');
    const alpha = props.get('--art-alpha');

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;

    const xsteps = Math.ceil(size.width / step.value);
    const ysteps = Math.ceil(size.height / step.value);

    const length = xsteps * ysteps;

    let height = 0;

    for (let x = 0; x < length; x++) {
      let xc = x;
      let y = height;
      if (x >= xsteps) {
        xc = x % xsteps;

        if (xc === 0) {
          height++;
          y = height;
        }
      }

      xc *= step.value;
      y *= step.value;

      this.draw(ctx, xc, y, step.value, step.value);
    }
  }
});`,js:`CSS.registerProperty({
  name: '--art-color',
  syntax: '<color>',
  inherits: false,
  initialValue: 'white',
});

CSS.registerProperty({
  name: '--art-steps',
  syntax: '<number>',
  inherits: false,
  initialValue: 40,
});

CSS.registerProperty({
  name: '--art-alpha',
  syntax: '<number>',
  inherits: false,
  initialValue: 1,
});`,css:`h1 {
  --art-alpha: .15;
  --art-color: rgba(255, 255, 255, .25);
  /* Setting --art-steps below 20 will slow this to a crawl */
  --art-steps: 50;
  background-image: paint(art), linear-gradient(to right, blue, black);

  align-items: flex-end;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: row-reverse;
  font-family: sans-serif;
  font-size: 3em;
  height: 80vh;
  line-height: 1;
  margin: 0;
  padding: .25em .5em;
  text-align: right;
  text-shadow: 1px 1px black, -1px 1px black;
}`,html:`<h1><span>Hello World</span></h1>`},animation:{name:'Ripple Effect',features:['Update properties in JavaScript to trigger the paint again, creating an animation effect'],worklet:`/* Example from https://github.com/GoogleChromeLabs/houdini-samples/tree/master/paint-worklet/ripple */

registerPaint('ripple', class {
    static get inputProperties() {
      return [
        'background-color',
        '--ripple-color',
        '--animation-tick',
        '--ripple-x',
        '--ripple-y'
      ];
    }

    paint(ctx, geom, properties) {
      const bgColor = properties.get('background-color');
      const rippleColor = properties.get('--ripple-color');
      const x = properties.get('--ripple-x');
      const y = properties.get('--ripple-y');
      let tick = properties.get('--animation-tick');

      if (tick < 0) {
        tick = 0;
      } else if (tick > 1000) {
        tick = 1000;
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, geom.width, geom.height);
      ctx.fillRect(0, 0, geom.width, geom.height);

      ctx.fillStyle = rippleColor;
      ctx.globalAlpha = 1 - tick/1000;
      ctx.arc(
        x, y, // center
        geom.width * tick/1000, // radius
        0, // startAngle
        2 * Math.PI //endAngle
      );
      ctx.fill();
    }
});

/*
Copyright 2016 Google, Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`,js:`CSS.registerProperty({
  name: '--ripple-color',
  syntax: '<color>',
  inherits: true,
  initialValue: 'purple',
});

CSS.registerProperty({
  name: '--ripple-y',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--ripple-x',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--animation-tick',
  syntax: '<number>',
  inherits: true,
  initialValue: 0,
});

const button = document.querySelector('#ripple');
button.addEventListener('click', evt => {
  button.classList.add('animating');
  const [x, y] = [evt.clientX, evt.clientY];
  const start = performance.now();
  requestAnimationFrame(function raf(now) {
    const count = Math.floor(now - start);
    button.style.cssText = \`--ripple-x: \${x}; --ripple-y: \${y}; --animation-tick: \${count};\`;
    if(count > 1000) {
      button.classList.remove('animating');
      button.style.cssText = \`--animation-tick: 0\`;
      return;
    }
    requestAnimationFrame(raf);
  })
})`,css:`#ripple {
  width: 300px;
  height: 300px;
  border-radius: 150px;
  font-size: 5em;
  background-color: rgb(255,64,129);
  border: 0;
  box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.24);
  color: white;
  --ripple-x: 0;
  --ripple-y: 0;
  --ripple-color: rgba(255,255,255,0.54);
  --animation-tick: 0;
}
#ripple:focus {
  outline: none;
}
#ripple.animating {
  background-image: paint(ripple);
}`,html:`<button id="ripple">
  Click me!
</button>`}},animationSettings={twitter:{name:'Twitter Header',features:['Combining a simple animator and smart timing updates for our keyframes to create complex animations'],worklet:`registerAnimator('twitter-header', class {
  constructor(options) {
  }

  animate(currentTime, effect) {
    effect.localTime = currentTime;
  }
});

/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`,js:`const scrollSource = document.body;
const bar = document.querySelector('.bar');
const avatar = document.querySelector('.profile .avatar');
const follow = document.querySelector('.profile .follow');
const name = document.querySelector('.profile .name');
const timeRange = 1000;
const scrollTimeline = new ScrollTimeline({scrollSource, timeRange});

[ '--avatar-size',
  '--avatar-border',
  '--header-height',
  '--font-base',
  '--bar-height',
  '--spacer',
].forEach(name => {
  CSS.registerProperty({
    name,
    syntax: '<length>',
    initialValue: '0px',
    inherits: true
  });
});

const barEffect = new KeyframeEffect(
  bar,
  [
    {opacity: 0},
    {opacity: 1},
  ],
  {
    duration: 0,
    fill: 'both',
  }
);

const avatarEffect = new KeyframeEffect(
  avatar,
  [
    {transform: 'translateY(0) scale(1)'},
    {transform: 'translateY(0px) scale(0)', offset: 0},
    {transform: 'translateY(0px) scale(0)'},
  ],
  {
    duration: timeRange,
    fill: 'both',
  }
);
new WorkletAnimation(
  'twitter-header',
  avatarEffect,
  scrollTimeline,
  []
).play();

const followEffect = new KeyframeEffect(
  follow,
  [
    {transform: 'translateY(0)'},
    {transform: 'translateY(0)', offset: 0},
    {transform: 'translateY(0px)'},
  ],
  {
    duration: timeRange,
    fill: 'both',
  }
);
new WorkletAnimation(
  'twitter-header',
  followEffect,
  scrollTimeline,
  []
).play();

const nameEffect = new KeyframeEffect(
  name,
  [
    {transform: 'translateY(0)'},
    {transform: 'translateY(0)', offset: 0},
    {transform: 'translateY(0) translateX(0px)', offset: 0},
    {transform: 'translateY(0px) translateX(0px)'},
  ],
  {
    duration: timeRange,
    fill: 'both',
  }
);
new WorkletAnimation(
  'twitter-header',
  nameEffect,
  scrollTimeline,
  []
).play();

function updateTimings() {
  const scrollSourceStyles = document.body.computedStyleMap();
  const viewportHeight = scrollSource.clientHeight;
  const maxScroll = scrollSource.scrollHeight - viewportHeight;

  const avatarDistanceFromTop = scrollSourceStyles.get('--header-height').value / 2 - scrollSourceStyles.get('--avatar-size').value / 2 - scrollSourceStyles.get('--avatar-border').value;
  const timeWhenAvatarTouchesTop = avatarDistanceFromTop / maxScroll * timeRange;
  const maxAvatarOffset = maxScroll - avatarDistanceFromTop;
  const targetAvatarScale = scrollSourceStyles.get('--bar-height').value / (scrollSourceStyles.get('--avatar-size').value + scrollSourceStyles.get('--avatar-border').value * 2);

  const avatarEffectKeyFrames = avatarEffect.getKeyframes();
  avatarEffectKeyFrames[1].transform = \`translateY(0px) scale(\${targetAvatarScale})\`;
  avatarEffectKeyFrames[1].offset = timeWhenAvatarTouchesTop/timeRange;
  avatarEffectKeyFrames[2].transform = \`translateY(\${maxAvatarOffset}px) scale(\${targetAvatarScale})\`;
  avatarEffect.setKeyframes(avatarEffectKeyFrames);

  console.log(timeWhenAvatarTouchesTop);
  barEffect.duration = timeWhenAvatarTouchesTop;

  const followDistanceFromTop = scrollSourceStyles.get('--header-height').value / 2 + scrollSourceStyles.get('--spacer').value/2;
  const timeWhenFollowTouchesTop = followDistanceFromTop / maxScroll * timeRange;
  const maxFollowOffset = maxScroll - followDistanceFromTop;
  const followEffectKeyFrames = followEffect.getKeyframes();
  followEffectKeyFrames[1].offset = timeWhenFollowTouchesTop/timeRange;
  followEffectKeyFrames[2].transform = \`translateY(\${maxFollowOffset}px)\`;
  followEffect.setKeyframes(followEffectKeyFrames);

  const nameDistanceFromTop = name.offsetTop - scrollSourceStyles.get('--spacer').value;
  const timeWhenNameTouchesTop = nameDistanceFromTop / maxScroll * timeRange;
  const maxNameOffset = maxScroll - nameDistanceFromTop;
  const nameEffectKeyFrames = nameEffect.getKeyframes();
  const nameLeftOffset = scrollSourceStyles.get('--bar-height').value + scrollSourceStyles.get('--spacer').value/2;
  nameEffectKeyFrames[1].offset = timeWhenAvatarTouchesTop/timeRange;
  nameEffectKeyFrames[2].transform = \`translateY(0) translateX(\${nameLeftOffset}px)\`;
  nameEffectKeyFrames[2].offset = timeWhenNameTouchesTop/timeRange;
  nameEffectKeyFrames[3].transform = \`translateY(\${maxNameOffset}px) translateX(\${nameLeftOffset}px)\`;
  nameEffect.setKeyframes(nameEffectKeyFrames);
}
updateTimings();
window.addEventListener('resize', _ => updateTimings());`,css:`* {
  box-sizing: border-box;
}
/* Colors */
:root {
  --light-blue: rgb(230, 236, 240);
  --white: white;
  --grey: rgb(101, 119, 134);
  --light-grey: rgb(204, 214, 221);
  --blue: rgb(27, 149, 224);
  --black: rgb(20, 23, 26);
}

/* Dimensions */
:root {
  --avatar-size: 140px;
  --avatar-border: 4px;
  --header-height: 500px;
  --font-base: 15px;
  --bar-height: 50px;
  --spacer: 10px;
  --author-size: 50px;
}

html, body {
  margin: 0;
  border: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--light-blue);

  font-family: Helvetica;
  color: var(--black);
  font-size: var(--font-base);
}

body {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  backface-visibility: hidden;
}

a {
  text-decoration: none;
  color: var(--blue);
}

.bar {
  background-color: var(--white);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--bar-height);
  box-shadow: var(--grey) 0px 0px 4px;
  z-index: 2;
}

.profile, .tweets {
  background-color: var(--white);
  margin-bottom: calc(2 * var(--spacer));
}

.profile {
  position: relative;
  min-height: var(--header-height);
  background-image: url('http://houdini.glitch.me/animation/landscape.svg');
  background-size: auto calc(var(--header-height) / 2);
  background-position: 50% 0%;
  background-repeat: no-repeat;
  padding: var(--spacer);
  padding-top: 0;

  display: flex;
  flex-direction: column;
}

.profile > * {
  margin: 0;
}

.profile .avatar {
  box-sizing: content-box;
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  border: var(--avatar-border) solid var(--white);
  margin-left: calc(var(--avatar-border) * -1);
  margin-top: calc(var(--header-height) / 2 - var(--avatar-size) / 2 - var(--avatar-border));
  margin-bottom: var(--spacer);
  transform-origin: var(--avatar-border) 0%;
  z-index: 3;
  background-color: var(--light-grey);
}

.profile .name {
  font-size: calc(var(--font-base) * 4/3);
  position: relative;
  z-index: 3;
}

.profile .handle {
  font-size: var(--font-base);
  color: var(--grey);
  margin-bottom: var(--font-base);
  font-weight: normal;
}

.profile .description {
  flex-grow: 1;
}

.profile .stats, .profile .meta {
  color: var(--grey);
  display: flex;
  flex-direction: row;
}

.profile .meta {
  margin: calc(1.5 * var(--spacer)) 0;
}

.profile .location, .profile .homepage {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
}

.profile .location:before, .profile .homepage:before {
  display: inline-block;
  content: '';
  width: 1.3em;
  height: 1.3em;
  margin-right: 0.2em;
}

// .profile .homepage:before {
//   margin-left: calc(2* var(--spacer));
//   background-image: url('/animation/homepage.svg');
// }

.profile .stats > * {
  font-weight: bold;
  color: var(--black);
  margin-right: 0.2em;
}

.profile .followers {
  margin-left: calc(2 * var(--spacer));
}

.profile .follow {
  position: absolute;
  z-index: 3;
  color: var(--blue);
  border: 1px solid var(--blue);
  border-radius: calc(1em + var(--spacer));
  font-weight: bold;
  font-size: calc(var(--font-base) * 3/3);
  padding: var(--spacer) calc(2 * var(--spacer));
  top: calc(var(--header-height) / 2 + var(--spacer));
  right: var(--spacer);
}

.tweet {
  border-bottom: 1px solid var(--light-grey);
  padding: var(--spacer);
  padding-left: calc(var(--author-size) + 2 * var(--spacer));
}

.tweet .meta {
  color: var(--grey);
}

.tweet .meta .name {
  font-weight: bold;
  color: var(--black);
}

.tweet .meta .handle:after {
  content: '•';
  margin-left: 0.2em;
}

.tweet .avatar {
  width: var(--author-size);
  height: var(--author-size);
  margin: 0;
  margin-left: calc((var(--author-size) + var(--spacer)) * -1);
  float: left;
  border-radius: 50%;
  background-color: var(--light-grey);
}

.tweet .media {
  margin: var(--spacer) 0;
  border: 1px solid var(--light-grey);
  border-radius: 12px; /* FIXME */
  overflow: hidden;
  padding: var(--spacer);
}

.tweet .media .domain {
  color: var(--grey);
}

.tweet .media img {
  margin-top: calc(-1 * var(--spacer));
  margin-left: calc(-1 * var(--spacer));
  margin-bottom: var(--spacer);
  width: 100%;
  border-bottom: 1px solid var(--light-grey);
}

.tweet .media p {
  margin: 0;
}

.tweet .media p + p{
  margin-top: var(--spacer);
}

/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/`,html:`<div class="bar">
</div>
<header class="profile">
  <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
  <h1 class="name">Houdini Bunny</h1>
  <h2 class="handle">@HoudiniBunny</h2>
  <section class="description">
    Makes cute web technology awesome
    <br/>
    <br/>
    <a href="#">houdini.glitch.me</a>
  </section>
  <section class="meta">
    <span class="location">🎩</span>
    <a class="homepage" href="https://snugug.com">snugug.com</a>
  </section>
  <section class="stats">
    <span class="following">1,337</span> Following
    <span class="followers">9,659</span> Followers
  </section>
  <button class="follow">Follow</button>
</header>
<section class="tweets">
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta"> <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New Carrot-🥕 Carrots are yummy! You should eat some
  </section>
  <section class="tweet">
    <img src="http://houdini.glitch.me/animation/bunny.svg" class="avatar">
    <section class="meta">
      <span class="name">Houdini Bunny</span>
      <span class="handle">@HoudiniBunny</span>
      <span class="date">Dec 27</span>
    </section>
    🐰 New post-🎩 I'm making magic now!
  </section>
</section>`},parallax:{name:'Parallax',features:['Multiply our timeline with a rate to create a parallax effect'],worklet:`registerAnimator('parallax', class {
  constructor(options) {
    this._rate = options.rate;
  }

  animate(currentTime, effect) {
    effect.localTime = currentTime * this._rate;
  }
});`,js:`const scrollSource = document.scrollingElement;
const timeRange = 1000;
const scrollTimeline = new ScrollTimeline({scrollSource, timeRange});

const one = document.querySelector('#one');
const two = document.querySelector('#two');
const three = document.querySelector('#three');
const four = document.querySelector('#four');
const bunny = document.querySelector('#bunny');

new WorkletAnimation('parallax', new KeyframeEffect(
  one,
  [ {transform: 'translateY(0)'}, {transform: 'translateY(-200vh)'} ],
  { duration: timeRange }
), scrollTimeline, { rate: .25 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  two,
  [ {transform: 'translateY(0)'}, {transform: 'translateY(-200vh)'} ],
  { duration: timeRange }
), scrollTimeline, { rate: 1 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  three,
  [ {transform: 'translateY(0)', opacity: 1}, {transform: 'translateY(-200vh)', opacity: 0} ],
  { duration: timeRange }
), scrollTimeline, { rate: 2 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  four,
  [ {transform: 'translateY(0)'}, {transform: 'translateY(-200vh)'} ],
  { duration: timeRange }
), scrollTimeline, { rate: 4 }).play();

new WorkletAnimation('parallax', new KeyframeEffect(
  bunny,
  [ {transform: 'translateY(0) scale(.25)', opacity: 0}, {transform: 'translateY(-200vh) scale(1)', opacity: 1} ],
  { duration: timeRange }
), scrollTimeline, { rate: 4 }).play();`,css:`div {
  height: 33vh;
  width: 33vw;
  margin-top: 25vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  color: white;
  text-shadow: 2px 2px black, -2px -2px black, -2px 2px black, 2px -2px black;
}

#one {
  background: rgba(255, 0, 0, .75);
  margin-left: 50vw;
}

#two {
  background: rgba(0, 255, 0, .75);
  margin-left: 33vw;
}

#three {
  background: rgba(0, 0, 255, .75);
  margin-left: 60vw;
}

#four {
  background: rgba(255, 0, 255, .75);
  margin-left: 10vw;
}`,html:`<div id="one">One</div>
<div id="two">Two</div>
<div id="three">Three</div>
<div id="four">Four</div>
<img src="http://houdini.glitch.me/animation/bunny.svg" alt="Cute Bunny" id="bunny" />`}},layoutSettings={"centered blocks":{name:'Centered Blocks',features:['A simple stacking of elements centered in their parent'],worklet:`registerLayout('block-like', class {
  static get inputProperties() {
    return ['--gap'];
  }

  *intrinsicSizes(children, edges, styleMap) {
    const childrenSizes = yield children.map((child) => {
      return child.intrinsicSizes();
    });

    const maxContentSize = childrenSizes.reduce((max, childSizes) => {
      return Math.max(max, childSizes.maxContentSize);
    }, 0);

    const minContentSize = childrenSizes.reduce((max, childSizes) => {
      return Math.max(max, childSizes.minContentSize);
    }, 0);

    return {maxContentSize, minContentSize};
  }

  *layout(children, edges, constraints, styleMap) {
    const availableInlineSize = constraints.fixedInlineSize;
    const availableBlockSize = constraints.fixedBlockSize;

    const childConstraints = { availableInlineSize, availableBlockSize };

    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment(childConstraints);
    });

    let blockOffset = 0;
    for (let fragment of childFragments) {
      // Position the fragment in a block like manner, centering it in the
      // inline direction
      fragment.blockOffset = blockOffset;
      fragment.inlineOffset = (availableInlineSize - fragment.inlineSize) / 2;

      blockOffset += fragment.blockSize + styleMap.get('--gap').value;
    }

    const autoBlockSize = blockOffset;

    return {
      autoBlockSize,
      childFragments,
    };
  }
});`,js:`CSS.registerProperty({
  name: '--gap',
  syntax: '<number>',
  inherits: false,
  initialValue: 5,
});`,css:`.parent {
  display: layout(block-like);
  --gap: 10;
}

.one {
  border: 2px solid red;
}

.two {
  border: 2px dashed orange;
}

.three {
  border: 2px solid yellow;
}

.four {
  border: 2px dashed green;
}

.five {
  border: 2px solid blue;
}

.block {
  height: 25vh;
  display: flex;
  justify-items: vertical;
  align-items: center;
}
`,html:`<div class="parent">
  <div class="block one">Hello</div>
  <div class="block two">World</div>
  <div class="block three">How</div>
  <div class="block four">Are</div>
  <div class="block five">You?</div>
</div>`},masonry:{name:'Masonry',features:['C\'mon! Masonry with adjustable columns and padding'],worklet:`// From https://github.com/GoogleChromeLabs/houdini-samples

registerLayout('masonry', class {
  static get inputProperties() {
    return [ '--padding', '--columns' ];
  }

  *intrinsicSizes() { /* TODO implement :) */ }
  *layout(children, edges, constraints, styleMap) {
    const inlineSize = constraints.fixedInlineSize;

    const padding = parseInt(styleMap.get('--padding'));
    const columnValue = styleMap.get('--columns');

    // We also accept 'auto', which will select the BEST number of columns.
    let columns = parseInt(columnValue);
    if (columnValue == 'auto' || !columns) {
      columns = Math.ceil(inlineSize / 350); // MAGIC NUMBER \o/.
    }

    // Layout all children with simply their column size.
    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
    const childFragments = yield children.map((child) => {
      return child.layoutNextFragment({fixedInlineSize: childInlineSize});
    });

    let autoBlockSize = 0;
    const columnOffsets = Array(columns).fill(0);
    for (let childFragment of childFragments) {
      // Select the column with the least amount of stuff in it.
      const min = columnOffsets.reduce((acc, val, idx) => {
        if (!acc || val < acc.val) {
          return {idx, val};
        }

        return acc;
      }, {val: +Infinity, idx: -1});

      childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx;
      childFragment.blockOffset = padding + min.val;

      columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
      autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
    }

    return {autoBlockSize, childFragments};
  }
});

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`,js:`CSS.registerProperty({
  name: '--padding',
  syntax: '<number>',
  inherits: false,
  initialValue: 0,
});

CSS.registerProperty({
  name: '--columns',
  syntax: '<number> | auto',
  inherits: false,
  initialValue: 'auto',
});`,css:`body {
  display: layout(masonry);
  --padding: 10;
  --columns: 3;
}
div {
  background-color: hsl(0, 80%, 20%);
  color: hsl(0, 80%, 95%);
  font: 12px sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
div::first-letter {
  font-size: 200%;
}`,html:`<div>1 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. </div>

<div>2 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret</div>

<div>3 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>4 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>5 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>6 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>7 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>8 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>

<div>9 Lorem ipsum dolor sit amet, consul disputando ne his, et vim accumsan ponderum. Rebum deseruisse ex vix. Vix stet honestatis definitionem an, et natum ocurreret cum, semper interpretaris cu mea. Eam saperet fierent luptatum no. Ius ei dicunt detracto elaboraret.</div>`}};stageFright({navigation:{arrows:!1,spacebar:'alt'},notes:'alt'});const propsRepl=new REPL('#props-repl',propsSettings,'props'),paintRepl=new REPL('#paint-repl',paintSettings,'paint'),animationRepl=new REPL('#animation-repl',animationSettings,'animation'),layoutRepl=new REPL('#layout-repl',layoutSettings,'layout');window.CSS&&CSS.registerProperty&&(CSS.registerProperty({name:'--brush-color',syntax:'<color>',inherits:!0,initialValue:'#784ca5'}),CSS.registerProperty({name:'--offset',syntax:'<number>',inherits:!0,initialValue:.25}),CSS.registerProperty({name:'--padding',syntax:'<number>',inherits:!0,initialValue:5}),CSS.registerProperty({name:'--art-color',syntax:'<color>',inherits:!1,initialValue:'white'}),CSS.registerProperty({name:'--art-steps',syntax:'<number>',inherits:!1,initialValue:40}),CSS.registerProperty({name:'--art-alpha',syntax:'<number>',inherits:!1,initialValue:1}),CSS.registerProperty({name:'--prime-color',syntax:'<color>',inherits:!0,initialValue:'rebeccapurple'})),CSS.paintWorklet&&(CSS.paintWorklet.addModule('js/paint/brushstroke.not.min.js'),CSS.paintWorklet.addModule('js/paint/holman.not.min.js'),CSS.paintWorklet.addModule('js/paint/switcher.not.min.js')),CSS.layoutWorklet&&CSS.layoutWorklet.addModule('js/layout/blueprint.not.min.js');
//# sourceMappingURL=../maps/main.js.map
