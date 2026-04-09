import React, { type FC, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { getTvShowsApi } from '@jellyfin/sdk/lib/utils/api/tv-shows-api';

import { useApi } from 'hooks/useApi';
import type { ItemDto } from 'types/base/models/item-dto';

interface EpisodeListProps {
    seriesId: string;
}

const EpisodeList: FC<EpisodeListProps> = ({ seriesId }) => {
    const { api, user } = useApi();
    const [selectedSeason, setSelectedSeason] = useState<string>('');

    const { data: seasonsData } = useQuery({
        queryKey: ['Series', seriesId, 'Seasons'],
        queryFn: async () => {
            if (!api || !user?.Id) return null;
            const resp = await getTvShowsApi(api).getSeasons({
                seriesId,
                userId: user.Id
            });
            return resp.data.Items ?? [];
        },
        enabled: !!api && !!user?.Id,
        staleTime: 30000,
        select: (data) => {
            if (data && !selectedSeason && data.length > 0) {
                // setSelectedSeason in a safe way after first load
            }
            return data;
        }
    });

    // Set default season after first load
    React.useEffect(() => {
        if (seasonsData && seasonsData.length > 0 && !selectedSeason) {
            setSelectedSeason(seasonsData[0].Id ?? '');
        }
    }, [seasonsData, selectedSeason]);

    const { data: episodes } = useQuery({
        queryKey: ['Series', seriesId, 'Episodes', selectedSeason],
        queryFn: async () => {
            if (!api || !user?.Id || !selectedSeason) return null;
            const resp = await getTvShowsApi(api).getEpisodes({
                seriesId,
                userId: user.Id,
                seasonId: selectedSeason,
                fields: ['Overview', 'PrimaryImageAspectRatio'] as never[]
            });
            return resp.data.Items ?? [];
        },
        enabled: !!api && !!user?.Id && !!selectedSeason,
        staleTime: 30000
    });

    const handleSeasonChange = useCallback((e: SelectChangeEvent) => {
        setSelectedSeason(e.target.value);
    }, []);

    if (!seasonsData?.length) return null;

    return (
        <Box className='detailModal-episodes'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>Episodes</Typography>
                <Select
                    value={selectedSeason}
                    onChange={handleSeasonChange}
                    size='small'
                    sx={{
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '.MuiSvgIcon-root': { color: '#fff' },
                        minWidth: 140
                    }}
                >
                    {seasonsData.map(season => (
                        <MenuItem key={season.Id} value={season.Id ?? ''}>
                            {season.Name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box className='detailModal-episodeList'>
                {(episodes ?? []).map((ep: ItemDto, idx: number) => (
                    <Box key={ep.Id} className='detailModal-episode'>
                        <Typography className='detailModal-episodeNumber' variant='h4' sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, minWidth: 40 }}>
                            {ep.IndexNumber ?? idx + 1}
                        </Typography>
                        <Box className='detailModal-episodeInfo' sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <Typography sx={{ fontWeight: 600 }}>{ep.Name}</Typography>
                                {ep.RunTimeTicks && (
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                        {Math.round(ep.RunTimeTicks / 600000000)}m
                                    </Typography>
                                )}
                            </Box>
                            {ep.Overview && (
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mt: 0.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {ep.Overview}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default EpisodeList;
