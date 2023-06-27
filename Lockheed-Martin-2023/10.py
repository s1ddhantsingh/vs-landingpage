def main():
    tt = int(input())

    for _ in range(tt):
        N = int(input())
        budget = []
        real = []

        b_temp = input().split(' ')
        for v in b_temp:
            budget.append(float(v))
        r_temp = input().split(' ')
        for v in r_temp:
            real.append(float(v))

        sum = 0
        for i in range(N):
            sum += (real[i] - budget[i])
        sum/=N

        # print(f'{sum:.2f}') --> gives a rounding error
        output = round(sum, 2)
        l = f'{output}'.split('.')
        if len(l[1]) == 1:
            print(f'{output}0')
        else:
            print(f'{output}')

main()

'''
2
6
123.45 678.90 1234.56 789.01 2345.67 8901.23
321.54 876.09 1432.65 987.10 2543.76 8109.32

'''