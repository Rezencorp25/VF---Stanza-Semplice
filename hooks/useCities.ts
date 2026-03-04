import { useState, useEffect } from 'react';
// import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import { db } from '../lib/firebase';
import { City } from '../types';
import { mockCities } from '../mockData';

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data loading
    const loadCities = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setCities(mockCities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities");
        setLoading(false);
      }
    };

    loadCities();

    /* Firebase implementation commented out for dev/mock mode
    const q = query(collection(db, 'cities'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const citiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as City[];
      setCities(citiesData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching cities:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  const addCity = async (city: Omit<City, 'id'>) => {
    try {
      console.log("Mock addCity:", city);
      // Simulate adding
      const newCity = { ...city, id: `city-${Date.now()}` } as City;
      setCities(prev => [...prev, newCity]);
      /*
      await addDoc(collection(db, 'cities'), {
        ...city,
        createdAt: new Date().toISOString(),
        objectsCount: 0, // Initialize with 0
        availableRoomsCount: 0,
        assignedCollaboratorsCount: 0
      });
      */
    } catch (err) {
      console.error("Error adding city:", err);
      throw err;
    }
  };

  const updateCity = async (id: string, data: Partial<City>) => {
    try {
      console.log("Mock updateCity:", id, data);
      setCities(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      /*
      await updateDoc(doc(db, 'cities', id), data);
      */
    } catch (err) {
      console.error("Error updating city:", err);
      throw err;
    }
  };

  const deleteCity = async (id: string) => {
    try {
      console.log("Mock deleteCity:", id);
      setCities(prev => prev.filter(c => c.id !== id));
      /*
      await deleteDoc(doc(db, 'cities', id));
      */
    } catch (err) {
      console.error("Error deleting city:", err);
      throw err;
    }
  };

  const toggleCityStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      console.log("Mock toggleCityStatus:", id, currentStatus);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setCities(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      /*
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'cities', id), { status: newStatus });
      */
    } catch (err) {
      console.error("Error toggling city status:", err);
      throw err;
    }
  };

  return {
    cities,
    loading,
    error,
    addCity,
    updateCity,
    deleteCity,
    toggleCityStatus
  };
};
