import cv2
import mediapipe as mp
import numpy as np

# Initialize Mediapipe Hands and drawing utils
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Set up Mediapipe Hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Open webcam feed
cap = cv2.VideoCapture(0)

# Create a blank canvas for drawing
canvas = None
previous_point = None  # Track the previous point for continuous lines

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame from webcam. Exiting...")
        break

    # Flip the frame horizontally for a selfie-view and convert to RGB
    frame = cv2.flip(frame, 1)
    if canvas is None:
        canvas = np.zeros_like(frame)  # Initialize the canvas with the same size as the frame

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame to detect hands
    results = hands.process(rgb_frame)

    # If hands are detected, draw landmarks and connections
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw landmarks and connections on the frame
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2))

            # Check if one finger is raised (index finger, landmark 8 above landmark 6)
            h, w, _ = frame.shape
            index_tip = hand_landmarks.landmark[8]  # Index finger tip
            index_mcp = hand_landmarks.landmark[5]  # Index finger MCP

            if index_tip.y < index_mcp.y:  # Check if index finger is raised
                cx, cy = int(index_tip.x * w), int(index_tip.y * h)
                # Draw continuous line
                if previous_point is not None:
                    cv2.line(canvas, previous_point, (cx, cy), (255, 0, 0), 5)  # Blue line for drawing
                previous_point = (cx, cy)
            else:
                previous_point = None

    # Combine the frame and the canvas
    combined = cv2.addWeighted(frame, 0.7, canvas, 0.3, 0)

    # Display the combined frame
    cv2.imshow("Hand Tracking with Continuous Drawing", combined)

    # Check if 'Esc' is pressed or the close button is clicked
    if cv2.waitKey(1) & 0xFF == 27:  # Press Esc to exit
        break
    if cv2.getWindowProperty("Hand Tracking with Continuous Drawing", cv2.WND_PROP_AUTOSIZE) == -1:
        break

# Release resources
cap.release()
hands.close()
cv2.destroyAllWindows()
