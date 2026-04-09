import React, { type FC, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import { playbackManager } from 'components/playback/playbackmanager';
import { useApi } from 'hooks/useApi';
import { useItem } from 'hooks/useItem';

import EpisodeList from './EpisodeList';
import SimilarTitles from './SimilarTitles';

import './DetailModal.scss';

interface DetailModalProps {
    itemId: string | null;
    onClose: () => void;
}

function formatRuntime(ticks: number | null | undefined): string | null {
    if (!ticks) return null;
    const totalMinutes = Math.round(ticks / 600000000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function buildBackdropSrc(api: { basePath: string } | undefined, itemId: string | null | undefined, tag: string | null | undefined): string | null {
    if (!api || !itemId || !tag) return null;
    return `${api.basePath}/Items/${itemId}/Images/Backdrop/0?fillWidth=1280&quality=80&tag=${tag}`;
}

const DetailModalContent: FC<{ itemId: string; onClose: () => void }> = ({ itemId, onClose }) => {
    const { api } = useApi();
    const { data: item, isPending } = useItem(itemId);

    const backdropTag = item?.BackdropImageTags?.[0] ?? item?.ImageTags?.Backdrop;
    const backdropSrc = buildBackdropSrc(api, item?.Id, backdropTag);

    const runtime = formatRuntime(item?.RunTimeTicks);
    const match = item?.CommunityRating ? Math.round(item.CommunityRating * 10) : null;
    const isSeries = item?.Type === 'Series';
    const cast = item?.People?.filter(p => p.Type === 'Actor')?.slice(0, 5) ?? [];
    const directors = item?.People?.filter(p => p.Type === 'Director')?.slice(0, 2) ?? [];
    const directorLabel = directors.length > 1 ? 'Directors:' : 'Director:';
    const seasonLabel = item?.ChildCount === 1 ? '1 Season' : `${item?.ChildCount ?? 0} Seasons`;

    const handlePlay = useCallback(() => {
        if (!item) return;
        void playbackManager.play({ items: [item] });
        onClose();
    }, [item, onClose]);

    if (isPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress sx={{ color: '#E50914' }} />
            </Box>
        );
    }

    if (!item) return null;

    return (
        <>
            {/* Backdrop with gradient overlay */}
            <Box
                className='detailModal-backdrop'
                style={{ backgroundImage: backdropSrc ? `url(${backdropSrc})` : undefined }}
            >
                <Box className='detailModal-backdropContent'>
                    <h2 className='detailModal-title'>{item.Name}</h2>

                    <Box className='detailModal-actions'>
                        {playbackManager.canPlay(item) && (
                            <button className='detailModal-playBtn' onClick={handlePlay}>
                                <PlayArrowIcon fontSize='small' />
                                Play
                            </button>
                        )}
                        <button className='detailModal-iconBtn' title='Add to My List'>
                            <AddIcon fontSize='small' />
                        </button>
                        <button className='detailModal-iconBtn' title='Like'>
                            <ThumbUpOffAltIcon fontSize='small' />
                        </button>
                    </Box>
                </Box>
            </Box>

            {/* Body content */}
            <DialogContent className='detailModal-body' sx={{ padding: '0 1.5rem 2rem' }}>
                {/* Meta row */}
                <Box className='detailModal-meta'>
                    {match && <span className='detailModal-match'>{match}% Match</span>}
                    {item.ProductionYear && <span className='detailModal-year'>{item.ProductionYear}</span>}
                    {item.OfficialRating && <span className='detailModal-rating'>{item.OfficialRating}</span>}
                    {runtime && <span className='detailModal-runtime'>{runtime}</span>}
                    {isSeries && item.ChildCount && (
                        <span className='detailModal-runtime'>{seasonLabel}</span>
                    )}
                </Box>

                {/* Overview */}
                {item.Overview && (
                    <p className='detailModal-overview'>{item.Overview}</p>
                )}

                {/* Info rows */}
                {(cast.length > 0 || directors.length > 0 || item.Genres?.length) && (
                    <Box className='detailModal-infoRow'>
                        {cast.length > 0 && (
                            <Box>
                                <span className='detailModal-infoLabel'>Cast:</span>
                                <span className='detailModal-infoValue'>{cast.map(p => p.Name).join(', ')}</span>
                            </Box>
                        )}
                        {directors.length > 0 && (
                            <Box>
                                <span className='detailModal-infoLabel'>{directorLabel}</span>
                                <span className='detailModal-infoValue'>{directors.map(p => p.Name).join(', ')}</span>
                            </Box>
                        )}
                        {item.Genres && item.Genres.length > 0 && (
                            <Box>
                                <span className='detailModal-infoLabel'>Genres:</span>
                                <span className='detailModal-infoValue'>{item.Genres.slice(0, 4).join(', ')}</span>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Episode list for series */}
                {isSeries && item.Id && (
                    <EpisodeList seriesId={item.Id} />
                )}

                {/* Similar titles */}
                <SimilarTitles item={item} />
            </DialogContent>
        </>
    );
};

const DetailModal: FC<DetailModalProps> = ({ itemId, onClose }) => (
    <Dialog
        open={Boolean(itemId)}
        onClose={onClose}
        maxWidth='md'
        fullWidth
        scroll='paper'
        slotProps={{ paper: { className: 'detailModal-dialog' } }}
        sx={{
            '& .MuiDialog-paper': {
                backgroundColor: '#181818',
                color: '#fff',
                backgroundImage: 'none'
            },
            '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            }
        }}
    >
        {/* Close button */}
        <IconButton
            onClick={onClose}
            sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                backgroundColor: '#181818',
                color: '#fff',
                '&:hover': { backgroundColor: '#333' }
            }}
        >
            <CloseIcon />
        </IconButton>

        {itemId && <DetailModalContent itemId={itemId} onClose={onClose} />}
    </Dialog>
);

export default DetailModal;
