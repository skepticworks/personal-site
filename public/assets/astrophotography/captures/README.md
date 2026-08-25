# Astrophotography captures (web derivatives only)

Each published capture uses a stable capture ID directory:

```text
public/assets/astrophotography/captures/<capture-id>/
  thumbnail.avif|webp
  preview.avif|webp
  preview-hq.avif|webp   # optional
```

**Never** place RAW, FITS, TIFF masters, calibration frames, or other source
files here. The original library lives outside this repository.

See `docs/astrophotography-publishing.md`.
