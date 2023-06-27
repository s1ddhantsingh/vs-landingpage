import time

def main():
    str = input('please enter the string you would like to bold: ').split(' ')

    print('pausing, GET TO THE WINDOW YOU WANT TO PRINT THIS IN FAST!!!')

    time.sleep(3)

    for token in str:

        print(f'start:{bolded_subtoken}, end:{token}')

        # kb.type(bolded_subtoken)
        # kb.press(Key.shift)
        # for _ in range(len(bolded_subtoken)):
        #     kb.press(Key.left)
        #     kb.release(Key.left)

        # kb.press(Key.cmd_l)
        # kb.press('b')
        # kb.release(Key.cmd_l)
        # kb.release('b')

        # for _ in range(len(bolded_subtoken)):
        #     kb.press(Key.right)

        # kb.type(token)

if __name__ == "__main__":
    main()
