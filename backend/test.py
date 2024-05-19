# example.py
# import sys
# def python_function(arg1, arg2):
#     # Your Python code here
#     result = arg1 + arg2
#     return result

# if __name__ == "__main__":
#     # If you want to test this script separately
#     print(python_function(int(sys.argv[1]), int(sys.argv[2])))

import cv2

import matplotlib.pyplot as plt

image = cv2.imread('D:\My Projects\Face-Emotion-Detection\backend\PrivateTest_10131363.jpg')
plt.imshow(image)
