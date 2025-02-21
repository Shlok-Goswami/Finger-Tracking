import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)
canvas = None
previous_point = None 

color_palette = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (0, 255, 255), (255, 0, 255), (255, 165, 0)] 
color_box_positions = [(50 + i * 80, 50) for i in range(len(color_palette))] 

draw_color = color_palette[0] 
show_palette = True 

def is_hand_closed(hand_landmarks):
    """Check if the hand is closed (fingers folded)."""
    return all(hand_landmarks.landmark[i].y > hand_landmarks.landmark[i - 2].y for i in [8, 12, 16, 20])

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame. Exiting...")
        break

    frame = cv2.flip(frame, 1)
    if canvas is None:
        canvas = np.zeros_like(frame)
    
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            h, w, _ = frame.shape
            index_tip = hand_landmarks.landmark[8]
            index_x, index_y = int(index_tip.x * w), int(index_tip.y * h)

            for i, (bx, by) in enumerate(color_box_positions):
                if bx <= index_x <= bx + 70 and by <= index_y <= by + 70:
                    draw_color = color_palette[i]
            
            if is_hand_closed(hand_landmarks):
                previous_point = None
            elif hand_landmarks.landmark[12].y > hand_landmarks.landmark[10].y:
                if previous_point is not None:
                    cv2.line(canvas, previous_point, (index_x, index_y), draw_color, 5)
                previous_point = (index_x, index_y)
            else:
                previous_point = None
    
    combined = cv2.addWeighted(frame, 0.7, canvas, 0.3, 0)
    
    for i, (bx, by) in enumerate(color_box_positions):
        cv2.rectangle(combined, (bx, by), (bx + 70, by + 70), color_palette[i], -1)
        if color_palette[i] == draw_color:
            cv2.rectangle(combined, (bx, by), (bx + 70, by + 70), (255, 255, 255), 3)
    
    cv2.imshow("Gesture Drawing", combined)
    
    if cv2.waitKey(1) & 0xFF == 27:
        break
    if cv2.getWindowProperty("Gesture Drawing", cv2.WND_PROP_AUTOSIZE) == -1:
        break

cap.release()
hands.close()
cv2.destroyAllWindows()
