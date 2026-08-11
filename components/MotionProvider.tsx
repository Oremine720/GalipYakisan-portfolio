"use client";

import { MotionConfig } from "framer-motion";

/**
 * Tüm framer-motion animasyonlarını işletim sistemindeki
 * "hareketi azalt" tercihine bağlar (prefers-reduced-motion).
 * Kullanıcı bu tercihi açtıysa transform/opacity animasyonları atlanır,
 * içerik son haliyle doğrudan görünür.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
