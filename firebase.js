import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCLKlPHG79sfF8SSvKvFFMko344SARrEs",
  authDomain: "rafay-ai-studio.firebaseapp.com",
  projectId: "rafay-ai-studio",
  storageBucket: "rafay-ai-studio.firebasestorage.app",
  messagingSenderId: "158886375837",
  appId: "1:158886375837:web:1c6c1b28f3012f0ace7f74",
  measurementId: "G-KBWLH8R8YZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const authButton = document.querySelector("#authBtn");
authButton?.addEventListener("click", async () => {
  authButton.disabled = true;
  try {
    if (auth.currentUser) {
      await signOut(auth);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    console.error("Firebase authentication error:", error);
    alert(error.code === "auth/unauthorized-domain"
      ? "This website domain is not authorized yet. Add abdulrafay-2011.github.io in Firebase Authentication > Settings > Authorized domains."
      : "Sign-in failed: " + (error.message || error.code));
  } finally {
    authButton.disabled = false;
  }
});

window.rafayCloudSaveProject = async (project) => {
  const user = auth.currentUser;
  if (!user) return;
  await setDoc(doc(db, "users", user.uid, "projects", project.id), {
    ...project,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

onAuthStateChanged(auth, async (user) => {
  window.rafayCurrentUser = user;
  let cloudProjects = [];
  if (user) {
    try {
      const snapshot = await getDocs(collection(db, "users", user.uid, "projects"));
      cloudProjects = snapshot.docs.map(item => item.data());
      const localProjects = JSON.parse(localStorage.getItem("rafay-ai-studio-projects-v1") || "[]");
      const cloudIds = new Set(cloudProjects.map(item => item.id));
      for (const project of localProjects) {
        if (!cloudIds.has(project.id)) {
          await window.rafayCloudSaveProject(project);
          cloudProjects.push(project);
        }
      }
    } catch (error) {
      console.error("Firestore sync error:", error);
      alert("Google sign-in worked, but cloud sync needs Firestore security rules. Ask the setup assistant to configure the rules.");
    }
  }
  window.dispatchEvent(new CustomEvent("rafay-auth-state", { detail: { user, projects: cloudProjects } }));
});
