const enchStruct = {
  id72001 : { min: 1, max: 10, value: "최대공격력" },
  id72002 : { min: 11, max: 20, value: "최대공격력" },
  id72003 : { min: 21, max: 30, value: "최대공격력" },
  id72004 : { min: 31, max: 40, value: "최대공격력" },
  id72005 : { min: 41, max: 50, value: "최대공격력" }
}

function enchantFunc(idObj) {
  const min = idObj.min;
  const max = idObj.max;
  return idObj.value + (Math.floor(Math.random() * (max - min + 1)) + min);
}


document.querySelector('.spin-btn').addEventListener('click', () => {
  const enchantID = Math.floor(Math.random() * (4)) + 72001;
  const result = enchantFunc(enchStruct["id" + enchantID]);
  
  console.log(result)
  
  if (result) {
    document.querySelector('.filler').innerHTML = 
      `<span>${result}</span>`;
  } else {
    document.querySelector('.filler').innerHTML = 
      `에러`;
  }
});
