document.addEventListener("DOMContentLoaded", () => {
  const submissions = [];

  // TAB
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
      if(btn.dataset.target==="submissions") renderCharts();
    });
  });

  // "지역 기타" 입력 제어
  const regionRadios = document.querySelectorAll('input[name="region"]');
  const regionOtherInput = document.querySelector('input[name="regionOther"]');
  regionRadios.forEach(radio=>{
    radio.addEventListener('change',()=>{
      if(radio.value==="기타"){
        regionOtherInput.style.display='block';
        regionOtherInput.required=true;
      }else{
        regionOtherInput.style.display='none';
        regionOtherInput.required=false;
      }
    });
  });

  // FORM SUBMIT
  const form=document.getElementById("petSurveyForm");
  const msg=document.getElementById("msg");
  const submissionsList=document.getElementById("submissionsList");

  const keyMap={
    hasPet:"반려동물 보유",
    region:"지역",
    regionOther:"직접 입력 지역",
    priorityCriteria:"병원 선택 기준",
    concernAndFeature:"불만/필요 기능",
    priority1:"1순위 정보",
    priority2:"2순위 정보",
    priceRange:"최대 지불 의향"
  };

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    msg.textContent="💌 제출이 완료되었습니다!";
    const data=new FormData(form);
    const payload={};
    for(const [k,v] of data.entries()) payload[k]=v;

    // submissions 저장
    submissions.push(payload);

    // submissions list에 추가, 불필요 기본값 제거
    const card=document.createElement("div");
    card.className="record";
    let html=Object.entries(payload).filter(([k,v])=>{
      if(k==="regionOther" && payload.region!=="기타") return false;
      if(k==="hasPet" && v==="예") return false;
      return v!=="";
    }).map(([k,v])=>`<div><strong>${keyMap[k]||k}:</strong> ${v}</div>`).join("");
    if(html==="") html="<div>제출된 정보 없음</div>";
    card.innerHTML=html;
    submissionsList.prepend(card);

    form.reset();
    regionOtherInput.style.display='none';
    
    // 제출 후 '다른 사람 의견 보기' 탭을 자동으로 클릭하여 그래프를 표시합니다.
    document.querySelector('.tab-btn[data-target="submissions"]').click();
  });

  // CHART
  function renderCharts(){
    const regionCount={};
    const priceCount={};

    submissions.forEach(s=>{
      // 지역
      let reg=s.region==="기타"? s.regionOther:s.region;
      if(reg) regionCount[reg]=(regionCount[reg]||0)+1;
      // 가격
      let price=s.priceRange;
      if(price) priceCount[price]=(priceCount[price]||0)+1;
    });

    // REGION CHART
    const ctxR=document.getElementById("regionChart").getContext("2d");
    // destroy 오류 해결: window.regionChart가 객체이고, destroy가 함수인지 확인
    if (window.regionChart && typeof window.regionChart.destroy === 'function') {
        window.regionChart.destroy();
    }
    window.regionChart=new Chart(ctxR,{
      type:'bar',
      data:{
        labels:Object.keys(regionCount),
        datasets:[{
          label:'응답 수',
          data:Object.values(regionCount),
          backgroundColor:'rgba(255,77,79,0.7)'
        }]
      },
      options:{responsive:true,plugins:{legend:{display:false}}}
    });

    // PRICE CHART
    const ctxP=document.getElementById("priceChart").getContext("2d");
    // destroy 오류 해결: window.priceChart가 객체이고, destroy가 함수인지 확인
    if(window.priceChart && typeof window.priceChart.destroy === 'function') {
        window.priceChart.destroy();
    }
    window.priceChart=new Chart(ctxP,{
      type:'bar',
      data:{
        labels:Object.keys(priceCount),
        datasets:[{
          label:'응답 수',
          data:Object.values(priceCount),
          backgroundColor:'rgba(255,159,67,0.7)'
        }]
      },
      options:{responsive:true,plugins:{legend:{display:false}}}
    });
  }
});
