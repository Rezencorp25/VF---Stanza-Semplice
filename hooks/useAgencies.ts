import { useState, useEffect } from 'react';
// import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import { db } from '../lib/firebase';
import { Agency } from '../types';
import { mockAgencies } from '../mockData';

export const useAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading
    const loadAgencies = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAgencies(mockAgencies);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching agencies:", err);
        setError("Failed to load agencies");
        setLoading(false);
      }
    };

    loadAgencies();

    /* Firebase implementation commented out
    const q = query(collection(db, 'filiali'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agenciesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agency[];
      setAgencies(agenciesData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching agencies:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  const addAgency = async (agency: Omit<Agency, 'id'>) => {
    try {
      console.log("Mock addAgency:", agency);
      const newAgency = { ...agency, id: `ag-${Date.now()}` } as Agency;
      setAgencies(prev => [...prev, newAgency]);
      /*
      await addDoc(collection(db, 'filiali'), {
        ...agency,
        createdAt: new Date().toISOString(),
        competenceGroupsCount: 0,
        collaboratorsCount: 0,
        objectsCount: 0,
        roomsCount: 0,
        imagesCount: 0,
        documentsCount: 0,
        collaboratorIds: agency.collaboratorIds || []
      });
      */
    } catch (err) {
      console.error("Error adding agency:", err);
      throw err;
    }
  };

  const updateAgency = async (id: string, data: Partial<Agency>) => {
    try {
      console.log("Mock updateAgency:", id, data);
      setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      /*
      await updateDoc(doc(db, 'filiali', id), data);
      */
    } catch (err) {
      console.error("Error updating agency:", err);
      throw err;
    }
  };

  const deleteAgency = async (id: string) => {
    try {
      console.log("Mock deleteAgency:", id);
      setAgencies(prev => prev.filter(a => a.id !== id));
      /*
      await deleteDoc(doc(db, 'filiali', id));
      */
    } catch (err) {
      console.error("Error deleting agency:", err);
      throw err;
    }
  };

  const toggleAgencyStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      console.log("Mock toggleAgencyStatus:", id, currentStatus);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setAgencies(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      /*
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'filiali', id), { status: newStatus });
      */
    } catch (err) {
      console.error("Error toggling agency status:", err);
      throw err;
    }
  };

  return {
    agencies,
    loading,
    error,
    addAgency,
    updateAgency,
    deleteAgency,
    toggleAgencyStatus
  };
};
