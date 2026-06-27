#!/usr/bin/env python3
import struct, zlib, math

def create_png(size, output_path):
    # 藍底白圓圈圖示（代替「數」字，避免字型依賴）
    img_data = []
    for y in range(size):
        row = [0]  # filter byte
        for x in range(size):
            cx, cy = size/2, size/2
            r = size * 0.35
            dist = math.sqrt((x-cx)**2 + (y-cy)**2)
            if dist < r:
                row.extend([255, 255, 255, 255])  # white
            else:
                row.extend([26, 115, 232, 255])  # #1a73e8 blue
        img_data.append(bytes(row))

    def make_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr = make_chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))

    raw = b''.join(img_data)
    idat = make_chunk(b'IDAT', zlib.compress(raw))
    iend = make_chunk(b'IEND', b'')

    with open(output_path, 'wb') as f:
        f.write(signature + ihdr + idat + iend)
    print(f"Generated {output_path}")

create_png(192, 'public/icons/icon-192.png')
create_png(512, 'public/icons/icon-512.png')
print("Icons generated!")
