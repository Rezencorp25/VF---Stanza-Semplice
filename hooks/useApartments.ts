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
  where,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';
*/
import { Apartment } from '../types';
import { mockApartments } from '../mockData';

const CACHE_KEY_PREFIX = 'apartments_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: Apartment[];
  totalCount: number;
  timestamp: number;
}

export const useApartments = (buildingId?: string | null) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  // const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false); // Mock data is small, no pagination needed
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const isFetching = useRef(false);

  const fetchApartments = useCallback(async (isLoadMore = false) => {
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

      let filteredApartments = mockApartments;
      if (buildingId) {
        filteredApartments = mockApartments.filter(a => a.buildingId === buildingId);
      }

      setApartments(filteredApartments);
      setTotalCount(filteredApartments.length);
      setHasMore(false);

      /* Firebase implementation commented out
      const coll = collection(db, 'apartments');
      // Ensure composite index exists for buildingId + createdAt
      let q = query(coll, orderBy('createdAt', 'desc'), limit(20));

      if (buildingId) {
        q = query(coll, where('buildingId', '==', buildingId), orderBy('createdAt', 'desc'), limit(20));
      }

      if (isLoadMore && lastDoc) {
        if (buildingId) {
            q = query(
              coll, 
              where('buildingId', '==', buildingId), 
              orderBy('createdAt', 'desc'), 
              startAfter(lastDoc), 
              limit(20)
            );
        } else {
            q = query(coll, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(20));
        }
      }

      const snapshot = await getDocs(q);
      const newApartments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Apartment[];

      // Get total count (only on first load)
      let currentTotalCount = totalCount;
      if (!isLoadMore) {
         let countQuery = query(coll);
         if (buildingId) {
            countQuery = query(coll, where('buildingId', '==', buildingId));
         }
         try {
             const countSnapshot = await getCountFromServer(countQuery);
             currentTotalCount = countSnapshot.data().count;
             setTotalCount(currentTotalCount);
         } catch (e) {
             console.error("Error fetching count:", e);
         }
      }

      if (isLoadMore) {
        setApartments(prev => [...prev, ...newApartments]);
      } else {
        setApartments(newApartments);
        // Cache
        const cacheKey = CACHE_KEY_PREFIX + (buildingId || 'all');
        const cacheData: CachedData = {
            data: newApartments,
            totalCount: currentTotalCount,
            timestamp: Date.now()
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
      */

    } catch (err: any) {
      console.error("Error fetching apartments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, [buildingId, totalCount]); // Removed lastDoc dependency

  // Initial fetch & Reset on buildingId change
  useEffect(() => {
    // Reset state locally (visual)
    setApartments([]);
    // setLastDoc(null);
    setHasMore(true);
    setTotalCount(0);
    setLoading(true);
    isFetching.current = false;

    /* Cache check commented out for simplicity in mock mode
    const checkCache = async () => {
        const cacheKey = CACHE_KEY_PREFIX + (buildingId || 'all');
        const cached = sessionStorage.getItem(cacheKey);
        
        if (cached) {
            try {
                const parsed: CachedData = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
                    setApartments(parsed.data);
                    setTotalCount(parsed.totalCount);
                    setLoading(false);
                }
            } catch(e) {}
        }
        
        // Fetch fresh
        fetchApartments(false);
    };

    checkCache();
    */
    fetchApartments(false);
  }, [buildingId]); 

  const refresh = () => {
    const cacheKey = CACHE_KEY_PREFIX + (buildingId || 'all');
    sessionStorage.removeItem(cacheKey);
    // setLastDoc(null);
    fetchApartments(false);
  };

  return {
    apartments,
    loading,
    loadingMore,
    hasMore,
    error,
    totalCount,
    loadMore: () => fetchApartments(true),
    refresh
  };
};
