import { db } from '../firebase';
import type { UserProfile, HistoryItem } from '../types';

const getCollection = (userId: string, collectionName: string) => {
    return db.collection('users').doc(userId).collection(collectionName);
};

// User Profile
export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
    await db.collection('users').doc(userId).set({ profile }, { merge: true });
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    const doc = await db.collection('users').doc(userId).get();
    const data = doc.data();
    return data?.profile || { brandVoice: '', targetAudience: '' };
};

// History
export const saveHistoryItem = async (userId: string, item: HistoryItem): Promise<void> => {
    await getCollection(userId, 'history').doc(item.id).set(item);
};

export const getHistory = async (userId: string): Promise<HistoryItem[]> => {
    const snapshot = await getCollection(userId, 'history').orderBy('timestamp', 'desc').limit(50).get();
    return snapshot.docs.map(doc => doc.data() as HistoryItem);
};

export const deleteHistoryItem = async (userId: string, itemId: string): Promise<void> => {
    await getCollection(userId, 'history').doc(itemId).delete();
};
