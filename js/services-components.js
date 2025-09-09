class RoseServiceCard extends HTMLElement{
  static get observedAttributes(){ return ['title','desc','color','variant','classname','aria-label']; }
  constructor(){
    super();
    this.attachShadow({mode:'open'});
  }
  attributeChangedCallback(){ this.render(); }
  connectedCallback(){ this.render(); }
  getAttr(name, fallback=''){ return this.getAttribute(name) ?? fallback; }
  computeTextColor(hex){
    const c = (hex||'').trim().toLowerCase();
    const map = { '#b5a304':'#000000', '#a62b0c':'#ffffff', '#163b60':'#ffffff', '#e7e1d6':'#163b60', '#ffffff':'#000000', '#000000':'#ffffff' };
    if(map[c]) return map[c];
    const m = c.match(/^#([0-9a-f]{6})$/i); if(!m) return '#000000';
    const r=parseInt(m[1].slice(0,2),16), g=parseInt(m[1].slice(2,4),16), b=parseInt(m[1].slice(4,6),16);
    const sr=r/255, sg=g/255, sb=b/255;
    const lin = v=> (v<=0.03928? v/12.92: Math.pow((v+0.055)/1.055,2.4));
    const L = 0.2126*lin(sr)+0.7152*lin(sg)+0.0722*lin(sb);
    return L > 0.6 ? '#000000' : '#ffffff';
  }
  render(){
    const title = this.getAttr('title');
    const desc = this.getAttr('desc');
    const color = this.getAttr('color','#e7e1d6');
    const variant = (this.getAttr('variant','fill')||'fill').toLowerCase();
    const className = this.getAttr('className','');
    const aria = this.getAttr('aria-label', `Service: ${title||''}`);
    const textColor = this.computeTextColor(color);

    const idBase = `rose-${Math.random().toString(36).slice(2)}`;
    const clipId = `${idBase}-clip`;
    const maskId = `${idBase}-mask`;
    const petalPath = `M256,40 C302,28 338,44 364,72 C392,102 408,140 402,174 C440,186 468,212 480,248 C492,284 488,324 468,356 C450,386 420,408 386,414 C380,448 360,478 330,496 C300,514 264,518 232,506 C198,494 170,468 158,436 C126,444 92,438 66,418 C38,396 22,364 20,330 C18,296 30,262 54,238 C44,202 48,164 66,134 C86,100 120,78 160,74 C186,46 220,32 256,40 z`;

    const style = `
      :host{ display:block }
      .card{ position:relative; width:100%; height:100%; aspect-ratio:1/1; display:block }
      svg{ width:100%; height:100%; display:block; overflow:visible; }
      .outline{ stroke:#163b60; stroke-opacity:.35; stroke-width:2; fill:none }
      .hover{ transition: transform .25s ease, filter .25s ease; will-change: transform; }
      .container{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:16px }
      .inner{ width:82%; max-width:82%; text-align:center; margin:auto }
      .title{ font-family: var(--font-serif,'Fraunces',serif); font-weight:700; margin:0 0 .4rem; line-height:1.15; font-size: clamp(20px, 2.8vw, 28px) }
      .desc{ font-family: var(--font-sans,'Inter',sans-serif); margin:0; line-height:1.45; font-size: clamp(14px, 2vw, 16px) }
      .shadow{ filter: drop-shadow(0 10px 26px rgba(0,0,0,.25)); }
      .sr{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap }
      @media (prefers-reduced-motion: reduce){ .hover{ transition:none } }
      .card:focus-visible .hover, .card:hover .hover{ transform: scale(1.02) rotate(-0.5deg); }
    `;

    const fillSvg = `
      <svg viewBox="0 0 512 512" aria-hidden="true" class="hover shadow">
        <defs>
          <clipPath id="${clipId}">
            <path d="${petalPath}" />
          </clipPath>
        </defs>
        <g>
          <path d="${petalPath}" fill="${color}" />
          <path d="${petalPath}" class="outline" />
        </g>
      </svg>
      <div class="container">
        <div class="inner" style="color:${textColor}" part="content">
          <div class="content-clip" style="clip-path:url(#${clipId}); -webkit-clip-path:url(#${clipId});">
            <h3 class="title">${title??''}</h3>
            <p class="desc">${desc??''}</p>
          </div>
        </div>
      </div>
    `;

    // Knockout: rose visible, text punched out
    const knockoutSvg = `
      <svg viewBox="0 0 512 512" aria-hidden="true" class="hover shadow">
        <defs>
          <mask id="${maskId}">
            <rect width="512" height="512" fill="black" />
            <path d="${petalPath}" fill="white" />
            <g fill="black" font-family="var(--font-serif,'Fraunces',serif)" font-weight="700" text-anchor="middle">
              <text x="256" y="230" font-size="32">${(title||'').toUpperCase()}</text>
            </g>
            <g fill="black" font-family="var(--font-sans,'Inter',sans-serif)" text-anchor="middle">
              <text x="256" y="270" font-size="18">${(desc||'')}</text>
            </g>
          </mask>
        </defs>
        <g mask="url(#${maskId})">
          <path d="${petalPath}" fill="${color}" />
        </g>
        <path d="${petalPath}" class="outline" />
      </svg>
      <span class="sr">${title??''}. ${desc??''}</span>
    `;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="card ${className||''}" role="img" aria-label="${aria}">
        ${variant==='knockout' ? knockoutSvg : fillSvg}
      </div>
    `;
  }
}

customElements.define('rose-service-card', RoseServiceCard);

class ServicesSection extends HTMLElement{
  constructor(){ super(); this.attachShadow({mode:'open'}); }
  connectedCallback(){ this.render(); }
  render(){
    const style = `
      :host{ display:block }
      .wrap{ position:relative; max-width:var(--maxw,1280px); margin:0 auto; padding: 0 2rem }
      .title{ font-family: var(--font-serif,'Fraunces',serif); font-weight:700; text-align:center; color:#ffffff; font-size: clamp(32px,5vw,56px); letter-spacing:.02em; margin:0 0 2rem }
      .stage{ position:relative; width:100%; aspect-ratio: 2/1; border-radius: 0; overflow: visible }
      .base{ position:absolute; inset:0; background:#e7e1d6; z-index:0 }
      .overlay{ position:absolute; inset:0; z-index:1 }
      .doodle{ position:absolute; pointer-events:none; opacity:.2; }
      .d1{ top:6%; left:8%; width:120px; height:120px; }
      .d2{ bottom:8%; right:10%; width:140px; height:140px; }
      svg.doodle path{ stroke:#163b60; stroke-width:2; fill:none; stroke-linecap:round }
    `;

    const petalPath = `M256,40 C302,28 338,44 364,72 C392,102 408,140 402,174 C440,186 468,212 480,248 C492,284 488,324 468,356 C450,386 420,408 386,414 C380,448 360,478 330,496 C300,514 264,518 232,506 C198,494 170,468 158,436 C126,444 92,438 66,418 C38,396 22,364 20,330 C18,296 30,262 54,238 C44,202 48,164 66,134 C86,100 120,78 160,74 C186,46 220,32 256,40 z`;

    const overlay = `
      <svg class="overlay" viewBox="0 0 1024 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <mask id="hole-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="768">
            <rect width="1024" height="768" fill="white" fill-opacity="1"/>
            <!-- four roses as holes (black) -->
            <g transform="translate(128,64) scale(0.72)">
              <path d="${petalPath}" fill="black" fill-opacity="1"/>
            </g>
            <g transform="translate(560,64) scale(0.72)">
              <path d="${petalPath}" fill="black" fill-opacity="1"/>
            </g>
            <g transform="translate(128,400) scale(0.72)">
              <path d="${petalPath}" fill="black" fill-opacity="1"/>
            </g>
            <g transform="translate(560,400) scale(0.72)">
              <path d="${petalPath}" fill="black" fill-opacity="1"/>
            </g>
          </mask>
        </defs>
        <rect width="1024" height="768" fill="#a62b0c" mask="url(#hole-mask)"/>
        <!-- optional outlines for definition -->
        <g stroke="#163b60" stroke-opacity=".35" stroke-width="2" fill="none">
          <g transform="translate(128,64) scale(0.6)"><path d="${petalPath}"/></g>
          <g transform="translate(560,64) scale(0.6)"><path d="${petalPath}"/></g>
          <g transform="translate(128,400) scale(0.6)"><path d="${petalPath}"/></g>
          <g transform="translate(560,400) scale(0.6)"><path d="${petalPath}"/></g>
        </g>
      </svg>
    `;

    const doodles = `
      <svg class="doodle d1" viewBox="0 0 100 100" aria-hidden="true"><path d="M10,60 C30,40 70,40 90,60"/></svg>
      <svg class="doodle d2" viewBox="0 0 120 120" aria-hidden="true"><path d="M20,30 l20,20 m0,-20 l-20,20"/></svg>
    `;

    const html = `
      <section class="wrap">
        <h2 class="title">MY SERVICES</h2>
        <div class="stage" role="img" aria-label="Cutout roses revealing background">
          <div class="base"></div>
          ${overlay}
          ${doodles}
        </div>
      </section>
    `;
    this.shadowRoot.innerHTML = `<style>${style}</style>${html}`;
  }
}

customElements.define('services-section', ServicesSection);


