"use client";
/**
 * Media elements fed by the manifest.
 * LoopVideo: muted, inline, looping; plays only while on screen (and when `play` is true);
 * shows only the poster when Save-Data is on.
 * Picture: AVIF/WebP srcset from the manifest widths.
 */
import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { videos, images, srcSet } from "@/lib/media";

const noSubscribe = () => () => {};
/** Save-Data on, or a 2G-class connection: show posters only. */
const readSaveData = () => {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData || c?.effectiveType === "2g" || c?.effectiveType === "slow-2g");
};

type VideoProps = {
  id: string;
  className?: string;
  style?: CSSProperties;
  /** gate playback (e.g. hero waits for the lights) */
  play?: boolean;
  eager?: boolean;
};

export function LoopVideo({ id, className = "", style, play = true, eager = false }: VideoProps) {
  const v = videos[id];
  const ref = useRef<HTMLVideoElement>(null);
  const saveData = useSyncExternalStore(noSubscribe, readSaveData, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || saveData) return;
    let visible = false;
    const sync = () => {
      if (visible && play) {
        if (el.preload === "none") el.preload = "auto";
        void el.play().catch(() => {});
      } else el.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    sync();
    return () => io.disconnect();
  }, [play, saveData]);

  if (!v) return null;
  return (
    <video
      ref={ref}
      className={`media-lit ${className}`}
      style={style}
      poster={v.poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
    >
      {!saveData && (
        <>
          <source src={v.webm} type="video/webm" />
          <source src={v.mp4} type="video/mp4" />
        </>
      )}
    </video>
  );
}

type PictureProps = {
  id: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  sizes?: string;
  eager?: boolean;
};

export function Picture({ id, alt, className = "", imgClassName = "", style, sizes = "100vw", eager = false }: PictureProps) {
  const img = images[id];
  if (!img) return null;
  const largest = img.widths[img.widths.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(img, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(img, "webp")} sizes={sizes} />
      <img
        src={`${img.base}-${largest}.webp`}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`media-lit ${imgClassName}`}
        style={{ backgroundImage: `url(${img.placeholder})`, backgroundSize: "cover", ...style }}
      />
    </picture>
  );
}
