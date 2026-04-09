import React, { type FC } from 'react';

import { playbackManager } from 'components/playback/playbackmanager';
import { useDetailModal } from 'components/DetailModal/DetailModalContext';
import type { ItemDto } from 'types/base/models/item-dto';
import type { CardOptions } from 'types/cardOptions';

import './CardExpandedInfo.scss';

interface CardExpandedInfoProps {
    item: ItemDto;
    cardOptions: CardOptions;
    onPlay?: () => void;
}

function formatRuntime(ticks: number | null | undefined): string | null {
    if (!ticks) return null;
    const totalMinutes = Math.round(ticks / 600000000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

const CardExpandedInfo: FC<CardExpandedInfoProps> = ({ item, cardOptions, onPlay }) => {
    const canPlay = playbackManager.canPlay(item);
    const runtime = formatRuntime(item.RunTimeTicks);
    const { openDetailModal } = useDetailModal();
    const genres = item.Genres?.slice(0, 3) ?? [];
    const rating = item.CommunityRating ? Math.round(item.CommunityRating * 10) : null;

    return (
        <div className='cardExpandedInfo'>
            <div className='cardExpandedInfo-buttons'>
                {canPlay && (
                    <button
                        className='cardExpandedInfo-btn cardExpandedInfo-playBtn itemAction'
                        data-action='play'
                        title='Play'
                        aria-label='Play'
                        onClick={onPlay}
                    >
                        <span className='material-icons'>play_arrow</span>
                    </button>
                )}

                <button
                    className='cardExpandedInfo-btn itemAction'
                    data-action='addtofavorites'
                    title='Add to My List'
                    aria-label='Add to My List'
                >
                    <span className='material-icons'>add</span>
                </button>

                <button
                    className='cardExpandedInfo-btn itemAction'
                    data-action='markplayed'
                    title='Mark as Played'
                    aria-label='Mark as Played'
                >
                    <span className='material-icons'>thumb_up_off_alt</span>
                </button>

                {cardOptions.showDetailsMenu !== false && (
                    <button
                        className='cardExpandedInfo-btn'
                        title='More Info'
                        aria-label='More Info'
                        style={{ marginLeft: 'auto' }}
                        onClick={() => item.Id && openDetailModal(item.Id)}
                    >
                        <span className='material-icons'>expand_more</span>
                    </button>
                )}
            </div>

            <div className='cardExpandedInfo-meta'>
                {rating && (
                    <span className='cardExpandedInfo-rating'>{rating}% Match</span>
                )}
                {item.ProductionYear && (
                    <span className='cardExpandedInfo-year'>{item.ProductionYear}</span>
                )}
                {item.OfficialRating && (
                    <span className='cardExpandedInfo-officialRating'>{item.OfficialRating}</span>
                )}
                {runtime && (
                    <span className='cardExpandedInfo-runtime'>{runtime}</span>
                )}
            </div>

            {item.Overview && (
                <div className='cardExpandedInfo-overview'>{item.Overview}</div>
            )}

            {genres.length > 0 && (
                <div className='cardExpandedInfo-genres'>
                    {genres.map(genre => (
                        <span key={genre} className='cardExpandedInfo-genre'>{genre}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardExpandedInfo;
