const stages=[...document.querySelectorAll('.stage')];
const dots=[...document.querySelectorAll('.stage-dot')];
const stageLabel=document.querySelector('.stage-label');
const toast=document.getElementById('toast');
const confetti=document.getElementById('confetti');
let toastTimer;

function showStage(index){
  stages.forEach((stage,i)=>{stage.hidden=i!==index;stage.classList.toggle('is-active',i===index)});
  dots.forEach((dot,i)=>dot.classList.toggle('is-current',i===Math.min(index,1)));
  stageLabel.textContent=index===0?'маленький секрет · 01 / 02':index===1?'ещё один вопрос · 02 / 02':'счастливая глава · ♥';
  document.getElementById('top').scrollIntoView({behavior:'smooth',block:'center'});
}

function celebrate(){
  const colors=['#d77c83','#e7aa93','#edc678','#bc9dc4','#97b9a2','#f1c4b6'];
  const symbols=['♥','✦','✿','♡','•'];
  for(let i=0;i<64;i++){
    const piece=document.createElement('span');
    piece.className='confetti-piece';
    piece.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    piece.style.left=`${Math.random()*100}vw`;
    piece.style.color=colors[Math.floor(Math.random()*colors.length)];
    piece.style.fontSize=`${10+Math.random()*13}px`;
    piece.style.setProperty('--fall',`${2.2+Math.random()*2.1}s`);
    piece.style.setProperty('--drift',`${-90+Math.random()*180}px`);
    piece.style.setProperty('--spin',`${-360+Math.random()*720}deg`);
    confetti.appendChild(piece);
    piece.addEventListener('animationend',()=>piece.remove(),{once:true});
  }
}

function runAway(button){
  const rect=button.getBoundingClientRect();
  const pad=12;
  const maxX=Math.max(pad,window.innerWidth-rect.width-pad);
  const maxY=Math.max(pad,window.innerHeight-rect.height-pad);
  let x=pad+Math.random()*(maxX-pad);
  let y=pad+Math.random()*(maxY-pad);
  if(Math.abs(x-rect.left)<rect.width*1.5&&Math.abs(y-rect.top)<rect.height*1.5){
    x=rect.left>window.innerWidth/2?pad:maxX;
    y=rect.top>window.innerHeight/2?pad:maxY;
  }
  button.style.position='fixed';
  button.style.left=`${x}px`;
  button.style.top=`${y}px`;
  button.style.zIndex='11';
  button.style.transition='left .2s ease, top .2s ease, transform .2s ease';
  button.style.transform='rotate(-7deg) scale(.96)';
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),1050);
}

document.getElementById('love-yes').addEventListener('click',()=>showStage(1));
document.getElementById('date-yes').addEventListener('click',()=>{showStage(2);celebrate()});
document.getElementById('again').addEventListener('click',()=>showStage(0));
for(const button of document.querySelectorAll('.button-no')){
  button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')runAway(button)});
  button.addEventListener('pointerdown',event=>{event.preventDefault();runAway(button)});
  button.addEventListener('click',event=>{event.preventDefault();runAway(button)});
}
