/* ── CURSOR ── */
const cur=document.getElementById('cur');
document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
document.querySelectorAll('a,button,select,.sysmap-node,.ccard,.svc-row,.tpill').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});

/* ── MOBILE NAV ── */
function openDrawer(){document.getElementById('navDrawer').classList.add('open');document.getElementById('burger').classList.add('open')}
function closeDrawer(){document.getElementById('navDrawer').classList.remove('open');document.getElementById('burger').classList.remove('open')}

/* ── DARK/LIGHT ── */
function toggleMode(){
  document.body.classList.toggle('lm');
  const L=document.body.classList.contains('lm');
  document.getElementById('tlL').style.opacity=L?.4:1;
  document.getElementById('tlR').style.opacity=L?1:.4;
}

/* ── REVEAL ── */
const obs=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('v'),i*60)});
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ── ACCORDION ── */
function toggleSvc(row){
  const item=row.closest('.svc-item'),open=item.classList.contains('open');
  document.querySelectorAll('.svc-item').forEach(i=>i.classList.remove('open'));
  if(!open)item.classList.add('open');
}

/* ── FLYING CARD (desktop only) ── */
(function(){
  const isMobile=()=>window.innerWidth<=768;
  const flyCard=document.getElementById('flyCard');
  const hGhost=document.getElementById('heroGhost');
  const aGhost=document.getElementById('aboutGhost');
  const hCircle=document.getElementById('hCircle');
  const hL=document.getElementById('hL');
  const hR=document.getElementById('hR');

  function lerp(a,b,t){return a+(b-a)*t}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}

  function hPos(){const r=hGhost.getBoundingClientRect();return{l:r.left,t:r.top,w:r.width,h:r.height}}
  function aPos(){const r=aGhost.getBoundingClientRect();return{l:r.left,t:r.top,w:r.width,h:r.height}}

  function applyCard(l,t,w,h,ry){
    flyCard.style.left=l+'px'; flyCard.style.top=t+'px';
    flyCard.style.width=w+'px'; flyCard.style.height=h+'px';
    flyCard.style.transform=`perspective(1200px) rotateY(${ry}deg)`;
  }

  function init(){
    if(isMobile()){flyCard.style.opacity='0';return}
    const hp=hPos();
    applyCard(hp.l,hp.t,hp.w,hp.h,0);
    flyCard.style.opacity='1';
  }

  function onScroll(){
    if(isMobile())return;
    const sy=window.scrollY,vh=window.innerHeight;
    const animEnd=vh*1.4;
    const p=Math.max(0,Math.min(1,sy/animEnd));
    const ep=ease(p);
    const tf=Math.min(1,p/.45);
    hL.style.transform=`translateX(${-tf*100}px) translateY(${-tf*30}px)`;
    hL.style.opacity=String(1-tf*1.3);
    hR.style.transform=`translateX(${tf*100}px) translateY(${-tf*30}px)`;
    hR.style.opacity=String(1-tf*1.3);
    hCircle.style.opacity=String(1-tf*1.5);
    const hp=hPos(),ap=aPos();
    const tp=Math.max(0,Math.min(1,(p-.3)/.7));
    const te=ease(tp);
    const l=lerp(hp.l,ap.l,te),t2=lerp(hp.t,ap.t,te);
    const w=lerp(hp.w,ap.w,te),h=lerp(hp.h,ap.h,te);
    const ry=ep*180;
    const arc=Math.sin(p*Math.PI)*36;
    applyCard(l,t2-arc,w,h,ry);
  }

  requestAnimationFrame(()=>requestAnimationFrame(init));
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',()=>{init();onScroll()});
  onScroll();

  /* parallax */
  document.getElementById('hero').addEventListener('mousemove',e=>{
    if(isMobile()||window.scrollY>window.innerHeight*.2)return;
    const rect=document.getElementById('hero').getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-.5;
    const y=(e.clientY-rect.top)/rect.height-.5;
    const hp=hPos();
    flyCard.style.left=(hp.l+x*16)+'px';
    flyCard.style.top=(hp.t+y*10)+'px';
    hCircle.style.transform=`translate(${x*-22}px,${y*-14}px)`;
  });
})();

/* ── SYSTEM MAP (project nodes) ── */
const sysProjects=[
  {tag:'Computer Vision · Face Recognition',title:'Proxy Detection System',desc:'Designed and deployed an AI-powered identity verification system that detects proxy attendance and impersonation attempts using face recognition, facial embeddings, and similarity analysis, improving authentication security in production.',link:'https://github.com/Rahul2924/Proxy_Detection_System',status:'Production'},
  {tag:'Deep Learning · Anti-Spoofing',title:'Liveness Detection System',desc:'Built a production-grade liveness detection solution capable of identifying spoof attacks from printed photos, mobile displays, and replay videos using deep learning and computer vision, strengthening secure identity verification.',link:'https://github.com/Rahul2924/Liveness_Detection_System',status:'Production'},
  {tag:'YOLO · Computer Vision',title:'Human Intrusion Detection System',desc:'Developed a real-time surveillance system that detects unauthorized human intrusion using deep learning object detection models, enabling instant monitoring and automated security alerts for restricted environments.',link:'https://github.com/Rahul2924/Intrusion-Detection_System',status:'Production'},
  {tag:'LLM · RAG · NLP',title:'RAG Model Chatbot',desc:'Engineered an enterprise Retrieval-Augmented Generation (RAG) chatbot that combines vector search with large language models to provide accurate, context-aware responses from organization-specific documents and knowledge bases.',link:'https://github.com/Rahul2924/RAG-CHATBOT',status:'Production'},
  {tag:'Generative AI · Automation',title:'AI PPT Generation System',desc:'Built an AI-powered presentation generation platform that transforms user prompts into professional PowerPoint presentations by automatically generating structured content, slide layouts, and visual elements using large language models.',link:'https://github.com/Rahul2924/SlideFlow-AI#',status:'Production'}
];
function selectNode(i){
  document.querySelectorAll('.sysmap-node').forEach((n,idx)=>n.classList.toggle('active',idx===i));
  document.querySelectorAll('.sysmap-line').forEach((l,idx)=>l.classList.toggle('active',idx===i));
  const p=sysProjects[i];
  document.getElementById('sysmapPanel').innerHTML=
    '<div class="sysmap-panel-tag">'+p.tag+'</div>'+
    '<div class="sysmap-panel-title">'+p.title+'</div>'+
    '<p class="sysmap-panel-desc">'+p.desc+'</p>'+
    '<a href="'+p.link+'" target="_blank" class="sysmap-panel-link">View Source <i class="fa-solid fa-arrow-up-right"></i></a>'+
    '<div class="sysmap-panel-status"><span class="dot"></span>Status: '+p.status+'</div>';
}
selectNode(0);

/* ── FORM ── */
function sendMsg(){
  const n=document.getElementById('cfn').value.trim();
  const e=document.getElementById('cfe').value.trim();
  const ok=document.getElementById('msgOk'),err=document.getElementById('msgErr');
  if(!n||!e){err.textContent='Please fill in your name and email.';err.style.display='block';ok.style.display='none';return}
  ok.textContent=`Thanks ${n}! I'll be in touch soon.`;ok.style.display='block';err.style.display='none';
  ['cfn','cfe','cfm'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('cfs').value='';
  setTimeout(()=>ok.style.display='none',5000);
}

const form = document.getElementById("contactForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = {
        name: document.getElementById("cfn").value.trim(),
        email: document.getElementById("cfe").value.trim(),
        number: document.getElementById("cph").value.trim(),
        service: document.getElementById("cfs").value,
        content: document.getElementById("cfm").value.trim()
    };

    try {

        // Updated to point to your Formspree endpoint
        const response = await fetch(
            "https://formspree.io/f/mykqovnn",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json" // Required by Formspree to return JSON instead of redirecting
                },
                body: JSON.stringify(data)
            }
        );

        // Formspree returns 200 OK on success
        if (response.ok) {

            const ok = document.getElementById("msgOk");
            const err = document.getElementById("msgErr");

            ok.textContent = `Thanks ${data.name}! I'll be in touch soon.`;
            ok.style.display = "block";
            err.style.display = "none";

            form.reset();

            setTimeout(() => {
                ok.style.display = "none";
            }, 5000);

        } else {
            // Handle Formspree validation errors
            const result = await response.json().catch(() => ({}));
            const ok = document.getElementById("msgOk");
            const err = document.getElementById("msgErr");

            let errMsg = "Oops! There was a problem submitting your form.";
            if (result.errors && result.errors.length > 0) {
                errMsg = result.errors.map(errItem => errItem.message).join(", ");
            } else if (result.message) {
                errMsg = result.message;
            }

            err.textContent = errMsg;
            err.style.display = "block";
            ok.style.display = "none";
        }

    } catch (error) {

        const ok = document.getElementById("msgOk");
        const err = document.getElementById("msgErr");

        err.textContent = "Unable to connect to the server.";
        err.style.display = "block";
        ok.style.display = "none";

        console.error(error);
    }

});