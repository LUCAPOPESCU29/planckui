/* Minimal store-only ZIP writer + Swift package builder for the
   MacBook Resources downloads. No dependencies. */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zip(files: { path: string; content: string; exec?: boolean }[]): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const u16 = (v: number) => [v & 0xff, (v >> 8) & 0xff];
  const u32 = (v: number) => [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
  for (const f of files) {
    const name = enc.encode(f.path);
    const data = enc.encode(f.content);
    const crc = crc32(data);
    const execBit = f.exec ? 0x8101 : 0;
    // local header: sig(4) version(2) flags(2) method(2) time(2) date(2)
    //   crc(4) csize(4) usize(4) nameLen(2) extraLen(2)
    const local = new Uint8Array([
      0x50, 0x4b, 3, 4, ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...name,
    ]);
    chunks.push(local, data);
    // central: sig(4) verMade(2) verNeed(2) flags(2) method(2) time(2) date(2)
    //   crc(4) csize(4) usize(4) nameLen(2) extraLen(2) commentLen(2) diskStart(2)
    //   intAttrs(2) extAttrs(4) offset(4)
    const cd = new Uint8Array([
      0x50, 0x4b, 1, 2, ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length),
      ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(f.exec ? 0x81ed0000 : 0), ...u32(offset), ...name,
    ]);
    central.push(cd);
    offset += local.length + data.length;
  }
  const cdSize = central.reduce((a, b) => a + b.length, 0);
  const eocd = new Uint8Array([
    0x50, 0x4b, 5, 6, ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length),
    ...u32(cdSize), ...u32(offset), ...u16(0),
  ]);
  return new Blob([...chunks, ...central, eocd] as BlobPart[], { type: "application/zip" });
}

export const SWIFT_MODE: Record<string, string> = {
  dockpro: "pro", dockclassic: "classic", dockdev: "dev", deskclock: "clock",
};

export const PACKAGE_SWIFT = `// swift-tools-version:5.9
import PackageDescription
let package = Package(
    name: "PlanckDock",
    platforms: [.macOS(.v13)],
    targets: [.executableTarget(name: "PlanckDock", path: "Sources/PlanckDock")]
)
`;

export const RUN_SH = `#!/bin/zsh
# PlanckUi dock — build & launch (first run compiles for ~20s)
cd "$(dirname "$0")"
swift run
`;

export function readme(res: { name: string }, projectPath: string): string {
  return `# PlanckUi — ${res.name} (native macOS)

A real Swift/AppKit dock for your Mac: floating glass panel, live clock,
Now Playing from Apple Music & Spotify, Vercel deploys, and app icons
loaded straight from your /Applications.

## Run it

1. Install Xcode Command Line Tools once:  xcode-select --install
2. In this folder:  swift run
   (first run compiles for about 20 seconds, then the dock appears)

## What works

- Apps appear based on what you have installed — click to open.
  Pin a custom set:  ~/.planckui-dock/apps.txt  (one app name per line)
- Now Playing follows Apple Music or Spotify while something plays;
  the tile is clickable to play/pause.
- The Vercel tile deploys ${projectPath} — status lands in
  ~/.planckui-dock/deploy.status, the log in deploy.log
- Quit the dock:  pkill PlanckDock  (or Activity Monitor)

## Requirements

macOS 13+ and Xcode Command Line Tools. The first Automation permission
prompt powers Now Playing and app control — allow it once.
`;
}
