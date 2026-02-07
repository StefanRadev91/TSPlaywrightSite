import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    playwright: false,
    typescript: false,
    pom: false
  });
  const [quizHistory, setQuizHistory] = useState([]);

  // Create user document in Firestore
  async function createUserDoc(user, displayName) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: displayName || user.displayName || 'User',
        email: user.email,
        createdAt: serverTimestamp(),
        progress: {
          playwright: false,
          typescript: false,
          pom: false
        }
      });
    }
  }

  // Load user progress and quiz history from Firestore
  async function loadProgress(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.progress) {
          setProgress({
            playwright: data.progress.playwright || false,
            typescript: data.progress.typescript || false,
            pom: data.progress.pom || false
          });
        }
        if (data.quizHistory) {
          setQuizHistory(data.quizHistory);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  // Sign up with email/password
  async function signup(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await createUserDoc(result.user, displayName);
    return result;
  }

  // Sign in with email/password
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserDoc(result.user);
    return result;
  }

  // Save quiz answer to Firestore
  async function saveQuizAnswer(questionId, isCorrect) {
    if (!currentUser) return;

    const entry = {
      questionId,
      correct: isCorrect,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        quizHistory: arrayUnion(entry)
      });
      setQuizHistory(prev => [...prev, entry]);
    } catch (error) {
      console.error('Error saving quiz answer:', error);
    }
  }

  // Sign out
  async function logout() {
    setProgress({ playwright: false, typescript: false, pom: false });
    setQuizHistory([]);
    return signOut(auth);
  }

  // Mark a page as completed
  async function markPageComplete(pageId) {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        [`progress.${pageId}`]: true
      });
      setProgress(prev => ({ ...prev, [pageId]: true }));
    } catch (error) {
      console.error('Error marking page complete:', error);
    }
  }

  // Reset all progress
  async function resetProgress() {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'progress.playwright': false,
        'progress.typescript': false,
        'progress.pom': false
      });
      setProgress({ playwright: false, typescript: false, pom: false });
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProgress(user.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    progress,
    quizHistory,
    signup,
    login,
    loginWithGoogle,
    logout,
    markPageComplete,
    resetProgress,
    saveQuizAnswer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
