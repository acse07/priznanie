const stages=[...document.querySelectorAll('.stage')];
const dots=[...document.querySelectorAll('.stage-dot')];
const stageLabel=document.querySelector('.stage-label');
const toast=document.getElementById('toast');
const confetti=document.getElementById('confetti');
let toastTimer;
const runawayHomes=new WeakMap();

function resetRunawayButtons(){
  document.querySelectorAll('.button-no').forEach(button=>{
    const home=runawayHomes.get(button);
    if(!home)return;
    home.parent.insertBefore(button,home.next);
    button.removeAttribute('style');
    delete button.dataset.hopX;
    delete button.dataset.hopY;
    delete button.dataset.hopCount;
    runawayHomes.delete(button);
  });
}

function showStage(index){
  resetRunawayButtons();
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
  if(!runawayHomes.has(button))runawayHomes.set(button,{parent:button.parentElement,next:button.nextSibling});
  document.body.appendChild(button);
  const pad=16;
  const maxX=Math.max(pad,window.innerWidth-rect.width-pad);
  const maxY=Math.max(pad,window.innerHeight-rect.height-pad);
  let x=pad+Math.random()*(maxX-pad);
  let y=pad+Math.random()*(maxY-pad);
  let tries=0;
  while(Math.hypot(x-rect.left,y-rect.top)<Math.max(rect.width,70)&&tries<12){
    x=pad+Math.random()*(maxX-pad);
    y=pad+Math.random()*(maxY-pad);
    tries++;
  }
  button.style.position='fixed';
  button.style.left=`${x}px`;
  button.style.top=`${y}px`;
  button.style.zIndex='11';
  button.style.transition='left .2s ease, top .2s ease, transform .2s ease';
  button.style.transform=`rotate(${Math.random()*12-6}deg)`;
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

