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
let curView='table';
let showFavsOnly=false;
let selectedIds=new Set();
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

// ── backend path ──
const API='save.php';
const API_STATS='save.php?action=stats';
const AUTO_REFRESH_MS=60*1000;
const IS_SERVER = window.location.protocol === 'http:' || window.location.protocol === 'https:';

function loadLocal(){
  try{const s=localStorage.getItem(SK);if(s){const p=JSON.parse(s);attempts=p.attempts||0;lockedUntil=p.lockedUntil||0;}}catch{}
}
function saveLocal(){localStorage.setItem(SK,JSON.stringify({attempts,lockedUntil}));}

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

async function load(){
  loadLocal();
  if(!IS_SERVER){
    setSyncStatus('offline');
    toast('ℹ️ Running locally — changes save to this browser only.','i');
    loadFromLocal();
    migrateData();
    showUpd();
    render();
    return;
  }
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

function migrateData(){
  if(!floorMap||!floorMap.floors) floorMap=defFloorMap();
  data.forEach(p=>{
    if(p.pins===undefined){
      p.pins={};
      if(p.pin&&p.pinSet) p.pins[p.persons[0]]=p.pin;
    }
    if(p.pinsSet===undefined){
      p.pinsSet={};
      if(p.pinSet) p.pinsSet[p.persons[0]]=true;
    }
    delete p.pin; delete p.pinSet;
    if(p.pinAttempts===undefined) p.pinAttempts={};
    if(p.pinLockedUntil===undefined) p.pinLockedUntil={};
    delete p.empAttempts; delete p.empLockedUntil;
    if(p.photo===undefined) p.photo=null;
    if(p.photoPending===undefined) p.photoPending=null;
    if(p.status===undefined) p.status='available';
    if(p.statusNote===undefined) p.statusNote='';
    if(p.statusUntil===undefined) p.statusUntil=null;
    if(p.dob===undefined) p.dob=null;
    if(p.assets===undefined) p.assets=[];
    if(p.seatRef===undefined) p.seatRef=null;
  });
  // migrate old flat floorMap to new floors structure
  if(floorMap&&!floorMap.floors){
    const old=floorMap;
    floorMap=defFloorMap();
    // best-effort: if old had zones array, put in floor 5
    if(Array.isArray(old.zones)){
      floorMap.floors['5'].zones=old.zones;
    }
  }
}

async function persist(){
  lastUpd=new Date().toISOString();
  showUpd();
  if(!IS_SERVER){saveDataLocal();return;}
  setSyncStatus('saving');
  await persistToServer();
}

async function persistToServer(){
  try{
    const r=await fetch(API,{
      method:'POST',
      headers:{'Content-Type':'application/json','X-Admin-Actor':isAdm?'admin-ui':'user-ui'},
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