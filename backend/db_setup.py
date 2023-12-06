import mysql.connector as mysql
from dotenv import load_dotenv
import os
from faker import Faker
import uuid, bcrypt, random

fake = Faker('en')

load_dotenv("../.env.local")

DB_HOST = os.getenv("DATABASE_HOST")
DB_PORT = os.getenv("DATABASE_PORT")
DB_USER = os.getenv("DATABASE_USERNAME")
DB_PASSWORD = os.getenv("DATABASE_PASSWORD")
DB_NAME = os.getenv("DATABASE_NAME")

conn = mysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)

cur = conn.cursor()

admin_uuid = str(uuid.uuid4())
user_uuid = str(uuid.uuid4())
vip_uuid = str(uuid.uuid4())

cur.execute("INSERT INTO `rank`(id, name, admin) VALUES (%s, %s, %s);", (
admin_uuid, "Admin", True))
cur.execute("INSERT INTO `rank`(id, name, admin) VALUES (%s, %s, %s);", (
user_uuid, "User", False))
cur.execute("INSERT INTO `rank`(id, name, admin) VALUES (%s, %s, %s);", (
vip_uuid, "VIP", False))

conn.commit()
cur.execute("INSERT INTO user(id, username, password, rank_id, email) VALUES (%s, %s, %s, %s, %s);", (
        str(uuid.uuid4()),
        "baguette",
        bcrypt.hashpw(b"test", bcrypt.gensalt()).decode(),
        admin_uuid,
        "baguette@cybertraining.com"
    ))
for _ in range(20):
    cur.execute("INSERT INTO user(id, username, password, rank_id, email) VALUES (%s, %s, %s, %s, %s);", (
        str(uuid.uuid4()),
        fake.user_name(),
        bcrypt.hashpw(fake.password().encode(), bcrypt.gensalt()).decode(),
        random.choice([user_uuid, vip_uuid]),
        fake.free_email()
    ))

sqli_uuid = str(uuid.uuid4())
xss_uuid = str(uuid.uuid4())
id_uuid = str(uuid.uuid4())
cookies_uuid = str(uuid.uuid4())

cur.execute("INSERT INTO category (id, name) VALUES (%s, %s);", (
    sqli_uuid,
    "SQLi"
))

cur.execute("INSERT INTO category (id, name) VALUES (%s, %s);", (
    xss_uuid,
    "XSS"
))

cur.execute("INSERT INTO category (id, name) VALUES (%s, %s);", (
    id_uuid,
    "Information Disclosure"
))

cur.execute("INSERT INTO category (id, name) VALUES (%s, %s);", (
    cookies_uuid,
    "Cookies"
))

conn.commit()

for _ in range(10):
    cur.execute("INSERT INTO challenge(id, title, description, exploit, category_id) VALUES (%s, %s, %s, %s, %s);", (
        str(uuid.uuid4()),
        fake.sentence(2),
        fake.sentence(),
        fake.word(),
        random.choice([sqli_uuid, xss_uuid, id_uuid, cookies_uuid])
    ))

conn.commit()

for _ in range(5):
    cur.execute("INSERT INTO quiz (id, name) VALUES (%s, %s);", (
        str(uuid.uuid4()),
        fake.sentence(2)
    ))

conn.commit()

cur.execute("SELECT id FROM quiz")

quizzes = cur.fetchall()

for quiz in quizzes:
    for _ in range(4):
        cur.execute("INSERT INTO question (id, question, quiz_id) VALUES (%s, %s, %s);", (
            str(uuid.uuid4()),
            fake.sentence(4).replace('.', ' ?'),
            quiz[0]
        ))

conn.commit()

cur.execute("SELECT id FROM question")

questions = cur.fetchall()

for question in questions:
    for _ in range(4):
        cur.execute("INSERT INTO answer (id, answer, is_correct, question_id) VALUES (%s, %s, %s, %s);", (
            str(uuid.uuid4()),
            fake.word(),
            fake.boolean(),
            question[0]
        ))


conn.commit()