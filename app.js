const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const storeKey = "rafay-ai-studio-projects-v1";
const assetKey = "rafay-ai-studio-assets-v1";
let projects = read(storeKey, []);
let assets = read(assetKey, []);
let scenes = [{title:"Opening scene",description:"Describe the opening shot, subject and atmosphere."}];
let toastTimer;
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function go(page){const target=$("#page-"+page);if(!target)return;$$(".page").forEach(p=>p.classList.remove("active-page"));target.classList.add("active-page");$$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));$("#crumbTitle").textContent=({home:"Home",dashboard:"Dashboard",account:"Your profile",admin:"Admin dashboard",create:"Create",image:"Image studio",video:"Video studio",storyboard:"Storyboard",projects:"My projects",library:"Asset library",settings:"Settings"})[page]||"Home";$("#sidebar").classList.remove("open");if(page==="projects")renderProjects();if(page==="library")renderAssets();window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#helpBtn").addEventListener("click",()=>showModal("Studio help","This is the first working frontend version. Prompts, project notes, storyboards and reference images can be prepared locally. AI generation and cloud accounts will be connected in the next setup phase."));
function showModal(title,message){$("#modalTitle").textContent=title;$("#modalText").textContent=message;$("#modal").classList.remove("hidden")}
function closeModal(){$("#modal").classList.add("hidden")}
$("#modalClose").addEventListener("click",closeModal);$("#modalOk").addEventListener("click",closeModal);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
function saveProject(type,prompt,details={}){if(!prompt.trim()){toast("Add a description before saving.");return}const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),type,prompt:prompt.trim(),details,createdAt:new Date().toISOString()};projects.unshift(item);write(storeKey,projects);if(window.rafayCloudSaveProject){window.rafayCloudSaveProject(item).catch(error=>console.warn("Cloud save unavailable:",error));}renderHome();renderProjects();showModal("Project saved",window.rafayCurrentUser?"Your project was saved locally and is syncing to your account.":"Your project is saved in this browser. Sign in with Google to enable cloud sync.");}
function renderProjects(){const query=($("#projectSearch")?.value||"").toLowerCase();const filter=$("#projectFilter")?.value||"all";const filtered=projects.filter(p=>(filter==="all"||p.type===filter)&&p.prompt.toLowerCase().includes(query));const html=filtered.map(p=>projectCard(p)).join("");$("#allProjects").innerHTML=html;$("#projectsEmpty").classList.toggle("hidden",filtered.length>0);$("#allProjects").classList.toggle("hidden",filtered.length===0);bindDelete()}
function projectCard(p){return '<article class="project-card" data-id="'+escapeHtml(p.id)+'"><span class="project-type">'+escapeHtml(p.type.toUpperCase())+'</span><h3>'+escapeHtml(p.details.title||p.prompt.slice(0,48))+'</h3><p>'+escapeHtml(p.prompt.slice(0,150))+'</p><small>'+new Date(p.createdAt).toLocaleString()+'</small><button class="text-btn delete-project" data-id="'+escapeHtml(p.id)+'">Delete project ×</button></article>'}
function bindDelete(){$$(".delete-project").forEach(b=>b.addEventListener("click",()=>{projects=projects.filter(p=>p.id!==b.dataset.id);write(storeKey,projects);renderProjects();renderHome();toast("Project deleted.");window.rafayCloudDeleteProject?.(b.dataset.id).catch(console.warn)}))}
function renderHome(){const list=projects.slice(0,3);$("#homeProjects").innerHTML=list.map(projectCard).join("");$("#homeEmpty").classList.toggle("hidden",list.length>0);bindDelete()}
$("#projectSearch").addEventListener("input",renderProjects);$("#projectFilter").addEventListener("change",renderProjects);
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function setupMode(group,upload){$$( "button",$(group)).forEach(btn=>btn.addEventListener("click",()=>{$$( "button",$(group)).forEach(b=>b.classList.toggle("selected",b===btn));$(upload).classList.toggle("hidden",btn.dataset.mode!=="reference")}))}
setupMode("#imageModes","#referenceUpload");setupMode("#videoModes","#videoUpload");
function counter(input,label){$(input).addEventListener("input",()=>{$(label).textContent=$(input).value.length+" / 1500"})}
counter("#imagePrompt","#imageCount");counter("#videoPrompt","#videoCount");
function uploadPicker(button,input,label){$(button).addEventListener("click",()=>$(input).click());$(input).addEventListener("change",()=>{const file=$(input).files[0];if(file){$(label).textContent=file.name;toast("Reference selected: "+file.name)}})}
uploadPicker("#uploadReference","#referenceFile","#referenceName");uploadPicker("#uploadVideoReference","#videoReferenceFile","#videoReferenceName");
$("#prepareImage").addEventListener("click",()=>{const prompt=$("#imagePrompt").value;saveProject("image",prompt,{ratio:$("#imageRatio").value,style:$("#imageStyle").value,mode:$("#imageModes .selected").dataset.mode});if(prompt.trim())$("#imagePreviewStatus").textContent="Project brief saved locally"});
$("#prepareVideo").addEventListener("click",()=>{const prompt=$("#videoPrompt").value;saveProject("video",prompt,{ratio:$("#videoRatio").value,length:$("#videoLength").value,mode:$("#videoModes .selected").dataset.mode});if(prompt.trim())$("#videoPreviewStatus").textContent="Scene brief saved locally"});
$("#clearImage").addEventListener("click",()=>{$("#imagePrompt").value="";$("#imageCount").textContent="0 / 1500";$("#imagePreviewStatus").textContent="Waiting for your prompt";$("#referenceName").textContent="PNG, JPG or WEBP";$("#referenceFile").value="";toast("Image workspace cleared.")});
$("#clearVideo").addEventListener("click",()=>{$("#videoPrompt").value="";$("#videoCount").textContent="0 / 1500";$("#videoPreviewStatus").textContent="Waiting for your scene";$("#videoReferenceName").textContent="PNG, JPG or WEBP";$("#videoReferenceFile").value="";toast("Video workspace cleared.")});
function renderScenes(){$("#sceneList").innerHTML=scenes.map((s,i)=>'<article class="scene-card"><div class="scene-number">'+String(i+1).padStart(2,"0")+'</div><div class="scene-fields"><input aria-label="Scene title" data-scene-title="'+i+'" value="'+escapeHtml(s.title)+'" placeholder="Scene title"><textarea aria-label="Scene description" data-scene-desc="'+i+'" placeholder="Describe this scene...">'+escapeHtml(s.description)+'</textarea></div><button class="delete-scene" data-scene-delete="'+i+'" aria-label="Delete scene">×</button></article>').join("");$$("[data-scene-title]").forEach(el=>el.addEventListener("input",()=>scenes[Number(el.dataset.sceneTitle)].title=el.value));$$("[data-scene-desc]").forEach(el=>el.addEventListener("input",()=>scenes[Number(el.dataset.sceneDesc)].description=el.value));$$("[data-scene-delete]").forEach(el=>el.addEventListener("click",()=>{if(scenes.length===1){toast("Keep at least one scene.");return}scenes.splice(Number(el.dataset.sceneDelete),1);renderScenes()}))}
$("#addScene").addEventListener("click",()=>{scenes.push({title:"Scene "+(scenes.length+1),description:""});renderScenes()});
$("#saveStoryboard").addEventListener("click",()=>{const description=scenes.map((s,i)=>"Scene "+(i+1)+": "+s.title+" — "+s.description).join("\n");saveProject("storyboard",description,{title:"Storyboard · "+new Date().toLocaleDateString(),scenes:scenes.length});$("#storyStatus").textContent="Storyboard saved to your projects."});
function renderAssets(){$("#assetGrid").innerHTML=assets.map((a,i)=>'<article class="asset-card"><img src="'+a.data+'" alt="'+escapeHtml(a.name)+'"><div><b>'+escapeHtml(a.name)+'</b><small>'+escapeHtml(a.size)+'</small></div></article>').join("")}
function addAsset(file){if(!file)return;if(!file.type.startsWith("image/")){toast("Please choose an image file.");return}if(file.size>1800000){toast("Please use an image smaller than 1.8 MB in this browser version.");return}const reader=new FileReader();reader.onload=()=>{assets.unshift({name:file.name,size:(file.size/1024).toFixed(0)+" KB",data:reader.result});try{write(assetKey,assets);renderAssets();toast("Image added to your asset library.")}catch{assets.shift();toast("This image is too large for local browser storage.")}};reader.readAsDataURL(file)}
$("#libraryUploadBtn").addEventListener("click",()=>$("#libraryFile").click());$("#libraryFile").addEventListener("change",e=>addAsset(e.target.files[0]));
$("#clearWorkspace").addEventListener("click",()=>showModal("Clear this browser workspace?","This will permanently remove locally saved projects and assets from this browser. This cannot be undone."));
$("#modalOk").addEventListener("click",()=>{if($("#modalTitle").textContent==="Clear this browser workspace?"){projects=[];assets=[];write(storeKey,projects);write(assetKey,assets);renderHome();renderProjects();renderAssets();toast("Local workspace cleared.")}closeModal()});
renderHome();renderProjects();renderAssets();renderScenes();
window.addEventListener("rafay-auth-state", event => {
  const user = event.detail?.user || null;
  const projectsFromCloud = event.detail?.projects || [];
  const authButton = document.querySelector("#authBtn");
  const authStatus = document.querySelector("#authStatus");
  window.rafayCurrentUser = user;
  if (authButton) authButton.textContent = user ? "Sign out" : "Sign in with Google";
  if (authStatus) authStatus.textContent = user ? (user.displayName || user.email || "Signed in") : "Not signed in";
  const firebaseStatus = document.querySelector("#firebaseStatus");
  const storageStatus = document.querySelector("#storageStatus");
  if (firebaseStatus) firebaseStatus.textContent = user ? "Signed in · Cloud sync" : "Ready · Sign in to sync";
  if (storageStatus) storageStatus.textContent = user ? "Cloud sync active" : "Local until sign-in";
  const adminNav=document.querySelector("#adminNav"); if(adminNav) adminNav.hidden=!event.detail?.isAdmin;
  const statProjects=document.querySelector("#statProjects"); if(statProjects) statProjects.textContent=String(projectsFromCloud.length||projects.length);
  const statAccount=document.querySelector("#statAccount"); if(statAccount) statAccount.textContent=user?"Connected":"Signed out";
  if (user && projectsFromCloud.length) {
    const merged = new Map(projects.map(project => [project.id, project]));
    projectsFromCloud.forEach(project => merged.set(project.id, project));
    projects = [...merged.values()].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    write(storeKey, projects);
    renderHome();
    renderProjects();
  }
});
