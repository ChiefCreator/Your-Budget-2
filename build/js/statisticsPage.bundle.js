(()=>{"use strict";let e=[],t=null,n=null,a=[],r=[],o=null,l=null,s=[],c=[],i=null,u=[],d=[],m=document.querySelector(".main-date__value"),p=(new Date).getFullYear()+"-"+("0"+(+(new Date).getMonth()+1)).slice(-2);var h;localStorage.getItem("currentDate")||localStorage.setItem("currentDate",p),m.textContent=(h=localStorage.getItem("currentDate"))?"Все время"==h?h:7==h.length?new Date(h).toLocaleString("default",{month:"long"})+" "+new Date(h).getFullYear():4==h.length?h:void 0:(new Date).toLocaleString("default",{month:"long"})+" "+(new Date).getFullYear();let g=localStorage.getItem("email").replace(".","*"),f=document.querySelector(".balance-dynamics-chart__date-wrapper");f.textContent=(new Date).toLocaleString("ru",{year:"numeric",month:"numeric",day:"numeric"}).split(".").reverse().join("-");var y=am5.Root.new("trend-chart");y.setThemes([am5themes_Animated.new(y)]);var x=y.container.children.push(am5xy.XYChart.new(y,{panX:!0,wheelX:"panX",wheelY:"zoomX",pinchZoomX:!0,paddingLeft:0,layout:y.verticalLayout}));x.set("cursor",am5xy.XYCursor.new(y,{behavior:"none"})).lineY.set("visible",!1),x.zoomOutButton.set("forceHidden",!0);var v=am5xy.AxisRendererX.new(y,{pan:"zoom",minGridDistance:10}),w=x.xAxes.push(am5xy.CategoryAxis.new(y,{maxDeviation:.1,categoryField:"date",start:.5,minZoomCount:1,maxZoomCount:6,renderer:v}));w.get("renderer").labels.template.setAll({oversizedBehavior:"wrap",textAlign:"center"}),v.labels.template.setAll({fontSize:"0.8em"});var _=x.yAxes.push(am5xy.ValueAxis.new(y,{renderer:am5xy.AxisRendererY.new(y,{strokeOpacity:.1})})),b=x.series.push(am5xy.ColumnSeries.new(y,{name:"месяцы",xAxis:w,yAxis:_,valueYField:"cost",categoryXField:"date",fill:"rgb(0,128,0)"}));b.columns.template.setAll({tooltipText:"{categoryX}: {valueY}",width:am5.percent(90),tooltipY:0,strokeOpacity:0}),b.columns.template.setAll({templateField:"bg"}),b.bullets.push((function(){return am5.Bullet.new(y,{locationY:1,sprite:am5.Label.new(y,{text:"{valueY}",templateField:"bulletLocation",fill:"black",centerX:am5.percent(50),populateText:!0})})}));let D={};function A(e,t,n,a){var r,o,l=function(e){const t=e.reduce(((e,t)=>{const n=t.date;return e[n]||(e[n]={}),e[n].cost?e[n].cost+=t.cost:e[n].cost=t.cost,e[n].date=t.date,e}),{});return Object.values(t)}(function(e){const t=["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];return e.map((e=>{const n=e.date.split("-"),a=t[parseInt(n[1])-1],r=n[0];return{...e,date:`${a}, ${r}`}}))}(C(e,"increase")));u=function(e){let t=[];for(let n of e)n.cost>=0?t.push({...n,bg:{fill:"#31a51f"},bulletLocation:{centerY:am5.p100}}):t.push({...n,bg:{fill:"red"},bulletLocation:{centerY:am5.p0}});return t}((r=function(){const e=new Date,t=e.getMonth(),n=e.getFullYear();let a=[];for(let e=0;e<12;e++){let r=t-e,o=n;r<0&&(r+=12,o-=1);const l=new Date(o,r,1).toLocaleString("ru",{month:"long"});a.push(`${l}, ${o}`)}return a.map((e=>({cost:0,date:e})))}(),o=l,r.concat(o).reduce(((e,t)=>{const n=e.findIndex((e=>e.date===t.date));return-1===n?e.push(t):e[n].cost+=t.cost,e}),[]).reverse())),t.data.setAll(u),n.data.setAll(u),n.appear(),a.appear(1e3,100)}function S(e){return fetch(`https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${g}/${e}.json`)}function C(e,t){return"decrease"==t?e.sort(((e,t)=>new Date(t.date)-new Date(e.date))):"increase"==t?e.sort(((e,t)=>new Date(e.date)-new Date(t.date))):void 0}function M(e){let t=[];for(let n of e)t.push({...n,cost:Math.abs(n.cost)});return t}function L(){let e=document.querySelector(".select-time").querySelector(".select__input-hidden").value,t=u.slice(u.length-+e),n=function(e){let t=e.reduce(((e,t)=>e+t.cost),0);return`${Math.floor(t/e.length)}`}(t),a=(c=t[0].cost,i=t[t.length-1].cost,c>=i?Math.floor(c/i*100-100)+"%":c<i?Math.abs(Math.floor(i/c*100-100))+"%":void 0),r=function(e,t,n){return e>=t?Math.floor((e/t*100-100)/n.length)+"%":e<t?Math.abs(Math.floor((t/e*100-100)/n.length))+"%":void 0}(t[0].cost,t[t.length-1].cost,t),o=document.querySelector(".trend-card__value_average"),l=document.querySelector(".trend-card__value_whole-difference"),s=document.querySelector(".trend-card__value_month-difference");var c,i;function d(e,t){"Infinity%"==e||"-Infinity%"==e?(t.textContent="Н/д",t.style.color="black"):(e.includes("-")&&(t.style.color="red"),e.includes("-")||(t.style.color="#31a51f"),t.textContent=e)}d(n,o),d(a,l),d(r,s)}function q(e){return function(e){let t=null;for(let n=e.length-1;n>=0;n--)0===e[n].cost?null!==t&&(e[n].cost=t):t=e[n].cost;return e}(function(e){const t=[],n=new Date;for(let e=0;e<24;e++){const a=new Date(n.getTime());a.setMonth(n.getMonth()-e);const r=new Date(a.getFullYear(),a.getMonth()+1,0).getDate();for(let e=0;e<r;e++){let n;if(a.getMonth()==(new Date).getMonth()){if(e>(new Date).getDate())break;n=new Date(a.getFullYear(),a.getMonth(),e+1)}else n=new Date(a.getFullYear(),a.getMonth(),e+1);const r=new Date(n).toLocaleString("ru",{month:"numeric",day:"numeric",year:"numeric"});t.push(r.split(".").reverse().join("-"))}}return C(t.map((e=>({cost:0,date:e}))),"decrease")}().map((t=>{for(let n of e)n.date==t.date&&(t.cost+=n.cost);return t})))}function Y(e){for(let t of e)t.date=Date.parse(t.date);return e}function T(e,t){return 0==e||0==t?"Н/д":e>=t&&e<=0?-Math.floor(t/e*100-100)+"%":e>=t?Math.floor(t/e*100-100)+"%":e<t?Math.abs(Math.floor(t/e*100-100))+"%":void 0}function k(e){return 1==e||(e-11)%10==0&&11!=e?`за ${e} день`:2==e||3==e||4==e?`за ${e} дня`:`за ${e} дней`}function I(e,t){const n=new Date(e[0].date).getMonth()-t,a=new Date(new Date(e[0].date).getFullYear(),n,new Date(e[0].date).getDate()).toLocaleString("ru",{year:"numeric",month:"numeric",day:"numeric"}).split(".").reverse().join("-");return e.filter((e=>new Date(e.date)>=new Date(a)))}!function(){var e=am5.Root.new("balance-dynamics-chart");e.setThemes([am5themes_Animated.new(e)]);var t=e.container.children.push(am5xy.XYChart.new(e,{panX:!1,panY:!1,paddingLeft:0}));t.zoomOutButton.set("forceHidden",!0);var n=am5xy.AxisRendererX.new(e,{minGridDistance:250}),a=t.xAxes.push(am5xy.DateAxis.new(e,{baseInterval:{timeUnit:"day",count:0},renderer:n})),r=am5xy.AxisRendererY.new(e,{}),o=t.yAxes.push(am5xy.ValueAxis.new(e,{renderer:r})),l=t.series.push(am5xy.LineSeries.new(e,{name:"Series",xAxis:a,yAxis:o,valueYField:"cost",valueXField:"date",tooltip:am5.Tooltip.new(e,{labelText:"{valueY}"}),stroke:"rgb(0,128,0)"}));l.fills.template.setAll({visible:!0,fillOpacity:.3}),l.set("fill","rgba(0,128,0, 0.3)");var s=o.makeDataItem({value:0,endValue:-1e7});o.createAxisRange(s);var i=o.makeDataItem({value:0,endValue:-1e5}),u=l.createAxisRange(i);u.fills.template.setAll({visible:!0,opacity:.3}),u.fills.template.set("fill","rgba(255, 0, 0, 0.6)"),u.strokes.template.set("stroke","rgba(255, 0, 0, 1)");var d=new Date;am5.time.add(d,"day",Math.round(l.dataItems.length/2));var m=d.getTime();console.log(m);var p=a.createAxisRange(a.makeDataItem({}));p.set("value",m),p.get("grid").setAll({strokeOpacity:1,stroke:"rgb(195, 195, 208)",strokeWidth:2});var h=am5.Button.new(e,{height:6,width:18,themeTags:["resize","horizontal"]});h.get("background").setAll({cornerRadiusTL:am5.p100,cornerRadiusTR:am5.p100,cornerRadiusBR:am5.p100,cornerRadiusBL:am5.p100,fill:"rgb(195, 195, 208)",fillOpacity:1,stroke:"rgb(195, 195, 208)"}),h.get("background").states.create("down",{}).setAll({fill:"rgb(195, 195, 208)",fillOpacity:1}),h.adapters.add("y",(function(){return 0})),h.adapters.add("x",(function(e){return Math.max(0,Math.min(t.plotContainer.width(),e))})),h.events.on("dragged",(function(){var e=h.x(),n=a.toAxisPosition(e/t.plotContainer.width()),r=a.positionToValue(n);p.set("value",r);let o=new Date(r).toLocaleString("ru",{year:"numeric",month:"numeric",day:"numeric"}).split(".").reverse().join("-"),l=q(c).find((e=>e.date==o)).cost,s=C(I(q(c),12),"increase")[0].cost,i=C(q(c),"increase")[0].date,u=Math.floor((new Date(o).getTime()-new Date(i).getTime())/864e5);document.querySelector(".balance-dynamics-chart__total-num").textContent=l,document.querySelector(".balance-dynamics-chart__percent").textContent=T(s,l),document.querySelector(".balance-dynamics-chart__percent-name").textContent=k(u),f.textContent=o,f.style.left=e+10+"px"})),p.set("bullet",am5xy.AxisBullet.new(e,{location:0,sprite:h})),D.chart=t,D.series=l,D.xAxis=a,D.yAxis=o,D.resizeButton1=h,D.range1=p}(),Promise.all([S("categoriesExpenses"),S("categoriesExpensesByDate"),S("categoriesIncome"),S("categoriesIncomeByDate"),S("operationsExpenses"),S("operationsExpensesByDate"),S("operationsIncome"),S("operationsIncomeByDate")]).then((e=>Promise.all([e[0].json(),e[1].json(),e[2].json(),e[3].json(),e[4].json(),e[5].json(),e[6].json(),e[7].json()]))).then((u=>{a=u[0],t=u[1],s=u[2],o=u[3],e=u[4],n=null!=u[5]?u[5]:[],r=u[6],l=null!=u[7]?u[7]:[],c=e.concat(r),i=a.concat(s),A(M(e),w,b,x),L(),d=I(q(c),12);let m=C(d,"decrease")[0].date,p=d.find((e=>e.date==m)).cost,h=C(d,"increase")[0].cost,g=C(d,"increase")[0].date,f=Math.floor((new Date(m).getTime()-new Date(g).getTime())/864e5);document.querySelector(".balance-dynamics-chart__total-num").textContent=p,document.querySelector(".balance-dynamics-chart__percent").textContent=T(h,p),document.querySelector(".balance-dynamics-chart__percent-name").textContent=k(f),D.xAxis.data.setAll(Y(I(q(c),12))),D.series.data.setAll(Y(I(q(c),12))),D.series.appear(1e3),D.chart.appear(1e3,100)})),document.querySelectorAll(".select").forEach((function(t){const n=t.querySelector(".select__button"),a=t.querySelector(".select__dropdown"),o=t.querySelector(".select__dropdown-list"),l=t.querySelectorAll(".select__dropdown-item"),s=t.querySelector(".select__input-hidden");n.addEventListener("click",(function(){o.classList.toggle("select__dropdown-list_visible"),a.classList.toggle("select__dropdown_visible"),this.classList.add("select__button_active")})),l.forEach((t=>{t.addEventListener("click",(function(l){if(l.stopPropagation(),n.querySelector(".select__button-title").textContent=this.textContent,s.value=this.dataset.value,o.classList.remove("select__dropdown-list_visible"),a.classList.remove("select__dropdown_visible"),t.closest(".select-trend")&&("expenses"==s.value?A(M(e),w,b,x):"income"==s.value?A(r,w,b,x):"netIncome"==s.value&&A(c,w,b,x)),L(),t.closest(".select-time-balance")){let e=C(I(q(c),+s.value),"decrease")[0].date,t=I(q(c),+s.value).find((t=>t.date==e)).cost,n=C(I(q(c),+s.value),"increase")[0].cost,a=C(I(q(c),+s.value),"increase")[0].date,r=Math.floor((new Date(e).getTime()-new Date(a).getTime())/864e5);document.querySelector(".balance-dynamics-chart__total-num").textContent=t,document.querySelector(".balance-dynamics-chart__percent").textContent=T(n,t),document.querySelector(".balance-dynamics-chart__percent-name").textContent=k(r),D.range1.set("value",new Date(e).getTime()),f.textContent=e,f.style.left="calc(100% - 110px)",D.resizeButton1.events.on("dragged",(function(){var e=D.resizeButton1.x(),t=D.xAxis.toAxisPosition(e/D.chart.plotContainer.width()),n=D.xAxis.positionToValue(t);D.range1.set("value",n);let a=new Date(n).toLocaleString("ru",{year:"numeric",month:"numeric",day:"numeric"}).split(".").reverse().join("-"),r=I(q(c),+s.value).find((e=>e.date==a)).cost,o=C(I(q(c),+s.value),"increase")[0].cost,l=C(I(q(c),+s.value),"increase")[0].date,i=Math.floor((new Date(a).getTime()-new Date(l).getTime())/864e5);document.querySelector(".balance-dynamics-chart__total-num").textContent=r,document.querySelector(".balance-dynamics-chart__percent").textContent=T(o,r),document.querySelector(".balance-dynamics-chart__percent-name").textContent=k(i),f.textContent=a,f.style.left=e+10+"px"})),D.xAxis.data.setAll(Y(I(q(c),+s.value))),D.series.data.setAll(Y(I(q(c),+s.value))),D.range1.set("value",(new Date).getTime()),D.series.appear(1e3),D.chart.appear(1e3,100)}}))})),document.addEventListener("click",(function(e){e.target!=n&&(o.classList.remove("select__dropdown-list_visible"),a.classList.remove("select__dropdown_visible"))}))}))})();