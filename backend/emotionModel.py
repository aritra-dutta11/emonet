# emotionModel.py

# emotionModel.py

class Emotion:
    def __init__(self, meeting_id, users=None):
        # print("MeetID", meeting_id)
        self.meeting_id = meeting_id
        self.users = users or []

    def add_user(self, user):
        self.users.append(user)

    def to_dict(self):
        return {
            'meetingID': self.meeting_id,
            'users': self.users
        }
