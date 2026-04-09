import React, { type FC, type PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DetailModalContext } from './DetailModalContext';
import DetailModal from './DetailModal';

/**
 * Provides the detail modal context to the app and renders the modal portal.
 * Supports URL-addressable modals via ?jbv=<itemId> query param.
 */
const DetailModalProvider: FC<PropsWithChildren> = ({ children }) => {
    const [modalItemId, setModalItemId] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const openDetailModal = useCallback((itemId: string) => {
        setModalItemId(itemId);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('jbv', itemId);
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const closeDetailModal = useCallback(() => {
        setModalItemId(null);
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('jbv');
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    // Support URL-based open on mount / navigation
    React.useEffect(() => {
        const jbv = searchParams.get('jbv');
        if (jbv && jbv !== modalItemId) {
            setModalItemId(jbv);
        }
    // Only run when searchParams change, not when modalItemId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const value = useMemo(() => ({
        openDetailModal,
        closeDetailModal
    }), [openDetailModal, closeDetailModal]);

    return (
        <DetailModalContext.Provider value={value}>
            {children}
            <DetailModal itemId={modalItemId} onClose={closeDetailModal} />
        </DetailModalContext.Provider>
    );
};

export default DetailModalProvider;
