import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import type { UserDto } from '@jellyfin/sdk/lib/generated-client/models/user-dto';
import escapeHtml from 'escape-html';
import type { ApiClient } from 'jellyfin-apiclient';

import { appRouter } from 'components/router/appRouter';
import imageLoader from 'components/images/imageLoader';
import layoutManager from 'components/layoutManager';
import { playbackManager } from 'components/playback/playbackmanager';
import globalize from 'lib/globalize';

function getBackdropUrl(apiClient: ApiClient, item: BaseItemDto): string | null {
    if (item.BackdropImageTags?.length && item.Id) {
        return apiClient.getScaledImageUrl(item.Id, {
            type: 'Backdrop',
            maxWidth: 1920,
            tag: item.BackdropImageTags[0]
        });
    }
    return null;
}

function truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function loadFeatured(
    elem: HTMLElement,
    apiClient: ApiClient,
    user: UserDto
) {
    // Hide on TV layout
    if (layoutManager.tv) {
        elem.innerHTML = '';
        return Promise.resolve();
    }

    const userId = user.Id || apiClient.getCurrentUserId();

    return apiClient.getItems(userId, {
        SortBy: 'DateCreated,SortName',
        SortOrder: 'Descending',
        IncludeItemTypes: 'Movie,Series',
        Limit: 10,
        Recursive: true,
        Fields: 'Overview,BackdropImageTags',
        ImageTypeLimit: 1,
        EnableImageTypes: 'Backdrop',
        HasBackdrop: true
    }).then(function (result) {
        const items = result.Items || [];
        if (!items.length) {
            elem.innerHTML = '';
            return;
        }

        // Pick a random item from the recent items
        const item = items[Math.floor(Math.random() * items.length)];
        const backdropUrl = getBackdropUrl(apiClient, item);

        if (!backdropUrl) {
            elem.innerHTML = '';
            return;
        }

        const itemUrl = appRouter.getRouteUrl(item);
        const overview = truncateText(item.Overview, 200);
        const name = escapeHtml(item.Name || '');
        const year = item.ProductionYear ? `<span class="heroYear">${item.ProductionYear}</span>` : '';
        const itemType = item.Type === 'Series'
            ? globalize.translate('Series')
            : globalize.translate('Movies');

        let html = '';
        html += '<div class="heroSection">';
        html += '  <div class="heroBanner lazy" data-src="' + escapeHtml(backdropUrl) + '">';
        html += '    <div class="heroGradient"></div>';
        html += '    <div class="heroContent">';
        html += '      <div class="heroMeta">' + escapeHtml(itemType) + ' ' + year + '</div>';
        html += '      <h1 class="heroTitle">' + name + '</h1>';
        if (overview) {
            html += '      <p class="heroOverview">' + escapeHtml(overview) + '</p>';
        }
        html += '      <div class="heroButtons">';
        html += '        <button class="heroPlayBtn" data-id="' + escapeHtml(item.Id || '') + '" data-serverid="' + escapeHtml(item.ServerId || '') + '">';
        html += '          <span class="material-icons play_arrow" aria-hidden="true"></span> ';
        html += '          ' + globalize.translate('Play');
        html += '        </button>';
        html += '        <a is="emby-linkbutton" href="' + itemUrl + '" class="heroInfoBtn">';
        html += '          <span class="material-icons info_outline" aria-hidden="true"></span> ';
        html += '          ' + globalize.translate('MoreFromValue', globalize.translate('Details'));
        html += '        </a>';
        html += '      </div>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        elem.innerHTML = html;

        // Lazy load the backdrop image
        const lazyBanner = elem.querySelector('.heroBanner.lazy') as HTMLElement | null;
        if (lazyBanner) {
            imageLoader.lazyImage(lazyBanner, backdropUrl);
        }

        // Wire up play button
        const playBtn = elem.querySelector('.heroPlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', function () {
                playbackManager.play({
                    ids: [item.Id],
                    serverId: item.ServerId
                });
            });
        }
    });
}
