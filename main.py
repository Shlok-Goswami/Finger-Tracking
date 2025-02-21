import cv2
import mediapipe as mp
import sys
import json
import ast

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Initialize the Mediapipe Hands solution
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)

cap = cv2.VideoCapture(0)  # Use the webcam

cap.set(3, 1000)  # Set width (double the value for portrait orientation)
cap.set(4, 2000)  # Set height (double the value for portrait orientation)

frame_count = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % 2 == 0:  # Process every 2nd frame
        frame = cv2.flip(frame, 1)  # Flip horizontally for a selfie-view
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame and detect hands
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Extract and print coordinates of the index and middle fingers
                finger_coordinates = []

                # Index finger tip (Landmark 8)
                index_finger_tip = hand_landmarks.landmark[8]
                h, w, _ = frame.shape
                index_x, index_y = int(index_finger_tip.x * w), int(index_finger_tip.y * h)
                #print(f"Index Finger Tip: (x={index_x}, y={index_y})")
                finger_coordinates.append((index_x, index_y))  # Store index finger coordinates

                # Middle finger tip (Landmark 12)
                middle_finger_tip = hand_landmarks.landmark[12]
                middle_x, middle_y = int(middle_finger_tip.x * w), int(middle_finger_tip.y * h)
                print(f"{index_x},{index_y},{middle_x},{middle_y}")
                finger_coordinates.append((middle_x, middle_y))  # Store middle finger coordinates
                #print(f""+index_x+","+index_y+","+middle_x+","+middle_y)

                # Optionally draw the fingertips on the frame
                cv2.circle(frame, (index_x, index_y), 5, (0, 255, 0), -1)  # Green for index finger
                cv2.circle(frame, (middle_x, middle_y), 5, (0, 0, 255), -1)  # Red for middle finger

                # Store coordinates in array (finger_coordinates array is updated per frame)
                #print(f"Finger Coordinates Array: {finger_coordinates}")
                input = ast.literal_eval(sys.argv[1])
                output = input

                output.append(finger_coordinates) 
                sys.stdout.flush()

        # Display the frame
        cv2.imshow("Hand Tracking", frame)
        if cv2.waitKey(1) & 0xFF == 27:  # Press Esc to exit
            break

cap.release()
cv2.destroyAllWindows()