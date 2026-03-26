// ═══════════════ CONFIG ═══════════════
const PIN='1234';           // ← Change this PIN!
const IT_EMAIL='it@ubisl.co.in'; // ← IT team email
const LOC='5th Floor';
const DOM='ubisl.co.in';
const SK='ubi_v5';
const MAX_ATT=3;
const LOCKOUT_MS=5*60*1000; // 5 min
const EMP_PIN_SALT='UBIS_DIR_2026'; // salt for employee PIN hashing
const EMP_MAX_ATT=3;
const EMP_LOCKOUT_MS=5*60*1000;

// ═══════════════ DEPT COLORS ═══════════════
const DC={
  'Head Office':['#1a56e8','#e8edfb'],
  'IT':['#0ea5e9','#e0f4fd'],
  'AVP':['#7c3aed','#ede9ff'],
  'HR':['#e53e5a','#fde8ec'],
  'Account':['#d97706','#fef3e0'],
  'MIS':['#059669','#d1fae5'],
  'Admin':['#64748b','#f1f5f9'],
  'Education Loan':['#0891b2','#e0f7fa'],
  'Empanelment & CRM Team':['#9333ea','#f3e8ff'],
  'Pantry':['#b45309','#fef3c7'],
  'Internal Control & Compliance':['#be185d','#fce7f3'],
};
const AV=[['#1a56e8','#dbeafe'],['#0ea5e9','#e0f2fe'],['#7c3aed','#ede9fe'],['#e53e5a','#fee2e2'],['#d97706','#fef3c7'],['#059669','#d1fae5']];

function dS(d){const c=DC[d]||['#6b6b85','#f0f0f5'],dk=isDark();return dk?`background:${c[0]}22;color:${c[0]};border:1px solid ${c[0]}44;`:`background:${c[1]};color:${c[0]};border:1px solid ${c[0]}44;`}
function aS(n){let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))&0xffffffff;const[fg,bg]=AV[Math.abs(h)%AV.length];const dk=isDark();return dk?`background:${fg}22;color:${fg};`:`background:${bg};color:${fg};`}
function isDark(){const t=document.documentElement.getAttribute('data-theme');return t==='dark'||t==='midnight';}

// per-name email helpers
function autoEmail(name){
  const p=name.trim().split(/\s+/);
  const a=p[0].toLowerCase().replace(/[^a-z]/g,'');
  const b=(p[1]||'').toLowerCase().replace(/[^a-z]/g,'');
  return b?`${a}.${b}@${DOM}`:`${a}@${DOM}`;
}
function getEmails(entry){
  if(entry.noEmail) return [];
  return entry.emails&&entry.emails.length?entry.emails:entry.persons.map(n=>autoEmail(n));
}

// ═══════════════ DEFAULT DATA ═══════════════
function defData(){const D=LOC;
  function mk(id,names,ext,dept,role,location,emails,noEmail){
    const persons=names.split('/').map(s=>s.trim());
    const em=noEmail?[]:emails?emails.split('/').map(s=>s.trim()):persons.map(n=>autoEmail(n));
    return{id,persons,ext,dept,role,location:location||D,emails:em,noEmail:!!noEmail,
      pin:null,pinSet:false,
      photo:null,photoPending:null,
      status:'available',statusNote:'',statusUntil:null,
      dob:null,
      empAttempts:0,empLockedUntil:0};
  }
  return[
  mk(1,'Vrushali Salunke','101/9','Head Office','Front Desk & Sr. Admin Executive'),
  mk(2,'Sanjay Rajoria','131','Head Office','MD & CEO'),
  mk(3,'Dattatraya Bhosale','125','Head Office','CFO'),
  mk(4,'Priyesh Haridas','132','Head Office','CBO'),
  mk(5,'Ashutosh Tipnis','111','Head Office','CPO'),
  mk(6,'Nitesh Surve','133','Head Office','COO'),
  mk(7,'Swapnaja Mathure','177','Head Office','VP – HR'),
  mk(8,'Dhananjay Kamble','150','Head Office','VP IT'),
  mk(9,'Ricky Dawda','134','Head Office','VP – Risk'),
  mk(10,'Jalpa Phansalkar','109','Head Office','Head – Internal Control'),
  mk(11,'Komal Pawar','103','Head Office','EA to MD & CEO'),
  mk(12,'Sanjay Kurseja','106','Head Office','Asst. Company Secretary'),
  mk(13,'Siddhartha Vaidya','181','Head Office','Associate – Secretarial'),
  mk(14,'Kuldeep Awasthi','108','Internal Control & Compliance','Compliance Head'),
  mk(15,'Mahesh Rasal / Mansi Salunkhe','152','Internal Control & Compliance','Compliance Manager / Executive'),
  mk(16,'Akash Dama / Sanjana Sawant','123','Internal Control & Compliance','Management Trainee / Executive'),
  mk(17,'Sheetal Dhaybar','144','Internal Control & Compliance','Senior Executive'),
  mk(18,'Ashish','149','IT','Manager – IT'),
  mk(19,'Vinay Bhekare / Sachin Yadav','104/199','IT','IT Executive'),
  mk(20,'Ganesh Shukla','143','IT','Developer – App & Systems',null,'ganesh.shukla@ubisl.co.in'),
  mk(21,'Aditi Chavan','189','IT','Executive'),
  mk(22,'Tushar Sable','110','AVP','AVP – Education Loan'),
  mk(23,'Gauravi Sarkarte / Sanket','171','AVP','AVP Risk / Executive'),
  mk(24,'Darshak Shah / Abhishek','105','AVP','AVP – Accounts / Executive'),
  mk(25,'Gaurav Bamania','120','AVP','AVP – HR'),
  mk(26,'Suchita Gaikwad','122','HR','HR Operation Manager'),
  mk(27,'Abha / Prerna','119','HR','HR – Executive'),
  mk(28,'Prathamesh / Nupur','115','HR','Payroll Executive'),
  mk(29,'Pranjali / Akansha Chundawat','166','HR','Asst. Manager / HR Executive'),
  mk(30,'Balaji Dhore / Rahul Nakte','117','HR','HR Compliance'),
  mk(31,'Tejasvi Gholap','172','HR','HR Executive'),
  mk(32,'Sayli / Shraddha Gujar','118','HR','Senior Manager / Asst. Manager'),
  mk(33,'Snehal Tambe / Sonam','116','HR','Asst. Manager (Payroll) / Executive'),
  mk(34,'Alister Fernandez','138','HR','Senior Executive'),
  mk(35,'Sachita Nambiar / Sanjana Tiwari','121','HR','Senior Manager / Executive'),
  mk(36,'Sagar Chotaliya / Nilakshi','137','Account','Asst. Manager / Sr. Executive'),
  mk(37,'Yash Vora / Jinesh','139','Account','Senior Manager'),
  mk(38,'Abhishek Shirtavle / Darshana Raut','105','Account','Sr. Executive / Executive'),
  mk(39,'Chaitali / Shefali','127','Account','Asst. Manager / Executive'),
  mk(40,'Kiran Mansukhani / Vikas Rawlo','130','MIS','Sr. Manager (MIS) / Analytics'),
  mk(41,'Ankita Sawant / Akansha','113','MIS','MIS Executive'),
  mk(42,'Martin Anandas','188','Admin','Asst. Manager'),
  mk(43,'Aniket Jadhav','101','Admin','Admin Executive'),
  mk(44,'Sejal Nagtilak / Manali','129','Education Loan','Manager / Senior Executive'),
  mk(45,'Pranesh Narkar / Siddhi Konde','112','Education Loan','Senior Executive'),
  mk(46,'Nandini Kondale','202','Empanelment & CRM Team','Business Co-ordinator'),
  mk(47,'Swati Agarwal','201','Empanelment & CRM Team','Manager Empanelment'),
  mk(48,'Piyush Aukirkar / Raj Jaiswar','201','Empanelment & CRM Team','Lead CRM / Sr. Executive'),
  mk(49,'Madhuri','124','Empanelment & CRM Team','Asst. Manager CRM'),
  mk(50,'Supriya / Sakshi','211','Empanelment & CRM Team','Sr. Operation Executive'),
  mk(51,'Ashish / Prathamesh','212','Empanelment & CRM Team','CRM Executive'),
  mk(52,'Poonam / Ruchita / Jayshree','214','Empanelment & CRM Team','Sr. Executive / Asst. Manager / Sr. Executive'),
  mk(53,'Anita / Shailendra','216','Empanelment & CRM Team','Sr. Operation Executive / Operation Executive'),
  mk(54,'Pratiksha','217','Empanelment & CRM Team','Voice Executive'),
  mk(55,'Prem More / Ganesh / Akshay','135','Pantry','Sub – Staff'),
  mk(56,'Omkar / Love Bavge','200','Pantry','Sub – Staff (6th Floor)',null,'6th Floor'),
  mk(57,'Meeting Room (Near Front Desk)','187','Admin','Meeting Room',null,null,true),
  mk(58,'Big Conference Room','142','Admin','Conference Room',null,null,true),
];}

function defFloorMap(){
  return{
    floors:{
      '5':{
        label:'5th Floor',
        canvasWidth:1200,
        canvasHeight:700,
        zones:[
          {id:'f5_conf',    label:'Conference Room', type:'room',   department:'None',                       x:20,  y:20,  width:250, height:140, colorOverride:null},
          {id:'f5_cfo',     label:'CFO',             type:'cabin',  department:'Head Office',                x:270, y:20,  width:155, height:140, colorOverride:null, staffId:null},
          {id:'f5_cbo',     label:'CBO',             type:'cabin',  department:'Head Office',                x:425, y:20,  width:155, height:140, colorOverride:null, staffId:null},
          {id:'f5_cpo',     label:'CPO',             type:'cabin',  department:'Head Office',                x:580, y:20,  width:155, height:140, colorOverride:null, staffId:null},
          {id:'f5_vphr',    label:'VP-HR',           type:'cabin',  department:'HR',                         x:20,  y:160, width:100, height:80,  colorOverride:null, staffId:null},
          {id:'f5_room2',   label:'Room #2',         type:'room',   department:'None',                       x:20,  y:240, width:100, height:70,  colorOverride:null},
          {id:'f5_comp',    label:'Compliance',      type:'cabin',  department:'Internal Control & Compliance', x:20, y:310, width:100, height:80, colorOverride:null, staffId:null},
          {id:'f5_acc',     label:'Accounts',        type:'cabin',  department:'Account',                    x:20,  y:390, width:100, height:70,  colorOverride:null, staffId:null},
          {id:'f5_ithead',  label:'IT-Head',         type:'cabin',  department:'IT',                         x:20,  y:460, width:100, height:70,  colorOverride:null, staffId:null},
          {id:'f5_room3',   label:'Room #3',         type:'room',   department:'None',                       x:20,  y:530, width:100, height:70,  colorOverride:null},
          {id:'f5_main_bay',label:'Main Bay',        type:'bay',    department:'HR',                         x:120, y:160, width:615, height:420, colorOverride:null,
            config:{rows:6, seatsPerSide:7, aisleRatio:0.15},
            sections:[
              {label:'HR',                      rows:[0,1], department:'HR'},
              {label:'IT / Risk / Secretarial', rows:[2],   department:'IT'},
              {label:'MIS & MSME',              rows:[3],   department:'MIS'},
              {label:'Internal Control',        rows:[4],   department:'Internal Control & Compliance'},
              {label:'Edu Loan',                rows:[5],   department:'Education Loan'}
            ],
            seats:{}
          },
          {id:'f5_risk',    label:'Risk & Internal Audit Heads', type:'cabin', department:'AVP', x:735, y:160, width:165, height:170, colorOverride:null, staffId:null},
          {id:'f5_server',  label:'Server Room',     type:'room',   department:'None',                       x:900, y:20,  width:280, height:140, colorOverride:null},
          {id:'f5_md',      label:'MD',              type:'cabin',  department:'Head Office',                x:735, y:330, width:165, height:170, colorOverride:null, staffId:null},
          {id:'f5_ea',      label:'EA to MD',        type:'cabin',  department:'Head Office',                x:900, y:160, width:140, height:100, colorOverride:null, staffId:null},
          {id:'f5_admin',   label:'Admin',           type:'cabin',  department:'Admin',                      x:735, y:500, width:165, height:120, colorOverride:null, staffId:null},
          {id:'f5_pantry',  label:'Pantry',          type:'room',   department:'None',                       x:120, y:580, width:300, height:80,  colorOverride:null},
          {id:'f5_toilet',  label:'Toilet',          type:'room',   department:'None',                       x:420, y:580, width:180, height:80,  colorOverride:null}
        ]
      },
      '6':{
        label:'6th Floor',
        canvasWidth:1200,
        canvasHeight:700,
        zones:[
          {id:'f6_balcony', label:'Balcony',         type:'room',   department:'None',                       x:20,  y:10,  width:960, height:55,  colorOverride:null},
          {id:'f6_msme',    label:'MSME',            type:'cabin',  department:'MSME',                       x:20,  y:70,  width:160, height:60,  colorOverride:null, staffId:null},
          {id:'f6_left_bay',label:'Left Bay',        type:'bay',    department:'Empanelment & CRM Team',     x:20,  y:130, width:480, height:340, colorOverride:null,
            config:{rows:4, seatsPerSide:3, aisleRatio:0.15},
            sections:[
              {label:'CRM Team',    rows:[0,1], department:'Empanelment & CRM Team'},
              {label:'Empanelment', rows:[2,3], department:'Empanelment & CRM Team'}
            ],
            seats:{}
          },
          {id:'f6_meeting', label:'Meeting Room',    type:'room',   department:'None',                       x:20,  y:475, width:480, height:160, colorOverride:null},
          {id:'f6_coo',     label:'COO',             type:'cabin',  department:'Head Office',                x:540, y:70,  width:300, height:190, colorOverride:null, staffId:null},
          {id:'f6_vacant',  label:'Vacant Seating',  type:'room',   department:'None',                       x:540, y:265, width:300, height:215, colorOverride:null},
          {id:'f6_pantry',  label:'Pantry',          type:'room',   department:'None',                       x:540, y:480, width:300, height:100, colorOverride:null},
          {id:'f6_toilet',  label:'Toilet',          type:'room',   department:'None',                       x:540, y:580, width:300, height:80,  colorOverride:null}
        ]
      }
    }
  };
}

// ═══════════════ STATE ═══════════════
let data=[],editIdx=-1,isAdm=false,sCol='dept',sDir=1,lastUpd=null;
let attempts=0,lockedUntil=0;
let lastDeleted=null,undoTimer=null,lastSearchKey='',lastDeptFilter='';
let curView='table';          // 'table' | 'card'
let showFavsOnly=false;       // favorites filter toggle
let selectedIds=new Set();    // bulk-delete selection
let mainTab='home';
let floorMap=null;

// ── Floor Map State ──
let floorCurrentFloor='5';
let floorZoomZoneId=null;        // null = floor view, id = bay zoom view
let floorSelectedZoneId=null;    // selected for edit
let floorActiveZoneId=null;      // clicked for card filter
let floorUndoSnapshot=null;
let floorDragState=null;
let floorSelectedSeatId=null;    // seat selected in zoom view
let floorViewBoxAnim=null;       // animation frame id

// ── employee session (sessionStorage — clears on tab close) ──
const EMP_SESSION_KEY='ubi_emp_session';
function getEmpSession(){try{const s=sessionStorage.getItem(EMP_SESSION_KEY);return s?JSON.parse(s):null;}catch{return null;}}
function setEmpSession(obj){try{sessionStorage.setItem(EMP_SESSION_KEY,JSON.stringify(obj));}catch{}}
function clearEmpSession(){try{sessionStorage.removeItem(EMP_SESSION_KEY);}catch{}}

// ── favorites stored per-browser in localStorage ──
const FAV_KEY=SK+'_favs';
let favs=new Set();
function loadFavs(){try{const s=localStorage.getItem(FAV_KEY);if(s)favs=new Set(JSON.parse(s));}catch{}}
function saveFavs(){localStorage.setItem(FAV_KEY,JSON.stringify([...favs]));}

// ── Status definitions ──
const STATUS_OPTS=[
  {k:'available',  label:'Available',     icon:'🟢', color:'#22c55e'},
  {k:'wfh',        label:'Work From Home',icon:'🏠', color:'#3b82f6'},
  {k:'ooo',        label:'Out of Office', icon:'🟡', color:'#f59e0b'},
  {k:'leave',      label:'On Leave',      icon:'🔴', color:'#ef4444'},
  {k:'tour',       label:'On Tour',       icon:'✈️', color:'#8b5cf6'},
  {k:'training',   label:'In Training',   icon:'📚', color:'#06b6d4'},
  {k:'deputed',    label:'Deputed',       icon:'🔄', color:'#f97316'},
];
function getStatus(k){return STATUS_OPTS.find(s=>s.k===k)||STATUS_OPTS[0];}

// ── SHA-256 PIN hashing (Web Crypto API) ──
async function hashPIN(pin){
  const encoder=new TextEncoder();
  const data=encoder.encode(pin+EMP_PIN_SALT);
  const buf=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// ── backend path (same folder as this HTML file on the NAS) ──
const API='save.php';
const API_STATS='save.php?action=stats';
const AUTO_REFRESH_MS=60*1000;

// ── detect if running on a real server or just opened as a local file ──
const IS_SERVER = window.location.protocol === 'http:' || window.location.protocol === 'https:';

// ── PIN lockout lives in localStorage only (per-browser, intentional) ──
function loadLocal(){
  try{const s=localStorage.getItem(SK);if(s){const p=JSON.parse(s);attempts=p.attempts||0;lockedUntil=p.lockedUntil||0;}}catch{}
}
function saveLocal(){localStorage.setItem(SK,JSON.stringify({attempts,lockedUntil}));}

// ── localStorage fallback (for local file:// usage) ──
function loadFromLocal(){
  try{
    const s=localStorage.getItem(SK+'_data');
    if(s){const p=JSON.parse(s);data=p.data||defData();floorMap=p.floorMap||defFloorMap();lastUpd=p.updated||null;}
    else{data=defData();floorMap=defFloorMap();lastUpd=new Date().toISOString();saveDataLocal();}
  }catch{data=defData();floorMap=defFloorMap();}
}
function saveDataLocal(){
  localStorage.setItem(SK+'_data',JSON.stringify({data,floorMap,updated:lastUpd}));
}

// ── load data ──────────────────────────────────────────────────────────────
async function load(){
  loadLocal();
  if(!IS_SERVER){
    // Running as local file — use localStorage
    setSyncStatus('offline');
    toast('ℹ️ Running locally — changes save to this browser only.','i');
    loadFromLocal();
    migrateData();
    showUpd();
    render();
    return;
  }
  // Running on server — fetch from save.php
  setSyncStatus('loading');
  try{
    const r=await fetch(API+'?t='+Date.now());
    if(!r.ok) throw new Error('HTTP '+r.status);
    const json=await r.json();
    if(json.data&&Array.isArray(json.data)){
      data=json.data;
      floorMap=json.floorMap||defFloorMap();
      lastUpd=json.updated||null;
    } else if(Array.isArray(json)&&json.length>0){
      data=json;
      floorMap=defFloorMap();
    } else {
      // Server has empty data.json — seed with defaults and save
      data=defData();
      floorMap=defFloorMap();
      await persistToServer();
    }
    migrateData();
    setSyncStatus('ok');
  }catch(e){
    console.warn('Could not reach save.php, falling back to localStorage.',e);
    loadFromLocal();
    migrateData();
    setSyncStatus('offline');
    toast('⚠️ Could not connect to server. Changes will only save locally.','e');
  }
  showUpd();
  render();
  renderFloorMap();
  checkBirthdays();
}

// ── migrate old records to add new fields ──────────────────────────────────
function migrateData(){
  if(!floorMap||!floorMap.floors) floorMap=defFloorMap();
  data.forEach(p=>{
    // ── new per-person PIN model ──
    // migrate old single pin/pinSet to new per-person pins/pinsSet objects
    if(p.pins===undefined){
      p.pins={};
      // if old pin existed, migrate it to first person
      if(p.pin&&p.pinSet) p.pins[p.persons[0]]=p.pin;
    }
    if(p.pinsSet===undefined){
      p.pinsSet={};
      if(p.pinSet) p.pinsSet[p.persons[0]]=true;
    }
    // remove old flat fields
    delete p.pin; delete p.pinSet;
    // per-person lockout
    if(p.pinAttempts===undefined) p.pinAttempts={};
    if(p.pinLockedUntil===undefined) p.pinLockedUntil={};
    // remove old flat lockout
    delete p.empAttempts; delete p.empLockedUntil;
    // other fields
    if(p.photo===undefined) p.photo=null;
    if(p.photoPending===undefined) p.photoPending=null;
    if(p.status===undefined) p.status='available';
    if(p.statusNote===undefined) p.statusNote='';
    if(p.statusUntil===undefined) p.statusUntil=null;
    if(p.dob===undefined) p.dob=null;
    if(p.assets===undefined) p.assets=[];
  });
}

// ── save data ──────────────────────────────────────────────────────────────
async function persist(){
  lastUpd=new Date().toISOString();
  showUpd();
  if(!IS_SERVER){
    saveDataLocal();
    return;
  }
  setSyncStatus('saving');
  await persistToServer();
}

async function persistToServer(){
  try{
    const r=await fetch(API,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'X-Admin-Actor': isAdm ? 'admin-ui' : 'user-ui'
      },
      body:JSON.stringify({data,floorMap,updated:lastUpd})
    });
    if(!r.ok) throw new Error('HTTP '+r.status);
    setSyncStatus('ok');
  }catch(e){
    console.error('Save failed',e);
    setSyncStatus('error');
    toast('❌ Save failed — check server connection.','e');
  }
}

// ── sync status dot in header ──
function setSyncStatus(state){
  const dot=document.getElementById('syncDot');
  const lbl=document.getElementById('syncLbl');
  if(!dot)return;
  const map={
    loading:['#f59e0b','Loading…'],
    saving: ['#f59e0b','Saving…'],
    ok:     ['#22c55e','● Live'],
    offline:['#94a3b8','○ Local only'],
    error:  ['#ef4444','⚠ Save error'],
  };
  const[color,text]=map[state]||['#94a3b8','—'];
  dot.style.background=color;
  lbl.textContent=text;
  lbl.style.color=color;
}

function showUpd(){
  const el=document.getElementById('updLbl');
  if(!lastUpd){el.textContent='—';return;}
  const d=new Date(lastUpd);
  el.textContent=d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})+' '+d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
}

function escHtml(v=''){
  return String(v)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

// ═══════════════ HIGHLIGHT helper ═══════════════
function hl(text, q) {
  if (!q) return escHtml(text);
  const safe = escHtml(text);
  const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${safeQ})`, 'gi'), '<mark class="hl">$1</mark>');
}

// ═══════════════ RENDER ═══════════════
function render(){
  const q=document.getElementById('q').value.toLowerCase().trim();
  const df=document.getElementById('df').value;

  let rows=data.filter(p=>{
    if(showFavsOnly && !favs.has(p.id)) return false;
    const f=`${p.persons.join(' ')} ${p.ext} ${p.dept} ${p.role} ${p.location} ${(p.emails||[]).join(' ')}`.toLowerCase();
    return(!q||f.includes(q))&&(!df||p.dept===df);
  });

  if(q && q!==lastSearchKey){
    lastSearchKey=q;
    sendStatEvent({type:'search', extension:q.replace(/[^0-9/]/g,''), department:q});
  }
  if(!q) lastSearchKey='';
  if(df && df!==lastDeptFilter){
    lastDeptFilter=df;
    sendStatEvent({type:'dept_filter', department:df});
  }
  if(!df) lastDeptFilter='';

  rows.sort((a,b)=>{
    const av=(sCol==='name'?a.persons[0]:(a[sCol]||'')).toLowerCase();
    const bv=(sCol==='name'?b.persons[0]:(b[sCol]||'')).toLowerCase();
    return av<bv?-sDir:av>bv?sDir:0;
  });

  // Bulk bar visibility (admin only)
  const bulkBar=document.getElementById('bulkBar');
  if(isAdm){ bulkBar.classList.add('visible'); }
  else { bulkBar.classList.remove('visible'); selectedIds.clear(); }
  updateBulkInfo();

  if(curView==='card'){
    renderCards(rows, q);
  } else {
    renderTable(rows, q);
  }

  document.getElementById('totC').textContent=data.length;
  updDept();
  const sh=data.filter(p=>p.persons.length>1).length;
  const depts=[...new Set(data.map(p=>p.dept))].length;
  document.getElementById('stats').innerHTML=
    `<div class="chip">Showing <strong>${rows.length}</strong> of <strong>${data.length}</strong></div>`+
    `<div class="chip">Departments: <strong>${depts}</strong></div>`+
    `<div class="chip">Shared phones: <strong>${sh}</strong></div>`+
    (showFavsOnly?`<div class="chip">⭐ Favorites: <strong>${favs.size}</strong></div>`:'');
}

// ─── TIER + BADGE HELPERS ────────────────────────────────────
const MGMT_KEYWORDS=['ceo','cfo','cbo','coo','cpo','md','vp','vice president','director','president','chief'];
function isMgmt(role){ return MGMT_KEYWORDS.some(k=>(role||'').toLowerCase().includes(k)); }
function isGanesh(p){ return p.persons.some(n=>n.toLowerCase().includes('ganesh shukla')); }

// ─── TABLE RENDER ────────────────────────────────────────────
function renderTable(rows, q){
  const tblWrap=document.getElementById('tblWrap');
  const cardGrid=document.getElementById('cardGrid');
  tblWrap.style.display='';
  cardGrid.style.display='none';

  const tb=document.getElementById('tb');
  if(!rows.length){
    tb.innerHTML=`<tr><td colspan="6"><div class="empty"><div class="ei">📭</div><p>${showFavsOnly?'No favorites yet. Click ☆ on any row to star it.':'No entries found.'}</p></div></td></tr>`;
    return;
  }

  tb.innerHTML=rows.map((p,i)=>{
    const shared=p.persons.length>1;
    const emails=getEmails(p);
    const delay=Math.min(i*.018,.35);
    const isFav=favs.has(p.id);
    const isSelected=selectedIds.has(p.id);
    const idx=data.indexOf(p);
    const mgmt=isMgmt(p.role);
    const dev=isGanesh(p);

    // Sort persons so searched person appears first in shared entries
    let displayPersons=[...p.persons];
    let displayEmails=[...emails];
    if(q&&shared){
      const matchIdx=displayPersons.findIndex(n=>n.toLowerCase().includes(q));
      if(matchIdx>0){
        const [mp]=displayPersons.splice(matchIdx,1);
        const [me]=displayEmails.splice(matchIdx,1);
        displayPersons.unshift(mp);
        displayEmails.unshift(me);
      }
    }

    const starBtn=`<button class="star${isFav?' on':''}" onclick="toggleFav(${p.id},event)" title="${isFav?'Remove from favorites':'Add to favorites'}">${isFav?'★':'☆'}</button>`;
    const chkBox=isAdm?`<input type="checkbox" class="rc" ${isSelected?'checked':''} onchange="toggleSelect(${p.id})" onclick="event.stopPropagation()" title="Select for bulk action">`:'';

    // Tier badge
    const tierBadge=mgmt?`<span class="mgmt-badge">★ ${p.role.match(/(MD|CEO|CFO|CBO|COO|CPO|VP|Director|President|Chief)/i)?.[0]||'Senior'}</span>`:
                    dev?`<span class="dev-badge">⌨ Dev</span>`:'';

    let nameCell;
    if(shared){
      const cards=displayPersons.map((name,j)=>{
        const ini=name.split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
        const em=displayEmails[j]||'';
        const isMatch=q&&name.toLowerCase().includes(q);
        return`<div class="pcard${isMatch?' match-top':''}">
          <div class="av" style="${aS(name)}">${ini}</div>
          <div>
            <div class="pname">${hl(name,q)}</div>
            ${em?`<div class="pmail"><a class="mail-link" href="mailto:${escHtml(em)}" onclick="event.stopPropagation()">✉ ${hl(em,q)}</a></div>`:''}
          </div>
        </div>`;
      }).join('');
      nameCell=`<div style="display:flex;align-items:flex-start;gap:.4rem">${chkBox}${starBtn}<div class="person-list">${cards}</div></div>`;
    } else {
      const ini=p.persons[0].split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
      const em0=emails[0]||'';
      // Use photo if available, otherwise fallback to initials
      const avatar = p.photo
        ? `<img src="${p.photo}" class="av" style="object-fit:cover;border:1px solid var(--border);">`
        : `<div class="av" style="${aS(p.persons[0])}">${ini}</div>`;

      nameCell=`<div class="nc">
        ${chkBox}${starBtn}
        ${avatar}
        <div>
          <div class="nm">${hl(p.persons[0],q)} ${tierBadge}</div>
          ${em0?`<div class="em"><a class="mail-link" href="mailto:${escHtml(em0)}" onclick="event.stopPropagation()">✉ ${hl(em0,q)}</a></div>`:''}
        </div>
      </div>`;
    }

    const extRaw=p.ext;
    const extCell=shared
      ?`<div class="sb-w"><a class="tel-link eb" href="tel:${escHtml(extRaw)}" title="Call ext.">📞 ${hl(extRaw,q)}</a><span class="shtag">shared × ${p.persons.length}</span></div>`
      :`<a class="tel-link eb" href="tel:${escHtml(extRaw)}" title="Call ext.">📞 ${hl(extRaw,q)}</a>`;

    const actCell=isAdm
      ?`<td><div class="ab"><button class="ib" onclick="editE(${idx})">✏️</button><button class="ib dl" onclick="delE(${idx})">🗑️</button></div></td>`
      :'<td></td>';

    const rowClass=mgmt?'mgmt-row':dev?'dev-row':'';
    const stDot=(p.status&&p.status!=='available')?`<span title="${getStatus(p.status).label}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${getStatus(p.status).color};margin-left:.3rem;vertical-align:middle"></span>`:'';
    return`<tr class="${rowClass}" style="animation-delay:${delay}s${isSelected?';background:var(--as)':''}">
      <td>${nameCell}${stDot}${shared?`<div style="margin-left:2.8rem;margin-top:.25rem">${tierBadge}</div>`:''}</td>
      <td>${extCell}</td>
      <td><span class="dp" style="${dS(p.dept)}">${hl(p.dept,q)}</span></td>
      <td style="color:var(--muted);font-size:.79rem">${hl(p.role||'—',q)}</td>
      <td style="color:var(--muted);font-size:.79rem">${hl(p.location||LOC,q)}</td>
      ${actCell}
    </tr>`;
  }).join('');
}

// ─── CARD RENDER ─────────────────────────────────────────────
function renderCards(rows, q){
  const tblWrap=document.getElementById('tblWrap');
  const cardGrid=document.getElementById('cardGrid');
  tblWrap.style.display='none';
  cardGrid.style.display='grid';

  if(!rows.length){
    cardGrid.innerHTML=`<div class="empty" style="grid-column:1/-1"><div class="ei">📭</div><p>${showFavsOnly?'No favorites yet.':'No entries found.'}</p></div>`;
    return;
  }

  cardGrid.innerHTML=rows.map((p,i)=>{
    const shared=p.persons.length>1;
    const emails=getEmails(p);
    const delay=Math.min(i*.03,.5);
    const isFav=favs.has(p.id);
    const isSelected=selectedIds.has(p.id);
    const idx=data.indexOf(p);

    // avatars
    let avHtml;
    if(shared){
      avHtml=`<div style="display:flex;gap:4px;flex-wrap:wrap">
        ${p.persons.slice(0,3).map(n=>{
          const ini=n.split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
          return`<div class="ec-av-sm" style="${aS(n)}">${ini}</div>`;
        }).join('')}
        ${p.persons.length>3?`<div class="ec-av-sm" style="background:var(--surface2);color:var(--muted)">+${p.persons.length-3}</div>`:''}
      </div>`;
    } else {
      if (p.photo) {
        avHtml=`<img src="${p.photo}" class="ec-av" style="object-fit:cover;border:1px solid var(--border);">`;
      } else {
        const ini=p.persons[0].split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
        avHtml=`<div class="ec-av" style="${aS(p.persons[0])}">${ini}</div>`;
      }
    }

    const adminBtns=isAdm?`<div class="ec-admin-btns">
      <button class="ib" style="width:24px;height:24px;font-size:.7rem" onclick="editE(${idx})" title="Edit">✏️</button>
      <button class="ib dl" style="width:24px;height:24px;font-size:.7rem" onclick="delE(${idx})" title="Delete">🗑️</button>
    </div>`:'';

    const chkBox=isAdm?`<input type="checkbox" class="rc ec-chk" ${isSelected?'checked':''} onchange="toggleSelect(${p.id})" title="Select">`:'';

    const emailLinks=emails.slice(0,shared?2:1).map(em=>
      `<a class="mail-link" href="mailto:${escHtml(em)}" title="${escHtml(em)}" style="font-size:.67rem;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%">✉ ${escHtml(em)}</a>`
    ).join('');

    const mgmt=isMgmt(p.role);
    const dev=isGanesh(p);
    const tierBadge=mgmt?`<span class="mgmt-badge">★ ${p.role.match(/\b(MD|CEO|CFO|CBO|COO|CPO|VP|Director|President|Chief)/i)?.[0]||'Senior'}</span>`:
                    dev?`<span class="dev-badge">⌨ Dev</span>`:'';
    const cardClass=`emp-card${mgmt?' mgmt-card':dev?' dev-card':''}`;

    // Sort persons: match on top
    let displayPersons=[...p.persons];
    let displayEmails=[...emails];
    if(q&&shared){
      const mIdx=displayPersons.findIndex(n=>n.toLowerCase().includes(q));
      if(mIdx>0){
        const[mp]=displayPersons.splice(mIdx,1);const[me]=displayEmails.splice(mIdx,1);
        displayPersons.unshift(mp);displayEmails.unshift(me);
      }
    }

    return`<div class="${cardClass}"
      style="animation-delay:${delay}s${isSelected?';border-color:var(--accent);background:var(--as)':''};cursor:pointer"
      onclick="openCardModal(${p.id})">
      ${chkBox}
      ${adminBtns}
      <div class="ec-top">
        ${avHtml}
        <button class="star${isFav?' on':''}" onclick="toggleFav(${p.id},event)" title="${isFav?'Unstar':'Star'}">${isFav?'★':'☆'}</button>
      </div>
      <div>
        <div class="ec-names">${hl(displayPersons.join(' / '),q)} ${tierBadge}</div>
        <div class="ec-role">${hl(p.role||'—',q)}</div>
        ${(p.status&&p.status!=='available')?`<div style="margin-top:.28rem"><span class="ec-status" style="background:${getStatus(p.status).color}18;color:${getStatus(p.status).color};border:1px solid ${getStatus(p.status).color}33">${getStatus(p.status).icon} ${getStatus(p.status).label}${p.statusNote?' · '+escHtml(p.statusNote):''}</span></div>`:''}
      </div>
      <div class="ec-footer">
        <span class="dp" style="${dS(p.dept)};font-size:.6rem">${hl(p.dept,q)}</span>
        <a class="tel-link eb" href="tel:${escHtml(p.ext)}" style="font-size:.75rem" title="Call ext. ${escHtml(p.ext)}">📞 ${hl(p.ext,q)}</a>
      </div>
      ${emailLinks?`<div style="margin-top:.25rem">${emailLinks}</div>`:''}
    </div>`;
  }).join('');
}

  if(df && df!==lastDeptFilter){
    lastDeptFilter=df;
    sendStatEvent({type:'dept_filter', department:df});
  }
  if(!df) lastDeptFilter='';
function updDept(){
  const sel=document.getElementById('df'),cur=sel.value;
  const depts=[...new Set(data.map(p=>p.dept))].sort();
  sel.innerHTML='<option value="">All Departments</option>'+depts.map(d=>`<option value="${escHtml(d)}"${cur===d?' selected':''}>${escHtml(d)}</option>`).join('');
  document.getElementById('dL').innerHTML=depts.map(d=>`<option value="${escHtml(d)}">`).join('');
}

function sortBy(c){
  if(sCol===c)sDir*=-1;else{sCol=c;sDir=1;}
  document.querySelectorAll('thead th span').forEach(e=>e.textContent='↕');
  document.querySelectorAll('thead th').forEach(e=>e.classList.remove('sorted'));
  const icon=document.getElementById('s'+c[0]);
  if(icon){icon.textContent=sDir===1?'↑':'↓';icon.parentElement.classList.add('sorted');}
  render();
}

// ═══════════════ THEME ═══════════════
// Theme cycle: light → dark → cherry → midnight → light
const THEMES=['light','dark','cherry','midnight'];
const THEME_LABELS={light:'🌙 Dark',dark:'🌸 Blossom',cherry:'🌃 Midnight',midnight:'☀️ Light'};
function toggleTheme(){
  const h=document.documentElement;
  const cur=h.getAttribute('data-theme')||'light';
  const idx=THEMES.indexOf(cur);
  const next=THEMES[(idx+1)%THEMES.length];
  h.setAttribute('data-theme',next);
  document.getElementById('thBtn').textContent=THEME_LABELS[next];
  render();
}

// ═══════════════ IT REQUEST FORM ═══════════════
function openIT(){['itn','ite','itd'].forEach(id=>document.getElementById(id).value='');document.getElementById('itt').value='';buildITPreview();openM('itM');}

function buildITPreview(){
  const n=document.getElementById('itn').value.trim();
  const e=document.getElementById('ite').value.trim();
  const t=document.getElementById('itt').value;
  const d=document.getElementById('itd').value.trim();
  if(!n&&!t&&!d){document.getElementById('itPreview').textContent='Fill the form above to generate request text…';return;}
  const ts=new Date().toLocaleString('en-IN');
  document.getElementById('itPreview').textContent=
`📋 PHONE DIRECTORY CHANGE REQUEST
${'─'.repeat(38)}
From : ${n||'(not filled)'}  |  Ext: ${e||'N/A'}
Type : ${t||'(not selected)'}
Date : ${ts}

Details:
${d||'(not filled)'}
${'─'.repeat(38)}
Please update the directory accordingly.`;
}

function copyIT(){
  const n=document.getElementById('itn').value.trim(),t=document.getElementById('itt').value,d=document.getElementById('itd').value.trim();
  if(!n||!t||!d){toast('Please fill all required fields','e');return;}
  const txt=document.getElementById('itPreview').textContent;
  navigator.clipboard.writeText(txt).then(()=>{toast('Request text copied! Paste it in your email / chat.','i');}).catch(()=>{
    // fallback: select text
    const el=document.getElementById('itPreview');
    const sel=window.getSelection();const range=document.createRange();range.selectNodeContents(el);sel.removeAllRanges();sel.addRange(range);
    toast('Text selected — press Ctrl+C to copy','i');
  });
}

// ═══════════════ VIEW TOGGLE ═══════════════
function setView(v){
  curView=v;
  document.getElementById('vtTable').classList.toggle('active',v==='table');
  document.getElementById('vtCard').classList.toggle('active',v==='card');
  render();
}

// ═══════════════ FLOOR MAP — COMPLETE ENGINE ═══════════════

// ── Department auto-colour palette (12 distinct, alphabetically assigned) ──
const FM_PALETTE = [
  '#1a56e8','#0ea5e9','#7c3aed','#e53e5a','#d97706','#059669',
  '#64748b','#0891b2','#9333ea','#be185d','#b45309','#dc2626'
];
let _fmDeptMap = {};

function fmDeptColor(dept){
  if(!dept || dept==='None') return '#B0BEC5';
  // rebuild map if needed
  const allDepts = [...new Set(
    Object.values(floorMap.floors).flatMap(f=>f.zones.map(z=>z.department))
  )].filter(d=>d&&d!=='None').sort();
  allDepts.forEach((d,i)=>{ if(!_fmDeptMap[d]) _fmDeptMap[d]=FM_PALETTE[i%FM_PALETTE.length]; });
  return _fmDeptMap[dept] || '#B0BEC5';
}

function fmZoneColor(z){
  if(z.colorOverride) return z.colorOverride;
  if(!z.department || z.department==='None') return '#B0BEC5';
  return fmDeptColor(z.department);
}

function fmTextColor(hex){
  if(!hex) return '#111827';
  const c=hex.replace('#','');
  const n=parseInt(c.length===3?c.split('').map(x=>x+x).join(''):c,16);
  const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return (r*299+g*587+b*114)/1000>165?'#111827':'#ffffff';
}

function fmHexAlpha(hex,alpha){
  const c=hex.replace('#','');
  const n=parseInt(c.length===3?c.split('').map(x=>x+x).join(''):c,16);
  const r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function fmCurrentFloor(){
  return floorMap.floors[floorCurrentFloor];
}

function fmGetZoneById(id){
  return fmCurrentFloor()?.zones.find(z=>z.id===id);
}

function fmAllZones(){
  return fmCurrentFloor()?.zones || [];
}

// ── MAIN TAB SWITCHING ──
function switchMainTab(tab){
  mainTab=tab;
  document.getElementById('tabHomeBtn').classList.toggle('active',tab==='home');
  document.getElementById('tabFloorBtn').classList.toggle('active',tab==='floor');
  document.getElementById('tabAdminBtn').classList.toggle('active',tab==='admin');
  document.getElementById('homeTabPane').style.display=tab==='home'?'':'none';
  document.getElementById('floorTabPane').style.display=tab==='floor'?'':'none';
  if(tab==='admin'){
    if(isAdm){openM('admPanelM');}
    else{checkLockout();if(!lockedOut())openM('pinM');}
    mainTab='home';
    document.getElementById('tabHomeBtn').classList.add('active');
    document.getElementById('tabAdminBtn').classList.remove('active');
    return;
  }
  if(tab==='floor') renderFloorMap();
}

function floorIsEditMode(){ return isAdm && mainTab==='floor'; }

function getFloorDepartmentOptions(){
  return [...new Set(data.map(p=>p.dept))].sort();
}

// ── FLOOR SWITCHER ──
function renderFloorSwitcher(){
  const wrap=document.getElementById('floorSwitcherWrap');
  if(!wrap||!floorMap) return;
  const floors=Object.entries(floorMap.floors);
  let html=floors.map(([k,f])=>`<button class="floor-sw-btn${floorCurrentFloor===k?' active':''}" onclick="fmSwitchFloor('${k}')">${escHtml(f.label)}</button>`).join('');
  if(floorIsEditMode()) html+=`<button class="floor-sw-btn floor-sw-add" onclick="fmAddFloor()">+ Floor</button>`;
  wrap.innerHTML=html;
}

function fmSwitchFloor(key){
  floorCurrentFloor=key;
  floorZoomZoneId=null;
  floorSelectedZoneId=null;
  floorActiveZoneId=null;
  floorSelectedSeatId=null;
  closeFloorCardsPanel();
  renderFloorSwitcher();
  renderFloorMap();
}

function fmAddFloor(){
  const label=prompt('New floor label (e.g. "7th Floor"):');
  if(!label) return;
  const key=String(Math.max(...Object.keys(floorMap.floors).map(Number))+1);
  floorMap.floors[key]={label,canvasWidth:1200,canvasHeight:700,zones:[]};
  fmSwitchFloor(key);
}

// ── UNDO ──
function floorPushUndo(){ floorUndoSnapshot=JSON.stringify({map:floorMap,data:data.map(d=>({...d}))}); }
function floorUndo(){
  if(!floorUndoSnapshot) return;
  const snap=JSON.parse(floorUndoSnapshot);
  floorMap=snap.map;
  // restore seatRefs
  snap.data.forEach(sd=>{
    const found=data.find(d=>d.id===sd.id);
    if(found) found.seatRef=sd.seatRef||null;
  });
  floorUndoSnapshot=null; floorSelectedZoneId=null;
  renderFloorMap(); renderFloorSwitcher();
}

// ── EDIT TOOLBAR ACTIONS ──
function floorAddZone(){
  floorPushUndo();
  const id='zone_'+Math.random().toString(36).slice(2,8);
  fmCurrentFloor().zones.push({id,label:'New Zone',type:'room',department:'None',
    x:100,y:100,width:160,height:90,colorOverride:null});
  floorSelectedZoneId=id; renderFloorMap();
}
function floorDeleteSelectedZone(){
  if(!floorSelectedZoneId) return;
  if(!confirm('Delete this zone?')) return;
  floorPushUndo();
  fmCurrentFloor().zones=fmCurrentFloor().zones.filter(z=>z.id!==floorSelectedZoneId);
  floorSelectedZoneId=null; renderFloorMap();
}
async function floorSaveLayout(){
  await persist();
  const btn=document.querySelector('#floorToolbar .fm-save-btn');
  if(btn){ btn.textContent='✓ Saved'; btn.style.background='#22c55e'; btn.style.color='#fff';
    setTimeout(()=>{btn.textContent='Save Layout';btn.style.background='';btn.style.color='';},2000);}
  toast('Floor map layout saved','s');
}
function floorApplyColorOverride(v){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  floorPushUndo(); z.colorOverride=v; renderFloorMap();
}
function floorResetColorOverride(){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  floorPushUndo(); z.colorOverride=null; renderFloorMap();
}

// ── ZONE PROPERTY PANEL ──
function floorPropChanged(setColor){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  z.label=document.getElementById('zonePropLabel').value.trim()||'Zone';
  z.department=document.getElementById('zonePropDept').value;
  const newType=document.getElementById('zonePropType').value;
  if(newType !== z.type){
    z.type=newType;
    if(newType==='bay' && !z.config) z.config={rows:4,seatsPerSide:5,aisleRatio:0.15};
    if(newType==='bay' && !z.sections) z.sections=[];
    if(newType==='bay' && !z.seats) z.seats={};
    if(newType==='cabin' && z.staffId===undefined) z.staffId=null;
  }
  if(setColor) z.colorOverride=document.getElementById('zonePropColor').value;
  renderFloorMap();
  renderZonePropPanelContent(z);
}
function renderFloorZoneProps(){
  const panel=document.getElementById('zonePropPanel');
  if(!floorIsEditMode()||!floorSelectedZoneId){ panel.style.display='none'; return; }
  panel.style.display='block';
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  renderZonePropPanelContent(z);
}
function renderZonePropPanelContent(z){
  const panel=document.getElementById('zonePropPanel');
  panel.innerHTML=`
    <button class="zone-prop-close" onclick="document.getElementById('zonePropPanel').style.display='none'">✕</button>
    <div class="ff full"><label>Label</label><input type="text" id="zonePropLabel" value="${escHtml(z.label||'')}" oninput="floorPropChanged()"></div>
    <div class="ff full"><label>Type</label>
      <select id="zonePropType" onchange="floorPropChanged()">
        <option ${z.type==='room'?'selected':''}>room</option>
        <option ${z.type==='cabin'?'selected':''}>cabin</option>
        <option ${z.type==='bay'?'selected':''}>bay</option>
      </select>
    </div>
    <div class="ff full"><label>Department</label>
      <select id="zonePropDept" onchange="floorPropChanged()">
        <option value="None">None</option>
        ${getFloorDepartmentOptions().map(d=>`<option ${z.department===d?'selected':''}>${escHtml(d)}</option>`).join('')}
      </select>
    </div>
    <div class="ff full"><label>Colour Override</label>
      <input type="color" id="zonePropColor" value="${z.colorOverride||'#1a56e8'}" onchange="floorPropChanged(true)">
      <button class="btn bo" style="margin-top:.3rem;padding:.2rem .6rem;font-size:.72rem" onclick="floorResetColorOverride()">Reset to Auto</button>
    </div>
    ${z.type==='bay' ? renderBayConfigPanel(z) : ''}
    ${z.type==='cabin' ? renderCabinAssignPanel(z) : ''}
  `;
}

function renderBayConfigPanel(z){
  const cfg=z.config||{rows:4,seatsPerSide:5,aisleRatio:0.15};
  const secs=(z.sections||[]).map((s,i)=>`
    <div class="bay-sec-row">
      <input type="text" value="${escHtml(s.label)}" placeholder="Section name" onchange="fmUpdateSection(${i},'label',this.value)">
      <input type="number" min="0" max="19" value="${s.rows[0]}" style="width:44px" onchange="fmUpdateSection(${i},'rowFrom',this.value)">
      <span>–</span>
      <input type="number" min="0" max="19" value="${s.rows[s.rows.length-1]}" style="width:44px" onchange="fmUpdateSection(${i},'rowTo',this.value)">
      <button onclick="fmRemoveSection(${i})">✕</button>
    </div>`).join('');
  return `<div class="bay-config-panel">
    <div class="bay-config-title">Bay Configuration</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
      <div class="ff"><label>Rows</label><input type="number" min="1" max="20" value="${cfg.rows}" onchange="fmUpdateBayConfig('rows',+this.value)"></div>
      <div class="ff"><label>Seats/Side</label><input type="number" min="1" max="15" value="${cfg.seatsPerSide}" onchange="fmUpdateBayConfig('seatsPerSide',+this.value)"></div>
    </div>
    <div class="ff"><label>Aisle Ratio: <span id="aisleRatioVal">${cfg.aisleRatio}</span></label>
      <input type="range" min="0.10" max="0.30" step="0.01" value="${cfg.aisleRatio}" oninput="document.getElementById('aisleRatioVal').textContent=this.value;fmUpdateBayConfig('aisleRatio',+this.value)">
    </div>
    <div class="bay-sections-title">Sections <button class="btn bo" style="padding:.15rem .4rem;font-size:.7rem" onclick="fmAddSection()">+ Add</button></div>
    <div id="baySectionsList">${secs}</div>
    <div style="font-size:.68rem;color:var(--muted);margin-top:.4rem">Rows are 0-indexed. Seat assignments persist across config changes.</div>
  </div>`;
}

function fmUpdateBayConfig(key,val){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z||z.type!=='bay') return;
  if(!z.config) z.config={rows:4,seatsPerSide:5,aisleRatio:0.15};
  const oldCount=z.config.rows*z.config.seatsPerSide*2;
  z.config[key]=val;
  const newCount=z.config.rows*z.config.seatsPerSide*2;
  const occupied=Object.values(z.seats||{}).filter(v=>v&&v.staffId).length;
  if(newCount<occupied){
    if(!confirm(`This change will unassign ${occupied-newCount} seat(s). Continue?`)){
      renderZonePropPanelContent(z); return;
    }
  }
  renderFloorMap();
}
function fmAddSection(){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  if(!z.sections) z.sections=[];
  z.sections.push({label:'New Section',rows:[0],department:'None'});
  renderZonePropPanelContent(z);
}
function fmRemoveSection(i){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  z.sections.splice(i,1); renderZonePropPanelContent(z);
}
function fmUpdateSection(i,key,val){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z) return;
  const s=z.sections[i]; if(!s) return;
  if(key==='label') s.label=val;
  else if(key==='rowFrom'){ const to=s.rows[s.rows.length-1]; s.rows=fmRange(+val,to); }
  else if(key==='rowTo'){ const from=s.rows[0]; s.rows=fmRange(from,+val); }
  else if(key==='dept') s.department=val;
}
function fmRange(a,b){ const r=[]; for(let i=Math.min(a,b);i<=Math.max(a,b);i++) r.push(i); return r; }

function renderCabinAssignPanel(z){
  const assigned=z.staffId?data.find(p=>p.id===z.staffId):null;
  const options=data.filter(p=>{
    if(p.id===z.staffId) return true; // allow deselect
    if(!p.seatRef) return true;
    return false; // already assigned elsewhere
  }).map(p=>`<option value="${p.id}" ${p.id===z.staffId?'selected':''}>${escHtml(p.persons.join('/'))} (${escHtml(p.dept)})</option>`).join('');
  return `<div class="bay-config-panel">
    <div class="bay-config-title">Cabin Occupant</div>
    <select id="cabinStaffSel" onchange="fmAssignCabin(this.value)">
      <option value="">— Vacant —</option>
      ${options}
    </select>
    ${assigned?`<div style="font-size:.72rem;color:var(--muted);margin-top:.3rem">${escHtml(assigned.persons[0])} · ${escHtml(assigned.dept)}</div>`:''}
  </div>`;
}

function fmAssignCabin(staffIdStr){
  const z=fmGetZoneById(floorSelectedZoneId); if(!z||z.type!=='cabin') return;
  floorPushUndo();
  // unset old occupant's seatRef
  if(z.staffId){
    const old=data.find(p=>p.id===z.staffId);
    if(old) old.seatRef=null;
  }
  z.staffId=staffIdStr?+staffIdStr:null;
  if(z.staffId){
    const p=data.find(d=>d.id===z.staffId);
    if(p) p.seatRef={floor:floorCurrentFloor,zoneId:z.id,seatId:null};
  }
  renderFloorMap();
}

// ── SVG RENDERING ──
function renderFloorMap(){
  if(!floorMap||!floorMap.floors) floorMap=defFloorMap();
  const svg=document.getElementById('floorMapSvg');
  if(!svg) return;
  const floor=fmCurrentFloor();
  if(!floor) return;

  const toolbar=document.getElementById('floorToolbar');
  if(toolbar) toolbar.style.display=floorIsEditMode()?'flex':'none';

  svg.setAttribute('viewBox',`0 0 ${floor.canvasWidth} ${floor.canvasHeight}`);
  svg.innerHTML='';

  // SVG grid background
  const defs=svgEl('defs');
  const pat=svgEl('pattern');
  pat.setAttribute('id','fmGrid'); pat.setAttribute('width','30'); pat.setAttribute('height','30');
  pat.setAttribute('patternUnits','userSpaceOnUse');
  const dotLine1=svgEl('line'); dotLine1.setAttribute('x1','0'); dotLine1.setAttribute('y1','0'); dotLine1.setAttribute('x2','0'); dotLine1.setAttribute('y2','30');
  dotLine1.setAttribute('stroke','var(--border)'); dotLine1.setAttribute('stroke-width','0.3');
  const dotLine2=svgEl('line'); dotLine2.setAttribute('x1','0'); dotLine2.setAttribute('y1','0'); dotLine2.setAttribute('x2','30'); dotLine2.setAttribute('y2','0');
  dotLine2.setAttribute('stroke','var(--border)'); dotLine2.setAttribute('stroke-width','0.3');
  pat.appendChild(dotLine1); pat.appendChild(dotLine2);
  defs.appendChild(pat); svg.appendChild(defs);
  const bg=svgEl('rect');
  bg.setAttribute('width',floor.canvasWidth); bg.setAttribute('height',floor.canvasHeight);
  bg.setAttribute('fill','url(#fmGrid)'); svg.appendChild(bg);

  if(floorZoomZoneId){
    renderBayZoomView(svg, floor);
  } else {
    renderFloorView(svg, floor);
  }

  svg.onclick=e=>{
    if(e.target===svg||e.target.tagName==='rect'&&e.target.getAttribute('fill')==='url(#fmGrid)'){
      if(floorIsEditMode()){floorSelectedZoneId=null;renderFloorMap();}
    }
  };

  renderFloorLegend();
  renderFloorZoneProps();
  renderFloorSwitcher();
}

function svgEl(tag){
  return document.createElementNS('http://www.w3.org/2000/svg',tag);
}
function svgText(text,x,y,opts={}){
  const t=svgEl('text');
  t.setAttribute('x',x); t.setAttribute('y',y);
  t.setAttribute('text-anchor',opts.anchor||'middle');
  t.setAttribute('dominant-baseline',opts.baseline||'middle');
  t.setAttribute('fill',opts.fill||'#111827');
  t.setAttribute('font-size',opts.size||14);
  t.setAttribute('font-weight',opts.weight||'normal');
  t.setAttribute('font-family','Sora, sans-serif');
  if(opts.clip) t.setAttribute('clip-path',`url(#${opts.clip})`);
  t.textContent=text;
  return t;
}

// ── FLOOR VIEW ──
function renderFloorView(svg, floor){
  floor.zones.forEach(z=>{
    const g=svgEl('g');
    g.setAttribute('class','fm-zone-group');
    g.dataset.id=z.id;

    const fillHex=fmZoneColor(z);
    const isSelected=z.id===floorSelectedZoneId;
    const isActive=z.id===floorActiveZoneId;
    const isRoom=z.type==='room';

    // clip for text
    const clipId='clip_'+z.id;
    const defs2=svgEl('defs');
    const clipEl=svgEl('clipPath'); clipEl.setAttribute('id',clipId);
    const clipRect=svgEl('rect');
    clipRect.setAttribute('x',z.x+4); clipRect.setAttribute('y',z.y+4);
    clipRect.setAttribute('width',Math.max(0,z.width-8)); clipRect.setAttribute('height',Math.max(0,z.height-8));
    clipEl.appendChild(clipRect); defs2.appendChild(clipEl); g.appendChild(defs2);

    const r=svgEl('rect');
    r.setAttribute('x',z.x); r.setAttribute('y',z.y);
    r.setAttribute('width',z.width); r.setAttribute('height',z.height);
    r.setAttribute('rx',6); r.setAttribute('ry',6);
    r.setAttribute('fill',isRoom?'#E0E0E0':fmHexAlpha(fillHex,0.25));
    r.setAttribute('stroke',isSelected?'#2563eb':isActive?'#ef4444':'#374151');
    r.setAttribute('stroke-width',isSelected||isActive?2.5:1);
    if(!isRoom) r.style.cursor='pointer';

    if(!isRoom){
      r.addEventListener('click',e=>{e.stopPropagation();fmZoneClick(z.id);});
      if(floorIsEditMode()){
        r.addEventListener('dblclick',e=>{e.stopPropagation();floorSelectedZoneId=z.id;renderFloorMap();});
      }
    }
    g.appendChild(r);

    // Section bands for bay zones
    if(z.type==='bay' && z.sections && z.sections.length){
      const cfg=z.config||{rows:6,seatsPerSide:7,aisleRatio:0.15};
      const rowH=z.height/cfg.rows;
      z.sections.forEach(sec=>{
        const minR=Math.min(...sec.rows), maxR=Math.max(...sec.rows);
        const bandY=z.y+minR*rowH;
        const bandH=(maxR-minR+1)*rowH;
        const secColor=fmDeptColor(sec.department)||fillHex;
        const band=svgEl('rect');
        band.setAttribute('x',z.x+1); band.setAttribute('y',bandY);
        band.setAttribute('width',z.width-2); band.setAttribute('height',bandH);
        band.setAttribute('fill',fmHexAlpha(secColor,0.12));
        band.setAttribute('pointer-events','none');
        g.appendChild(band);
        if(z.width>80){
          const secTxt=svgText(sec.label, z.x+6, bandY+bandH/2, {
            anchor:'start', fill:fmHexAlpha(secColor,0.85), size:10, weight:'600', clip:clipId
          });
          g.appendChild(secTxt);
        }
      });
    }

    // Zone label
    const textFill=isRoom?'#555':fmTextColor(fillHex);
    const labelY=z.type==='bay' ? z.y+z.height*0.38 : z.y+z.height/2;
    const labelSize=Math.min(14, Math.max(9, z.width/10));
    const lbl=svgText(z.label, z.x+z.width/2, labelY, {fill:textFill, size:labelSize, weight:'600', clip:clipId});
    g.appendChild(lbl);

    // Cabin: occupant name
    if(z.type==='cabin' && z.staffId){
      const occ=data.find(p=>p.id===z.staffId);
      if(occ){
        const occName=occ.persons[0].split(' ')[0];
        g.appendChild(svgText(occName, z.x+z.width/2, z.y+z.height/2+12, {fill:textFill, size:Math.max(8,labelSize-3), clip:clipId}));
      }
    }

    // Bay: seat count badge
    if(z.type==='bay'){
      const cfg=z.config||{rows:6,seatsPerSide:7,aisleRatio:0.15};
      const total=cfg.rows*cfg.seatsPerSide*2;
      const occupied=Object.values(z.seats||{}).filter(v=>v&&v.staffId).length;
      const badgeTxt=`${occupied}/${total}`;
      const bx=z.x+z.width/2, by=z.y+z.height*0.65;
      const pill=svgEl('rect');
      pill.setAttribute('x',bx-20); pill.setAttribute('y',by-8);
      pill.setAttribute('width',40); pill.setAttribute('height',16);
      pill.setAttribute('rx',8); pill.setAttribute('fill',fmHexAlpha(fillHex,0.9));
      g.appendChild(pill);
      g.appendChild(svgText(badgeTxt, bx, by, {fill:'#fff', size:9, weight:'600'}));
    }

    // Locate on map highlight ring
    if(z._highlight){
      const glow=svgEl('rect');
      glow.setAttribute('x',z.x-3); glow.setAttribute('y',z.y-3);
      glow.setAttribute('width',z.width+6); glow.setAttribute('height',z.height+6);
      glow.setAttribute('rx',9); glow.setAttribute('ry',9);
      glow.setAttribute('fill','none'); glow.setAttribute('stroke','#f59e0b');
      glow.setAttribute('stroke-width',3); glow.setAttribute('opacity','0.85');
      g.insertBefore(glow, r);
    }

    // Edit mode handles
    if(floorIsEditMode() && z.id===floorSelectedZoneId){
      floorRenderHandles(g,z);
      floorBindDrag(r,z);
    }

    svg.appendChild(g);
  });
}

// ── BAY ZOOM VIEW ──
function renderBayZoomView(svg, floor){
  const z=fmGetZoneById(floorZoomZoneId); if(!z||z.type!=='bay') return;
  const pad=20;
  const vx=z.x-pad, vy=z.y-pad, vw=z.width+pad*2, vh=z.height+pad*2;
  svg.setAttribute('viewBox',`${vx} ${vy} ${vw} ${vh}`);

  // Zone background
  const bg=svgEl('rect');
  bg.setAttribute('x',z.x); bg.setAttribute('y',z.y);
  bg.setAttribute('width',z.width); bg.setAttribute('height',z.height);
  bg.setAttribute('rx',6); bg.setAttribute('fill',fmHexAlpha(fmZoneColor(z),0.1));
  bg.setAttribute('stroke','#374151'); bg.setAttribute('stroke-width',1.5);
  svg.appendChild(bg);

  const cfg=z.config||{rows:6,seatsPerSide:7,aisleRatio:0.15};
  const {rows,seatsPerSide,aisleRatio}=cfg;
  const aisleWidth=z.width*aisleRatio;
  const sideWidth=(z.width-aisleWidth)/2;
  const seatW=sideWidth/seatsPerSide*0.82;
  const rowH=z.height/rows;
  const seatH=rowH*0.70;
  const rowGap=rowH-seatH;
  const seatGap=sideWidth/seatsPerSide*0.18;

  // Section bands
  if(z.sections&&z.sections.length){
    z.sections.forEach(sec=>{
      const minR=Math.min(...sec.rows),maxR=Math.max(...sec.rows);
      const bandY=z.y+minR*rowH;
      const bandH=(maxR-minR+1)*rowH;
      const secColor=fmDeptColor(sec.department)||'#64748b';
      const band=svgEl('rect');
      band.setAttribute('x',z.x); band.setAttribute('y',bandY);
      band.setAttribute('width',z.width); band.setAttribute('height',bandH);
      band.setAttribute('fill',fmHexAlpha(secColor,0.07));
      band.setAttribute('pointer-events','none');
      svg.appendChild(band);
      // Section label
      const lbl=svgText(sec.label, z.x+4, bandY+rowH/2, {anchor:'start',fill:fmHexAlpha(secColor,0.7),size:9,weight:'600'});
      svg.appendChild(lbl);
    });
  }

  // Aisle line
  const aisleX=z.x+sideWidth;
  const aisle=svgEl('rect');
  aisle.setAttribute('x',aisleX); aisle.setAttribute('y',z.y);
  aisle.setAttribute('width',aisleWidth); aisle.setAttribute('height',z.height);
  aisle.setAttribute('fill','rgba(0,0,0,0.04)'); aisle.setAttribute('pointer-events','none');
  svg.appendChild(aisle);

  // Seats
  for(let r=0;r<rows;r++){
    const rowY=z.y+r*rowH+rowGap/2;
    for(let s=0;s<seatsPerSide;s++){
      // LEFT side: from aisle outward
      const lx=z.x+sideWidth-(s+1)*(seatW+seatGap)+seatGap/2;
      const lid=`R${r}-L${s}`;
      renderSeat(svg, z, lid, lx, rowY, seatW, seatH);
      // RIGHT side
      const rx2=z.x+sideWidth+aisleWidth+s*(seatW+seatGap);
      const rid=`R${r}-R${s}`;
      renderSeat(svg, z, rid, rx2, rowY, seatW, seatH);
    }
  }

  // "Back to Floor" button
  const btnG=svgEl('g');
  btnG.style.cursor='pointer';
  btnG.addEventListener('click',()=>fmExitZoom());
  const btnBg=svgEl('rect');
  btnBg.setAttribute('x',vx+4); btnBg.setAttribute('y',vy+4);
  btnBg.setAttribute('width',110); btnBg.setAttribute('height',24);
  btnBg.setAttribute('rx',12); btnBg.setAttribute('fill','var(--surface,#fff)');
  btnBg.setAttribute('stroke','#374151'); btnBg.setAttribute('stroke-width',1);
  btnG.appendChild(btnBg);
  btnG.appendChild(svgText('← Back to Floor', vx+59, vy+16, {fill:'#374151',size:11,weight:'600'}));
  svg.appendChild(btnG);
}

function renderSeat(svg, zone, seatId, sx, sy, sw, sh){
  const seat=zone.seats?.[seatId];
  const staffMember=seat?.staffId ? data.find(p=>p.id===seat.staffId) : null;
  const occupied=!!staffMember;
  const isSelected=seatId===floorSelectedSeatId;
  const deptColor=staffMember ? fmDeptColor(staffMember.dept) : '#94a3b8';

  const g=svgEl('g');
  g.style.cursor='pointer';

  const r=svgEl('rect');
  r.setAttribute('x',sx); r.setAttribute('y',sy);
  r.setAttribute('width',sw); r.setAttribute('height',sh);
  r.setAttribute('rx',3);
  if(occupied){
    r.setAttribute('fill',fmHexAlpha(deptColor,0.3));
    r.setAttribute('stroke',isSelected?'#f59e0b':deptColor);
    r.setAttribute('stroke-width',isSelected?2:1);
  } else {
    r.setAttribute('fill','rgba(255,255,255,0.4)');
    r.setAttribute('stroke','#94a3b8');
    r.setAttribute('stroke-width',1);
    r.setAttribute('stroke-dasharray','3,2');
  }
  g.appendChild(r);

  // selected glow
  if(isSelected){
    const glow=svgEl('rect');
    glow.setAttribute('x',sx-2); glow.setAttribute('y',sy-2);
    glow.setAttribute('width',sw+4); glow.setAttribute('height',sh+4);
    glow.setAttribute('rx',5); glow.setAttribute('fill','none');
    glow.setAttribute('stroke','#f59e0b'); glow.setAttribute('stroke-width',2);
    g.insertBefore(glow,r);
  }

  if(occupied && sw>20){
    const initials=staffMember.persons[0].split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
    const txt=svgText(initials, sx+sw/2, sy+sh/2, {fill:fmTextColor(deptColor)||'#111',size:Math.min(10,sw/2),weight:'600'});
    g.appendChild(txt);
  }

  // Tooltip via title
  const ttip=svgEl('title');
  ttip.textContent=occupied
    ? `${staffMember.persons.join(' / ')} · ${staffMember.role||''} · ${staffMember.dept}\nExt: ${staffMember.ext}\nSeat: ${seatId}`
    : `Vacant · Seat: ${seatId}`;
  g.appendChild(ttip);

  g.addEventListener('click',e=>{
    e.stopPropagation();
    fmSeatClick(zone.id, seatId, staffMember);
  });

  // Edit mode: seat assignment popover
  if(floorIsEditMode()){
    g.addEventListener('dblclick',e=>{
      e.stopPropagation();
      fmOpenSeatAssign(zone, seatId);
    });
  }

  svg.appendChild(g);
}

function fmSeatClick(zoneId, seatId, staffMember){
  if(floorSelectedSeatId===seatId){
    floorSelectedSeatId=null;
    // show all bay occupants
    const z=fmGetZoneById(zoneId); if(!z) return;
    fmShowBayCards(z);
    renderFloorMap();
    return;
  }
  floorSelectedSeatId=seatId;
  renderFloorMap();
  if(staffMember){
    renderFloorCards([staffMember]);
    document.getElementById('floorCardsPanel').classList.add('open');
  } else {
    closeFloorCardsPanel();
  }
}

function fmOpenSeatAssign(zone, seatId){
  // remove existing popover
  document.getElementById('fm-seat-popover')?.remove();
  const seat=zone.seats?.[seatId];
  const currentStaff=seat?.staffId?data.find(p=>p.id===seat.staffId):null;

  // Build list of assignable staff (not yet seated, plus current)
  const opts=data.filter(p=>{
    if(p.id===currentStaff?.id) return true;
    if(p.seatRef) return false;
    return true;
  });

  const pop=document.createElement('div');
  pop.id='fm-seat-popover';
  pop.className='fm-seat-popover';
  pop.innerHTML=`
    <strong>Seat ${seatId}</strong>
    <select id="fmSeatSel">
      <option value="">— Vacant —</option>
      ${opts.map(p=>`<option value="${p.id}"${p.id===currentStaff?.id?' selected':''}>${escHtml(p.persons.join('/'))} (${escHtml(p.dept)})</option>`).join('')}
    </select>
    <div style="display:flex;gap:.4rem;margin-top:.4rem">
      <button class="btn bp" style="flex:1;padding:.3rem" onclick="fmConfirmSeatAssign('${zone.id}','${seatId}')">Assign</button>
      <button class="btn bo" style="flex:1;padding:.3rem" onclick="document.getElementById('fm-seat-popover')?.remove()">Cancel</button>
    </div>
  `;
  document.getElementById('floorMapWrap').appendChild(pop);
}

function fmConfirmSeatAssign(zoneId, seatId){
  const z=fmGetZoneById(zoneId); if(!z) return;
  const selEl=document.getElementById('fmSeatSel'); if(!selEl) return;
  const staffId=selEl.value?+selEl.value:null;
  floorPushUndo();
  if(!z.seats) z.seats={};

  // unset old occupant
  const old=z.seats[seatId];
  if(old?.staffId){
    const oldP=data.find(p=>p.id===old.staffId);
    if(oldP) oldP.seatRef=null;
  }

  z.seats[seatId]=staffId?{staffId}:null;
  if(staffId){
    const p=data.find(d=>d.id===staffId);
    if(p) p.seatRef={floor:floorCurrentFloor, zoneId:z.id, seatId};
  }
  document.getElementById('fm-seat-popover')?.remove();
  renderFloorMap();
  toast('Seat assigned — Save Layout to persist','i');
}

// ── ZONE CLICK (view mode) ──
function fmZoneClick(id){
  if(floorIsEditMode()){ floorSelectedZoneId=id; renderFloorMap(); return; }
  const z=fmGetZoneById(id); if(!z) return;
  if(z.type==='room') return;

  if(z.type==='bay'){
    if(floorZoomZoneId===id){
      fmExitZoom(); return;
    }
    floorZoomZoneId=id;
    floorActiveZoneId=id;
    floorSelectedSeatId=null;
    fmShowBayCards(z);
    renderFloorMap();
    return;
  }

  // cabin
  if(floorActiveZoneId===id){ closeFloorCardsPanel(); floorActiveZoneId=null; renderFloorMap(); return; }
  floorActiveZoneId=id;
  if(z.staffId){
    const p=data.find(d=>d.id===z.staffId);
    if(p){ renderFloorCards([p]); document.getElementById('floorCardsPanel').classList.add('open'); }
  } else {
    // filter by department
    const rows=data.filter(p=>p.dept===z.department);
    renderFloorCards(rows);
    if(rows.length) document.getElementById('floorCardsPanel').classList.add('open');
  }
  renderFloorMap();
}

function fmShowBayCards(z){
  const seats=z.seats||{};
  const staffIds=[...new Set(Object.values(seats).filter(v=>v?.staffId).map(v=>v.staffId))];
  const rows=staffIds.map(id=>data.find(p=>p.id===id)).filter(Boolean);
  if(!rows.length){
    // fallback: by department
    const deptRows=data.filter(p=>p.dept===z.department);
    renderFloorCards(deptRows); if(deptRows.length) document.getElementById('floorCardsPanel').classList.add('open');
  } else {
    renderFloorCards(rows); document.getElementById('floorCardsPanel').classList.add('open');
  }
}

function fmExitZoom(){
  floorZoomZoneId=null;
  floorActiveZoneId=null;
  floorSelectedSeatId=null;
  closeFloorCardsPanel();
  renderFloorMap();
}

// ── FLOOR CARDS PANEL ──
function renderFloorCards(rows){
  const grid=document.getElementById('floorCardGrid');
  if(!rows.length){ grid.innerHTML='<div class="empty"><div class="ei">📭</div><p>No entries found.</p></div>'; return; }
  grid.innerHTML=rows.map(p=>{
    const ini=p.persons[0].split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
    const isFav=favs.has(p.id);
    const seat=p.seatRef ? `<span class="seat-tag">📍 ${p.seatRef.floor}F · ${p.seatRef.seatId||'cabin'}</span>` : '';
    return `<div class="emp-card" onclick="openCardModal(${p.id})">
      <div class="ec-top"><div class="ec-av" style="${aS(p.persons[0])}">${ini}</div>
      <button class="star${isFav?' on':''}" onclick="toggleFav(${p.id},event)">${isFav?'★':'☆'}</button></div>
      <div class="ec-names">${escHtml(p.persons.join(' / '))}</div>
      <div class="ec-role">${escHtml(p.role||'—')}</div>
      ${seat}
      <div class="ec-footer"><span class="dp" style="${dS(p.dept)};font-size:.6rem">${escHtml(p.dept)}</span>
      <a class="tel-link eb" href="tel:${escHtml(p.ext)}">📞 ${escHtml(p.ext)}</a></div>
    </div>`;
  }).join('');
}

function closeFloorCardsPanel(){
  document.getElementById('floorCardsPanel').classList.remove('open');
}

// ── LEGEND ──
function renderFloorLegend(){
  const el=document.getElementById('floorLegend');
  if(!el) return;
  _fmDeptMap={};
  const depts=[...new Set(fmAllZones().map(z=>z.department).filter(d=>d&&d!=='None'))];
  el.innerHTML=`<div class="fm-legend-title">Legend</div>`+depts.map(d=>`
    <div class="fm-legend-item">
      <span class="fm-legend-dot" style="background:${fmDeptColor(d)}"></span>
      <span>${escHtml(d)}</span>
    </div>`).join('');
}

// ── EDIT MODE: DRAG & RESIZE ──
function floorRenderHandles(g,z){
  const pts=[
    ['nw',z.x,z.y],['n',z.x+z.width/2,z.y],['ne',z.x+z.width,z.y],
    ['e',z.x+z.width,z.y+z.height/2],['se',z.x+z.width,z.y+z.height],
    ['s',z.x+z.width/2,z.y+z.height],['sw',z.x,z.y+z.height],['w',z.x,z.y+z.height/2]
  ];
  pts.forEach(([h,x,y])=>{
    const c=svgEl('rect');
    c.setAttribute('x',x-5);c.setAttribute('y',y-5);c.setAttribute('width',10);c.setAttribute('height',10);
    c.setAttribute('fill','#fff');c.setAttribute('stroke','#2563eb');c.setAttribute('class','fm-handle');
    c.setAttribute('rx',2);
    c.style.cursor=h==='n'||h==='s'?'ns-resize':h==='e'||h==='w'?'ew-resize':'nwse-resize';
    c.addEventListener('mousedown',e=>{e.stopPropagation();floorStartResize(e,z.id,h);});
    g.appendChild(c);
  });
}

function floorBindDrag(el,z){ el.style.cursor='move'; el.addEventListener('mousedown',e=>{e.stopPropagation();floorStartDrag(e,z.id);}); }

function floorSelectForEdit(id,showProps){
  floorSelectedZoneId=id;
  if(showProps){ const p=document.getElementById('zonePropPanel'); p.style.display='block'; }
  renderFloorMap();
}

function floorToSvgPoint(evt){
  const svg=document.getElementById('floorMapSvg');
  const pt=svg.createSVGPoint(); pt.x=evt.clientX; pt.y=evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function floorStartDrag(evt,id){
  if(!floorIsEditMode()) return;
  evt.preventDefault(); floorPushUndo();
  const z=fmGetZoneById(id); if(!z) return; floorSelectedZoneId=id;
  const p=floorToSvgPoint(evt);
  floorDragState={type:'move',id,start:p,orig:{x:z.x,y:z.y,width:z.width,height:z.height}};
  window.addEventListener('mousemove',floorOnMove); window.addEventListener('mouseup',floorEndDrag);
}
function floorStartResize(evt,id,handle){
  evt.preventDefault(); evt.stopPropagation(); floorPushUndo();
  const z=fmGetZoneById(id); if(!z) return; floorSelectedZoneId=id;
  const p=floorToSvgPoint(evt);
  floorDragState={type:'resize',handle,id,start:p,orig:{x:z.x,y:z.y,width:z.width,height:z.height}};
  window.addEventListener('mousemove',floorOnMove); window.addEventListener('mouseup',floorEndDrag);
}
function floorOnMove(evt){
  if(!floorDragState) return;
  const z=fmGetZoneById(floorDragState.id); if(!z) return;
  const p=floorToSvgPoint(evt); const dx=p.x-floorDragState.start.x; const dy=p.y-floorDragState.start.y;
  const floor=fmCurrentFloor();
  if(floorDragState.type==='move'){
    z.x=Math.max(0,Math.min(floor.canvasWidth-z.width, floorDragState.orig.x+dx));
    z.y=Math.max(0,Math.min(floor.canvasHeight-z.height, floorDragState.orig.y+dy));
  } else {
    const o=floorDragState.orig; let x=o.x,y=o.y,w=o.width,h=o.height;
    if(floorDragState.handle.includes('e')) w=Math.max(60,o.width+dx);
    if(floorDragState.handle.includes('s')) h=Math.max(40,o.height+dy);
    if(floorDragState.handle.includes('w')){ x=o.x+dx; w=Math.max(60,o.width-dx); }
    if(floorDragState.handle.includes('n')){ y=o.y+dy; h=Math.max(40,o.height-dy); }
    z.x=x;z.y=y;z.width=w;z.height=h;
  }
  renderFloorMap();
}
function floorEndDrag(){ floorDragState=null; window.removeEventListener('mousemove',floorOnMove); window.removeEventListener('mouseup',floorEndDrag); }

// ── BIDIRECTIONAL SEARCH: "Locate on Map" ──
function locateOnMap(staffId){
  const p=data.find(d=>d.id===staffId); if(!p||!p.seatRef) return;
  const ref=p.seatRef;
  switchMainTab('floor');
  floorCurrentFloor=ref.floor;
  floorZoomZoneId=null;
  floorActiveZoneId=null;
  floorSelectedSeatId=null;
  renderFloorSwitcher();
  renderFloorMap();
  // highlight zone
  const z=fmGetZoneById(ref.zoneId); if(!z) return;
  z._highlight=true;
  setTimeout(()=>{ z._highlight=false; renderFloorMap(); },3000);
  if(z.type==='bay' && ref.seatId){
    setTimeout(()=>{
      fmZoneClick(z.id);
      setTimeout(()=>{
        floorSelectedSeatId=ref.seatId;
        renderFloorCards([p]);
        document.getElementById('floorCardsPanel').classList.add('open');
        renderFloorMap();
      },300);
    },200);
  } else {
    fmZoneClick(z.id);
  }
}

// ═══════════════ FAVORITES ═══════════════
function toggleFav(id, e){
  if(e) e.stopPropagation();
  if(favs.has(id)) favs.delete(id); else favs.add(id);
  saveFavs();
  render();
}
function toggleFavFilter(){
  showFavsOnly=!showFavsOnly;
  const btn=document.getElementById('favToggleBtn');
  btn.classList.toggle('on',showFavsOnly);
  btn.querySelector('.fav-star-ico').textContent=showFavsOnly?'★':'☆';
  render();
}

// ═══════════════ BULK DELETE ═══════════════
function toggleSelect(id){
  if(selectedIds.has(id)) selectedIds.delete(id); else selectedIds.add(id);
  updateBulkInfo();
  render();
}
function updateBulkInfo(){
  const info=document.getElementById('bulkInfo');
  if(info) info.textContent=`${selectedIds.size} selected`;
}
function selectAllVisible(){
  const q=document.getElementById('q').value.toLowerCase().trim();
  const df=document.getElementById('df').value;
  data.filter(p=>{
    if(showFavsOnly&&!favs.has(p.id))return false;
    const f=`${p.persons.join(' ')} ${p.ext} ${p.dept} ${p.role} ${p.location} ${(p.emails||[]).join(' ')}`.toLowerCase();
    return(!q||f.includes(q))&&(!df||p.dept===df);
  }).forEach(p=>selectedIds.add(p.id));
  updateBulkInfo();
  render();
}
function clearSelection(){
  selectedIds.clear();
  updateBulkInfo();
  render();
}
async function bulkDelete(){
  if(!selectedIds.size){toast('Nothing selected','e');return;}
  if(!confirm(`Delete ${selectedIds.size} selected entr${selectedIds.size===1?'y':'ies'}? This cannot be undone.`))return;
  data=data.filter(p=>!selectedIds.has(p.id));
  selectedIds.clear();
  updateBulkInfo();
  render();
  toast(`Deleted entries`,'s');
  await persist();
}

// ═══════════════ LOGO / BANNER ═══════════════
function handleLogo(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    const bf=document.getElementById('bannerFull');
    bf.src=ev.target.result;
    bf.classList.remove('hidden');
    document.getElementById('hdrBanner').classList.add('img-mode');
    toast('Banner updated','s');
  };
  r.readAsDataURL(f);
}

// ═══════════════ IT REQUEST ═══════════════
function mailIT(){
  const n=document.getElementById('itn').value.trim(),t=document.getElementById('itt').value,d=document.getElementById('itd').value.trim();
  if(!n||!t||!d){toast('Please fill all required fields first','e');return;}
  const subj=`Phone Directory Change Request – ${t}`;
  const body=document.getElementById('itPreview').textContent;
  window.location.href=`mailto:${IT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
}
function rediffIT(){
  const n=document.getElementById('itn').value.trim(),t=document.getElementById('itt').value,d=document.getElementById('itd').value.trim();
  if(!n||!t||!d){toast('Please fill all required fields first','e');return;}
  const subj=`Phone Directory Change Request – ${t}`;
  const body=document.getElementById('itPreview').textContent;
  const full=`To: ${IT_EMAIL}\nSubject: ${subj}\n\n${body}`;
  navigator.clipboard.writeText(full).then(()=>{
    window.open('https://mail.ubisl.co.in','_blank');
    toast('Copied! Paste into compose window (Ctrl+V)','i');
  }).catch(()=>{
    const el=document.getElementById('itPreview');
    const sel=window.getSelection();const range=document.createRange();
    range.selectNodeContents(el);sel.removeAllRanges();sel.addRange(range);
    window.open('https://mail.ubisl.co.in','_blank');
    toast('Text selected — copy it, then paste in compose','i');
  });
}

// ═══════════════ SECRET ADMIN UNLOCK ═══════════════
let keyBuf='';
const SECRET='ADMIN';
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
  if(mainTab==='floor'&&floorIsEditMode()&&e.key==='Delete'&&floorSelectedZoneId){ floorDeleteSelectedZone(); return; }
  if(e.key==='Escape'){closeM('pinM');closeM('fM');closeM('itM');closeM('admPanelM');keyBuf='';return;}
  if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();document.getElementById('q').focus();return;}
  // build secret buffer
  if(e.key.length===1){keyBuf=(keyBuf+e.key.toUpperCase()).slice(-SECRET.length);}
  if(keyBuf===SECRET){
    keyBuf='';
    if(isAdm){openM('admPanelM');}
    else{checkLockout();if(!lockedOut())openM('pinM');}
  }
});

function lockedOut(){return Date.now()<lockedUntil;}

function checkLockout(){
  if(lockedOut()){
    const rem=Math.ceil((lockedUntil-Date.now())/1000);
    const bar=document.getElementById('lockoutBar');
    bar.style.display='block';
    bar.textContent=`🔒 Admin locked after too many wrong attempts. Try again in ${rem}s.`;
    setTimeout(()=>{if(!lockedOut())bar.style.display='none';},1000);
    return;
  }
  document.getElementById('lockoutBar').style.display='none';
}

// ═══════════════ PIN ═══════════════
let pb='';
function pp(d){if(pb.length>=4||lockedOut())return;pb+=d;updPD();if(pb.length===4)setTimeout(pcheck,100);}
function pdel(){pb=pb.slice(0,-1);updPD();}
function updPD(){
  for(let i=0;i<4;i++){
    const el=document.getElementById('p'+i);
    if(el) el.className='pdot2'+(i<pb.length?' f':'');
  }
}
function pinShake(){
  document.querySelectorAll('.pdot2').forEach(d=>{
    d.classList.add('err');
    d.style.animation='none';
    requestAnimationFrame(()=>{ d.style.animation='dotShake .35s ease'; });
    setTimeout(()=>{ d.classList.remove('err'); d.style.animation=''; },600);
  });
}
// Keyboard support inside PIN modal
document.addEventListener('keydown',e=>{
  const pinOpen=document.getElementById('pinM').classList.contains('open');
  if(pinOpen){
    if(e.key>='0'&&e.key<='9'){e.preventDefault();pp(e.key);return;}
    if(e.key==='Backspace'){e.preventDefault();pdel();return;}
    if(e.key==='Enter'){e.preventDefault();pcheck();return;}
  }
});

function pcheck(){
  if(lockedOut()){toast('Admin locked out. Try later.','e');return;}
  if(pb===PIN){
    attempts=0;lockedUntil=0;saveLocal();
    isAdm=true;pb='';updPD();
    document.getElementById('ah').style.display='';
    document.getElementById('admBar').classList.add('visible');
    render(); if(mainTab==='floor') renderFloorMap(); closeM('pinM');openM('admPanelM');admTab('people');populateAdmStats();
    document.getElementById('pe2txt').textContent='';
    document.getElementById('attTxt').textContent='';
    toast('Admin mode enabled','s');
  }else{
    attempts++;
    pb='';updPD();
    const rem=MAX_ATT-attempts;
    if(attempts>=MAX_ATT){
      lockedUntil=Date.now()+LOCKOUT_MS;saveLocal();
      closeM('pinM');
      document.getElementById('lockoutBar').style.display='block';
      document.getElementById('lockoutBar').textContent=`🔒 Too many wrong attempts. Admin locked for 5 minutes.`;
      toast('Too many failed attempts. Locked for 5 minutes.','e');
    }else{
      saveLocal();
      document.getElementById('pe2txt').textContent=`Incorrect PIN — ${rem} attempt${rem===1?'':'s'} left.`;
      document.getElementById('attTxt').textContent='';
      pinShake();
    }
  }
}

function logOut(){
  isAdm=false;
  selectedIds.clear();
  document.getElementById('ah').style.display='none';
  document.getElementById('admBar').classList.remove('visible');
  document.getElementById('bulkBar').classList.remove('visible');
  render(); if(mainTab==='floor') renderFloorMap(); closeM('admPanelM');toast('Logged out','s');
}

// ═══════════════ CRUD ═══════════════
function openAdd(){
  editIdx=-1;
  document.getElementById('fT').innerHTML='Add Person <span class="tag">NEW</span>';
  ['fn','fe','fd','fr','fem'].forEach(id=>{document.getElementById(id).value='';document.getElementById(id).classList.remove('val-err');});
  document.getElementById('fl').value=LOC;
  document.getElementById('fdob').value='';
  document.getElementById('fnoem').checked=false;
  ['extWarn','emailWarn'].forEach(id=>document.getElementById(id).classList.remove('show'));
  openM('fM');
}

function editE(i){
  editIdx=i;const p=data[i];
  document.getElementById('fT').innerHTML='Edit Entry <span class="tag">EDIT</span>';
  document.getElementById('fn').value=p.persons.join(' / ');
  document.getElementById('fe').value=p.ext||'';
  document.getElementById('fd').value=p.dept||'';
  document.getElementById('fr').value=p.role||'';
  document.getElementById('fem').value=p.noEmail?'':(p.emails||[]).join(' / ');
  document.getElementById('fl').value=p.location||LOC;
  document.getElementById('fdob').value=p.dob||'';
  document.getElementById('fnoem').checked=!!p.noEmail;
  openM('fM');
}

// ── Validation helpers ───────────────────────────────────────
function isValidExt(v){ return /^[0-9]{2,6}(\/[0-9]{2,6})*$/.test(v.trim()); }
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function validateExt(){
  const v=document.getElementById('fe').value.trim();
  const el=document.getElementById('fe');
  if(v&&!isValidExt(v)){
    el.classList.add('val-err');
    return false;
  }
  el.classList.remove('val-err');
  return true;
}
function validateEmails(){
  const raw=document.getElementById('fem').value.trim();
  const noEmail=document.getElementById('fnoem').checked;
  if(noEmail||!raw) return true;
  const el=document.getElementById('fem');
  const allOk=raw.split('/').map(s=>s.trim()).every(e=>!e||isValidEmail(e));
  if(!allOk){ el.classList.add('val-err'); return false; }
  el.classList.remove('val-err');
  return true;
}
function checkDuplicate(){
  const ext=document.getElementById('fe').value.trim();
  const emailRaw=document.getElementById('fem').value.trim();
  const extWarn=document.getElementById('extWarn');
  const emailWarn=document.getElementById('emailWarn');
  const others=editIdx===-1?data:data.filter((_,i)=>i!==editIdx);
  // ext check
  if(ext){
    const clash=others.find(p=>p.ext===ext);
    if(clash){
      extWarn.textContent=`⚠ Extension ${ext} already used by: ${clash.persons.join(' / ')} (${clash.dept})`;
      extWarn.classList.add('show');
    } else { extWarn.classList.remove('show'); }
  } else { extWarn.classList.remove('show'); }
  // email check
  if(emailRaw){
    const emails=emailRaw.split('/').map(s=>s.trim().toLowerCase()).filter(Boolean);
    const clashEmails=[];
    others.forEach(p=>(p.emails||[]).forEach(em=>{
      if(emails.includes(em.toLowerCase()))
        clashEmails.push(`${em} → ${p.persons.join('/')} (${p.dept})`);
    }));
    if(clashEmails.length){
      emailWarn.textContent=`⚠ Email already used: ${clashEmails.join(', ')}`;
      emailWarn.classList.add('show');
    } else { emailWarn.classList.remove('show'); }
  } else { emailWarn.classList.remove('show'); }
}

async function saveE(){
  const namesRaw=document.getElementById('fn').value.trim();
  const ext=document.getElementById('fe').value.trim();
  const dept=document.getElementById('fd').value.trim();
  if(!namesRaw||!ext||!dept){toast('Names, extension and department required','e');return;}
  // Validation
  if(!isValidExt(ext)){toast('Extension must be numbers only (e.g. 212 or 104/199)','e');document.getElementById('fe').classList.add('val-err');return;}
  const noEmail=document.getElementById('fnoem').checked;
  const emailsRaw=document.getElementById('fem').value.trim();
  if(!noEmail&&emailsRaw){
    const badEmail=emailsRaw.split('/').map(s=>s.trim()).find(e=>e&&!isValidEmail(e));
    if(badEmail){toast(`Invalid email format: ${badEmail}`,'e');document.getElementById('fem').classList.add('val-err');return;}
  }
  const persons=namesRaw.split('/').map(s=>s.trim()).filter(Boolean);
  const emails=noEmail?[]:emailsRaw?emailsRaw.split('/').map(s=>s.trim()):persons.map(n=>autoEmail(n));
  const dobRaw=document.getElementById('fdob').value.trim();
  const existing=editIdx===-1?{}:data[editIdx];
  const entry={
    ...existing,
    id:editIdx===-1?Date.now():data[editIdx].id,
    persons,ext,dept,
    role:document.getElementById('fr').value.trim(),
    emails,
    noEmail,
    location:document.getElementById('fl').value.trim()||LOC,
    dob:dobRaw||null,
  };
  if(editIdx===-1){data.push(entry);toast(`${persons.join(' / ')} added`,'s');}
  else{data[editIdx]=entry;toast(`${persons.join(' / ')} updated`,'s');}
  // Clear validation states
  ['fe','fem'].forEach(id=>{document.getElementById(id).classList.remove('val-err');});
  ['extWarn','emailWarn'].forEach(id=>{document.getElementById(id).classList.remove('show');});
  closeM('fM');render();
  await persist();
}

async function delE(i){
  const p=data[i];
  if(!confirm(`Remove "${p.persons.join(' / ')}" (Ext. ${p.ext})?`))return;
  const removed=data.splice(i,1)[0];
  render();
  queueUndo(removed,i);
  toast('Removed — you can undo for 10s','i');
  await persist();
}

function queueUndo(entry,index){
  lastDeleted={entry,index};
  const wrap=document.getElementById('undoWrap');
  document.getElementById('undoTxt').textContent=`Deleted ${entry.persons.join(' / ')}`;
  wrap.style.display='flex';
  clearTimeout(undoTimer);
  undoTimer=setTimeout(()=>{lastDeleted=null;wrap.style.display='none';},10000);
}

async function undoDelete(){
  if(!lastDeleted)return;
  clearTimeout(undoTimer);
  const {entry,index}=lastDeleted;
  const at=Math.max(0,Math.min(index,data.length));
  data.splice(at,0,entry);
  lastDeleted=null;
  document.getElementById('undoWrap').style.display='none';
  render();
  toast('Delete undone','s');
  await persist();
}

// ═══════════════ IMPORT / EXPORT ═══════════════
function exportJSON(){
  const blob=new Blob([JSON.stringify({data,floorMap,updated:lastUpd},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`ubi-directory-${new Date().toISOString().slice(0,10)}.json`;a.click();
  toast('JSON exported','s');
}

function importJSON(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=async ev=>{
    try{
      const parsed=JSON.parse(ev.target.result);
      const imported=parsed.data||parsed;
      if(!Array.isArray(imported))throw new Error('Invalid format');
      // Normalize old format (names string) to new (persons array)
      data=imported.map(p=>{
        if(!p.persons&&p.names)p.persons=p.names.split('/').map(s=>s.trim());
        if(!p.emails)p.emails=p.noEmail?[]:p.persons.map(n=>autoEmail(n));
        return p;
      });
      floorMap=parsed.floorMap||floorMap||defFloorMap();
      await persist();render();
      if(mainTab==='floor') renderFloorMap();
      toast(`Imported ${data.length} entries`,'s');
      closeM('admPanelM');
    }catch{toast('Invalid file. Please use an exported JSON file.','e');}
  };
  r.readAsText(f);
  e.target.value='';
}

// ═══════════════ EXPORT DOCX ═══════════════
async function exportDocx(){
  toast('Generating Word document…','i');
  try{
    const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
           AlignmentType,BorderStyle,WidthType,ShadingType,VerticalAlign,HeadingLevel}=docx;

    const border={style:BorderStyle.SINGLE,size:1,color:'CCCCCC'};
    const borders={top:border,bottom:border,left:border,right:border};
    const noBorder={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
    const noBorders={top:noBorder,bottom:noBorder,left:noBorder,right:noBorder};
    const hdrShade={fill:'1A56E8',type:ShadingType.CLEAR};

    // Group by department
    const deptMap={};
    data.forEach(p=>{if(!deptMap[p.dept])deptMap[p.dept]=[];deptMap[p.dept].push(p);});
    const depts=Object.keys(deptMap).sort();

    const children=[];

    // Title
    children.push(new Paragraph({
      alignment:AlignmentType.CENTER,
      spacing:{after:200},
      children:[new TextRun({text:'UBI SERVICES LIMITED',bold:true,size:36,font:'Arial',color:'1A56E8'})],
    }));
    children.push(new Paragraph({
      alignment:AlignmentType.CENTER,
      spacing:{after:100},
      children:[new TextRun({text:'Phone Extension Directory',size:26,font:'Arial',color:'444444'})],
    }));
    children.push(new Paragraph({
      alignment:AlignmentType.CENTER,
      spacing:{after:80},
      children:[new TextRun({text:'504-506, 5th Floor, Centrum, S.G. Barve Road, Thane',size:18,font:'Arial',color:'888888'})],
    }));
    children.push(new Paragraph({
      alignment:AlignmentType.CENTER,
      spacing:{after:360},
      children:[new TextRun({text:`Last Updated: ${lastUpd?new Date(lastUpd).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}):'—'}`,size:18,font:'Arial',color:'888888',italics:true})],
    }));

    // Table header row maker
    function hdrRow(){
      return new TableRow({
        tableHeader:true,
        children:[
          mkCell('Name',2200,true),
          mkCell('Extension',800,true),
          mkCell('Department',1600,true),
          mkCell('Designation',2400,true),
          mkCell('Email',2000,true),
          mkCell('Location',560,true),
        ]
      });
    }

    function mkCell(text,w,isHdr=false,shade=null){
      return new TableCell({
        borders,
        width:{size:w,type:WidthType.DXA},
        shading:isHdr?hdrShade:(shade||{fill:'FFFFFF',type:ShadingType.CLEAR}),
        margins:{top:80,bottom:80,left:120,right:120},
        verticalAlign:VerticalAlign.CENTER,
        children:[new Paragraph({
          children:[new TextRun({
            text,
            font:'Arial',
            size:isHdr?18:17,
            bold:isHdr,
            color:isHdr?'FFFFFF':'222222',
          })],
        })],
      });
    }

    const colWidths=[2200,800,1600,2400,2000,560];
    const totalW=colWidths.reduce((a,b)=>a+b,0);

    depts.forEach(dept=>{
      // Dept heading row (merged)
      children.push(new Paragraph({spacing:{before:200,after:60},children:[new TextRun({text:dept,bold:true,size:22,font:'Arial',color:'1A56E8'})]}));

      const rows=[hdrRow()];
      deptMap[dept].forEach((p,idx)=>{
        const emails=getEmails(p);
        const nameText=p.persons.join(' / ');
        const emailText=emails.join(' / ');
        const rowShade=idx%2===0?{fill:'F5F7FB',type:ShadingType.CLEAR}:{fill:'FFFFFF',type:ShadingType.CLEAR};
        rows.push(new TableRow({
          children:[
            mkCell(nameText,colWidths[0],false,rowShade),
            mkCell(p.ext,colWidths[1],false,rowShade),
            mkCell(p.dept,colWidths[2],false,rowShade),
            mkCell(p.role||'—',colWidths[3],false,rowShade),
            mkCell(emailText,colWidths[4],false,rowShade),
            mkCell(p.location||LOC,colWidths[5],false,rowShade),
          ]
        }));
      });

      children.push(new Table({
        width:{size:totalW,type:WidthType.DXA},
        columnWidths:colWidths,
        rows,
      }));
      children.push(new Paragraph({spacing:{after:120},children:[new TextRun({text:''})]}));
    });

    // Footer note
    children.push(new Paragraph({
      alignment:AlignmentType.CENTER,
      spacing:{before:400},
      children:[new TextRun({text:'This is a confidential internal document. For IT changes contact: it@ubisl.co.in',size:16,font:'Arial',color:'AAAAAA',italics:true})],
    }));

    const doc=new Document({
      styles:{default:{document:{run:{font:'Arial',size:18}}}},
      sections:[{
        properties:{page:{size:{width:12240,height:15840},margin:{top:900,right:900,bottom:900,left:900}}},
        children,
      }]
    });

    const blob=await Packer.toBlob(doc);
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=`UBI-Directory-${new Date().toISOString().slice(0,10)}.docx`;a.click();
    toast('Word document exported!','s');
  }catch(err){
    console.error(err);
    toast('Export failed. Check console for details.','e');
  }
}


// ═══════════════ CSV IMPORT / EXPORT ═══════════════
function exportCSV(){
  const headers=['Name(s)','Extension','Department','Designation','Email(s)','Location'];
  const rows=data.map(p=>{
    const emails=getEmails(p);
    return [
      p.persons.join(' / '),
      p.ext,
      p.dept,
      p.role||'',
      emails.join(' / '),
      p.location||LOC,
    ].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',');
  });
  const csv=[headers.map(h=>`"${h}"`).join(','),...rows].join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`UBI-Directory-${new Date().toISOString().slice(0,10)}.csv`;a.click();
  toast('CSV exported — open in Excel','s');
}

function importCSV(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=async ev=>{
    try{
      const lines=ev.target.result.split(/\r?\n/).filter(l=>l.trim());
      if(lines.length<2){toast('CSV appears empty','e');return;}
      // Skip header row
      const imported=lines.slice(1).map((line,i)=>{
        // Parse CSV line respecting quoted commas
        const cols=[];let cur='',inQ=false;
        for(let ci=0;ci<line.length;ci++){
          const ch=line[ci];
          if(ch==='"'){inQ=!inQ;}
          else if(ch===','&&!inQ){cols.push(cur.trim());cur='';}
          else cur+=ch;
        }
        cols.push(cur.trim());
        const [namesRaw,ext,dept,role,emailsRaw,location]=cols;
        if(!namesRaw||!ext||!dept) return null;
        const persons=namesRaw.split('/').map(s=>s.trim()).filter(Boolean);
        const emails=emailsRaw?emailsRaw.split('/').map(s=>s.trim()).filter(Boolean):persons.map(n=>autoEmail(n));
        return{id:Date.now()+i,persons,ext:ext.trim(),dept:dept.trim(),role:(role||'').trim(),emails,noEmail:false,location:(location||LOC).trim()};
      }).filter(Boolean);
      if(!imported.length){toast('No valid rows found in CSV','e');return;}
      if(!confirm(`Import ${imported.length} entries from CSV? This will REPLACE all current data.`))return;
      data=imported;
      await persist();render();
      toast(`Imported ${data.length} entries from CSV`,'s');
      closeM('admPanelM');
    }catch(err){console.error(err);toast('CSV parse error — check format','e');}
  };
  r.readAsText(f);
  e.target.value='';
}

// ═══════════════ PRINT A4 EXTENSION LIST ═══════════════
function printExtList(){
  // Build rows
  const deptMap={};
  data.forEach(p=>{if(!deptMap[p.dept])deptMap[p.dept]=[];deptMap[p.dept].push(p);});
  const depts=Object.keys(deptMap).sort();
  let rows='';
  depts.forEach(dept=>{
    rows+=`<tr style="background:#dbeafe!important"><td colspan="5" style="font-weight:700;font-size:6.2pt;text-transform:uppercase;letter-spacing:.07em;color:#1e3a8a!important;padding:2px 3px;border:1px solid #93c5fd!important">${escHtml(dept)}</td></tr>`;
    deptMap[dept].forEach(p=>{
      const emails=getEmails(p);
      rows+=`<tr>
        <td style="font-weight:600;color:#111827!important;font-size:6.6pt;padding:1.8px 3px;border:1px solid #dde3f5">${escHtml(p.persons.join(' / '))}</td>
        <td style="font-family:monospace;font-weight:700;font-size:7pt;color:#1a4fd6!important;padding:1.8px 3px;border:1px solid #dde3f5">${escHtml(p.ext)}</td>
        <td style="font-size:5.8pt;color:#374151!important;padding:1.8px 3px;border:1px solid #dde3f5">${escHtml(p.role||'—')}</td>
        <td style="font-size:5.5pt;color:#4b5563!important;font-family:monospace;padding:1.8px 3px;border:1px solid #dde3f5;overflow:hidden">${escHtml(emails.join(' / '))}</td>
        <td style="font-size:5.8pt;color:#374151!important;padding:1.8px 3px;border:1px solid #dde3f5">${escHtml(p.location||LOC)}</td>
      </tr>`;
    });
  });

  const now=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

  // ── IFRAME APPROACH: completely isolated from parent CSS vars ──
  // Create a hidden iframe with its own clean document so Chrome's
  // CSS variable resolution doesn't bleed dark theme colours in.
  const iframe=document.createElement('iframe');
  iframe.style.cssText='position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;opacity:0';
  document.body.appendChild(iframe);
  const doc=iframe.contentDocument||iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
    @page{size:A4 portrait;margin:8mm 6mm}
    body{font-family:'Sora',Arial,sans-serif;font-size:6.6pt;color:#111827;background:#fff}
    h1{font-size:11.5pt;font-weight:700;color:#0f2a7a;text-align:center;letter-spacing:-.01em}
    .sub{font-size:6.5pt;color:#6b7280;text-align:center;font-family:monospace;margin-top:1px}
    .meta{font-size:6pt;color:#9ca3af;text-align:center;margin-top:1px}
    .hdr{border-bottom:2.5px solid #1a4fd6;padding-bottom:3px;margin-bottom:5px}
    table{width:100%;border-collapse:collapse;table-layout:fixed}
    th{background:#1a4fd6!important;color:#fff!important;font-size:6.2pt;font-weight:700;
      text-transform:uppercase;letter-spacing:.07em;padding:2.5px 3px;text-align:left;
      border:1px solid #1a4fd6}
    td{padding:1.8px 3px;border:1px solid #dde3f5;vertical-align:middle;
      line-height:1.25;color:#111827!important;background:#fff!important;font-size:6.6pt}
    tr:nth-child(even) td{background:#f4f6fd!important;color:#111827!important}
    .footer{text-align:center;margin-top:4px;font-size:5.5pt;color:#9ca3af;
      border-top:1px solid #dde3f5;padding-top:2px;font-family:monospace}
  <\/style></head><body>
  <div class="hdr">
    <h1>UBI Services Limited — Phone Extension Directory</h1>
    <div class="sub">504-506, 5th Floor, Centrum, S.G. Barve Road, Thane</div>
    <div class="meta">Printed: ${now} &nbsp;·&nbsp; ${data.length} entries &nbsp;·&nbsp; INTERNAL DOCUMENT — DO NOT DISTRIBUTE</div>
  </div>
  <table>
    <thead><tr>
      <th style="width:25%">Name</th>
      <th style="width:9%">Ext.</th>
      <th style="width:22%">Designation</th>
      <th style="width:30%">Email</th>
      <th style="width:14%">Location</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">UBI Services Limited &nbsp;·&nbsp; IT Department &nbsp;·&nbsp; it@ubisl.co.in &nbsp;·&nbsp; Confidential Internal Use Only</div>
  <\/body><\/html>`);
  doc.close();

  // Print the iframe, then remove it
  setTimeout(()=>{
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(()=>{ document.body.removeChild(iframe); closeM('admPanelM'); },1000);
  },300);
}

// ═══════════════ CARD EXPAND MODAL ═══════════════
function openCardModal(id){
  const p=data.find(d=>d.id===id);
  if(!p) return;
  const shared=p.persons.length>1;
  const emails=getEmails(p);
  const m=isMgmt(p.role),dev=isGanesh(p);

  // top band gradient
  const band=document.getElementById('cmBand');
  if(m) band.style.background='linear-gradient(135deg,#78350f,#b8860b,#92400e)';
  else if(dev) band.style.background='linear-gradient(135deg,#1e1b4b,#3730a3,#0284c7)';
  else band.style.background='var(--hdr-grad)';

  // avatar
  const av=document.getElementById('cmAvatar');
  // Define 'ini' out here so the whole function can use it!
  const ini=p.persons[0].split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();

  if (p.photo && !shared) {
    av.innerHTML = `<img src="${p.photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    av.style.background = 'transparent';
    av.style.border = '2px solid var(--border)';
  } else {
    av.innerHTML = ini;
    av.style.border = 'none';
    av.style.cssText+=';'+aS(p.persons[0]).replace(/background:|color:/g,s=>s);
    Object.assign(av.style, {background: aS(p.persons[0]).match(/background:([^;]+)/)?.[1]||'', color: aS(p.persons[0]).match(/color:([^;]+)/)?.[1]||''});
  }

  document.getElementById('cmName').textContent=p.persons.join(' / ');
  // birthday badge
  const todayMD=(()=>{const d=new Date();return String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
  const nameEl=document.getElementById('cmName');
  if(p.dob && p.dob===todayMD){
    nameEl.innerHTML=escHtml(p.persons.join(' / '))+' <span title="Birthday today! 🎂" style="font-size:.9rem">🎂</span>';
  }
  document.getElementById('cmRole').textContent=p.role||'—';

  // dept badge
  const dc=DC[p.dept]||['#6b6b85','#f0f0f5'];
  document.getElementById('cmDept').innerHTML=`<span class="dp" style="background:${dc[1]};color:${dc[0]};border:1px solid ${dc[0]}44;font-size:.68rem;padding:.2rem .65rem">${escHtml(p.dept)}</span>`;

  // persons list
  const personsEl=document.getElementById('cmPersons');
  if(shared){
    personsEl.innerHTML=`<div class="cm-section" style="animation-delay:.38s">
      <div class="cm-section-label">Shared extension — ${p.persons.length} people</div>
      ${p.persons.map((name,j)=>{
        const ini2=name.split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
        const em=emails[j]||'';
        return`<div class="cm-person-row">
          <div class="cm-person-av" style="${aS(name)}">${ini2}</div>
          <div style="min-width:0">
            <div class="cm-person-name">${escHtml(name)}</div>
            ${em?`<div class="cm-person-email"><a href="mailto:${escHtml(em)}">✉ ${escHtml(em)}</a></div>`:''}
          </div>
        </div>`;
      }).join('')}
    </div>`;
  } else {
    const em=emails[0]||'';
    personsEl.innerHTML=em?`<div class="cm-section" style="animation-delay:.38s">
      <div class="cm-section-label">Email</div>
      <div class="cm-person-row">
        <div class="cm-person-av" style="${aS(p.persons[0])}">${ini}</div>
        <div class="cm-person-email"><a href="mailto:${escHtml(em)}" style="font-size:.8rem">✉ ${escHtml(em)}</a></div>
      </div>
    </div>`:'';
  }

  // ext button
  const extBtn=document.getElementById('cmExt');
  extBtn.href=`tel:${p.ext}`;
  document.getElementById('cmExtNum').textContent=p.ext;

  // footer buttons
  const isFav=favs.has(p.id);
  const idx=data.indexOf(p);
  let btns=`<button class="btn bo" onclick="toggleFav(${p.id},event);updateCmFavBtn(${p.id})" id="cmFavBtn">${isFav?'★ Unstar':'☆ Star'}</button>`;
  if(isAdm) btns+=`<button class="btn bo" onclick="closeCardModalDirect();editE(${idx})">✏️ Edit</button><button class="btn bo" style="color:var(--danger);border-color:var(--danger)" onclick="closeCardModalDirect();delE(${idx})">🗑️</button>`;
  document.getElementById('cmFooterBtns').innerHTML=btns;

  // status badge (only show when non-available)
  const st=getStatus(p.status||'available');
  const stEl=document.getElementById('cmStatus');
  if(stEl){
    if((p.status||'available')!=='available'){
      stEl.innerHTML=`<span style="display:inline-flex;align-items:center;gap:.3rem;font-size:.72rem;background:${st.color}18;color:${st.color};border:1px solid ${st.color}44;border-radius:20px;padding:.18rem .6rem;font-weight:600">${st.icon} ${st.label}${p.statusNote?` · ${escHtml(p.statusNote)}`:''}</span>`;
      stEl.style.display='';
    } else {
      stEl.innerHTML=''; stEl.style.display='none';
    }
  }

  // profile unlock section
  renderProfileSection(p.id);

  const modal=document.getElementById('cardModal');
  const box=document.getElementById('cmBox');
  box.classList.remove('closing');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function updateCmFavBtn(id){
  const btn=document.getElementById('cmFavBtn');
  if(btn) btn.textContent=favs.has(id)?'★ Unstar':'☆ Star';
}

function closeCardModal(e){
  if(e.target===document.getElementById('cardModal')) closeCardModalDirect();
}
function closeCardModalDirect(){
  const box=document.getElementById('cmBox');
  box.classList.add('closing');
  setTimeout(()=>{
    document.getElementById('cardModal').classList.remove('open');
    document.body.style.overflow='';
  },380);
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.getElementById('cardModal').classList.contains('open')){
    closeCardModalDirect();
  }
});

async function sendStatEvent(payload){
  if(!IS_SERVER) return;
  try{
    await fetch(API_STATS,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }catch{}
}

// ── Admin panel tab switcher ─────────────────────────────
function admTab(name){
  ['people','data','pins','approvals','analytics','audit'].forEach(t=>{
    const el=document.getElementById('adm-'+t);
    if(el) el.style.display=t===name?'block':'none';
    const btn=document.getElementById('tab-'+t);
    if(btn) btn.classList.toggle('active',t===name);
  });
  if(name==='pins') renderPinMgmt();
  if(name==='approvals') renderPhotoApprovals();
}

function populateAdmStats(){
  const row=document.getElementById('admStatRow');
  if(!row) return;
  const depts=[...new Set(data.map(p=>p.dept))].length;
  const shared=data.filter(p=>p.persons.length>1).length;
  row.innerHTML=`
    <div class="adm-stat"><div class="asn">${data.length}</div><div class="asl">Entries</div></div>
    <div class="adm-stat"><div class="asn">${depts}</div><div class="asl">Depts</div></div>
    <div class="adm-stat"><div class="asn">${shared}</div><div class="asl">Shared</div></div>
  `;
}

async function loadAnalytics(){
  const body=document.getElementById('analyticsBody');
  if(!IS_SERVER){
    body.innerHTML='<div class="anlt-empty">📡 Analytics only available on the live Synology server.<br><span style="font-size:.71rem;color:var(--muted)">Open via http://[NAS-IP]/directory to see real data.</span></div>';
    return;
  }
  body.innerHTML='<div class="anlt-empty">Loading…</div>';
  try{
    const r=await fetch(API_STATS,{headers:{'X-Admin-Pin':PIN}});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const json=await r.json();
    const s=json.stats||{};
    const exts=Object.entries((s.searches&&s.searches.extensions)||{}).sort((a,b)=>b[1]-a[1]).slice(0,8);
    const depts=Object.entries((s.searches&&s.searches.departments)||{}).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const hours=Object.entries((s.usage&&s.usage.hours)||{}).sort((a,b)=>Number(a[0])-Number(b[0]));
    const maxH=hours.length?Math.max(...hours.map(h=>h[1])):1;
    const extHtml=exts.length?exts.map(([k,v])=>`<div class="anlt-row"><span>${escHtml(k)}</span><strong>${v}</strong></div>`).join(''):'<em style="color:var(--muted);font-size:.75rem">No searches recorded yet</em>';
    const deptHtml=depts.length?depts.map(([k,v])=>`<div class="anlt-row"><span>${escHtml(k)}</span><strong>${v}</strong></div>`).join(''):'<em style="color:var(--muted);font-size:.75rem">No filters recorded yet</em>';
    const hourHtml=hours.length?hours.map(([k,v])=>`<div style="margin-bottom:.38rem"><div style="display:flex;justify-content:space-between;font-size:.74rem"><span>${escHtml(k)}:00</span><span>${v} visits</span></div><div class="anlt-bar"><div class="anlt-bar-fill" style="width:${Math.round(v/maxH*100)}%"></div></div></div>`).join(''):'<em style="color:var(--muted);font-size:.75rem">No usage recorded yet</em>';
    body.innerHTML=`
      <div class="anlt-section"><h4>🔍 Top Extensions Searched</h4>${extHtml}</div>
      <div class="anlt-section"><h4>🏢 Top Departments Filtered</h4>${deptHtml}</div>
      <div class="anlt-section"><h4>⏰ Usage by Hour</h4>${hourHtml}</div>`;
  }catch(e){
    body.innerHTML='<div class="anlt-empty">⚠️ Could not load analytics.<br><span style="font-size:.71rem">Check ADMIN_PIN env var on server matches app PIN.</span></div>';
  }
}

async function loadAudit(){
  const body=document.getElementById('auditBody');
  if(!IS_SERVER){
    body.innerHTML='<div class="anlt-empty">📋 Audit log only available on the live server.</div>';
    return;
  }
  body.innerHTML='<div class="anlt-empty">Loading…</div>';
  try{
    const r=await fetch(API+'?action=audit',{headers:{'X-Admin-Pin':PIN}});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const json=await r.json();
    const entries=(json.entries||[]).slice(-50).reverse();
    if(!entries.length){body.innerHTML='<div class="anlt-empty">No audit entries yet. Make some changes first.</div>';return;}
    body.innerHTML=entries.map(e=>{
      const cls='ae-'+(e.action||'edit');
      return`<div class="audit-entry">
        <div class="ae-time">${escHtml(e.time||'')}</div>
        <span class="${cls}">${escHtml((e.action||'').toUpperCase())}</span> — ${escHtml(e.description||'')}
      </div>`;
    }).join('');
  }catch{
    body.innerHTML='<div class="anlt-empty">⚠️ Could not load audit log.</div>';
  }
}

async function pollForUpdates(){
  if(!IS_SERVER) return;
  try{
    const r=await fetch(API+'?t='+Date.now());
    if(!r.ok) return;
    const json=await r.json();
    if(!json || !Array.isArray(json.data)) return;
    const remoteUpdated=json.updated||null;
    if(remoteUpdated && remoteUpdated!==lastUpd){
      data=json.data;
      lastUpd=remoteUpdated;
      showUpd();
      render();
      toast('Directory auto-refreshed with latest changes','i');
    }
  }catch{}
}

// ═══════════════ MODAL HELPERS ═══════════════
function openM(id){const m=document.getElementById(id);m.classList.add('open');const focusable=m.querySelector('button,input,select,textarea,.nk');if(focusable)setTimeout(()=>focusable.focus(),50);}
function closeM(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.mb').forEach(b=>b.addEventListener('click',e=>{if(e.target===b)closeM(b.id);}));

// ═══════════════ TOAST ═══════════════
function toast(msg,t='s'){const el=document.createElement('div');el.className=`toast ${t}`;el.textContent=msg;document.getElementById('tw').appendChild(el);setTimeout(()=>el.remove(),3500);}

// ═══════════════ EMPLOYEE PIN SYSTEM ═══════════════
let empPinBuf = '';
let empPinTargetId = null;   // card id being verified
let empPinTargetPerson = null; // specific person name being verified

// ── dot display ──
function epp(d){ if(empPinBuf.length>=6) return; empPinBuf+=d; updEmpPinDots(); if(empPinBuf.length===6) setTimeout(empPinCheck,120); }
function epd(){ empPinBuf=empPinBuf.slice(0,-1); updEmpPinDots(); }
function updEmpPinDots(){
  for(let i=0;i<6;i++){
    const el=document.getElementById('ep'+i);
    if(el) el.className='pdot2'+(i<empPinBuf.length?' f':'');
  }
}
function empPinShake(){
  document.querySelectorAll('#empPinDots .pdot2').forEach(d=>{
    d.classList.add('err'); d.style.animation='none';
    requestAnimationFrame(()=>{ d.style.animation='dotShake .35s ease'; });
    setTimeout(()=>{ d.classList.remove('err'); d.style.animation=''; },600);
  });
}

// ── verify PIN ──
async function empPinCheck(){
  const p = data.find(d=>d.id===empPinTargetId);
  if(!p || !empPinTargetPerson){ closeM('empPinM'); return; }
  const name = empPinTargetPerson;
  const now = Date.now();

  // lockout check (per person)
  const locked = (p.pinLockedUntil||{})[name]||0;
  if(locked > now){
    const rem = Math.ceil((locked-now)/1000);
    document.getElementById('empPinErr').textContent=`🔒 Too many attempts. Try again in ${rem}s.`;
    empPinBuf=''; updEmpPinDots(); return;
  }

  // no PIN set check
  if(!(p.pinsSet||{})[name]){
    document.getElementById('empPinErr').textContent='No PIN set for this profile. Contact IT.';
    empPinBuf=''; updEmpPinDots(); return;
  }

  const hashed = await hashPIN(empPinBuf);
  empPinBuf=''; updEmpPinDots();

  if(hashed === (p.pins||{})[name]){
    // ── success ──
    if(!p.pinAttempts) p.pinAttempts={};
    if(!p.pinLockedUntil) p.pinLockedUntil={};
    p.pinAttempts[name]=0; p.pinLockedUntil[name]=0;
    setEmpSession({id:p.id, name, unlockedAt:Date.now()});
    document.getElementById('empPinErr').textContent='';
    closeM('empPinM');
    toast(`✅ Identified as ${name}`,'s');
    openCardModal(p.id);
    auditLog(`PROFILE_UNLOCK — ${name} unlocked their profile`);
  } else {
    // ── wrong PIN ──
    if(!p.pinAttempts) p.pinAttempts={};
    if(!p.pinLockedUntil) p.pinLockedUntil={};
    p.pinAttempts[name]=(p.pinAttempts[name]||0)+1;
    const att = p.pinAttempts[name];
    const rem = EMP_MAX_ATT - att;
    if(att >= EMP_MAX_ATT){
      p.pinLockedUntil[name]=Date.now()+EMP_LOCKOUT_MS;
      p.pinAttempts[name]=0;
      document.getElementById('empPinErr').textContent='🔒 Too many wrong attempts. Locked for 5 minutes.';
      auditLog(`PIN_LOCK — Too many failed PIN attempts on ${name}`);
    } else {
      document.getElementById('empPinErr').textContent=`Incorrect PIN — ${rem} attempt${rem===1?'':'s'} remaining.`;
      auditLog(`PIN_FAIL — Failed PIN attempt on ${name} (${rem} remaining)`);
    }
    empPinShake();
    persist();
  }
}

// keyboard support inside emp PIN modal
document.addEventListener('keydown',e=>{
  const empOpen=document.getElementById('empPinM').classList.contains('open');
  if(empOpen){
    if(e.key>='0'&&e.key<='9'){e.preventDefault();epp(e.key);return;}
    if(e.key==='Backspace'){e.preventDefault();epd();return;}
    if(e.key==='Enter'){e.preventDefault();empPinCheck();return;}
  }
});

// ── open person picker or PIN directly ──
function openEmpPinModal(id){
  const p = data.find(d=>d.id===id);
  if(!p) return;

  // already identified for this card in this session?
  const sess = getEmpSession();
  if(sess && sess.id===id){
    toast('Already identified as '+sess.name,'s');
    openCardModal(id); return;
  }

  if(p.persons.length === 1){
    // single person — go straight to PIN
    _launchPinEntry(p, p.persons[0]);
  } else {
    // shared extension — show person picker first
    _showPersonPicker(p);
  }
}

function _showPersonPicker(p){
  const el = document.getElementById('cmProfileSection');
  if(!el) return;
  const avatarRow = p.persons.map(name=>{
    const ini = name.split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();
    const hasPIN = (p.pinsSet||{})[name];
    return `<button class="person-pick-btn" onclick="_launchPinEntry(data.find(d=>d.id===${p.id}),'${name.replace(/'/g,"\'")}')" ${hasPIN?'':'disabled title="No PIN set — contact IT"'}>
      <div class="person-pick-av" style="${aS(name)}">${ini}</div>
      <div>
        <div class="person-pick-name">${escHtml(name)}</div>
        <div class="person-pick-sub">${hasPIN?'Has PIN set':'No PIN — contact IT'}</div>
      </div>
      <span style="margin-left:auto;font-size:.8rem">${hasPIN?'→':'🔒'}</span>
    </button>`;
  }).join('');

  el.innerHTML=`<div style="margin-top:.8rem;padding-top:.7rem;border-top:1px solid var(--border)">
    <div style="font-size:.78rem;font-weight:600;color:var(--text);margin-bottom:.6rem">🔒 This is my profile — who are you?</div>
    ${avatarRow}
    <p style="font-size:.7rem;color:var(--muted);margin-top:.4rem">Only people with a PIN can identify themselves. Contact IT to get your PIN.</p>
  </div>`;
}

function _launchPinEntry(p, name){
  if(!p) return;
  empPinTargetId = p.id;
  empPinTargetPerson = name;
  empPinBuf = '';
  updEmpPinDots();
  document.getElementById('empPinErr').textContent='';
  document.getElementById('empPinSubtitle').textContent=
    `Enter your 6-digit PIN — ${escHtml(name)}`;
  openM('empPinM');
}

// ── profile section rendered inside card modal ──
function renderProfileSection(id){
  const el=document.getElementById('cmProfileSection');
  if(!el) return;
  const p=data.find(d=>d.id===id);
  if(!p){el.innerHTML='';return;}

  const sess = getEmpSession();
  const isMe = sess && sess.id===id;
  const adminView = isAdm;

  if(!isMe && !adminView){
    // determine if ANY person on this card has a PIN
    const anyPin = p.persons.some(n=>(p.pinsSet||{})[n]);
    if(anyPin){
      el.innerHTML=`<div style="margin-top:.8rem;padding-top:.7rem;border-top:1px solid var(--border)">
        <button class="btn bo" style="width:100%;font-size:.78rem" onclick="openEmpPinModal(${id})">🔒 This is my profile — Identify yourself</button>
      </div>`;
    } else { el.innerHTML=''; }
    return;
  }

  const identifiedName = isMe ? sess.name : p.persons[0];
  const st = getStatus(p.status||'available');
  const statusOptions = STATUS_OPTS.map(s=>
    `<option value="${s.k}"${(p.status||'available')===s.k?' selected':''}>${s.icon} ${s.label}</option>`
  ).join('');
  const lockBtn = isMe
    ? `<button class="btn bo" style="font-size:.72rem;padding:.28rem .7rem" onclick="lockProfile(${id})">🔒 Lock</button>`
    : '';

  el.innerHTML=`<div style="margin-top:.9rem;padding:.85rem;background:var(--surface2);border-radius:12px;border:1px solid var(--border)">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.65rem">
      <span style="font-size:.75rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.07em">
        ${isMe?`🔓 ${escHtml(identifiedName)}'s Profile`:'👤 Profile (Admin View)'}
      </span>
      ${lockBtn}
    </div>
    <!-- Photo -->
    <div style="margin-bottom:.75rem">
      <div style="font-size:.7rem;color:var(--muted);margin-bottom:.35rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em">Profile Photo</div>
      <div style="display:flex;align-items:center;gap:.75rem">
        ${p.photo
          ? `<img src="${p.photo}" style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--border)">`
          : `<div style="width:52px;height:52px;border-radius:50%;background:var(--surface);border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;font-size:1.2rem">👤</div>`}
        <div>
          ${p.photoPending
            ? `<div style="font-size:.72rem;color:#f59e0b;font-weight:600">⏳ Approval pending${isAdm?' — check Approvals tab':''}</div>`
            : `<label style="font-size:.72rem;color:var(--accent);cursor:pointer;font-weight:600">
                 📸 ${p.photo?'Change photo':'Upload photo'}
                 <input type="file" accept="image/*" style="display:none" onchange="handlePhotoUpload(${p.id},this)">
               </label>
               <div style="font-size:.68rem;color:var(--muted);margin-top:.15rem">Max 500KB · needs admin approval</div>`}
        </div>
      </div>
    </div>
    <div>
      <div style="font-size:.7rem;color:var(--muted);margin-bottom:.3rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em">Status</div>
      <div style="display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;margin-bottom:.45rem">
        <span style="display:inline-flex;align-items:center;gap:.3rem;font-size:.75rem;background:${st.color}18;color:${st.color};border:1px solid ${st.color}44;border-radius:20px;padding:.2rem .6rem;font-weight:600">${st.icon} ${st.label}</span>
        ${p.statusNote?`<span style="font-size:.72rem;color:var(--muted)">${escHtml(p.statusNote)}</span>`:''}
        ${p.statusUntil?`<span style="font-size:.7rem;color:var(--muted)">Until ${escHtml(p.statusUntil)}</span>`:''}
      </div>
      <div style="display:flex;gap:.35rem;flex-wrap:wrap;align-items:center">
        <select id="statusSel_${id}" style="font-size:.75rem;padding:.28rem .5rem;border-radius:7px;border:1px solid var(--border);background:var(--surface);color:var(--text);flex:1;min-width:130px">${statusOptions}</select>
        <input type="text" id="statusNote_${id}" placeholder="Note (optional)" value="${escHtml(p.statusNote||'')}"
          style="font-size:.75rem;padding:.28rem .5rem;border-radius:7px;border:1px solid var(--border);background:var(--surface);color:var(--text);flex:1;min-width:100px">
        <input type="date" id="statusUntil_${id}" value="${p.statusUntil||''}"
          style="font-size:.75rem;padding:.28rem .5rem;border-radius:7px;border:1px solid var(--border);background:var(--surface);color:var(--text)">
        <button class="btn bp" style="font-size:.75rem;padding:.28rem .7rem" onclick="saveStatus(${id})">Save</button>
      </div>
    </div>
    ${renderAssetSection(id)}
  </div>`;
}

function lockProfile(id){
  const sess=getEmpSession();
  if(sess&&sess.id===id){ clearEmpSession(); toast('Profile locked','s'); openCardModal(id); }
}

async function saveStatus(id){
  const p=data.find(d=>d.id===id); if(!p) return;
  const sel=document.getElementById('statusSel_'+id);
  const noteEl=document.getElementById('statusNote_'+id);
  const untilEl=document.getElementById('statusUntil_'+id);
  if(!sel) return;
  p.status=sel.value; p.statusNote=noteEl?noteEl.value.trim():''; p.statusUntil=untilEl?untilEl.value:'';
  await persist();
  toast('Status updated','s');
  auditLog(`STATUS_UPDATE — ${p.persons[0]} status set to ${getStatus(p.status).label}`);
  openCardModal(id);
}

// ═══════════════ ADMIN PIN MANAGEMENT ═══════════════
function renderPinMgmt(){
  const el=document.getElementById('pinMgmtList'); if(!el) return;

  // flatten to individual persons
  const rows=[];
  data.forEach(p=>{
    p.persons.forEach(name=>{
      if(p.noEmail && p.persons.length===1) return; // skip rooms/facilities
      const set=(p.pinsSet||{})[name]||false;
      rows.push({p, name, set});
    });
  });

  const setCount=rows.filter(r=>r.set).length;
  const tableRows=rows.map((r,i)=>{
    const pinSt=r.set
      ?`<span style="color:#22c55e;font-weight:600">✅ Set</span>`
      :`<span style="color:var(--muted)">⬜ Not Set</span>`;
    const shared=r.p.persons.length>1;
    return`<tr style="border-top:1px solid var(--border)${i%2===0?'':';background:var(--surface2)'}">
      <td style="padding:.45rem .7rem">
        ${escHtml(r.name)}
        ${shared?`<span style="font-size:.65rem;color:var(--muted);background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:.1rem .35rem;margin-left:.3rem">shared ${r.p.ext}</span>`:''}
      </td>
      <td style="padding:.45rem .7rem;color:var(--muted)">${escHtml(r.p.ext)}</td>
      <td style="padding:.45rem .7rem;color:var(--muted);font-size:.72rem">${escHtml(r.p.dept)}</td>
      <td style="padding:.45rem .7rem">${pinSt}</td>
      <td style="padding:.45rem .7rem;text-align:center">
        <button class="btn bo" style="font-size:.7rem;padding:.22rem .55rem"
          onclick="adminSetPin(${r.p.id},'${r.name.replace(/'/g,"\'")}')">${r.set?'🔄 Reset':'🔑 Set'} PIN</button>
      </td>
    </tr>`;
  }).join('');

  el.innerHTML=`
    <div style="font-size:.75rem;color:var(--muted);margin-bottom:.5rem">${setCount} of ${rows.length} people have PINs set</div>
    <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:.78rem">
        <thead><tr style="background:var(--surface2)">
          <th style="padding:.5rem .7rem;text-align:left;font-weight:700;color:var(--muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em">Employee</th>
          <th style="padding:.5rem .7rem;text-align:left;font-weight:700;color:var(--muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em">Ext</th>
          <th style="padding:.5rem .7rem;text-align:left;font-weight:700;color:var(--muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em">Dept</th>
          <th style="padding:.5rem .7rem;text-align:left;font-weight:700;color:var(--muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em">PIN</th>
          <th style="padding:.5rem .7rem;text-align:center;font-weight:700;color:var(--muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.06em">Action</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>`;
}

function adminSetPin(id, personName){
  const p=data.find(d=>d.id===id); if(!p) return;
  const label = personName || p.persons[0];
  const pin1=prompt(`Set 6-digit PIN for ${label}\n\nEnter new PIN (6 digits):`);
  if(pin1===null) return;
  if(!/^\d{6}$/.test(pin1)){toast('PIN must be exactly 6 digits','e');return;}
  const pin2=prompt(`Confirm PIN for ${label}:`);
  if(pin2===null) return;
  if(pin1!==pin2){toast('PINs do not match','e');return;}
  hashPIN(pin1).then(hashed=>{
    if(!p.pins) p.pins={};
    if(!p.pinsSet) p.pinsSet={};
    if(!p.pinAttempts) p.pinAttempts={};
    if(!p.pinLockedUntil) p.pinLockedUntil={};
    p.pins[label]=hashed;
    p.pinsSet[label]=true;
    p.pinAttempts[label]=0;
    p.pinLockedUntil[label]=0;
    persist().then(()=>{
      toast(`PIN set for ${label}`,'s');
      auditLog(`PIN_SET — PIN set for ${label} by admin`);
      renderPinMgmt();
    });
  });
}

async function bulkGeneratePins(){
  // collect all individual people without PINs
  const missing=[];
  data.forEach(p=>{
    if(p.noEmail && p.persons.length===1) return;
    p.persons.forEach(name=>{
      if(!(p.pinsSet||{})[name]) missing.push({p,name});
    });
  });
  if(!missing.length){toast('All employees already have PINs set','s');return;}
  if(!confirm(`Generate random 6-digit PINs for ${missing.length} people who don't have one yet?\n\nDownload the PIN sheet after to distribute.`)) return;

  const plain=[];
  for(const {p,name} of missing){
    const pin=String(Math.floor(100000+Math.random()*900000));
    const hashed=await hashPIN(pin);
    if(!p.pins) p.pins={};
    if(!p.pinsSet) p.pinsSet={};
    if(!p.pinAttempts) p.pinAttempts={};
    if(!p.pinLockedUntil) p.pinLockedUntil={};
    p.pins[name]=hashed; p.pinsSet[name]=true;
    p.pinAttempts[name]=0; p.pinLockedUntil[name]=0;
    plain.push({name, ext:p.ext, dept:p.dept, pin});
  }
  await persist();
  toast(`PINs generated for ${missing.length} people`,'s');
  auditLog(`BULK_PIN_GEN — Bulk PINs generated for ${missing.length} people by admin`);
  renderPinMgmt();
  if(confirm('PINs generated! Download the PIN distribution sheet now?')) _downloadPinCSV(plain);
}

function exportPinCSV(){
  const rows=[];
  data.forEach(p=>{
    if(p.noEmail && p.persons.length===1) return;
    p.persons.forEach(name=>{
      const set=(p.pinsSet||{})[name]||false;
      rows.push({name, ext:p.ext, dept:p.dept, status:set?'Set':'Not Set'});
    });
  });
  let csv='Employee PIN Status — UBI Services Limited\n';
  csv+=`Generated:,${new Date().toLocaleString('en-IN')}\n`;
  csv+='IMPORTANT: PINs are hashed. Use Bulk Generate or Reset to get plain PINs for distribution.\n\n';
  csv+='Employee,Extension,Department,PIN Status\n';
  rows.forEach(r=>{ csv+=`"${r.name}","${r.ext}","${r.dept}","${r.status}"\n`; });
  _csvDownload(csv,'UBIS_PIN_Status.csv');
  toast('PIN status sheet downloaded','s');
}

function _downloadPinCSV(rows){
  let csv='UBI Services Limited — Employee PINs for Distribution\n';
  csv+=`Generated:,${new Date().toLocaleString('en-IN')}\n`;
  csv+='CONFIDENTIAL — IT Department Use Only\n';
  csv+='Distribute individually — each employee receives only their own PIN.\n\n';
  csv+='Employee Name,Extension,Department,PIN\n';
  rows.forEach(r=>{ csv+=`"${r.name}","${r.ext}","${r.dept}","${r.pin}"\n`; });
  _csvDownload(csv,'UBIS_PIN_Distribution.csv');
}

function _csvDownload(csv,filename){
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function auditLog(desc){
  if(!IS_SERVER) return;
  try{ fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Admin-Pin':PIN},
    body:JSON.stringify({action:'audit',description:desc})}); }catch{}
}


// ═══════════════ ADMIN AUTO-LOGOUT (30 min idle) ═══════════════
const ADMIN_IDLE_MS = 30 * 60 * 1000; // 30 minutes
let adminIdleTimer = null;

function resetAdminIdleTimer(){
  if(!isAdm) return;
  clearTimeout(adminIdleTimer);
  adminIdleTimer = setTimeout(()=>{
    if(isAdm){
      logOut();
      toast('Admin session expired after 30 minutes of inactivity.','e');
    }
  }, ADMIN_IDLE_MS);
}

// Listen for user activity to reset idle timer
['click','keydown','mousemove','touchstart'].forEach(evt=>{
  document.addEventListener(evt, resetAdminIdleTimer, {passive:true});
});

// ═══════════════ KEYBOARD SHORTCUTS ═══════════════
function showShortcutsOverlay(){
  const existing = document.getElementById('shortcutsOverlay');
  if(existing){ existing.remove(); return; }

  const overlay = document.createElement('div');
  overlay.id = 'shortcutsOverlay';
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;padding:1rem`;
  overlay.innerHTML = `
    <div style="background:var(--surface);border-radius:16px;padding:1.5rem 2rem;max-width:420px;width:100%;box-shadow:var(--sh);border:1px solid var(--border)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">
        <h3 style="font-size:.95rem;font-weight:700;color:var(--text);margin:0">⌨️ Keyboard Shortcuts</h3>
        <button onclick="document.getElementById('shortcutsOverlay').remove()" style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--muted);padding:.2rem .4rem">✕</button>
      </div>
      ${[
        ['/','Focus search bar'],
        ['?','Show / hide this overlay'],
        ['Escape','Close any open modal / clear search'],
        ['C','Switch to Card view'],
        ['T','Switch to Table view'],
        ['F','Toggle Favorites filter'],
        ['A D M I N','Unlock admin panel'],
      ].map(([k,v])=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.42rem 0;border-bottom:1px solid var(--border)">
          <span style="font-size:.78rem;color:var(--muted)">${v}</span>
          <kbd style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:.18rem .55rem;font-family:'DM Mono',monospace;font-size:.72rem;color:var(--text)">${k}</kbd>
        </div>`).join('')}
      <p style="font-size:.7rem;color:var(--muted);margin-top:.75rem;text-align:center">Press <kbd style="background:var(--surface2);border:1px solid var(--border);border-radius:5px;padding:.1rem .4rem;font-family:'DM Mono',monospace">?</kbd> again or click outside to close</p>
    </div>`;
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// Add ? and other shortcuts to the existing keydown listener
// (We augment by adding a second listener for new shortcuts)
document.addEventListener('keydown', e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  if(e.key === '?'){ e.preventDefault(); showShortcutsOverlay(); return; }
  if(e.key === 'Escape'){
    const overlay = document.getElementById('shortcutsOverlay');
    if(overlay){ overlay.remove(); return; }
    // clear search
    const q = document.getElementById('q');
    if(q && q.value){ q.value=''; render(); return; }
  }
  if(document.getElementById('cardModal').classList.contains('open')) return;
  if(document.querySelector('.mb.open')) return;
  if(e.key.toLowerCase() === 'c'){ setView('card'); return; }
  if(e.key.toLowerCase() === 't'){ setView('table'); return; }
  if(e.key.toLowerCase() === 'f'){ toggleFavFilter(); return; }
});


// ═══════════════ BIRTHDAY REMINDERS ═══════════════
function checkBirthdays(){
  const today = new Date();
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');
  const todayStr = mm+'-'+dd;

  // upcoming = next 7 days
  const upcoming=[];
  const todayBirthdays=[];

  data.forEach(p=>{
    if(!p.dob) return;
    const dob = p.dob; // MM-DD format
    if(dob===todayStr){
      todayBirthdays.push(p.persons[0]);
    } else {
      // check next 7 days
      for(let i=1;i<=7;i++){
        const d=new Date(today);
        d.setDate(d.getDate()+i);
        const ms=String(d.getMonth()+1).padStart(2,'0');
        const ds=String(d.getDate()).padStart(2,'0');
        if(dob===ms+'-'+ds){
          upcoming.push({name:p.persons[0], days:i, dob});
          break;
        }
      }
    }
  });

  renderBirthdayStrip(todayBirthdays, upcoming);
}

function renderBirthdayStrip(today, upcoming){
  // remove existing
  const old=document.getElementById('bdayStrip');
  if(old) old.remove();
  if(!today.length && !upcoming.length) return;

  const strip=document.createElement('div');
  strip.id='bdayStrip';
  strip.style.cssText='background:linear-gradient(135deg,#fdf2ff,#fff0f6);border:1px solid #f9a8d4;border-radius:12px;padding:.6rem 1rem;margin:.5rem 0;display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;animation:floatUp .3s ease both';

  let html='';
  if(today.length){
    html+=`<span style="font-size:.8rem;font-weight:700;color:#be185d">🎂 Today:</span>`;
    today.forEach(n=>{
      html+=`<span style="font-size:.78rem;background:#fce7f3;color:#9d174d;border:1px solid #f9a8d4;border-radius:20px;padding:.15rem .6rem;font-weight:600">${escHtml(n)} 🎉</span>`;
    });
  }
  if(upcoming.length){
    if(today.length) html+=`<span style="color:#d1d5db;font-size:.75rem">|</span>`;
    html+=`<span style="font-size:.78rem;color:#be185d;font-weight:600">Upcoming:</span>`;
    upcoming.forEach(({name,days})=>{
      html+=`<span style="font-size:.75rem;color:#9d174d;background:#fdf4ff;border:1px solid #e9d5ff;border-radius:20px;padding:.12rem .55rem">${escHtml(name)} in ${days}d</span>`;
    });
  }
  html+=`<button onclick="document.getElementById('bdayStrip').remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#be185d;font-size:.8rem;opacity:.6;padding:.1rem .3rem">✕</button>`;
  strip.innerHTML=html;

  // Insert after toolbar
  const toolbar=document.querySelector('.toolbar');
  if(toolbar) toolbar.insertAdjacentElement('afterend',strip);
}

// ═══════════════ PHOTO UPLOAD ═══════════════
function handlePhotoUpload(id, inputEl){
  const file=inputEl.files[0];
  if(!file) return;
  if(file.size > 500*1024){ toast('Photo must be under 500KB. Please compress it first.','e'); return; }
  if(!file.type.startsWith('image/')){ toast('Please upload an image file','e'); return; }

  const reader=new FileReader();
  reader.onload=async e=>{
    const p=data.find(d=>d.id===id);
    if(!p) return;
    p.photoPending=e.target.result; // base64 data URL
    await persist();
    toast('Photo uploaded — awaiting admin approval ✅','s');
    openCardModal(id); // refresh card
  };
  reader.readAsDataURL(file);
  inputEl.value='';
}

async function approvePhoto(id){
  const p=data.find(d=>d.id===id);
  if(!p||!p.photoPending) return;
  p.photo=p.photoPending;
  p.photoPending=null;
  await persist();
  toast(`Photo approved for ${p.persons[0]}`,'s');
  auditLog(`PHOTO_APPROVED — Photo approved for ${p.persons[0]} by admin`);
  renderPhotoApprovals();
  render();
}

async function rejectPhoto(id){
  const p=data.find(d=>d.id===id);
  if(!p) return;
  p.photoPending=null;
  await persist();
  toast(`Photo rejected for ${p.persons[0]}`,'i');
  auditLog(`PHOTO_REJECTED — Photo rejected for ${p.persons[0]} by admin`);
  renderPhotoApprovals();
  render();
}

function renderPhotoApprovals(){
  const el=document.getElementById('photoApprovalsList');
  if(!el) return;
  const pending=data.filter(p=>p.photoPending);
  if(!pending.length){
    el.innerHTML='<div style="font-size:.78rem;color:var(--muted);padding:.5rem 0">No pending photo approvals.</div>';
    return;
  }
  el.innerHTML=pending.map(p=>`
    <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--border)">
      <img src="${p.photoPending}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--border)">
      <div style="flex:1;min-width:0">
        <div style="font-size:.82rem;font-weight:600;color:var(--text)">${escHtml(p.persons[0])}</div>
        <div style="font-size:.72rem;color:var(--muted)">${escHtml(p.dept)} · Ext ${escHtml(p.ext)}</div>
      </div>
      <button class="btn bp" style="font-size:.72rem;padding:.25rem .6rem" onclick="approvePhoto(${p.id})">✓ Approve</button>
      <button class="btn bo" style="font-size:.72rem;padding:.25rem .6rem;color:var(--danger);border-color:var(--danger)" onclick="rejectPhoto(${p.id})">✗ Reject</button>
    </div>`).join('');
}

// ═══════════════ ASSET MAPPING ═══════════════
// Assets stored per-employee in data.json under p.assets = [{type,make,model,tag,serial}]
const ASSET_TYPES=[
  {k:'laptop',    label:'Laptop',         icon:'💻'},
  {k:'desktop',   label:'Desktop CPU',    icon:'🖥️'},
  {k:'monitor',   label:'Monitor',        icon:'🖥'},
  {k:'keyboard',  label:'Keyboard',       icon:'⌨️'},
  {k:'mouse',     label:'Mouse',          icon:'🖱️'},
  {k:'phone',     label:'IP Phone',       icon:'📞'},
  {k:'ups',       label:'UPS',            icon:'🔋'},
  {k:'other',     label:'Other',          icon:'📦'},
];

function renderAssetSection(id){
  const p=data.find(d=>d.id===id);
  if(!p) return '';
  const assets=(p.assets||[]);
  if(!assets.length && !isAdm) return '';

  const rows=assets.map((a,i)=>{
    const type=ASSET_TYPES.find(t=>t.k===a.type)||ASSET_TYPES[7];
    return`<div style="display:flex;align-items:center;gap:.5rem;padding:.35rem 0;border-bottom:1px solid var(--border);font-size:.75rem">
      <span style="font-size:1rem;width:20px">${type.icon}</span>
      <div style="flex:1;min-width:0">
        <span style="font-weight:600;color:var(--text)">${escHtml(a.make||'')} ${escHtml(a.model||'')}</span>
        ${a.tag?`<span style="margin-left:.4rem;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:.08rem .38rem;font-size:.67rem;font-family:'DM Mono',monospace;color:var(--muted)">${escHtml(a.tag)}</span>`:''}
        ${a.serial?`<div style="font-size:.67rem;color:var(--muted)">S/N: ${escHtml(a.serial)}</div>`:''}
      </div>
      ${isAdm?`<button onclick="removeAsset(${id},${i})" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:.75rem;padding:.1rem .3rem" title="Remove">✕</button>`:''}
    </div>`;
  }).join('');

  const addForm=isAdm?`
    <div style="margin-top:.6rem;padding:.6rem;background:var(--surface);border:1px dashed var(--border);border-radius:8px">
      <div style="font-size:.72rem;color:var(--muted);margin-bottom:.4rem;font-weight:600">Add Asset</div>
      <div style="display:flex;gap:.35rem;flex-wrap:wrap;align-items:center">
        <select id="aType_${id}" style="font-size:.72rem;padding:.25rem .4rem;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text)">
          ${ASSET_TYPES.map(t=>`<option value="${t.k}">${t.icon} ${t.label}</option>`).join('')}
        </select>
        <input type="text" id="aMake_${id}" placeholder="Make (e.g. HP)" style="font-size:.72rem;padding:.25rem .4rem;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);width:80px">
        <input type="text" id="aModel_${id}" placeholder="Model" style="font-size:.72rem;padding:.25rem .4rem;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);width:90px">
        <input type="text" id="aTag_${id}" placeholder="Tag (UBIS-LAP-001)" style="font-size:.72rem;padding:.25rem .4rem;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);width:110px">
        <input type="text" id="aSerial_${id}" placeholder="S/N (optional)" style="font-size:.72rem;padding:.25rem .4rem;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text);width:100px">
        <button class="btn bp" style="font-size:.72rem;padding:.25rem .6rem" onclick="addAsset(${id})">+ Add</button>
      </div>
    </div>`:'';

  return`<div style="margin-top:.8rem;padding:.75rem;background:var(--surface2);border-radius:12px;border:1px solid var(--border)">
    <div style="font-size:.72rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.4rem">💻 Assigned Assets${assets.length?` (${assets.length})`:''}</div>
    ${rows||'<div style="font-size:.75rem;color:var(--muted);padding:.3rem 0">No assets assigned yet.</div>'}
    ${addForm}
  </div>`;
}

async function addAsset(id){
  const p=data.find(d=>d.id===id); if(!p) return;
  const type=document.getElementById('aType_'+id)?.value;
  const make=document.getElementById('aMake_'+id)?.value.trim();
  const model=document.getElementById('aModel_'+id)?.value.trim();
  const tag=document.getElementById('aTag_'+id)?.value.trim();
  const serial=document.getElementById('aSerial_'+id)?.value.trim();
  if(!tag && !model){ toast('Please enter at least a model or tag','e'); return; }
  if(!p.assets) p.assets=[];
  p.assets.push({type,make,model,tag,serial});
  await persist();
  toast('Asset added','s');
  auditLog(`ASSET_ADD — Added ${type} (${tag||model}) to ${p.persons[0]}`);
  openCardModal(id);
}

async function removeAsset(id,idx){
  const p=data.find(d=>d.id===id); if(!p||!p.assets) return;
  const removed=p.assets[idx];
  p.assets.splice(idx,1);
  await persist();
  toast('Asset removed','i');
  auditLog(`ASSET_REMOVE — Removed ${removed.type} (${removed.tag||removed.model}) from ${p.persons[0]}`);
  openCardModal(id);
}

// ═══════════════ CSV IMPORT WITH DIFF PREVIEW ═══════════════
function importCSV(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{
    try{
      const lines=ev.target.result.split(/\r?\n/).filter(l=>l.trim());
      if(lines.length<2){toast('CSV appears empty','e');return;}
      const imported=lines.slice(1).map((line,i)=>{
        const cols=[];let cur='',inQ=false;
        for(let ci=0;ci<line.length;ci++){
          const ch=line[ci];
          if(ch==='"'){inQ=!inQ;}
          else if(ch===','&&!inQ){cols.push(cur.trim());cur='';}
          else cur+=ch;
        }
        cols.push(cur.trim());
        const [namesRaw,ext,dept,role,emailsRaw,location,dob]=cols;
        if(!namesRaw||!ext||!dept) return null;
        const persons=namesRaw.split('/').map(s=>s.trim()).filter(Boolean);
        const emails=emailsRaw?emailsRaw.split('/').map(s=>s.trim()).filter(Boolean):persons.map(n=>autoEmail(n));
        return{id:Date.now()+i,persons,ext:ext.trim(),dept:dept.trim(),role:(role||'').trim(),emails,noEmail:false,location:(location||LOC).trim(),dob:dob?dob.trim():null};
      }).filter(Boolean);
      if(!imported.length){toast('No valid rows found in CSV','e');return;}
      showCSVDiffPreview(imported);
    }catch(err){console.error(err);toast('CSV parse error — check format','e');}
  };
  r.readAsText(f);
  e.target.value='';
}

function showCSVDiffPreview(incoming){
  // Compare against current data by extension
  const added=[],updated=[],unchanged=[];
  incoming.forEach(inc=>{
    const existing=data.find(d=>d.ext===inc.ext&&d.persons[0]===inc.persons[0]);
    if(!existing) added.push(inc);
    else if(JSON.stringify(existing.persons)!==JSON.stringify(inc.persons)||existing.role!==inc.role||existing.dept!==inc.dept) updated.push(inc);
    else unchanged.push(inc);
  });
  const removed=data.filter(d=>!incoming.find(inc=>inc.ext===d.ext&&inc.persons[0]===d.persons[0]));

  const overlay=document.createElement('div');
  overlay.id='csvDiffOverlay';
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);z-index:600;display:flex;align-items:center;justify-content:center;padding:1rem';

  const diffRows=[
    ...added.map(p=>`<tr><td style="color:#22c55e;font-weight:700;padding:.3rem .5rem">+ Added</td><td style="padding:.3rem .5rem;font-size:.78rem">${escHtml(p.persons[0])}</td><td style="padding:.3rem .5rem;font-size:.78rem;color:var(--muted)">${escHtml(p.ext)} · ${escHtml(p.dept)}</td></tr>`),
    ...updated.map(p=>`<tr><td style="color:#f59e0b;font-weight:700;padding:.3rem .5rem">~ Updated</td><td style="padding:.3rem .5rem;font-size:.78rem">${escHtml(p.persons[0])}</td><td style="padding:.3rem .5rem;font-size:.78rem;color:var(--muted)">${escHtml(p.ext)} · ${escHtml(p.dept)}</td></tr>`),
    ...removed.map(p=>`<tr><td style="color:#ef4444;font-weight:700;padding:.3rem .5rem">− Removed</td><td style="padding:.3rem .5rem;font-size:.78rem">${escHtml(p.persons[0])}</td><td style="padding:.3rem .5rem;font-size:.78rem;color:var(--muted)">${escHtml(p.ext)} · ${escHtml(p.dept)}</td></tr>`),
  ].join('');

  overlay.innerHTML=`
    <div style="background:var(--surface);border-radius:16px;padding:1.5rem;max-width:520px;width:100%;box-shadow:var(--sh);border:1px solid var(--border);max-height:80vh;display:flex;flex-direction:column">
      <h3 style="margin:0 0 .4rem;font-size:.95rem;color:var(--text)">📥 CSV Import Preview</h3>
      <p style="font-size:.75rem;color:var(--muted);margin:0 0 .8rem">Review changes before committing. This will replace all current data.</p>
      <div style="display:flex;gap:.75rem;margin-bottom:.8rem;flex-wrap:wrap">
        <span style="font-size:.75rem;background:#dcfce7;color:#166534;border-radius:20px;padding:.2rem .65rem;font-weight:600">+${added.length} added</span>
        <span style="font-size:.75rem;background:#fef3c7;color:#92400e;border-radius:20px;padding:.2rem .65rem;font-weight:600">~${updated.length} updated</span>
        <span style="font-size:.75rem;background:#fee2e2;color:#991b1b;border-radius:20px;padding:.2rem .65rem;font-weight:600">−${removed.length} removed</span>
        <span style="font-size:.75rem;background:var(--surface2);color:var(--muted);border-radius:20px;padding:.2rem .65rem">${unchanged.length} unchanged</span>
      </div>
      <div style="overflow-y:auto;flex:1;border:1px solid var(--border);border-radius:8px">
        <table style="width:100%;border-collapse:collapse">
          <tbody>${diffRows||'<tr><td colspan="3" style="padding:.5rem;text-align:center;color:var(--muted);font-size:.78rem">No changes detected</td></tr>'}</tbody>
        </table>
      </div>
      <div style="display:flex;gap:.5rem;margin-top:1rem;justify-content:flex-end">
        <button class="btn bo" onclick="document.getElementById('csvDiffOverlay').remove()">Cancel</button>
        <button class="btn bp" onclick="commitCSVImport(${JSON.stringify(incoming).replace(/"/g,'&quot;')})">✓ Confirm Import</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

async function commitCSVImport(incoming){
  // Preserve existing PIN/status/photo/asset data when re-importing
  const merged=incoming.map(inc=>{
    const existing=data.find(d=>d.ext===inc.ext&&d.persons[0]===inc.persons[0]);
    return existing?{...existing,...inc,id:existing.id}:{...inc};
  });
  data=merged;
  migrateData();
  await persist();
  render();
  toast(`Imported ${data.length} entries from CSV`,'s');
  const overlay=document.getElementById('csvDiffOverlay');
  if(overlay) overlay.remove();
  closeM('admPanelM');
}

// ═══════════════ INIT ═══════════════
loadLocal();
loadFavs();
load();

// Refresh lockout timer display every second
setInterval(()=>{if(lockedOut())checkLockout();},1000);
// Silent auto-refresh every 60 seconds
setInterval(pollForUpdates,AUTO_REFRESH_MS);
