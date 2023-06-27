import matplotlib.pyplot as plt
import cv2
import PIL
from PIL import Image, ImageOps
import random


def main(seed, bool):

    # img_one = 'IMG-2054.jpg'
    # img_two = 'IMG_9799.png'
    img_three = 'IMG_0876.png'

    # img_list = ['0204', '0876', '4064', '4459', '4811', '7705']
    # img_list=['asdasdasd-removebg-preview.png']
    img_list = ['IMG_2185.png']
    for i in range(len(img_list)):
        # seed = random.random()*random.randrange(0, 100)
        # fname = f'img_{seed}.png'

        fname = f'{img_list[i]}{seed}.png'

        imPOSTERIZE = PIL.ImageOps.posterize(
            Image.open(img_list[i]).convert("RGB"), 1)

        imPOSTERIZE.show()

        # img_list[i] = f'IMG_{img_list[i]}.png'
        # print(img_list[i])

        img = cv2.imread(img_list[i])

        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray_img, threshold1=115, threshold2=120)

        # plt.imshow(edges)
        # plt.show()

        # only save if I allow it to save
        # if bool:
        cv2.imwrite(fname, edges)

        # print(edges)
        savetopng_blackclear(fname=fname)
        # MUST CALL vv AFTER ^^
        savetopng_edges_colorized(fname=fname, og_filename=img_list[i])


def savetopng_blackclear(fname):
    new = []
    img = PIL.Image.open(fname)
    img = img.convert("RGBA")
    data = img.getdata()

    for pixel in data:
        if pixel[0] == 0 and pixel[1] == 0 and pixel[2] == 0:
            # 0,0,0 is the black color -- opacity varies from 0 (clear) to 255 (opaque)
            new.append((0, 0, 0, 0))
        else:
            new.append(pixel)  # append regular white pixel components

    img.putdata(new)
    img.save(f'T{fname}', 'PNG')
    print(f'successfully created: {fname} TRANSPARENT')
    # pix = img.load()
    # for x in range(img.width):
    #     for y in range(img.height):
    #         r, g, b = pix[x, y]
    #         if r==g==b==0:
    #             print(f'{x}, {y}')


def savetopng_edges_colorized(fname, og_filename):
    Timg = PIL.Image.open(f'T{fname}')
    Timg = Timg.convert("RGBA")
    Tdata = Timg.getdata()

    Rimg = PIL.Image.open(og_filename)
    Rimg = Rimg.convert("RGBA")
    Rdata = Rimg.getdata()

    new_img_data = []
    for i in range(len(Tdata)):
        Tpixel = Tdata[i]
        Rpixel = Rdata[i]
        if Tpixel[0] == 0 and Tpixel[1] == 0 and Tpixel[2] == 0:
            new_img_data.append(Tpixel)
        else:
            new_img_data.append(Rpixel)
    # CF == color formatted
    w, h = Rimg.size

    CFimg = PIL.Image.new(mode="RGB", size=(w, h))
    CFimg = PIL.Image.open(f'T{fname}')
    CFimg.putdata(new_img_data)
    CFimg.save(f'CF{fname}', 'PNG')
    print(f'successfully created: CF{fname} (Color-Formatted)')


if __name__ == "__main__":
    v = random.random()*random.randrange(0, 100)
    random.seed(v, False)
    print('starting...')
    main(v, False)
    print('executed...')
