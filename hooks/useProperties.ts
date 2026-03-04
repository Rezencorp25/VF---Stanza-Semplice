import { useState, useEffect, useCallback, useRef } from 'react';
/*
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  QueryDocumentSnapshot, 
  DocumentData,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';
*/
import { Property } from '../types';
import { mockProperties } from '../mockData';

const CACHE_KEY = 'properties_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: Property[];
  totalCount: number;
  timestamp: number;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  // const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Ref to track if we are currently fetching to prevent double calls
  const isFetching = useRef(false);

  const fetchProperties = useCallback(async (isLoadMore = false) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProperties(mockProperties);
      setTotalCount(mockProperties.length);
      setHasMore(false);

      /* Firebase implementation commented out
      // Base query
      const coll = collection(db, 'properties');
      // Ensure you have a composite index for whatever you filter/sort by.
      // Here we just sort by createdAt desc.
      let q = query(coll, orderBy('createdAt', 'desc'), limit(20));

      if (isLoadMore && lastDoc) {
        q = query(coll, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(20));
      }

      // Execute query
      const snapshot = await getDocs(q);
      
      const newProperties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];

      // Get total count only on first load (or if we want to refresh it)
      let currentTotalCount = totalCount;
      if (!isLoadMore) {
        try {
          const countSnapshot = await getCountFromServer(coll);
          currentTotalCount = countSnapshot.data().count;
          setTotalCount(currentTotalCount);
        } catch (e) {
          console.error("Error fetching count:", e);
        }
      }

      if (isLoadMore) {
        setProperties(prev => [...prev, ...newProperties]);
      } else {
        setProperties(newProperties);
        // Update cache
        const cacheData: CachedData = {
          data: newProperties,
          totalCount: currentTotalCount,
          timestamp: Date.now()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
      */

    } catch (err: any) {
      console.error("Error fetching properties:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, [totalCount]); // Removed lastDoc dependency

  // Initial load with cache check
  useEffect(() => {
    /* Cache check commented out for simplicity in mock mode
    const checkCache = async () => {
      const cached = sessionStorage.getItem(CACHE_KEY);
      let usedCache = false;

      if (cached) {
        try {
          const parsed: CachedData = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
            setProperties(parsed.data);
            setTotalCount(parsed.totalCount);
            setLoading(false);
            usedCache = true;
          }
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }
      
      fetchProperties(false);
    };

    checkCache();
    */
    fetchProperties(false);
  }, []); 

  const refresh = () => {
    sessionStorage.removeItem(CACHE_KEY);
    // setLastDoc(null);
    fetchProperties(false);
  };

  return {
    properties,
    loading,
    loadingMore,
    hasMore,
    error,
    totalCount,
    loadMore: () => fetchProperties(true),
    refresh
  };
};
