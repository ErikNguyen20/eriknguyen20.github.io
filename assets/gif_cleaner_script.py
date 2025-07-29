import argparse
import os
from PIL import Image, ImageSequence
import numpy as np
import scipy.ndimage
import cv2


# ------------------------
# From script1
# ------------------------
def remove_white_outline_and_fill(input_path, output_path):
    gif = Image.open(input_path)
    frames = []
    durations = []

    for frame in ImageSequence.Iterator(gif):
        rgba = frame.convert("RGBA")
        arr = np.array(rgba)

        transparent = arr[..., 3] == 0
        background = scipy.ndimage.binary_fill_holes(~transparent)
        hole_mask = transparent & ~background

        arr[hole_mask] = [255, 255, 255, 255]

        new_frame = Image.fromarray(arr, mode="RGBA")
        frames.append(new_frame)
        durations.append(frame.info.get('duration', 20))

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        loop=0,
        disposal=2,
        transparency=0,
        duration=durations
    )


# ------------------------
# From script2
# ------------------------
def erode_alpha(image, erosion_size=1):
    image = image.convert("RGBA")
    data = np.array(image)

    alpha = data[..., 3]
    mask = (alpha > 0).astype(np.uint8) * 255
    kernel = np.ones((3, 3), np.uint8)
    eroded_mask = cv2.erode(mask, kernel, iterations=erosion_size)
    data[..., 3] = eroded_mask

    return Image.fromarray(data, mode="RGBA")


def process_gif_erosion(input_path, output_path, erosion_size=1):
    original = Image.open(input_path)
    frames = []
    durations = []

    for frame in ImageSequence.Iterator(original):
        eroded_frame = erode_alpha(frame.copy(), erosion_size=erosion_size)
        durations.append(frame.info.get('duration', 20))
        frames.append(eroded_frame)

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        loop=original.info.get("loop", 0),
        disposal=2,
        transparency=0,
        duration=durations
    )


# ------------------------
# Combined Workflow
# ------------------------
def main():
    parser = argparse.ArgumentParser(description="Fix white outlines in a GIF and then trim edges.")
    parser.add_argument('-i', '--input', required=True, help='Path to input GIF file')
    parser.add_argument('-o', '--output', required=True, help='Path to final output GIF file')
    parser.add_argument('--erosion', type=int, default=1, help='Erosion size in pixels (default: 1)')

    args = parser.parse_args()

    intermediate_path = "__intermediate__.gif"

    print("Step 1: Removing white outlines and filling holes...")
    remove_white_outline_and_fill(args.input, intermediate_path)

    print("Step 2: Eroding alpha edges...")
    process_gif_erosion(intermediate_path, args.output, erosion_size=args.erosion)

    os.remove(intermediate_path)
    print(f"Done! Final output saved to '{args.output}'")


if __name__ == "__main__":
    main()
