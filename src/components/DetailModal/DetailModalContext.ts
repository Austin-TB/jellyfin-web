import { createContext, useContext } from 'react';

export interface DetailModalContextValue {
    openDetailModal: (itemId: string) => void;
    closeDetailModal: () => void;
}

export const DetailModalContext = createContext<DetailModalContextValue>({
    openDetailModal: () => { /* no-op */ },
    closeDetailModal: () => { /* no-op */ }
});

export const useDetailModal = () => useContext(DetailModalContext);
