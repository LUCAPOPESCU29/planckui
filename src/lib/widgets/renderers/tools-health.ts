import type { WidgetConfig } from "../types";
import { fieldRow, TOOL_CSS, toolShell } from "./kit";

/* 25 health, fitness and wellbeing mini-tools. Estimates use published
   formulas (Mifflin-St Jeor, Karvonen, Riegel, Navy body-fat) and say so. */

type R = (c: WidgetConfig) => { html: string; css: string; js?: string };

const out = (c: WidgetConfig, html: string, js = "", extra = ""): { html: string; css: string; js?: string } =>
  ({ html: toolShell(c, html), css: TOOL_CSS + extra, js });

function fxC(c: WidgetConfig, body: string): string {
  return "var f=shadow.getElementById('plk-f');" + "function calc(){" + body + "}" + "f.addEventListener('input',calc);f.addEventListener('change',calc);calc()";
}
const num = (name: string, label: string, ph = "", extra = ""): string =>
  fieldRow(label, `<input type="number" name="${name}" step="any" placeholder="${ph}" ${extra} required>`);
const sel = (name: string, label: string, opts: string[]): string =>
  fieldRow(label, `<select name="${name}">${opts.map((o) => `<option>${o}</option>`).join("")}</select>`);
const dt = (name: string, label: string): string =>
  fieldRow(label, `<input type="${name === "wake" ? "time" : "date"}" name="${name}" required>`);

/* 1 */
export const bmiCalculator: R = (c) => {
  const html = num("w", "Weight (kg)", "70") + num("h", "Height (cm)", "175") +
    '<dl class="plk-out"><dt>BMI</dt><dd id="plk-o1">—</dd><dt>Category</dt><dd id="plk-o2" style="font-size:14px">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value,h=+f.h.value/100;if(!w||!h)return;var bmi=w/(h*h);" +
    "shadow.getElementById('plk-o1').textContent=bmi.toFixed(1);" +
    "shadow.getElementById('plk-o2').textContent=bmi<18.5?'Underweight':bmi<25?'Healthy':bmi<30?'Overweight':'Obesity'");
  return out(c, html, js);
};

/* 2 */
export const bmrCalculator: R = (c) => {
  const html = num("w", "Weight (kg)", "70") + num("h", "Height (cm)", "175") + num("age", "Age", "30") +
    sel("sex", "Sex", ["Male", "Female"]) +
    '<dl class="plk-out"><dt>BMR (Mifflin-St Jeor)</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value,h=+f.h.value,a=+f.age.value;" +
    "var bmr=10*w+6.25*h-5*a+(f.sex.selectedIndex===0?5:-161);" +
    "shadow.getElementById('plk-o1').textContent=Math.round(bmr).toLocaleString()+' kcal/day'");
  return out(c, html, js);
};

/* 3 */
export const dailyCalorieCalculator: R = (c) => {
  const html = num("w", "Weight (kg)", "70") + num("h", "Height (cm)", "175") + num("age", "Age", "30") +
    sel("sex", "Sex", ["Male", "Female"]) +
    sel("act", "Activity", ["Sedentary", "Light (1–3×/week)", "Moderate (3–5×/week)", "Very active (6–7×/week)"]) +
    '<dl class="plk-out"><dt>Daily calories (TDEE)</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value,h=+f.h.value,a=+f.age.value;" +
    "var bmr=10*w+6.25*h-5*a+(f.sex.selectedIndex===0?5:-161);" +
    "var k=[1.2,1.375,1.55,1.725][f.act.selectedIndex];" +
    "shadow.getElementById('plk-o1').textContent=Math.round(bmr*k).toLocaleString()+' kcal/day'");
  return out(c, html, js);
};

/* 4 */
export const waterIntakeCalculator: R = (c) => {
  const html = num("w", "Weight (kg)", "70") + num("act", "Exercise today (minutes)", "30") +
    '<dl class="plk-out"><dt>Daily water</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value,m=+f.act.value;if(!w)return;" +
    "var l=w*0.033+m/30*0.35;" +
    "shadow.getElementById('plk-o1').textContent=l.toFixed(1)+' liters'");
  return out(c, html, js);
};

/* 5 */
export const proteinIntakeCalculator: R = (c) => {
  const html = num("w", "Weight (kg)", "70") +
    sel("goal", "Goal", ["General health (0.8 g/kg)", "Active (1.6 g/kg)", "Muscle gain (2.2 g/kg)"]) +
    '<dl class="plk-out"><dt>Daily protein</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value;var k=[0.8,1.6,2.2][f.goal.selectedIndex];" +
    "shadow.getElementById('plk-o1').textContent=Math.round(w*k)+' g/day'");
  return out(c, html, js);
};

/* 6 */
export const bodyFatCalculator: R = (c) => {
  const html = sel("sex", "Sex", ["Male", "Female"]) + num("h", "Height (cm)", "178") + num("n", "Neck (cm)", "38") +
    num("wa", "Waist (cm)", "84") + num("hi", "Hips (cm, women)", "95") +
    '<dl class="plk-out"><dt>Body fat (US Navy)</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var h=+f.h.value,n=+f.n.value,wa=+f.wa.value,hi=+f.hi.value||0;" +
    "var bf=f.sex.selectedIndex===0?495/(1.0324-0.19077*Math.log10(wa-n))-450:495/(1.29579-0.35004*Math.log10(wa+hi-n))-450;" +
    "shadow.getElementById('plk-o1').textContent=bf.toFixed(1)+'%'");
  return out(c, html, js);
};

/* 7 */
export const idealWeightCalculator: R = (c) => {
  const html = num("h", "Height (cm)", "175") + sel("sex", "Sex", ["Male", "Female"]) +
    '<dl class="plk-out"><dt>Ideal weight (Devine)</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var h=+f.h.value;var inches=Math.max(0,h/2.54-60);" +
    "var kg=f.sex.selectedIndex===0?50+2.3*inches:45.5+2.3*inches;" +
    "shadow.getElementById('plk-o1').textContent=kg.toFixed(1)+' kg'");
  return out(c, html, js);
};

/* 8 */
export const runningPaceCalculator: R = (c) => {
  const html = num("d", "Distance (km)", "10") + num("mm", "Finish minutes", "50") + num("ss", "Finish seconds", "0") +
    '<dl class="plk-out"><dt>Pace</dt><dd id="plk-o1">—</dd><dt>Speed</dt><dd id="plk-o2">—</dd></dl>';
  const js = fxC(c, "var d=+f.d.value,t=+f.mm.value*60+ +f.ss.value;if(!d||!t)return;" +
    "var pace=t/d;shadow.getElementById('plk-o1').textContent=Math.floor(pace)+':'+String(Math.round(pace%60)).padStart(2,'0')+' /km';" +
    "shadow.getElementById('plk-o2').textContent=(d/(t/3600)).toFixed(2)+' km/h'");
  return out(c, html, js);
};

/* 9 */
export const raceTimeCalculator: R = (c) => {
  const html = num("d1", "Raced distance (km)", "10") + num("t", "Finish time (minutes)", "50") + num("d2", "Target distance (km)", "21.1") +
    '<dl class="plk-out"><dt>Predicted time (Riegel)</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var d1=+f.d1.value,t=+f.t.value,d2=+f.d2.value;if(!d1||!t||!d2)return;" +
    "var p=t*Math.pow(d2/d1,1.06);" +
    "shadow.getElementById('plk-o1').textContent=Math.floor(p)+':'+String(Math.round((p%1)*60)).padStart(2,'0')+' min'");
  return out(c, html, js);
};

/* 10 */
export const oneRepMaxCalculator: R = (c) => {
  const html = num("w", "Weight lifted (kg)", "100") + num("r", "Reps (1–12)", "5") +
    '<dl class="plk-out"><dt>Estimated 1RM (Epley)</dt><dd id="plk-o1">—</dd><dt>70% / 80% / 90%</dt><dd id="plk-o2">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value,r=+f.r.value;if(!w||r<1)return;" +
    "var max=w*(1+r/30);shadow.getElementById('plk-o1').textContent=max.toFixed(1)+' kg';" +
    "shadow.getElementById('plk-o2').textContent=[0.7,0.8,0.9].map(function(k){return (max*k).toFixed(0)+'kg'}).join(' / ')");
  return out(c, html, js);
};

/* 11 */
export const heartRateZonesCalculator: R = (c) => {
  const html = num("age", "Age", "30") + num("rest", "Resting heart rate", "60") +
    '<dl class="plk-out"><dt>Max HR</dt><dd id="plk-o1">—</dd><dt>Zones Z1–Z5 (Karvonen)</dt><dd id="plk-o2" style="font-size:13px;line-height:1.6">—</dd></dl>';
  const js = fxC(c, "var a=+f.age.value,r=+f.rest.value;var max=220-a,rev=max-r;if(rev<=0)return;" +
    "shadow.getElementById('plk-o1').textContent=max+' bpm';" +
    "var z=[0.5,0.6,0.7,0.8,0.9];" +
    "shadow.getElementById('plk-o2').innerHTML=z.map(function(k,i){return 'Z'+(i+1)+': '+Math.round(rev*k+r)+'–'+Math.round(rev*(z[i+1]||1)+r)+' bpm'}).join('<br>')");
  return out(c, html, js);
};

/* 12 */
export const stepsToCaloriesCalculator: R = (c) => {
  const html = num("steps", "Steps today", "10000") + num("w", "Weight (kg)", "70") +
    '<dl class="plk-out"><dt>Calories burned</dt><dd id="plk-o1">—</dd><dt>Distance</dt><dd id="plk-o2">—</dd></dl>';
  const js = fxC(c, "var s=+f.steps.value,w=+f.w.value;if(!s)return;" +
    "shadow.getElementById('plk-o1').textContent=Math.round(s*w*0.0005)+' kcal';" +
    "shadow.getElementById('plk-o2').textContent=(s*0.000762).toFixed(2)+' km'");
  return out(c, html, js);
};

/* 13 */
export const sleepCycleCalculator: R = (c) => {
  const html = dt("wake", "I want to wake up at") +
    '<dl class="plk-out"><dt>Bedtimes (14 min to fall asleep)</dt><dd id="plk-o1" style="font-size:15px;line-height:1.7">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "f.addEventListener('input',calc);function calc(){if(!f.wake.value)return;" +
    "var p=f.wake.value.split(':'),wake=(+p[0]*60)+ +p[1];var out=[];" +
    "[6,5,4,3].forEach(function(c){var t=(wake-c*90-14)%1440;if(t<0)t+=1440;" +
    "out.push(String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0'))})" +
    "shadow.getElementById('plk-o1').textContent=out.join('  ·  ')}calc()";
  return out(c, html, js);
};

/* 14 */
export const dueDateCalculator: R = (c) => {
  const html = dt("lmp", "First day of last period") +
    '<dl class="plk-out"><dt>Due date (280 days)</dt><dd id="plk-o1">—</dd><dt>Current week</dt><dd id="plk-o2">—</dd></dl>';
  const js = "var f=shadow.getElementById('plk-f');" +
    "f.addEventListener('input',calc);function calc(){if(!f.lmp.value)return;" +
    "var l=new Date(f.lmp.value+'T00:00:00');var due=new Date(l.getTime()+280*86400000);" +
    "shadow.getElementById('plk-o1').textContent=due.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'});" +
    "var days=Math.floor((Date.now()-l.getTime())/86400000);var wk=days>=0&&days<300?Math.floor(days/7)+1+'':days<0?'not yet':'full term';" +
    "shadow.getElementById('plk-o2').textContent=wk}calc()";
  return out(c, html, js);
};

/* 15 */
export const caloriesBurnedCalculator: R = (c) => {
  const html = sel("act", "Activity", ["Walking (3.5 METs)", "Running (9.8 METs)", "Cycling (7.5 METs)", "Swimming (8 METs)", "Yoga (2.5 METs)"]) +
    num("w", "Weight (kg)", "70") + num("min", "Minutes", "45") +
    '<dl class="plk-out"><dt>Calories burned</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var met=[3.5,9.8,7.5,8,2.5][f.act.selectedIndex];var w=+f.w.value,m=+f.min.value;if(!w||!m)return;" +
    "shadow.getElementById('plk-o1').textContent=Math.round(met*3.5*w/200*m)+' kcal'");
  return out(c, html, js);
};

/* 16 */
export const waistToHeightCalculator: R = (c) => {
  const html = num("wa", "Waist (cm)", "82") + num("h", "Height (cm)", "175") +
    '<dl class="plk-out"><dt>Waist-to-height</dt><dd id="plk-o1">—</dd><dt>Assessment</dt><dd id="plk-o2" style="font-size:14px">—</dd></dl>';
  const js = fxC(c, "var wa=+f.wa.value,h=+f.h.value;if(!wa||!h)return;var r=wa/h;" +
    "shadow.getElementById('plk-o1').textContent=r.toFixed(2);" +
    "shadow.getElementById('plk-o2').textContent=r<0.4?'Underweight range':r<=0.5?'Healthy':r<=0.6?'Increased risk':'High risk'");
  return out(c, html, js);
};

/* 17 */
export const macrosCalculator: R = (c) => {
  const html = num("kcal", "Daily calories", "2200") +
    sel("split", "Split", ["Balanced 30/40/30", "Low-carb 40/30/30", "High-protein 40/20/40"]) +
    '<dl class="plk-out"><dt>Protein / Carbs / Fat</dt><dd id="plk-o1" style="font-size:15px">—</dd></dl>';
  const js = fxC(c, "var k=+f.kcal.value;var s=[[0.3,0.4,0.3],[0.4,0.3,0.3],[0.4,0.2,0.4]][f.split.selectedIndex];" +
    "shadow.getElementById('plk-o1').textContent=Math.round(k*s[0]/4)+'g · '+Math.round(k*s[1]/4)+'g · '+Math.round(k*s[2]/9)+'g'");
  return out(c, html, js);
};

/* 18 */
export const proteinPerMealCalculator: R = (c) => {
  const html = num("g", "Daily protein (g)", "140") + num("meals", "Meals per day", "4") +
    '<dl class="plk-out"><dt>Protein per meal</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var g=+f.g.value,m=+f.meals.value;if(!m)return;" +
    "shadow.getElementById('plk-o1').textContent=Math.round(g/m)+' g'");
  return out(c, html, js);
};

/* 19 */
export const caffeineCalculator: R = (c) => {
  const html = num("mg", "Caffeine consumed (mg)", "200") + num("hrs", "Hours since", "5") +
    '<dl class="plk-out"><dt>Still in your system</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var mg=+f.mg.value,h=+f.hrs.value;if(!mg)return;" +
    "shadow.getElementById('plk-o1').textContent=(mg*Math.pow(0.5,h/5)).toFixed(0)+' mg (5h half-life)'");
  return out(c, html, js);
};

/* 20 */
export const calorieDeficitCalculator: R = (c) => {
  const html = num("tdee", "Daily burn (kcal)", "2400") + num("rate", "Loss goal (kg per week)", "0.5") +
    '<dl class="plk-out"><dt>Eat per day</dt><dd id="plk-o1">—</dd><dt>Daily deficit</dt><dd id="plk-o2">—</dd></dl>';
  const js = fxC(c, "var t=+f.tdee.value,r=+f.rate.value;if(!t)return;var def=r*7700/7;" +
    "shadow.getElementById('plk-o1').textContent=Math.max(0,Math.round(t-def)).toLocaleString()+' kcal';" +
    "shadow.getElementById('plk-o2').textContent=Math.round(def).toLocaleString()+' kcal'");
  return out(c, html, js);
};

/* 21 */
export const walkingTimeCalculator: R = (c) => {
  const html = num("d", "Distance (km)", "5") + sel("pace", "Pace", ["Slow (4 km/h)", "Average (5 km/h)", "Brisk (6 km/h)"]) +
    '<dl class="plk-out"><dt>Walking time</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var d=+f.d.value;var sp=[4,5,6][f.pace.selectedIndex];if(!sp)return;" +
    "var h=d/sp;shadow.getElementById('plk-o1').textContent=Math.floor(h)+'h '+Math.round((h%1)*60)+'min'");
  return out(c, html, js);
};

/* 22 */
export const cyclingSpeedCalculator: R = (c) => {
  const html = num("d", "Distance (km)", "40") + num("min", "Ride minutes", "90") +
    '<dl class="plk-out"><dt>Average speed</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var d=+f.d.value,m=+f.min.value;if(!m)return;" +
    "shadow.getElementById('plk-o1').textContent=(d/(m/60)).toFixed(1)+' km/h'");
  return out(c, html, js);
};

/* 23 */
export const heightPredictor: R = (c) => {
  const html = num("m", "Mother\u2019s height (cm)", "165") + num("f", "Father\u2019s height (cm)", "180") + sel("sex", "Child", ["Boy", "Girl"]) +
    '<dl class="plk-out"><dt>Predicted adult height</dt><dd id="plk-o1">—</dd></dl>';
  const js = fxC(c, "var m=+f.m.value,fa=+f.f.value;" +
    "var h=f.sex.selectedIndex===0?(fa+m+13)/2:(fa+m-13)/2;" +
    "shadow.getElementById('plk-o1').textContent=h.toFixed(1)+' cm (±8 cm)'");
  return out(c, html, js);
};

/* 24 */
export const hydrationReminder: R = (c) => {
  const html = num("w", "Weight (kg)", "70") +
    '<dl class="plk-out"><dt>Daily target</dt><dd id="plk-o1">—</dd><dt>Per waking hour (16 h)</dt><dd id="plk-o2">—</dd></dl>';
  const js = fxC(c, "var w=+f.w.value;if(!w)return;var l=w*0.033;" +
    "shadow.getElementById('plk-o1').textContent=l.toFixed(1)+' L';" +
    "shadow.getElementById('plk-o2').textContent=Math.round(l/16*1000)+' ml'");
  return out(c, html, js);
};

/* 25 */
export const restTimer: R = (c) => {
  const html =
    fieldRow("Rest (seconds)", '<input type="number" name="sec" value="90" min="5" step="5" required>') +
    '<div class="plk-out" style="text-align:center"><b id="plk-o1" style="font-size:42px;font-variant-numeric:tabular-nums">90</b><div class="plk-lab" id="plk-o2" style="margin-top:6px">Ready</div></div>' +
    '<button type="button" class="plk-btn" id="plk-go">Start rest</button>';
  const js = "var f=shadow.getElementById('plk-f'),disp=shadow.getElementById('plk-o1'),st=shadow.getElementById('plk-o2');" +
    "var left=+f.sec.value,t=null;" +
    "f.sec.addEventListener('input',function(){left=+f.sec.value;disp.textContent=left});" +
    "shadow.getElementById('plk-go').addEventListener('click',function(){" +
    "if(t){clearInterval(t);t=null;st.textContent='Paused';return}" +
    "st.textContent='Resting…';t=setInterval(function(){left--;disp.textContent=left;" +
    "if(left<=0){clearInterval(t);t=null;st.textContent='Go!'}},1000)})";
  return out(c, html, js);
};

/* 26 — interval timer (work / rest) */
export const intervalTimer: R = (c) => {
  const html =
    fieldRow("Work (seconds)", '<input type="number" name="work" value="30" min="5" step="5">') +
    fieldRow("Rest (seconds)", '<input type="number" name="rest" value="15" min="5" step="5">') +
    fieldRow("Rounds", '<input type="number" name="rounds" value="8" min="1" max="30" step="1">') +
    '<div class="plk-big" id="plk-o1">Ready</div><div class="plk-lab plk-center" id="plk-o2">Round 0 of 8</div>' +
    '<div class="plk-center" style="margin-top:8px"><button type="button" class="plk-btn" id="plk-go">Start</button></div>';
  const js = "var f=shadow.getElementById('plk-f'),d=shadow.getElementById('plk-o1'),lab=shadow.getElementById('plk-o2'),go=shadow.getElementById('plk-go');" +
    "var t=null,left=0,round=1,phase='work';" +
    "function paint(){d.textContent=String(Math.max(0,left)).padStart(2,'0');lab.textContent='Round '+round+' of '+(+f.rounds.value)+' — '+phase}" +
    "function stop(){clearInterval(t);t=null;go.textContent='Start'}" +
    "go.addEventListener('click',function(){if(t){stop();lab.textContent='Paused';return}" +
    "go.textContent='Pause';phase='work';round=1;left=+f.work.value;paint();" +
    "t=setInterval(function(){left--;if(left>0){paint();return}" +
    "if(phase==='work'){phase='rest';left=+f.rest.value}else{round++;if(round>(+f.rounds.value||1)){stop();phase='done';left=0;d.textContent='Done!';lab.textContent='All rounds complete';return}" +
    "phase='work';left=+f.work.value}paint()},1000);paint()})";
  const extra = ".plk-big{color:var(--w-accent)}";
  return out(c, html, js, extra);
};
