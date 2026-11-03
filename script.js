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
  const area=button.closest('.actions').getBoundingClientRect();
  const yesRect=button.parentElement.querySelector('.button-yes').getBoundingClientRect();
  const oldX=Number(button.dataset.hopX||0);
  const oldY=Number(button.dataset.hopY||0);
  const baseLeft=rect.left-oldX;
  const baseTop=rect.top-oldY;
  let minX=Math.max(-72,area.left+4-baseLeft,yesRect.right+8-baseLeft);
  let maxX=Math.min(72,area.right-rect.width-4-baseLeft);
  if(minX>maxX)minX=maxX=oldX;
  const minY=Math.max(-30,area.top+3-baseTop);
  const maxY=Math.min(30,area.bottom-rect.height-3-baseTop);
  const hop=Number(button.dataset.hopCount||0)+1;
  const x=hop%2===1?minX:maxX;
  const y=hop%2===1?maxY:minY;
  button.dataset.hopX=String(x);
  button.dataset.hopY=String(y);
  button.dataset.hopCount=String(hop);
  button.style.position='relative';
  button.style.left=`${x}px`;
  button.style.top=`${y}px`;
  button.style.zIndex='2';
  button.style.transition='left .2s ease, top .2s ease, transform .2s ease';
  button.style.transform=hop%2===1?'rotate(-5deg)':'rotate(5deg)';
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
