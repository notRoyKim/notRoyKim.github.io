const enchStruct = {
  id72001 : { min: 0, max: 10, value: "최대공격력" },
  id72002 : { min: 0, max: 10, value: "최대공격력" }
}

function enchantFunc(idObj) {
  const min = idObj.min;
  const max = idObj.max;
  return idObj.value + Math.floor(Math.random() * (max - min + 1)) + min;
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
