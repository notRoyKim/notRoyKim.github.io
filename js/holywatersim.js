const enchStruct = {
  id72001 : { min: 1, max: 6, value: "최대 공격력", value2:"" },
  id72002 : { min: 7, max: 12, value: "최대 공격력", value2:"" },
  id72003 : { min: 13, max: 18, value: "최대 공격력", value2:"" },
  id72004 : { min: 19, max: 24, value: "최대 공격력", value2:"" },
  id72005 : { min: 25, max: 30, value: "최대 공격력", value2:"" },
  id72006 : { min: 1, max: 6, value: "마법 공격력", value2:"" },
  id72007 : { min: 7, max: 12, value: "마법 공격력", value2:"" },
  id72008 : { min: 13, max: 18, value: "마법 공격력", value2:"" },
  id72009 : { min: 19, max: 24, value: "마법 공격력", value2:"" },
  id72010 : { min: 25, max: 30, value: "마법 공격력", value2:"" },
  id72011 : { min: 1, max: 10, value: "4대 속성 연금 대미지", value2:"" },
  id72012 : { min: 11, max: 20, value: "4대 속성 연금 대미지", value2:"" },
  id72013 : { min: 21, max: 30, value: "4대 속성 연금 대미지", value2:"" },
  id72014 : { min: 31, max: 40, value: "4대 속성 연금 대미지", value2:"" },
  id72015 : { min: 41, max: 50, value: "4대 속성 연금 대미지", value2:"" },
  id72016 : { min: 1, max: 10, value: "마리오네트 최대 대미지", value2:"" },
  id72017 : { min: 11, max: 20, value: "마리오네트 최대 대미지", value2:"" },
  id72018 : { min: 21, max: 30, value: "마리오네트 최대 대미지", value2:"" },
  id72019 : { min: 31, max: 40, value: "마리오네트 최대 대미지", value2:"" },
  id72020 : { min: 41, max: 50, value: "마리오네트 최대 대미지", value2:"" },
  id72021 : { min: 1, max: 5, value: "힐링 효과", value2:"%" },
  id72022 : { min: 6, max: 10, value: "힐링 효과", value2:"%" },
  id72023 : { min: 1, max: 5, value: "크리티컬", value2:"%" },
  id72024 : { min: 1, max: 2, value: "크리티컬 대미지", value2:"%" },
  id72025 : { min: 3, max: 4, value: "크리티컬 대미지", value2:"%" },
  id72026 : { min: 1, max: 5, value: "밸런스 증가", value2:"%" }
}

function enchantFunc(idObj) {
  const min = idObj.min;
  const max = idObj.max;
  return idObj.value + " " + (Math.floor(Math.random() * (max - min + 1)) + min) + idObj.value2;
}


document.querySelector('.spin-btn').addEventListener('click', () => {
  const enchantID = Math.floor(Math.random() * (25)) + 72001;
  const result = enchantFunc(enchStruct["id" + enchantID]);
  
  console.log(result)
  
  if (result) {
    document.querySelector('.filler').innerHTML = 
      `<span>${result} 증가</span>`;
  } else {
    document.querySelector('.filler').innerHTML = 
      `에러`;
  }
});
