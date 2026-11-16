/* Lightweight swipeable lightbox. Lightbox.open(list, index); list = [{src, cap}] */
(function(){
  var lb,track,slides,cnt,cap,list=[],idx=0,startX=0,startY=0,dx=0,dragging=false,W=0,lock=null;
  function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}
  function build(){
    lb=el('div','lb');lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
    var top=el('div','lb-top');cnt=el('span','lb-count');var close=el('button','lb-close','×');close.setAttribute('aria-label','关闭');
    top.appendChild(cnt);top.appendChild(close);
    track=el('div','lb-track');slides=[0,1,2].map(function(){var s=el('div','lb-slide');var im=new Image();im.alt='';im.decoding='async';s.appendChild(im);track.appendChild(s);return s;});
    cap=el('div','lb-cap');
    var prev=el('button','lb-nav lb-prev','‹'),next=el('button','lb-nav lb-next','›');
    lb.appendChild(track);lb.appendChild(top);lb.appendChild(cap);lb.appendChild(prev);lb.appendChild(next);
    document.body.appendChild(lb);
    close.onclick=hide;prev.onclick=function(e){e.stopPropagation();go(-1)};next.onclick=function(e){e.stopPropagation();go(1)};
    lb.addEventListener('touchstart',ts,{passive:true});lb.addEventListener('touchmove',tm,{passive:false});lb.addEventListener('touchend',te);
    lb.addEventListener('click',function(e){if(e.target.classList.contains('lb-slide'))hide();});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')hide();if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1);});
    window.addEventListener('resize',function(){if(lb.classList.contains('open'))render();});
  }
  function setImg(s,i){var im=s.firstChild;if(i<0||i>=list.length){im.removeAttribute('src');im.style.visibility='hidden';return;}im.style.visibility='';if(im.getAttribute('src')!==list[i].src)im.src=list[i].src;}
  function pos(off,anim){track.style.transition=anim?'transform .28s ease-out':'none';track.style.transform='translate3d('+(-W+off)+'px,0,0)';}
  function render(){W=window.innerWidth;setImg(slides[0],idx-1);setImg(slides[1],idx);setImg(slides[2],idx+1);pos(0,false);
    cnt.textContent=(idx+1)+' / '+list.length;cap.textContent=list[idx].cap||'';
    if(idx+2<list.length){var p=new Image();p.src=list[idx+2].src;}}
  function go(d){var n=idx+d;if(n<0||n>=list.length){pos(0,true);return;}
    pos(-d*W,true);setTimeout(function(){idx=n;// rotate slides so the already-loaded image is reused
      if(d>0){track.appendChild(slides[0]);slides.push(slides.shift());}else{track.insertBefore(slides[2],slides[0]);slides.unshift(slides.pop());}
      render();},280);}
  function ts(e){if(e.touches.length>1)return;dragging=true;lock=null;startX=e.touches[0].clientX;startY=e.touches[0].clientY;dx=0;}
  function tm(e){if(!dragging)return;var x=e.touches[0].clientX-startX,y=e.touches[0].clientY-startY;if(lock===null)lock=Math.abs(x)>Math.abs(y)?'x':'y';
    e.preventDefault();if(lock==='x'){dx=x;if((idx===0&&dx>0)||(idx===list.length-1&&dx<0))dx/=3;pos(dx,false);}else{dx=y;lb.style.opacity=Math.max(.35,1-Math.abs(y)/400);}}
  function te(){if(!dragging)return;dragging=false;
    if(lock==='x'){if(dx<-50)go(1);else if(dx>50)go(-1);else pos(0,true);}
    else if(lock==='y'){if(Math.abs(dx)>110)hide();lb.style.opacity='';}}
  function hide(){lb.classList.remove('open');document.body.classList.remove('noscroll');}
  window.Lightbox={open:function(l,i){if(!lb)build();list=l;idx=i||0;lb.classList.add('open');document.body.classList.add('noscroll');render();}};
})();
