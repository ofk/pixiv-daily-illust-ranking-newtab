import { storage } from './utils/storage';
import type { Artwork } from './utils/types';

const fetchPixivRanking = async (params: Record<string, string>): Promise<Artwork[]> => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((k) => {
    searchParams.set(k, params[k]);
  });
  const resp = await fetch(`https://www.pixiv.net/ranking.php?${searchParams}`);
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const artworks = [] as Artwork[];
  doc.querySelectorAll('section.ranking-item').forEach((section) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const id = section.getAttribute('data-id')!;
    const title = section.getAttribute('data-title')!;
    const url = `https://www.pixiv.net/artworks/${id}`;
    const thumbnailUrl = section.querySelector('img._thumbnail')!.getAttribute('data-src')!;
    const imageUrl = thumbnailUrl.replace(/\w+\/\w+\/(img-master\/)/, '$1');
    const userId = section.querySelector('img._thumbnail')!.getAttribute('data-user-id')!;
    const userName = section.getAttribute('data-user-name')!;
    const userUrl = `https://www.pixiv.net/users/${userId}`;
    const userImageUrl = section
      .querySelector('a.user-container')!
      .getAttribute('data-profile_img')!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
    artworks.push({
      title,
      url,
      imageUrl,
      userName,
      userUrl,
      userImageUrl,
    });
  });
  return artworks;
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // eslint-disable-next-line default-case
  switch (message.action) {
    case `${process.env.PACKAGE_NAME}.getArtworks`:
      storage
        .fetch<Artwork[]>('artworks', 1000 * 60 * 60 * 8, async () => {
          const artworks = await fetchPixivRanking({ mode: 'daily', content: 'illust' });
          return artworks;
        })
        .then(
          (artworks) => {
            sendResponse({ artworks });
          },
          () => {
            sendResponse({ artworks: [] });
          }
        );
      break;

    case `${process.env.PACKAGE_NAME}.clearCache`:
      storage.clear('artworks');
      sendResponse({});
      break;
  }

  return true;
});
