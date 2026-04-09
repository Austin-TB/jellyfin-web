import React, { type FC, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';

import { useApi } from 'hooks/useApi';
import type { ItemDto } from 'types/base/models/item-dto';
import { useDetailModal } from './DetailModalContext';

interface SimilarCardProps {
    sim: ItemDto;
    imgSrc: string | null;
}

const SimilarCard: FC<SimilarCardProps> = ({ sim, imgSrc }) => {
    const { openDetailModal } = useDetailModal();

    const handleClick = useCallback(() => {
        if (sim.Id) openDetailModal(sim.Id);
    }, [sim.Id, openDetailModal]);

    return (
        <Box
            key={sim.Id}
            className='detailModal-similarCard'
            onClick={handleClick}
            sx={{ cursor: 'pointer' }}
        >
            <Box className='detailModal-similarCard-image' sx={{
                backgroundImage: imgSrc ? `url(${imgSrc})` : undefined,
                backgroundColor: '#333',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '4px',
                aspectRatio: '16/9',
                mb: 0.75
            }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{sim.Name}</Typography>
            {sim.ProductionYear && (
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{sim.ProductionYear}</Typography>
            )}
        </Box>
    );
};

interface SimilarTitlesProps {
    item: ItemDto;
}

const SimilarTitles: FC<SimilarTitlesProps> = ({ item }) => {
    const { api, user } = useApi();

    const { data: similar } = useQuery({
        queryKey: ['Items', item.Id, 'Similar'],
        queryFn: async () => {
            if (!api || !user?.Id || !item.Id) return [];
            const resp = await getLibraryApi(api).getSimilarItems({
                itemId: item.Id,
                userId: user.Id,
                limit: 12,
                fields: ['PrimaryImageAspectRatio', 'Overview'] as never[]
            });
            return resp.data.Items ?? [];
        },
        enabled: !!api && !!user?.Id && !!item.Id,
        staleTime: 60000
    });

    if (!similar?.length) return null;

    return (
        <Box className='detailModal-similar'>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 1.5 }}>More Like This</Typography>
            <Box className='detailModal-similarGrid'>
                {similar.slice(0, 6).map((sim: ItemDto) => {
                    const imgTag = sim.ImageTags?.Primary;
                    const imgSrc = imgTag && api ?
                        `${api.basePath}/Items/${sim.Id}/Images/Primary?fillWidth=200&quality=80&tag=${imgTag}` :
                        null;
                    return (
                        <SimilarCard key={sim.Id} sim={sim} imgSrc={imgSrc} />
                    );
                })}
            </Box>
        </Box>
    );
};

export default SimilarTitles;
