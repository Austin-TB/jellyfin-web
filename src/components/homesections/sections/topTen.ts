import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import type { ApiClient } from 'jellyfin-apiclient';

import cardBuilder from 'components/cardbuilder/cardBuilder';
import { getPortraitShape } from 'components/cardbuilder/utils/shape';
import globalize from 'lib/globalize';
import { ServerConnections } from 'lib/jellyfin-apiclient';

import type { SectionContainerElement, SectionOptions } from './section';

function getTopTenFetchFn(serverId: string) {
    return function () {
        const apiClient = ServerConnections.getApiClient(serverId);
        return apiClient.getItems(apiClient.getCurrentUserId(), {
            SortBy: 'PlayCount,DateCreated',
            SortOrder: 'Descending',
            IncludeItemTypes: 'Movie,Series',
            Limit: 10,
            Recursive: true,
            Fields: 'PrimaryImageAspectRatio,Overview,Genres',
            ImageTypeLimit: 1,
            EnableImageTypes: 'Primary',
            EnableTotalRecordCount: false
        });
    };
}

function getTopTenItemsHtmlFn({ enableOverflow }: SectionOptions) {
    return function (items: BaseItemDto[]) {
        // Build cards with rank numbers embedded
        let html = '';
        items.forEach((item, index) => {
            const rankHtml = `<div class="topTen-badge" aria-hidden="true">${index + 1}</div>`;
            const cardHtml = cardBuilder.getCardsHtml({
                items: [item],
                shape: getPortraitShape(enableOverflow),
                overlayText: false,
                showTitle: false,
                lazy: true,
                overlayPlayButton: true,
                context: 'home',
                allowBottomPadding: !enableOverflow,
                cardClass: 'topTenCard'
            });
            // Wrap each card in a rank container
            html += `<div class="topTen-item">${rankHtml}${cardHtml}</div>`;
        });
        return html;
    };
}

export function loadTopTen(
    elem: HTMLElement,
    apiClient: ApiClient,
    options: SectionOptions
) {
    let html = '';

    html += '<div class="sectionTitleContainer sectionTitleContainer-cards padded-left">';
    html += '<h2 class="sectionTitle sectionTitle-cards">';
    html += globalize.translate('TopPicks') || 'Top 10 Today';
    html += '</h2>';
    html += '</div>';

    if (options.enableOverflow) {
        html += '<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale" data-centerfocus="true">';
        html += '<div is="emby-itemscontainer" class="itemsContainer scrollSlider focuscontainer-x topTen-container" data-monitor="videoplayback,markplayed">';
    } else {
        html += '<div is="emby-itemscontainer" class="itemsContainer padded-left padded-right vertical-wrap focuscontainer-x topTen-container" data-monitor="videoplayback,markplayed">';
    }

    if (options.enableOverflow) {
        html += '</div>';
    }
    html += '</div>';

    elem.classList.add('hide');
    elem.innerHTML = html;

    const itemsContainer: SectionContainerElement | null = elem.querySelector('.itemsContainer');
    if (!itemsContainer) return;
    itemsContainer.fetchData = getTopTenFetchFn(apiClient.serverId());
    itemsContainer.getItemsHtml = getTopTenItemsHtmlFn(options);
    itemsContainer.parentContainer = elem;
}
