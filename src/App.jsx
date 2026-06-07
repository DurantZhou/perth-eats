import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://shkcasprhgbeqxsdocqs.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa2Nhc3ByaGdiZXF4c2RvY3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MjgyMjEsImV4cCI6MjA5NjQwNDIyMX0.wKyFePPjL4LdKkkywuYfVNAzDgRSeuKPLJnJuxiNC8o";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_CUISINES = ["Japanese","Modern Australian","Asian","Italian","Mexican","Thai","Vietnamese","Indian","French","Greek","Middle Eastern","Latin American","Cafe / Brunch","Other"];
const PERTH_SUBURBS = ["Applecross","Bayswater","Belmont","Bentley","Burswood","Cannington","Carlisle","Claremont","Cloverdale","Como","Cottesloe","East Fremantle","East Perth","Elizabeth Quay","Fremantle","Highgate","Hillarys","Inglewood","Innaloo","Joondalup","Karrinyup","Leederville","Mindarie","Morley","Mount Hawthorn","Mount Lawley","Mount Pleasant","Nedlands","North Fremantle","Northbridge","Osborne Park","Perth CBD","Rockingham","Scarborough","Shafto Lane","South Perth","Subiaco","Swanbourne","Victoria Park","Wembley","West Perth","Willeton"];
const PRICE_LABELS = {1:"Under $20",2:"$20–$40",3:"$40–$70",4:"$70+"};
const PRICE_SYM = {1:"$",2:"$$",3:"$$$",4:"$$$$"};
const REACTIONS = [["love","😍","#72243E","#FBEAF0"],["like","😊","#27500A","#EAF3DE"],["meh","😐","#555","#F1EFE8"],["dislike","😞","#A32D2D","#FCEBEB"]];
const AVATARS = ["🧑‍🍳","👩‍🍳","🧔","👩","🧑","👨","🙋","🙋‍♀️","🤵","👸"];
const CEMOJI = {"Japanese":"🍜","Modern Australian":"🦘","Asian":"🥢","Italian":"🍝","Mexican":"🌮","Thai":"🍛","Vietnamese":"🥖","Indian":"🫙","French":"🥐","Greek":"🫒","Middle Eastern":"🧆","Latin American":"🥑","Cafe / Brunch":"☕","Korean":"🥩","Chinese":"🥟","Spanish":"🥘","Seafood":"🦞","Steakhouse":"🥩","Pizza":"🍕","Burger":"🍔","Vegetarian":"🥗","Dessert":"🍰"};
const PAL = {"Japanese":["#E1F5EE","#085041"],"Modern Australian":["#EEEDFE","#3C3489"],"Asian":["#FAEEDA","#633806"],"Italian":["#FAECE7","#993C1D"],"Mexican":["#FCE8E8","#A32D2D"],"Thai":["#EAF3DE","#27500A"],"Vietnamese":["#E6F1FB","#0C447C"],"Indian":["#FBEAF0","#72243E"],"French":["#F1EFE8","#5F5E5A"],"Greek":["#FAEEDA","#633806"],"Middle Eastern":["#EAF3DE","#27500A"],"Latin American":["#FAECE7","#993C1D"],"Cafe / Brunch":["#FBEAF0","#72243E"],"Korean":["#FFE8E8","#8B1A1A"],"Chinese":["#FFF0DA","#7A4A00"],"Spanish":["#FAF0E6","#8B4513"],"Seafood":["#E0F4FF","#0056A0"],"Steakhouse":["#F5E8E0","#6B3A2A"],"Pizza":["#FFF4E0","#8B5E00"],"Burger":["#FFF0E0","#7A4500"],"Vegetarian":["#EAFAEA","#1A6B1A"],"Dessert":["#FDE8F5","#8B2B72"],"Other":["#F1EFE8","#444"]};
const CUISINE_PHOTOS = {"Japanese":"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80","Modern Australian":"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80","Asian":"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80","Italian":"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80","Mexican":"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80","Thai":"https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80","Vietnamese":"https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80","Indian":"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80","French":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80","Greek":"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80","Middle Eastern":"https://images.unsplash.com/photo-1498579397066-22750a3cb424?w=600&q=80","Latin American":"https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=600&q=80","Cafe / Brunch":"https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&q=80","Korean":"https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80","Chinese":"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80","Spanish":"https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600&q=80","Seafood":"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80","Steakhouse":"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80","Pizza":"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80","Burger":"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80","Vegetarian":"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80","Dessert":"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80","Other":"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"};
const SUBURB_COORDS = {"Northbridge":[-31.947,115.857],"Perth CBD":[-31.952,115.861],"Subiaco":[-31.948,115.827],"Victoria Park":[-31.983,115.900],"Highgate":[-31.939,115.865],"Elizabeth Quay":[-31.958,115.859],"Mount Hawthorn":[-31.926,115.841],"Fremantle":[-32.057,115.744],"Mount Lawley":[-31.931,115.870],"Leederville":[-31.937,115.844],"South Perth":[-31.974,115.868],"East Perth":[-31.947,115.875],"West Perth":[-31.948,115.849],"Scarborough":[-31.893,115.758],"Nedlands":[-31.978,115.804],"Como":[-31.983,115.862],"Applecross":[-32.010,115.843],"Inglewood":[-31.919,115.870],"Wembley":[-31.924,115.817],"Cottesloe":[-31.993,115.756],"Shafto Lane":[-31.953,115.861],"Bentley":[-31.997,115.917],"Burswood":[-31.960,115.897],"Cannington":[-31.993,115.936],"Carlisle":[-31.974,115.906],"Claremont":[-31.981,115.782],"Cloverdale":[-31.974,115.930],"Belmont":[-31.943,115.928],"Bayswater":[-31.920,115.914],"Karrinyup":[-31.869,115.793],"Hillarys":[-31.806,115.739],"Joondalup":[-31.745,115.766],"Morley":[-31.888,115.893],"Osborne Park":[-31.899,115.829],"Innaloo":[-31.888,115.796],"Balcatta":[-31.872,115.829],"Bassendean":[-31.906,115.942],"Beckenham":[-32.013,115.950],"Beechboro":[-31.858,115.930],"Bull Creek":[-32.052,115.853],"Canning Vale":[-32.053,115.912],"Dianella":[-31.885,115.872],"Doubleview":[-31.890,115.776],"East Fremantle":[-32.033,115.764],"Floreat":[-31.932,115.797],"Glendalough":[-31.914,115.828],"Hamilton Hill":[-32.074,115.789],"Joondanna":[-31.905,115.843],"Karawara":[-32.004,115.876],"Lathlain":[-31.963,115.906],"Manning":[-31.988,115.876],"Midland":[-31.889,116.007],"Mirrabooka":[-31.863,115.862],"Mosman Park":[-31.997,115.769],"Mount Lawley":[-31.931,115.870],"Mount Pleasant":[-32.007,115.847],"Myaree":[-32.022,115.820],"Nollamara":[-31.869,115.844],"North Fremantle":[-32.043,115.739],"North Perth":[-31.926,115.858],"O'Connor":[-32.040,115.797],"Palmyra":[-32.036,115.793],"Rivervale":[-31.963,115.920],"Rockingham":[-32.278,115.730],"Shenton Park":[-31.950,115.800],"St James":[-31.983,115.906],"Stirling":[-31.870,115.847],"Swanbourne":[-31.977,115.764],"Thornlie":[-32.040,115.953],"Tuart Hill":[-31.893,115.836],"Victoria Park":[-31.983,115.900],"Willagee":[-32.040,115.806],"Willeton":[-32.052,115.866],"Winthrop":[-32.052,115.834]};
const DICE_FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];
const BLANK_FORM = {name:"",cuisine:"Japanese",suburb:"",price:2,meal:[],vibe:"",rating:""};
const placeCache = {};

const getPhoto = r => CUISINE_PHOTOS[r.cuisine] || CUISINE_PHOTOS["Other"];
const ceq = c => CEMOJI[c] || "🍽️";
const bg = c => (PAL[c]||["#F1EFE8","#444"])[0];
const tc = c => (PAL[c]||["#F1EFE8","#444"])[1];

async function fetchGooglePlace(r) {
  if (placeCache[r.id]) return placeCache[r.id];
  try {
    const res = await fetch(`/api/places?name=${encodeURIComponent(r.name)}&suburb=${encodeURIComponent(r.suburb)}`);
    const data = await res.json();
    if (data.photo || data.rating) { placeCache[r.id] = data; return data; }
  } catch {}
  return null;
}

const S = {
  pill: a => ({padding:"6px 14px",borderRadius:20,border:a?"1.5px solid #7F77DD":"1px solid #ddd",background:a?"#EEEDFE":"#fff",color:a?"#3C3489":"#555",cursor:"pointer",fontSize:13,fontWeight:a?600:400,whiteSpace:"nowrap"}),
  inp: {width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",color:"#222",fontSize:14,boxSizing:"border-box"},
  sel: {padding:"7px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",color:"#222",fontSize:13,cursor:"pointer"},
  btn: {padding:"10px 20px",borderRadius:10,background:"#534AB7",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer"},
  ghost: {padding:"9px 16px",borderRadius:8,background:"none",border:"1px solid #ddd",color:"#666",fontSize:14,cursor:"pointer"},
};

// ── LOGIN ─────────────────────────────────────────────────────
function Login({onLogin}) {
  const [mode,setMode] = useState("login");
  const [username,setUsername] = useState("");
  const [pin,setPin] = useState("");
  const [avatar,setAvatar] = useState("🧑‍🍳");
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);

  const submit = async () => {
    if(username.trim().length<2){setErr("Username must be at least 2 characters.");return;}
    if(!/^\d{4}$/.test(pin)){setErr("PIN must be exactly 4 digits.");return;}
    setLoading(true); setErr("");
    if(mode==="signup") {
      const {data:existing} = await sb.from("users").select("id").eq("username",username.toLowerCase()).single();
      if(existing){setErr("Username already taken.");setLoading(false);return;}
      const {data,error} = await sb.from("users").insert({username:username.trim(),pin,avatar}).select().single();
      if(error){setErr("Error creating account.");setLoading(false);return;}
      onLogin(data);
    } else {
      const {data,error} = await sb.from("users").select("*").eq("username",username.toLowerCase()).eq("pin",pin).single();
      if(error||!data){setErr("Invalid username or PIN.");setLoading(false);return;}
      onLogin(data);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:22,padding:"2rem",width:"100%",maxWidth:360,boxShadow:"0 8px 40px rgba(0,0,0,.18)"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:48,marginBottom:8}}>🍽️</div>
          <div style={{fontSize:22,fontWeight:700,color:"#222"}}>Perth Eats</div>
          <div style={{fontSize:13,color:"#888",marginTop:4}}>Your personal restaurant companion</div>
        </div>
        <div style={{display:"flex",background:"#f5f5f5",borderRadius:12,padding:4,marginBottom:"1.25rem"}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"8px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:600,fontSize:14,background:mode===m?"#fff":"transparent",color:mode===m?"#534AB7":"#888"}}>
              {m==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>
        {mode==="signup"&&(
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,color:"#666",marginBottom:6}}>Pick your avatar</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {AVATARS.map(a=><button key={a} onClick={()=>setAvatar(a)} style={{fontSize:20,padding:"6px 8px",borderRadius:10,border:avatar===a?"2px solid #534AB7":"1px solid #ddd",background:avatar===a?"#EEEDFE":"#fff",cursor:"pointer"}}>{a}</button>)}
            </div>
          </div>
        )}
        <div style={{marginBottom:10}}>
          <div style={{fontSize:12,color:"#666",marginBottom:4}}>Username</div>
          <input style={S.inp} value={username} onChange={e=>setUsername(e.target.value)} placeholder="e.g. foodielover" onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,color:"#666",marginBottom:4}}>4-digit PIN</div>
          <input style={S.inp} value={pin} onChange={e=>setPin(e.target.value.slice(0,4))} type="password" maxLength={4} placeholder="e.g. 1234" onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        {err&&<div style={{color:"#A32D2D",fontSize:13,marginBottom:10,background:"#FCEBEB",padding:"8px 12px",borderRadius:8}}>{err}</div>}
        <button onClick={submit} disabled={loading} style={{...S.btn,width:"100%",padding:"11px",borderRadius:10,background:"linear-gradient(135deg,#667eea,#764ba2)",fontSize:15}}>
          {loading?"Please wait...":(mode==="login"?"Log In 🚀":"Create Account 🎉")}
        </button>
        <div style={{textAlign:"center",marginTop:10,fontSize:12,color:"#aaa"}}>Data saved permanently in the cloud ☁️</div>
      </div>
    </div>
  );
}

// ── MAP ───────────────────────────────────────────────────────
function MapView({restaurants,saved,reactions}) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markers = useRef([]);
  const [ready,setReady] = useState(!!window.L);
  const [selected,setSelected] = useState(null);
  const [mapSearch,setMapSearch] = useState("");
  const [mapCuisine,setMapCuisine] = useState("All");
  const [showSavedOnly,setShowSavedOnly] = useState(false);

  const cuisineList = useMemo(()=>["All",...new Set(restaurants.map(r=>r.cuisine))],[restaurants]);

  const mapFiltered = useMemo(()=>{
    let list = showSavedOnly ? restaurants.filter(r=>saved[r.id]) : restaurants.filter(r=>saved[r.id]);
    if(mapSearch) list=list.filter(r=>r.name.toLowerCase().includes(mapSearch.toLowerCase())||r.suburb.toLowerCase().includes(mapSearch.toLowerCase()));
    if(mapCuisine!=="All") list=list.filter(r=>r.cuisine===mapCuisine);
    return list;
  },[restaurants,saved,mapSearch,mapCuisine,showSavedOnly]);

  useEffect(()=>{
    if(window.L){setReady(true);return;}
    const link=document.createElement("link");link.rel="stylesheet";link.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(link);
    const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";s.onload=()=>setReady(true);document.head.appendChild(s);
  },[]);

  useEffect(()=>{
    if(!ready||!mapRef.current)return;
    if(!mapInst.current){mapInst.current=window.L.map(mapRef.current).setView([-31.952,115.861],13);window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:19}).addTo(mapInst.current);}
    markers.current.forEach(m=>m.remove());markers.current=[];
    mapFiltered.forEach(r=>{
      const c=SUBURB_COORDS[r.suburb];if(!c)return;
      const jit=[c[0]+(Math.random()-.5)*.003,c[1]+(Math.random()-.5)*.003];
      const rxn=reactions[r.id];const rxnE=rxn?REACTIONS.find(([k])=>k===rxn)?.[1]:"";
      const icon=window.L.divIcon({className:"",html:`<div style="background:${bg(r.cuisine)};border:2px solid ${tc(r.cuisine)};border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.2);position:relative">${ceq(r.cuisine)}${rxnE?`<span style="position:absolute;top:-6px;right:-6px;font-size:11px">${rxnE}</span>`:""}</div>`,iconSize:[34,34],iconAnchor:[17,17]});
      const m=window.L.marker(jit,{icon}).addTo(mapInst.current);
      m.on("click",()=>setSelected(r));markers.current.push(m);
    });
  },[ready,mapFiltered,reactions]);

  return (
    <div style={{height:"calc(100vh - 117px)",display:"flex",flexDirection:"column"}}>
      {/* Search bar */}
      <div style={{padding:"10px 12px",background:"#fff",borderBottom:"1px solid #eee",display:"flex",flexDirection:"column",gap:8,zIndex:200}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#bbb"}}>🔍</span>
          <input style={{width:"100%",padding:"8px 10px 8px 32px",borderRadius:8,border:"1px solid #ddd",fontSize:13,boxSizing:"border-box"}}
            placeholder="Search saved restaurants..." value={mapSearch} onChange={e=>setMapSearch(e.target.value)}/>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <select style={{padding:"6px 10px",borderRadius:8,border:"1px solid #ddd",fontSize:12,background:"#fff",cursor:"pointer"}} value={mapCuisine} onChange={e=>setMapCuisine(e.target.value)}>
            {cuisineList.map(c=><option key={c} value={c}>{c==="All"?"All cuisines":c}</option>)}
          </select>
          <span style={{fontSize:12,color:"#888"}}>{mapFiltered.length} pin{mapFiltered.length!==1?"s":""} shown</span>
          {(mapSearch||mapCuisine!=="All")&&<button onClick={()=>{setMapSearch("");setMapCuisine("All");}} style={{padding:"5px 10px",borderRadius:8,border:"1px solid #F0997B",background:"#fff",color:"#993C1D",fontSize:12,cursor:"pointer"}}>Clear ✕</button>}
        </div>
      </div>
      {/* Map */}
      <div style={{flex:1,position:"relative"}}>
        {!ready&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#aaa"}}>Loading map...</div>}
        <div ref={mapRef} style={{height:"100%",width:"100%",display:ready?"block":"none"}}/>
        {selected&&(
          <div style={{position:"absolute",bottom:12,left:12,right:12,zIndex:400,background:"#fff",borderRadius:12,padding:"12px 14px",boxShadow:"0 2px 12px rgba(0,0,0,.15)"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <img src={getPhoto(selected)} style={{width:60,height:60,objectFit:"cover",borderRadius:8,flexShrink:0}} onError={e=>e.target.style.display="none"}/>
              <div style={{flex:1}}>
                <span style={{background:bg(selected.cuisine),color:tc(selected.cuisine),fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:20,display:"inline-flex",alignItems:"center",gap:4,marginBottom:4}}>{ceq(selected.cuisine)} {selected.cuisine}</span>
                <div style={{fontWeight:600,fontSize:15,color:"#222"}}>{selected.name}</div>
                <div style={{fontSize:12,color:"#666",marginTop:2}}>{selected.vibe} · 📍 {selected.suburb} · <span style={{color:"#3B6D11",fontWeight:600}}>{PRICE_SYM[selected.price]} {PRICE_LABELS[selected.price]}</span></div>
                {selected.rating&&<div style={{fontSize:12,color:"#888",marginTop:2}}>⭐ {selected.rating}</div>}
              </div>
              <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",fontSize:18,color:"#aaa",cursor:"pointer"}}>✕</button>
            </div>
          </div>
        )}
        {mapFiltered.length===0&&<div style={{position:"absolute",top:"40%",left:0,right:0,textAlign:"center",color:"#888",pointerEvents:"none",zIndex:300}}><div style={{fontSize:32,marginBottom:8}}>⭐</div><div style={{fontWeight:600}}>{Object.values(saved).some(Boolean)?"No restaurants match your search":"Save restaurants to see them on the map"}</div></div>}
      </div>
    </div>
  );
}

// ── DICE ──────────────────────────────────────────────────────
function DicePage({restaurants,saved,reactions}) {
  const [phase,setPhase] = useState("idle");
  const [rolling,setRolling] = useState(false);
  const [diceFace,setDiceFace] = useState("🎲");
  const [cuisine,setCuisine] = useState(null);
  const [restaurant,setRestaurant] = useState(null);
  const savedList = restaurants.filter(r=>saved[r.id]);
  const cuisines = [...new Set(savedList.map(r=>r.cuisine))];
  const roll = (items,onDone) => {
    setRolling(true);let i=0;
    const iv=setInterval(()=>{setDiceFace(DICE_FACES[Math.floor(Math.random()*6)]);i++;if(i>14){clearInterval(iv);setDiceFace("🎲");setRolling(false);onDone(items[Math.floor(Math.random()*items.length)]);}},100);
  };
  const rollCuisine=()=>roll(cuisines,c=>{setCuisine(c);setPhase("cuisine");});
  const rollRestaurant=()=>roll(savedList.filter(r=>r.cuisine===cuisine),r=>{setRestaurant(r);setPhase("restaurant");});
  const reset=()=>{setPhase("idle");setCuisine(null);setRestaurant(null);setDiceFace("🎲");};
  const rxnE=restaurant?REACTIONS.find(([k])=>k===reactions[restaurant.id])?.[1]||"":"";

  if(!savedList.length) return (
    <div style={{padding:"2rem",textAlign:"center",color:"#aaa"}}>
      <div style={{fontSize:40,marginBottom:12}}>⭐</div>
      <div style={{fontWeight:600,color:"#555"}}>No saved restaurants yet</div>
      <div style={{fontSize:13,marginTop:6}}>Save some spots first, then come back to roll!</div>
    </div>
  );
  return (
    <div style={{padding:"1.5rem 1rem",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:22,fontWeight:700,color:"#222",marginBottom:4}}>🎲 Foodie Dice</div>
      <div style={{fontSize:13,color:"#888",marginBottom:"1.5rem"}}>Can't decide? Let fate choose tonight's dinner!</div>
      <div onClick={rolling?undefined:phase==="idle"?rollCuisine:phase==="cuisine"?rollRestaurant:reset}
        style={{margin:"0 auto 1.25rem",width:110,height:110,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:22,boxShadow:"0 6px 24px rgba(102,126,234,.4)",fontSize:58,cursor:rolling?"default":"pointer",userSelect:"none",animation:rolling?"shake .1s infinite":"none"}}>
        {diceFace}
      </div>
      <style>{`@keyframes shake{0%{transform:translate(-2px,-2px)}25%{transform:translate(2px,2px)}50%{transform:translate(-2px,2px)}75%{transform:translate(2px,-2px)}100%{transform:translate(0,0)}} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:"1.25rem"}}>
        {[["Pick Cuisine",phase==="cuisine"||phase==="restaurant"],["Pick Restaurant",phase==="restaurant"]].map(([label,done],i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:done?"#EEEDFE":"#f5f5f5",borderRadius:20,padding:"4px 12px"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:done?"#534AB7":"#ccc",color:"#fff",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{i+1}</div>
              <span style={{fontSize:12,fontWeight:500,color:done?"#3C3489":"#aaa"}}>{label}</span>
            </div>
            {i===0&&<div style={{width:20,height:2,background:"#eee",borderRadius:2}}/>}
          </div>
        ))}
      </div>
      {cuisine&&<div style={{background:bg(cuisine),border:`2px solid ${tc(cuisine)}`,borderRadius:14,padding:"1rem",marginBottom:10,animation:"fadeUp .4s ease"}}>
        <div style={{fontSize:11,color:tc(cuisine),fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>🎉 Tonight's Cuisine</div>
        <div style={{fontSize:28,marginBottom:4}}>{ceq(cuisine)}</div>
        <div style={{fontSize:22,fontWeight:700,color:tc(cuisine)}}>{cuisine}</div>
        <div style={{fontSize:12,color:tc(cuisine),marginTop:4,opacity:.8}}>{savedList.filter(r=>r.cuisine===cuisine).length} saved spot(s)</div>
      </div>}
      {restaurant&&<div style={{background:"#fff",border:"2px solid #534AB7",borderRadius:14,padding:"1rem",marginBottom:10,animation:"fadeUp .4s ease",boxShadow:"0 4px 16px rgba(83,74,183,.15)"}}>
        <img src={getPhoto(restaurant)} style={{width:"100%",height:140,objectFit:"cover",borderRadius:10,marginBottom:10}} onError={e=>e.target.style.display="none"}/>
        <div style={{fontSize:11,color:"#534AB7",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>🍽️ Your Restaurant Tonight</div>
        <div style={{fontSize:22,fontWeight:700,color:"#222",marginBottom:4}}>{restaurant.name} {rxnE}</div>
        <div style={{fontSize:13,color:"#666",marginBottom:8}}>{restaurant.vibe}</div>
        <div style={{display:"flex",justifyContent:"center",gap:12,fontSize:12,color:"#888",flexWrap:"wrap"}}>
          <span>📍 {restaurant.suburb}</span>
          <span style={{color:"#3B6D11",fontWeight:600}}>{PRICE_SYM[restaurant.price]} {PRICE_LABELS[restaurant.price]}</span>
          {restaurant.rating&&<span>⭐ {restaurant.rating}</span>}
        </div>
      </div>}
      <div style={{marginTop:8}}>
        {phase==="idle"&&<button onClick={rollCuisine} disabled={rolling} style={{...S.btn,padding:"12px 32px",borderRadius:12,background:"linear-gradient(135deg,#667eea,#764ba2)",fontSize:15}}>🎲 Roll for Cuisine!</button>}
        {phase==="cuisine"&&<button onClick={rollRestaurant} disabled={rolling} style={{...S.btn,padding:"12px 32px",borderRadius:12,background:"linear-gradient(135deg,#f093fb,#f5576c)",fontSize:15}}>🎲 Roll for Restaurant!</button>}
        {phase==="restaurant"&&<button onClick={reset} style={{...S.btn,padding:"12px 32px",borderRadius:12,fontSize:15}}>🔄 Roll Again</button>}
      </div>
    </div>
  );
}

// ── CUISINE MANAGER ───────────────────────────────────────────
function CuisinePage({customCuisines,setCustomCuisines,setRestaurants,filterCuisine,setFilterCuisine,userId}) {
  const [newC,setNewC] = useState("");
  const [editing,setEditing] = useState(null);
  const [editVal,setEditVal] = useState("");
  const all = [...DEFAULT_CUISINES,...customCuisines];

  const add = async () => {
    const v=newC.trim();
    if(!v||all.map(c=>c.toLowerCase()).includes(v.toLowerCase()))return;
    const {data} = await sb.from("custom_cuisines").insert({user_id:userId,name:v}).select().single();
    if(data) setCustomCuisines(p=>[...p,v]);
    setNewC("");
  };
  const del = async c => {
    await sb.from("custom_cuisines").delete().eq("user_id",userId).eq("name",c);
    setCustomCuisines(p=>p.filter(x=>x!==c));
    if(filterCuisine===c)setFilterCuisine("All");
  };
  const save = async old => {
    const v=editVal.trim();if(!v)return;
    await sb.from("custom_cuisines").update({name:v}).eq("user_id",userId).eq("name",old);
    setCustomCuisines(p=>p.map(c=>c===old?v:c));
    setRestaurants(p=>p.map(r=>r.cuisine===old?{...r,cuisine:v}:r));
    if(filterCuisine===old)setFilterCuisine(v);
    setEditing(null);
  };

  return (
    <div style={{padding:"1.25rem 1rem",maxWidth:600,margin:"0 auto"}}>
      <div style={{fontSize:20,fontWeight:700,color:"#222",marginBottom:4}}>🍴 Cuisine Types</div>
      <div style={{fontSize:13,color:"#888",marginBottom:"1.25rem"}}>Add, edit or remove cuisine categories.</div>
      <div style={{display:"flex",gap:8,marginBottom:"1.25rem"}}>
        <input style={{...S.inp,flex:1}} value={newC} onChange={e=>setNewC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. Korean, Dumpling Bar..."/>
        <button style={S.btn} onClick={add}>+ Add</button>
      </div>
      {customCuisines.length>0&&(
        <div style={{marginBottom:"1.5rem"}}>
          <div style={{fontSize:12,color:"#aaa",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Your Custom Cuisines</div>
          {customCuisines.map(c=>(
            <div key={c} style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              {editing===c?(
                <>
                  <input style={{...S.inp,flex:1,padding:"6px 10px",fontSize:13}} value={editVal} onChange={e=>setEditVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save(c)} autoFocus/>
                  <button onClick={()=>save(c)} style={{...S.btn,padding:"6px 12px",fontSize:12}}>Save</button>
                  <button onClick={()=>setEditing(null)} style={{...S.ghost,padding:"6px 10px",fontSize:12}}>Cancel</button>
                </>
              ):(
                <>
                  <span style={{fontSize:18}}>{ceq(c)}</span>
                  <span style={{flex:1,fontWeight:500,color:"#222",fontSize:14}}>{c}</span>
                  <button onClick={()=>{setEditing(c);setEditVal(c);}} style={{padding:"5px 10px",borderRadius:8,background:"#EEEDFE",color:"#534AB7",border:"none",cursor:"pointer",fontSize:12,fontWeight:500}}>✏️ Edit</button>
                  <button onClick={()=>del(c)} style={{padding:"5px 10px",borderRadius:8,background:"#FCEBEB",color:"#A32D2D",border:"none",cursor:"pointer",fontSize:12,fontWeight:500}}>🗑️ Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{fontSize:12,color:"#aaa",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Default Cuisines</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {DEFAULT_CUISINES.map(c=><span key={c} style={{background:bg(c),color:tc(c),borderRadius:20,padding:"5px 12px",fontSize:13,fontWeight:500}}>{ceq(c)} {c}</span>)}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [user,setUser] = useState(null);
  const [tab,setTab] = useState("browse");
  const [restaurants,setRestaurants] = useState([]);
  const [customCuisines,setCustomCuisines] = useState([]);
  const [saved,setSaved] = useState({});
  const [reactions,setReactions] = useState({});
  const [notes,setNotes] = useState({});
  const [loading,setLoading] = useState(true);
  const [view,setView] = useState("all");
  const [grouped,setGrouped] = useState(false);
  const [search,setSearch] = useState("");
  const [fCuisine,setFCuisine] = useState("All");
  const [fMeal,setFMeal] = useState("All");
  const [fSuburb,setFSuburb] = useState("All");
  const [fPrice,setFPrice] = useState("All");
  const [fReaction,setFReaction] = useState("All");
  const [showAI,setShowAI] = useState(false);
  const [showAdd,setShowAdd] = useState(false);
  const [aiQuery,setAiQuery] = useState("");
  const [aiResults,setAiResults] = useState([]);
  const [aiLoading,setAiLoading] = useState(false);
  const [aiErr,setAiErr] = useState("");
  const [form,setForm] = useState(BLANK_FORM);
  const [formErr,setFormErr] = useState("");
  const [notesTarget,setNotesTarget] = useState(null);
  const [notesDraft,setNotesDraft] = useState("");

  const allCuisines = useMemo(()=>[...DEFAULT_CUISINES,...customCuisines],[customCuisines]);
  const suburbs = useMemo(()=>["All",...new Set([...PERTH_SUBURBS,...restaurants.map(r=>r.suburb)])].filter((v,i,a)=>a.indexOf(v)===i),[restaurants]);
  const savedCount = useMemo(()=>Object.values(saved).filter(Boolean).length,[saved]);

  // Load all data on login
  useEffect(()=>{
    if(!user) return;
    const load = async () => {
      setLoading(true);
      const [{data:rests},{data:savedData},{data:reactData},{data:notesData},{data:cuisineData}] = await Promise.all([
        sb.from("restaurants").select("*").order("id"),
        sb.from("saved").select("restaurant_id").eq("user_id",user.id),
        sb.from("reactions").select("restaurant_id,reaction").eq("user_id",user.id),
        sb.from("notes").select("restaurant_id,note").eq("user_id",user.id),
        sb.from("custom_cuisines").select("name").eq("user_id",user.id),
      ]);
      if(rests) setRestaurants(rests);
      if(savedData) { const s={}; savedData.forEach(x=>s[x.restaurant_id]=true); setSaved(s); }
      if(reactData) { const r={}; reactData.forEach(x=>r[x.restaurant_id]=x.reaction); setReactions(r); }
      if(notesData) { const n={}; notesData.forEach(x=>n[x.restaurant_id]=x.note); setNotes(n); }
      if(cuisineData) setCustomCuisines(cuisineData.map(x=>x.name));
      setLoading(false);
    };
    load();
  },[user]);

  const toggleSave = async id => {
    const isSaved = saved[id];
    setSaved(s=>({...s,[id]:!isSaved}));
    if(isSaved) await sb.from("saved").delete().eq("user_id",user.id).eq("restaurant_id",id);
    else await sb.from("saved").insert({user_id:user.id,restaurant_id:id});
  };

  const setReaction = async (id,r) => {
    const current = reactions[id];
    const newR = current===r ? null : r;
    setReactions(p=>({...p,[id]:newR}));
    if(newR) await sb.from("reactions").upsert({user_id:user.id,restaurant_id:id,reaction:newR},{onConflict:"user_id,restaurant_id"});
    else await sb.from("reactions").delete().eq("user_id",user.id).eq("restaurant_id",id);
  };

  const saveNote = async (id,text) => {
    setNotes(n=>({...n,[id]:text.trim()}));
    if(text.trim()) await sb.from("notes").upsert({user_id:user.id,restaurant_id:id,note:text.trim()},{onConflict:"user_id,restaurant_id"});
    else await sb.from("notes").delete().eq("user_id",user.id).eq("restaurant_id",id);
    setNotesTarget(null);
  };

  const filtered = useMemo(()=>{
    let list = view==="saved"?restaurants.filter(r=>saved[r.id]):[...restaurants];
    if(search) list=list.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.suburb.toLowerCase().includes(search.toLowerCase()));
    if(fCuisine!=="All") list=list.filter(r=>r.cuisine===fCuisine);
    if(fMeal!=="All") list=list.filter(r=>r.meal?.includes(fMeal));
    if(fSuburb!=="All") list=list.filter(r=>r.suburb===fSuburb);
    if(fPrice!=="All") list=list.filter(r=>r.price===parseInt(fPrice));
    if(fReaction!=="All") list=list.filter(r=>reactions[r.id]===fReaction);
    return list;
  },[restaurants,saved,reactions,view,search,fCuisine,fMeal,fSuburb,fPrice,fReaction]);

  const groupedList = useMemo(()=>{
    if(!grouped) return null;
    const g={};filtered.forEach(r=>{if(!g[r.cuisine])g[r.cuisine]=[];g[r.cuisine].push(r);});
    return Object.entries(g).sort((a,b)=>a[0].localeCompare(b[0]));
  },[filtered,grouped]);

  const runAI = async () => {
    if(!aiQuery.trim())return;
    setAiLoading(true);setAiErr("");setAiResults([]);
    try {
      const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:aiQuery,cuisines:allCuisines.join(","),existing:restaurants.map(r=>r.name).join(",")})});
      const data=await res.json();
      setAiResults(Array.isArray(data)?data:[]);
    } catch{setAiErr("Couldn't fetch — try again.");}
    setAiLoading(false);
  };

  const addFromAI = async r => {
    const {data} = await sb.from("restaurants").insert({name:r.name,cuisine:r.cuisine,suburb:r.suburb,price:r.price,meal:r.meal,vibe:r.vibe,rating:r.rating,added_by:user.id,is_default:false}).select().single();
    if(data){
      setRestaurants(p=>[...p,data]);
      await sb.from("saved").insert({user_id:user.id,restaurant_id:data.id});
      setSaved(s=>({...s,[data.id]:true}));
    }
    setAiResults(p=>p.filter(x=>x.name!==r.name));
  };

  const addAllAI = async () => { for(const r of aiResults) await addFromAI(r); };

  const submitForm = async () => {
    if(!form.name.trim()){setFormErr("Enter a name.");return;}
    if(!form.suburb){setFormErr("Select a suburb.");return;}
    if(!form.meal.length){setFormErr("Select meal type(s).");return;}
    const {data} = await sb.from("restaurants").insert({name:form.name.trim(),cuisine:form.cuisine,suburb:form.suburb,price:form.price,meal:form.meal,vibe:form.vibe.trim()||"Added by you",rating:parseFloat(form.rating)||null,added_by:user.id,is_default:false}).select().single();
    if(data){
      setRestaurants(p=>[...p,data]);
      await sb.from("saved").insert({user_id:user.id,restaurant_id:data.id});
      setSaved(s=>({...s,[data.id]:true}));
    }
    setForm(BLANK_FORM);setFormErr("");setShowAdd(false);
  };

  const hasFilters = fCuisine!=="All"||fMeal!=="All"||fSuburb!=="All"||fPrice!=="All"||fReaction!=="All"||search;
  const switchTab = t => { setTab(t); if(t==="mylist") setView("saved"); if(t==="browse") setView("all"); };

  const Card = ({r}) => {
    const rxn=reactions[r.id]; const note=notes[r.id];
    const [gPhoto,setGPhoto] = useState(null);
    const [gRating,setGRating] = useState(null);
    const [imgLoaded,setImgLoaded] = useState(false);
    useEffect(()=>{ fetchGooglePlace(r).then(d=>{if(d?.photo)setGPhoto(d.photo);if(d?.rating)setGRating(d.rating);}); },[r.id]);
    const imgSrc = gPhoto || getPhoto(r);
    const displayRating = gRating || r.rating;
    return (
      <div style={{background:"#fff",border:saved[r.id]?"1.5px solid #AFA9EC":"1px solid #e5e5e5",borderRadius:14,overflow:"hidden"}}>
        <div style={{position:"relative"}}>
          <img src={imgSrc} alt={r.name} style={{width:"100%",height:155,objectFit:"cover",display:"block",opacity:imgLoaded?1:0,transition:"opacity .3s"}} onLoad={()=>setImgLoaded(true)} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/>
          <div style={{display:"none",width:"100%",height:155,alignItems:"center",justifyContent:"center",fontSize:52,background:`linear-gradient(135deg,${bg(r.cuisine)},${tc(r.cuisine)}22)`}}>{ceq(r.cuisine)}</div>
          {!imgLoaded&&<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${bg(r.cuisine)},${tc(r.cuisine)}22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>{ceq(r.cuisine)}</div>}
          {gRating&&<div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.6)",color:"#fff",borderRadius:20,padding:"3px 8px",fontSize:12,fontWeight:600}}>⭐ {gRating} <span style={{fontSize:10,opacity:.8}}>G</span></div>}
        </div>
        <div style={{padding:".85rem 1rem"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{background:bg(r.cuisine),color:tc(r.cuisine),fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,display:"inline-flex",alignItems:"center",gap:4}}>{ceq(r.cuisine)} {r.cuisine}</span>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>{setNotesTarget(r);setNotesDraft(notes[r.id]||"");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,padding:"2px 4px",opacity:note?1:.3}}>📝</button>
              <button onClick={()=>toggleSave(r.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,padding:"2px 4px",filter:saved[r.id]?"none":"grayscale(1)",opacity:saved[r.id]?1:.45}}>⭐</button>
            </div>
          </div>
          <div style={{fontWeight:600,fontSize:15,color:"#222",marginBottom:2}}>{r.name}</div>
          <div style={{fontSize:13,color:"#666",marginBottom:6}}>{r.vibe}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#888",flexWrap:"wrap",marginBottom:10}}>
            <span>📍 {r.suburb}</span><span>·</span>
            <span style={{color:"#3B6D11",fontWeight:600}}>{PRICE_SYM[r.price]} {PRICE_LABELS[r.price]}</span>
            {displayRating&&<><span>·</span><span>⭐ {displayRating}{gRating&&<span style={{fontSize:10,color:"#4285F4",fontWeight:600,marginLeft:2}}>G</span>}</span></>}
            <span>·</span><span>{r.meal?.map(m=>m[0].toUpperCase()+m.slice(1)).join(", ")}</span>
          </div>
          <div style={{paddingTop:8,borderTop:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#aaa",marginRight:2}}>Rate:</span>
            {REACTIONS.map(([key,emoji,tcc,bgc])=>(
              <button key={key} onClick={()=>setReaction(r.id,key)} style={{border:rxn===key?`1.5px solid ${tcc}`:"1px solid #e5e5e5",background:rxn===key?bgc:"#fff",borderRadius:20,padding:"3px 9px",cursor:"pointer",fontSize:12,display:"inline-flex",alignItems:"center",gap:3,color:rxn===key?tcc:"#777",fontWeight:rxn===key?600:400}}>
                {emoji} <span style={{fontSize:11}}>{key}</span>
              </button>
            ))}
          </div>
          {note&&<div onClick={()=>{setNotesTarget(r);setNotesDraft(note);}} style={{marginTop:8,background:"#F7F6FF",borderRadius:8,padding:"7px 10px",fontSize:12,color:"#555",cursor:"pointer",borderLeft:"3px solid #AFA9EC",lineHeight:1.5}}>📝 <em>{note.length>80?note.slice(0,80)+"…":note}</em></div>}
          {saved[r.id]&&<div style={{marginTop:6,fontSize:11,color:"#534AB7",fontWeight:600}}>⭐ Saved</div>}
        </div>
      </div>
    );
  };

  if(!user) return <Login onLogin={setUser}/>;
  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,sans-serif",flexDirection:"column",gap:12,color:"#888"}}><div style={{fontSize:40}}>🍽️</div><div style={{fontWeight:600}}>Loading Perth Eats...</div></div>;

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"#f7f7f9",minHeight:"100vh",color:"#222"}}>
      {notesTarget&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div style={{background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:400,boxShadow:"0 4px 24px rgba(0,0,0,.15)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div><div style={{fontWeight:600,fontSize:16}}>{notesTarget.name}</div><div style={{fontSize:12,color:"#666"}}>📍 {notesTarget.suburb}</div></div>
              <button onClick={()=>setNotesTarget(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#aaa"}}>✕</button>
            </div>
            <textarea style={{...S.inp,resize:"vertical",lineHeight:1.6,fontSize:13}} rows={5} value={notesDraft} onChange={e=>setNotesDraft(e.target.value)} placeholder="Your notes, favourite dishes, tips..."/>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button style={{...S.btn,flex:1}} onClick={()=>saveNote(notesTarget.id,notesDraft)}>Save note</button>
              <button style={S.ghost} onClick={()=>setNotesTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{background:"#fff",borderBottom:"1px solid #eee",padding:"12px 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:150}}>
        <div style={{fontSize:18,fontWeight:700}}>Perth Eats 🍽️</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22}}>{user.avatar}</span>
          <span style={{fontSize:13,fontWeight:600,color:"#534AB7"}}>{user.username}</span>
          <button onClick={()=>{setUser(null);setSaved({});setReactions({});setNotes({});setRestaurants([]);}} style={{background:"none",border:"1px solid #ddd",borderRadius:8,padding:"4px 10px",fontSize:12,color:"#888",cursor:"pointer"}}>Log out</button>
        </div>
      </div>

      <div style={{paddingBottom:70}}>
        {tab==="map"&&<MapView restaurants={restaurants} saved={saved} reactions={reactions}/>}
        {tab==="dice"&&<DicePage restaurants={restaurants} saved={saved} reactions={reactions}/>}
        {tab==="cuisines"&&<CuisinePage customCuisines={customCuisines} setCustomCuisines={setCustomCuisines} setRestaurants={setRestaurants} filterCuisine={fCuisine} setFilterCuisine={setFCuisine} userId={user.id}/>}
        {(tab==="browse"||tab==="mylist")&&(
          <div style={{padding:"1rem 1rem 1.5rem",maxWidth:700,margin:"0 auto"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:".85rem",alignItems:"center"}}>
              <button style={S.pill(view==="all"&&tab==="browse")} onClick={()=>{setView("all");setTab("browse");}}>Browse all</button>
              <button style={S.pill(tab==="mylist")} onClick={()=>{setView("saved");setTab("mylist");}}>
                My List {savedCount>0&&<span style={{background:"#7F77DD",color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:11,marginLeft:4}}>{savedCount}</span>}
              </button>
              {(tab==="mylist")&&<button style={S.pill(grouped)} onClick={()=>setGrouped(g=>!g)}>🍽️ Group</button>}
            </div>

            <div style={{display:"flex",gap:8,marginBottom:".85rem",flexWrap:"wrap"}}>
              <button style={S.pill(showAI)} onClick={()=>{setShowAI(v=>!v);setShowAdd(false);}}>✨ AI Discover</button>
              <button style={S.pill(showAdd)} onClick={()=>{setShowAdd(v=>!v);setShowAI(false);}}>＋ Add</button>
            </div>

            {showAI&&(
              <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:"1rem",marginBottom:".85rem",boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>✨ AI Restaurant Discovery</div>
                <div style={{fontSize:13,color:"#666",marginBottom:8}}>Describe your craving — get 20 real Perth suggestions.</div>
                <div style={{display:"flex",gap:8}}>
                  <input style={{...S.inp,flex:1}} value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runAI()} placeholder='e.g. "best Korean BBQ" or "cheap seafood Fremantle"'/>
                  <button style={S.btn} onClick={runAI} disabled={aiLoading}>{aiLoading?"Searching...":"Search"}</button>
                </div>
                {aiErr&&<div style={{color:"#A32D2D",fontSize:13,marginTop:8}}>{aiErr}</div>}
                {aiResults.length>0&&(
                  <div style={{marginTop:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontSize:12,color:"#aaa"}}>{aiResults.length} suggestions</div>
                      <button onClick={addAllAI} style={{padding:"5px 12px",borderRadius:8,background:"#EAF3DE",color:"#27500A",border:"none",cursor:"pointer",fontWeight:600,fontSize:12}}>+ Add All</button>
                    </div>
                    <div style={{maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                      {aiResults.map((r,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:"10px 14px",gap:8}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              <span style={{fontWeight:600,fontSize:14}}>{r.name}</span>
                              <span style={{background:bg(r.cuisine),color:tc(r.cuisine),fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{ceq(r.cuisine)} {r.cuisine}</span>
                            </div>
                            <div style={{fontSize:12,color:"#777",marginTop:3}}>{r.vibe} · 📍 {r.suburb} · {PRICE_SYM[r.price]} {PRICE_LABELS[r.price]}</div>
                          </div>
                          <button onClick={()=>addFromAI(r)} style={{...S.btn,padding:"6px 14px",fontSize:13,whiteSpace:"nowrap"}}>+ Add</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showAdd&&(
              <div style={{background:"#fff",border:"1px solid #e5e5e5",borderRadius:12,padding:"1rem",marginBottom:".85rem",boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:10}}>＋ Add a Restaurant</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:12,color:"#666",marginBottom:4}}>Name *</div><input style={S.inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Leederville Hotel"/></div>
                  <div><div style={{fontSize:12,color:"#666",marginBottom:4}}>Cuisine</div><select style={{...S.sel,width:"100%"}} value={form.cuisine} onChange={e=>setForm(f=>({...f,cuisine:e.target.value}))}>{allCuisines.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><div style={{fontSize:12,color:"#666",marginBottom:4}}>Suburb *</div><select style={{...S.sel,width:"100%"}} value={form.suburb} onChange={e=>setForm(f=>({...f,suburb:e.target.value}))}><option value="">Select...</option>{PERTH_SUBURBS.map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><div style={{fontSize:12,color:"#666",marginBottom:4}}>Price</div><select style={{...S.sel,width:"100%"}} value={form.price} onChange={e=>setForm(f=>({...f,price:parseInt(e.target.value)}))}>
                    {[1,2,3,4].map(p=><option key={p} value={p}>{PRICE_SYM[p]} {PRICE_LABELS[p]}</option>)}
                  </select></div>
                  <div><div style={{fontSize:12,color:"#666",marginBottom:4}}>Rating</div><input style={S.inp} type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e=>setForm(f=>({...f,rating:e.target.value}))} placeholder="4.5"/></div>
                  <div style={{gridColumn:"1/-1"}}>
                    <div style={{fontSize:12,color:"#666",marginBottom:4}}>Meal types *</div>
                    <div style={{display:"flex",gap:8}}>
                      {["brunch","lunch","dinner"].map(m=><button key={m} style={S.pill(form.meal.includes(m))} onClick={()=>setForm(f=>({...f,meal:f.meal.includes(m)?f.meal.filter(x=>x!==m):[...f.meal,m]}))}>{m[0].toUpperCase()+m.slice(1)}</button>)}
                    </div>
                  </div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:12,color:"#666",marginBottom:4}}>Vibe</div><input style={S.inp} value={form.vibe} onChange={e=>setForm(f=>({...f,vibe:e.target.value}))} placeholder="e.g. Great outdoor seating"/></div>
                </div>
                {formErr&&<div style={{color:"#A32D2D",fontSize:13,marginTop:8}}>{formErr}</div>}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button style={S.btn} onClick={submitForm}>Save Restaurant</button>
                  <button style={S.ghost} onClick={()=>{setShowAdd(false);setFormErr("");setForm(BLANK_FORM);}}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{position:"relative",marginBottom:".65rem"}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"#bbb"}}>🔍</span>
              <input style={{...S.inp,paddingLeft:36}} placeholder="Search by name or suburb..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>

            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:".65rem",alignItems:"center"}}>
              <select style={S.sel} value={fCuisine} onChange={e=>setFCuisine(e.target.value)}><option value="All">All cuisines</option>{allCuisines.map(c=><option key={c}>{c}</option>)}</select>
              <select style={S.sel} value={fMeal} onChange={e=>setFMeal(e.target.value)}><option value="All">All meals</option>{["brunch","lunch","dinner"].map(m=><option key={m} value={m}>{m[0].toUpperCase()+m.slice(1)}</option>)}</select>
              <select style={S.sel} value={fSuburb} onChange={e=>setFSuburb(e.target.value)}>{suburbs.map(s=><option key={s} value={s}>{s==="All"?"All suburbs":s}</option>)}</select>
              <select style={S.sel} value={fPrice} onChange={e=>setFPrice(e.target.value)}><option value="All">All prices</option>{[1,2,3,4].map(p=><option key={p} value={p}>{PRICE_SYM[p]} {PRICE_LABELS[p]}</option>)}</select>
              <select style={S.sel} value={fReaction} onChange={e=>setFReaction(e.target.value)}><option value="All">All reactions</option>{REACTIONS.map(([k,e])=><option key={k} value={k}>{e} {k[0].toUpperCase()+k.slice(1)}</option>)}</select>
              {hasFilters&&<button onClick={()=>{setSearch("");setFCuisine("All");setFMeal("All");setFSuburb("All");setFPrice("All");setFReaction("All");}} style={{...S.sel,color:"#993C1D",borderColor:"#F0997B"}}>Clear ✕</button>}
            </div>

            <div style={{fontSize:12,color:"#aaa",marginBottom:".65rem"}}>{filtered.length} restaurant{filtered.length!==1?"s":""} {view==="saved"?"in your list":"found"}</div>

            {filtered.length===0?(
              <div style={{textAlign:"center",padding:"3rem 1rem",color:"#aaa"}}>
                <div style={{fontSize:36,marginBottom:12}}>🍽️</div>
                <div style={{fontWeight:600,color:"#555"}}>{view==="saved"?"No saved restaurants yet":"No restaurants match"}</div>
                <div style={{fontSize:13,marginTop:6}}>{view==="saved"?"Star some spots to save them!":"Try adjusting your filters"}</div>
              </div>
            ):grouped&&groupedList?(
              groupedList.map(([cuisine,list])=>(
                <div key={cuisine} style={{marginBottom:"1.5rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:8,borderBottom:"1px solid #eee"}}>
                    <span style={{background:bg(cuisine),color:tc(cuisine),fontSize:13,fontWeight:600,padding:"4px 12px",borderRadius:20}}>{ceq(cuisine)} {cuisine}</span>
                    <span style={{fontSize:12,color:"#aaa"}}>{list.length} place{list.length!==1?"s":""}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>{list.map(r=><Card key={r.id} r={r}/>)}</div>
                </div>
              ))
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>{filtered.map(r=><Card key={r.id} r={r}/>)}</div>
            )}
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #eee",display:"flex",zIndex:200}}>
        {[["browse","🔍","Browse"],["mylist","⭐","My List"],["map","🗺️","Map"],["dice","🎲","Dice"],["cuisines","🍴","Cuisines"]].map(([id,icon,label])=>(
          <button key={id} onClick={()=>switchTab(id)} style={{flex:1,padding:"10px 4px 8px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:20}}>{icon}</span>
            <span style={{fontSize:10,fontWeight:600,color:tab===id?"#534AB7":"#aaa"}}>{label}</span>
            {tab===id&&<div style={{width:20,height:2,background:"#534AB7",borderRadius:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}