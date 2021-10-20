# Fembed-video-API
Please leave an issue if not working

## Example
https://fapi.deta.dev/:videoid

## Documentation

<details>
<summary>Click me</summary>

---

**Will return `{ success: false }` if video not found or wrong video id**

### GET `/:videoid`
Returns fembed's source api(`/api/source/videoid`).

```json
{
  "success": true,
  "player": {...},
  "data": [...],
  "captions": [...],
  "is_vr": false
}
```

### GET `/:videoid/player`
Returns fembed's source api(`/api/source/videoid`) player object.

### GET `/:videoid/video`
Returns video array with direct url.

```json
[
  {
    "file": "https://...-480p.mp4",
    "label": "480p",
    "type": "mp4"
  },
  {
    "file": "https://...-720p.mp4",
    "label": "720p",
    "type": "mp4"
  },
  {
    "file": "https://...-1080p.mp4",
    "label": "1080p",
    "type": "mp4"
  }
]
```

### GET `/:videoid/captions`
idk about this but returns captions object

Will return `[]` if no captions

---

</details>

## License
This project is [MIT](./LICENSE) licensed.