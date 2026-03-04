import { useState, useEffect } from 'react';
// import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import { db } from '../lib/firebase';
import { CompetenceGroup } from '../types';
import { mockCompetenceGroups } from '../mockData';

export const useCompetenceGroups = () => {
  const [competenceGroups, setCompetenceGroups] = useState<CompetenceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading
    const loadGroups = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCompetenceGroups(mockCompetenceGroups);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching competence groups:", err);
        setError("Failed to load competence groups");
        setLoading(false);
      }
    };

    loadGroups();

    /* Firebase implementation commented out
    const q = query(collection(db, 'gruppiCompetenza'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CompetenceGroup[];
      setCompetenceGroups(groupsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching competence groups:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  const addCompetenceGroup = async (group: Omit<CompetenceGroup, 'id'>) => {
    try {
      console.log("Mock addCompetenceGroup:", group);
      const newGroup = { 
        ...group, 
        id: `cg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collaboratorIds: group.collaboratorIds || [],
        objectIds: group.objectIds || []
      } as CompetenceGroup;
      setCompetenceGroups(prev => [...prev, newGroup]);
      /*
      await addDoc(collection(db, 'gruppiCompetenza'), {
        ...group,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collaboratorIds: group.collaboratorIds || [],
        objectIds: group.objectIds || []
      });
      */
    } catch (err) {
      console.error("Error adding competence group:", err);
      throw err;
    }
  };

  const updateCompetenceGroup = async (id: string, data: Partial<CompetenceGroup>) => {
    try {
      console.log("Mock updateCompetenceGroup:", id, data);
      setCompetenceGroups(prev => prev.map(g => g.id === id ? { ...g, ...data, updatedAt: new Date().toISOString() } : g));
      /*
      await updateDoc(doc(db, 'gruppiCompetenza', id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      */
    } catch (err) {
      console.error("Error updating competence group:", err);
      throw err;
    }
  };

  const deleteCompetenceGroup = async (id: string) => {
    try {
      console.log("Mock deleteCompetenceGroup:", id);
      setCompetenceGroups(prev => prev.filter(g => g.id !== id));
      /*
      await deleteDoc(doc(db, 'gruppiCompetenza', id));
      */
    } catch (err) {
      console.error("Error deleting competence group:", err);
      throw err;
    }
  };

  const toggleCompetenceGroupStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      console.log("Mock toggleCompetenceGroupStatus:", id, currentStatus);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setCompetenceGroups(prev => prev.map(g => g.id === id ? { ...g, status: newStatus, updatedAt: new Date().toISOString() } : g));
      /*
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'gruppiCompetenza', id), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      */
    } catch (err) {
      console.error("Error toggling competence group status:", err);
      throw err;
    }
  };

  return {
    competenceGroups,
    loading,
    error,
    addCompetenceGroup,
    updateCompetenceGroup,
    deleteCompetenceGroup,
    toggleCompetenceGroupStatus
  };
};
