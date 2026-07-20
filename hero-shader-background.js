// Exact Paper Shaders MeshGradient layers from the supplied component.
;(async function(){
  const hero=document.querySelector('.hero')
  if(!hero||hero.dataset.paperShaderReady==='true')return
  hero.dataset.paperShaderReady='true'

  const style=document.createElement('style')
  style.dataset.feature='hero-paper-mesh-gradient'
  style.textContent=`
    .hero{position:relative;isolation:isolate;overflow:hidden;background:#000!important}
    .hero-paper-shaders{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:#000}
    .hero-paper-shaders>div{position:absolute;inset:0;width:100%;height:100%}
    .hero-paper-shaders canvas{width:100%!important;height:100%!important;display:block}
    .hero>.hero-glow{display:none!important}
    .hero>.container{position:relative;z-index:1}
    .hero .hero-panorama-fade--left{background:linear-gradient(90deg,#000 3%,rgba(0,0,0,0) 100%)}
    .hero .hero-panorama-fade--right{background:linear-gradient(270deg,#000 3%,rgba(0,0,0,0) 100%)}
  `
  document.head.appendChild(style)

  const mount=document.createElement('div')
  mount.className='hero-paper-shaders'
  mount.setAttribute('aria-hidden','true')
  hero.insertBefore(mount,hero.firstChild)

  try{
    const ReactModule=await import('https://esm.sh/react@19.1.1')
    const React=ReactModule.default||ReactModule
    const ReactDOM=await import('https://esm.sh/react-dom@19.1.1/client?deps=react@19.1.1')
    const Shaders=await import('https://esm.sh/@paper-design/shaders-react@0.0.77?deps=react@19.1.1')
    const MeshGradient=Shaders.MeshGradient
    if(!MeshGradient)throw new Error('MeshGradient export not found')

    const root=ReactDOM.createRoot(mount)
    root.render(
      React.createElement(React.Fragment,null,
        React.createElement(MeshGradient,{
          style:{position:'absolute',inset:0,width:'100%',height:'100%'},
          colors:['#000000','#06b6d4','#0891b2','#164e63','#f97316'],
          speed:0.3,
          backgroundColor:'#000000'
        }),
        React.createElement(MeshGradient,{
          style:{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.6},
          colors:['#000000','#ffffff','#06b6d4','#f97316'],
          speed:0.2,
          wireframe:true,
          backgroundColor:'transparent'
        })
      )
    )
  }catch(error){
    console.error('Paper MeshGradient failed to load',error)
    mount.remove()
  }
})()
