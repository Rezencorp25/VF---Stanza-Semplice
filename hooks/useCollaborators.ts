import { useState, useEffect } from 'react';
// import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
// import { db } from '../lib/firebase';
import { Collaborator } from '../types';
import { mockCollaborators } from '../mockData';

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading
    const loadCollaborators = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCollaborators(mockCollaborators);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
        setError("Failed to load collaborators");
        setLoading(false);
      }
    };

    loadCollaborators();
    
    /* Firebase implementation commented out
    // Fetch all users. In a real app, you might want to filter by role here if "collaboratore" is a specific role,
    // or fetch all and filter in the UI. For now, we fetch all users.
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collaboratorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collaborator[];
      setCollaborators(collaboratorsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching collaborators:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  const addCollaborator = async (collaborator: Omit<Collaborator, 'id'>) => {
    try {
      console.log("Mock addCollaborator:", collaborator);
      const newCollaborator = { 
        ...collaborator, 
        id: `col-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      } as Collaborator;
      setCollaborators(prev => [...prev, newCollaborator]);
      /*
      // In a real app, you would also create the user in Firebase Auth here or via a Cloud Function trigger.
      // For this demo, we just add to Firestore.
      await addDoc(collection(db, 'users'), {
        ...collaborator,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      });
      */
    } catch (err) {
      console.error("Error adding collaborator:", err);
      throw err;
    }
  };

  const updateCollaborator = async (id: string, data: Partial<Collaborator>) => {
    try {
      console.log("Mock updateCollaborator:", id, data);
      setCollaborators(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
      /*
      await updateDoc(doc(db, 'users', id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      */
    } catch (err) {
      console.error("Error updating collaborator:", err);
      throw err;
    }
  };

  const deleteCollaborator = async (id: string) => {
    try {
      console.log("Mock deleteCollaborator:", id);
      setCollaborators(prev => prev.filter(c => c.id !== id));
      /*
      // Call Cloud Function to delete from Auth (mocked here)
      // await httpsCallable(functions, 'deleteCollaboratore')({ uid: id });
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', id));
      */
    } catch (err) {
      console.error("Error deleting collaborator:", err);
      throw err;
    }
  };

  const toggleCollaboratorStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      console.log("Mock toggleCollaboratorStatus:", id, currentStatus);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setCollaborators(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c));
      /*
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'users', id), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      */
    } catch (err) {
      console.error("Error toggling collaborator status:", err);
      throw err;
    }
  };

  return {
    collaborators,
    loading,
    error,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator,
    toggleCollaboratorStatus
  };
};
