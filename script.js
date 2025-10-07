// pairing generator + fancy UI triggers
const coffeeEl = document.getElementById('coffee');
const pastryEl = document.getElementById('pastry');
const genBtn = document.getElementById('genBtn');
const clearBtn = document.getElementById('clearBtn');
const resultDiv = document.getElementById('result');
const pairingTextEl = document.getElementById('pairingText');
const metaText = document.getElementById('metaText');
const pairingBox = document.getElementById('pairingBox');
const coffeeChip = document.getElementById('coffeeChip');
const sparkles = document.getElementById('sparkles');

const downloadCSVbtn = document.getElementById('downloadCSV');
const downloadJSONbtn = document.getElementById('downloadJSON');
const downloadHTMLbtn = document.getElementById('downloadHTML');
const copyBtn = document.getElementById('copyBtn');

function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

const coffeeDesc = {
  "Espresso":"bold, concentrated",
  "Americano":"clean and strong",
  "Latte":"creamy and smooth",
  "Cappuccino":"frothy and balanced",
  "Flat White":"silky and milky",
  "Filter Coffee":"bright and aromatic",
  "Cold Brew":"smooth and low-acid"
};

const pastryDesc = {
  "Croissant":"buttery, flaky",
  "Danish":"sweet and layered",
  "Muffin":"soft and crumbly",
  "Biscotti":"crunchy and nutty",
  "Scone":"crumbly and rich",
  "Tart":"bright and tangy",
  "Brownie":"dense and chocolatey",
  "Cheesecake slice":"creamy and indulgent"
};

const benefits = [
  "perfect morning pick-me-up",
  "ideal for afternoon coffee breaks",
  "a crowd-pleasing combo",
  "great for social media hero shots",
  "a balanced flavor contrast",
  "an indulgent treat that lifts sales"
];

function makeMarketing(coffee, pastry){
  const cDesc = coffeeDesc[coffee] || "delicious";
  const pDesc = pastryDesc[pastry] || "tasty";
  const benefit = sample(benefits);
  // more vivid marketing language
  const sentence = `${coffee} pairs beautifully with a ${pDesc} ${pastry} — ${cDesc} meets ${pDesc} for ${benefit}. Try it today!`;
  return sentence;
}

function timestampFilename(prefix, ext){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${prefix}_${y}${m}${day}_${hh}${mm}${ss}.${ext}`;
}

function escapeCSVField(s){
  if(s == null) return '""';
  const val = String(s).replace(/"/g,'""');
  return `"${val}"`;
}

function downloadBlob(content, filename, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function showResult(coffee, pastry, text){
  pairingTextEl.textContent = text;
  metaText.textContent = `Generated: ${new Date().toLocaleString()}`;
  resultDiv.style.display = 'block';
  // add animation classes
  resultDiv.classList.remove('show');
  void resultDiv.offsetWidth;
  resultDiv.classList.add('show','result-animate');
  // sparkle effect (brief)
  sparkles.style.opacity = 1;
  setTimeout(()=>{ sparkles.style.opacity = 0; resultDiv.classList.remove('result-animate'); }, 900);
  // store for downloads
  resultDiv.dataset.coffee = coffee;
  resultDiv.dataset.pastry = pastry;
  resultDiv.dataset.text = text;
  // update coffee chip emoji based on coffee
  coffeeChip.textContent = coffeeEmoji(coffee);
}

function coffeeEmoji(coffee){
  if(/espresso/i.test(coffee)) return '☕';
  if(/latte|flat white|cappuccino/i.test(coffee)) return '🥛';
  if(/cold brew/i.test(coffee)) return '🧊';
  if(/americano|filter/i.test(coffee)) return '☕';
  return '☕';
}

// generate
genBtn.addEventListener('click', ()=>{
  const coffee = coffeeEl.value;
  const pastry = pastryEl.value;
  const text = makeMarketing(coffee, pastry);
  showResult(coffee, pastry, text);
});

// clear
clearBtn.addEventListener('click', ()=>{
  pairingTextEl.textContent = '';
  metaText.textContent = '';
  resultDiv.style.display = 'none';
  resultDiv.dataset.coffee = '';
  resultDiv.dataset.pastry = '';
  resultDiv.dataset.text = '';
});

// downloads
downloadCSVbtn.addEventListener('click', ()=>{
  const coffee = resultDiv.dataset.coffee;
  const pastry = resultDiv.dataset.pastry;
  const text = resultDiv.dataset.text;
  if(!text){ alert('Generate pairing pehle kar lo'); return; }
  const header = ['coffee','pastry','pairing_text'];
  const row = [escapeCSVField(coffee), escapeCSVField(pastry), escapeCSVField(text)].join(',');
  const csv = header.join(',') + '\n' + row + '\n';
  const fname = timestampFilename('pairing','csv');
  downloadBlob(csv, fname, 'text/csv;charset=utf-8;');
});

downloadJSONbtn.addEventListener('click', ()=>{
  const coffee = resultDiv.dataset.coffee;
  const pastry = resultDiv.dataset.pastry;
  const text = resultDiv.dataset.text;
  if(!text){ alert('Generate pairing pehle kar lo'); return; }
  const obj = {coffee, pastry, pairing_text: text, generated_at: new Date().toISOString()};
  const json = JSON.stringify(obj, null, 2);
  const fname = timestampFilename('pairing','json');
  downloadBlob(json, fname, 'application/json;charset=utf-8;');
});

downloadHTMLbtn.addEventListener('click', ()=>{
  const coffee = resultDiv.dataset.coffee;
  const pastry = resultDiv.dataset.pastry;
  const text = resultDiv.dataset.text;
  if(!text){ alert('Generate pairing pehle kar lo'); return; }
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pairing Suggestion</title></head>
<body style="font-family:Inter,Arial,Helvetica,sans-serif;padding:20px">
  <h1>Pairing: ${coffee} + ${pastry}</h1>
  <p>${text}</p>
  <p>Generated: ${new Date().toLocaleString()}</p>
</body>
</html>`;
  const fname = timestampFilename('pairing','html');
  downloadBlob(html, fname, 'text/html;charset=utf-8;');
});

// copy to clipboard
copyBtn.addEventListener('click', async ()=>{
  const text = resultDiv.dataset.text;
  if(!text){ alert('Generate pairing pehle kar lo'); return; }
  try{
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied ✓';
    setTimeout(()=> copyBtn.textContent = 'Copy',1400);
  }catch(err){
    alert('Copy failed — use manual select');
  }
});
