from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
import asyncio
import matplotlib.pyplot as plt
import base64
import io
from io import BytesIO
from PIL import Image
import re
import tensorflow as tf
import cv2
from flask_pymongo import PyMongo
from emotionModel import Emotion
from collections import Counter
import certifi
# import pyperclip

app = Flask(__name__)
CORS(app)
# app.config["MONGO_URI"] = "mongodb://localhost:27017/faceEmotionDetection"
app.config["MONGO_URI"] = "mongodb+srv://faceEmotionDetection:faceEmo@cluster0.6ybxth9.mongodb.net/faceEmotionDetection?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app, tlsCAFile=certifi.where())
print("Connected to MongoDB Database")

# collection = mongo.db.test
# inserted_id = collection.insert_one({"name": "Aritra", "Title": "Dutta"}).inserted_id
# print(inserted_id)

model1 = tf.keras.models.load_model('D:/My Projects/Face-Emotion-Detection/backend/Model1.h5')
model2 = tf.keras.models.load_model('D:/My Projects/Face-Emotion-Detection/backend/Model2.h5')
model3 = tf.keras.models.load_model('D:/My Projects/Face-Emotion-Detection/backend/Model3.h5')
# model.summary()

@app.route('/predict', methods=['POST'])
def predict():
    # Read the binary data from the request
    
    
   #  base64Image = request.form['image']
   #  user_name = request.form['userName']
   #  meeting_id = request.form['meeting_id']

    request_data = request.get_json()
    base64Image = request_data['image']
    user_name = request_data['userName']
    meeting_id = request_data['meeting_id']
    print(user_name)
    print(meeting_id)
    # base64Image = request.get_data()
    # test = "data:image/.+;base64,'" + str(base64Image)
   #  pyperclip.copy(base64Image)
   #  print('Copied to clipboard')
    # print(base64Image)
    image_data = re.sub('^data:image/.+;base64,', '', base64Image)
    # print(base64Image)
    # base64_bytes = base64Image.encode('utf-8')
    image_bytes = base64.b64decode(image_data)
    # image_bytes = base64.b64decode(base64Image)
    image = Image.open(io.BytesIO(image_bytes))

    image_arr = np.array(image)
    # # print(image_arr)
    faceCascade=cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_alt.xml')
    gray = cv2.cvtColor(image_arr,cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(gray,1.1,4)
    for x,y,w,h in faces:
       roi_gray = gray[y:y+h, x:x+w]
       roi_color = image_arr[y:y+h, x:x+w]
       cv2.rectangle(image_arr,(x, y),(x+w, y+h),(255,0,0),2)
       facess = faceCascade.detectMultiScale(roi_gray)
       if len(facess) == 0:
          return "Face not detected"
       else:
          for (ex,ey,ew,eh) in facess:
             face_roi =roi_color[ey: ey+eh, ex:ex +ew]
    classes = ["angry","disgust","fear","happy","neutral","sad","surprise"]

    final_image =cv2.resize(face_roi,(48,48))
    # plt.imshow(final_image)
    final_image = np.expand_dims(final_image,axis =0)
    final_image = final_image/255.0

    predictions1 = model1.predict(final_image)
    predictions2 = model2.predict(final_image)
    predictions3 = model3.predict(final_image)
    predictions = []
    predictions.append(np.argmax(predictions1))
    predictions.append(np.argmax(predictions2))
    predictions.append(np.argmax(predictions3))

    counts = Counter(predictions)
    result = (counts.most_common(1)[0])[0]
   #  print(classes[np.argmax(predictions)])

   #  return jsonify({'prediction':classes[np.argmax(predictions)]})
   #  emotion = classes[np.argmax(predictions)]
    emotion = classes[result]
    print(emotion)

   #  s = store(meeting_id, {"name":user_name, "emotion":emotion})
    user = {"name":user_name, "emotion":emotion}
    

    existing_meeting_id = mongo.db.emotions.find_one({'meetingID':meeting_id})
   # print(meeting_id)
    if existing_meeting_id:
      # print("Empty Dictionary")
      # emotion = Emotion.from_dict(meeting_id)
      # emotion.add_user(user['name'], user['emotion'])
      # mongo.db.emotions.update({'meetingID': meeting_id}, emotion.to_dict(), upsert=True)
      users = existing_meeting_id['users']
      for u in users:
         if u['name'] == user['name']:
            result = mongo.db.emotions.update_one({'meetingID':meeting_id, 'users.name':user['name']}, {'$push': {'users.$.emotions': user['emotion']}},)
            # return "New Emotion Added"
            return jsonify({'prediction': "New Emotion Added"})

      result = mongo.db.emotions.update_one({'meetingID':meeting_id}, {'$addToSet': {'users': {"name": user['name'], "emotions":[user['emotion']]}}},) 
      # print(users)
      # return "New User added"
      return jsonify({'prediction': "New User Added"})
   # print("MeetID", request.json['meeting_id'])
    emotion = Emotion(request.json['meeting_id'])
    emotion.add_user({"name": user['name'], "emotions":[user['emotion']]})
    mongo.db.emotions.insert_one(emotion.to_dict())
   #  return "One Inserted"
    return jsonify({'prediction': "One Inserted"})
    




    # plt.imshow(image_arr)

    # Now you have the image array for prediction
    # Perform your model prediction here using the image array
    
    # Return the prediction result or whatever response you need
   #  return "Emotion is - "


@app.route("/fetchEmotions", methods=['POST'])
def fetchEmotions():
   # print("hi")
   request_data = request.get_json()
   meeting_id = request_data['meeting_id']
   # print(meeting_id)

   exist = mongo.db.emotions.find_one({'meetingID': meeting_id})
   # print(exist)
   if not exist:
      return jsonify({"messsage":"Wrong"})
   
   # print(type(exist))
   # return jsonify({"Response":exist})
   users = exist['users']
   # print(len(users))
   classes = ["angry","disgust","fear","happy","neutral","sad","surprise"]

   user_emotions_response = []
   for user in users:
      user_dict = {}
      user_dict["name"] = user["name"]
      # print(user['name'])
      for emo in classes:
         c = round(((user['emotions'].count(emo) / len(user['emotions'])) * 100),2)
         user_dict[emo] = c
         # print(f'{emo} : {c}')
      user_emotions_response.append(user_dict)
   # print(user_emotions_response)
   return jsonify({"users":user_emotions_response})



# @app.route("/store", methods=['POST'])
def store(meeting_id, user):
   print("Emotion Store")
   # meeting_id = request.json['meeting_id']
   # user = request.json['user']
   print(meeting_id)
   print(user['name'])
   print(user['emotion'])

   existing_meeting_id = mongo.db.emotions.find_one({'meetingID':meeting_id})
   # print(meeting_id)
   if existing_meeting_id:
      # print("Empty Dictionary")
      # emotion = Emotion.from_dict(meeting_id)
      # emotion.add_user(user['name'], user['emotion'])
      # mongo.db.emotions.update({'meetingID': meeting_id}, emotion.to_dict(), upsert=True)
      users = existing_meeting_id['users']
      for u in users:
         if u['name'] == user['name']:
            result = mongo.db.emotions.update_one({'meetingID':meeting_id, 'users.name':user['name']}, {'$push': {'users.$.emotions': user['emotion']}},)
            return "New Emotion Added"

      result = mongo.db.emotions.update_one({'meetingID':meeting_id}, {'$addToSet': {'users': {"name": user['name'], "emotions":[user['emotion']]}}},) 
      # print(users)
      return "New User added"
   # print("MeetID", request.json['meeting_id'])
   emotion = Emotion(request.json['meeting_id'])
   emotion.add_user({"name": user['name'], "emotions":[user['emotion']]})
   mongo.db.emotions.insert_one(emotion.to_dict())
   return "One Inserted"


if __name__ == '__main__':
    app.run(debug=True)  # Run Flask app
