File galleries persist metadata (blobId, thumbnailUrl, name, size, uploadDate) in IndexedDB for large blobs/binary data, syncing via Walrus/Sui onchain for ownership. Use react-window for virtual scrolling, Canvas API for thumbnails, and react-dropzone for drag-drop. Infinite scroll outperforms pagination for galleries; optimize with WebP/AVIF via browser APIs. [github](https://github.com/bvaughn/react-window)

## Persistence Schema

IndexedDB stores blobs efficiently (~50% disk); LocalStorage limited to strings (~5MB).

| Storage     | Pros                          | Cons                       | Use Case                  |
|-------------|-------------------------------|----------------------------|---------------------------|
| IndexedDB  | Async, blobs/objects, indexed | Complex API               | Metadata + thumbnails  [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5) |
| LocalStorage | Sync, simple                 | Strings only, small quota | User prefs (view/sort)  [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5) |

**Schema Example** (idb-keyval or Dexie.js):
```javascript
// Schema: { blobs: [{ id: 'blobId', name: 'file.jpg', thumbnail: blobUrl, size: 1024, date: Date.now(), tags: [] }] }
```

Sync: Poll Sui object or use RPC subscriptions for updates. [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5)

## Performance Techniques

- **Virtual Scrolling**: react-window/VirtualList for 10k+ items (render viewport only). [web](https://web.dev/articles/virtualize-long-lists-react-window)
- **Thumbnails**: Canvas resize (100x100px) on upload; store as blob URL. [youtube](https://www.youtube.com/watch?v=5Vro146pDa0)
- **Lazy Loading**: `loading="lazy"` + IntersectionObserver; use react-intersection-observer. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-build-an-infinite-scroll-image-gallery-with-react-css-grid-and-unsplash)
- **Optimization**: Canvas toBlob('image/webp'); compress via browser-image-resizer.

**Thumbnail Gen**:
```typescript
function generateThumbnail(file: File): Promise<string> {
  return new Promise((res) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 200, 200);
      canvas.toBlob((blob) => res(URL.createObjectURL(blob!)), 'image/webp');
    };
    img.src = URL.createObjectURL(file);
  });
}
```

## UX Patterns & Libraries

- **Views**: Masonry grid (react-masonry-css) > list; toggle via state.
- **Scroll**: Infinite (react-infinite-scroll-component) with IntersectionObserver. [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-build-an-infinite-scroll-image-gallery-with-react-css-grid-and-unsplash)
- **Search/Filter**: Fuse.js on metadata.
- **Drag-Drop**: react-dropzone.

**Library Recs**:
| Category       | Libs                          | Why |
|----------------|-------------------------------|-----|
| Virtual List  | react-window, virtua         | High perf  [github](https://github.com/bvaughn/react-window) |
| Infinite Scroll | react-infinite-scroll-component | Easy Unsplash-like  [digitalocean](https://www.digitalocean.com/community/tutorials/how-to-build-an-infinite-scroll-image-gallery-with-react-css-grid-and-unsplash) |
| Gallery UI    | react-image-gallery, lightGallery | Thumbs/zoom  [github](https://github.com/brillout/awesome-react-components) |
| Drop Upload   | react-dropzone               | Drag-drop |
| IndexedDB     | Dexie.js, idb-keyval         | Typed schema  [dev](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5) |

**Gallery Example** (react-window + infinite):
```typescript
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useInfiniteQuery } from '@tanstack/react-query';

function Gallery({ items }) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({ /* Walrus list query */ });
  const itemCount = data?.pages.reduce((acc, page) => acc + page.blobs.length, 0) ?? 0;

  return (
    <InfiniteLoader isItemLoaded={() => true} itemCount={itemCount} loadMoreItems={fetchNextPage} />
    {({ onItemsRendered, ref }) => (
      <Grid columnCount={4} columnWidth={250} height={800} rowCount={Math.ceil(itemCount/4)} rowHeight={250} ref={ref} onItemsRendered={onItemsRendered}>
        {({ columnIndex, rowIndex, style }) => {
          const idx = rowIndex * 4 + columnIndex;
          const item = data.pages.flatMap(p => p.blobs)[idx];
          return <div style={style}><img src={item.thumbnail} loading="lazy" /></div>;
        }}
      </Grid>
    )}
  );
}
```