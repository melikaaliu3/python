from celery import Celery
import smtplib
from email.mime.text import MIMEText

celery_app = Celery("tasks", broker="redis://redis:6379/0")

@celery_app.task
def send_new_movie_email(movie_title: str, recipient: str):
    msg = MIMEText(f"A new movie '{movie_title}' has been added!")
    msg["Subject"] = "New Movie Notification"
    msg["From"] = "noreply@moviesystem.com"
    msg["To"] = recipient

    with smtplib.SMTP("mailhog", 1025) as server:
        server.sendmail(msg["From"], [recipient], msg.as_string())