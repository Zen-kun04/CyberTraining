from flask import Flask, request, jsonify
import mysql.connector as mysql
import bcrypt
import uuid
from datetime import datetime, timezone, timedelta
from flask_cors import CORS
import jwt
import os
from dotenv import load_dotenv

load_dotenv("../.env.local")


DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_NAME = os.getenv("DATABASE_NAME")
JWT_PASSPHRASE = os.getenv("JWT_PASSPHRASE")


app = Flask(__name__)
CORS(app)


def generate_jwt(user_id: str, username: str, email: str) -> str:
    return jwt.encode({"id": user_id, "username": username, "email": email, "exp": datetime.now(tz=timezone.utc) + timedelta(weeks=1)}, JWT_PASSPHRASE, algorithm="HS256")


def is_jwt_valid(token: str) -> bool:
    try:
        jwt.decode(token, JWT_PASSPHRASE, ["HS256"])
        return True
    except (jwt.exceptions.DecodeError, jwt.exceptions.InvalidAlgorithmError, jwt.exceptions.InvalidSignatureError, jwt.exceptions.ExpiredSignatureError):
        return False


def is_jwt_admin(token: str) -> bool:
    try:
        decoded_token = jwt.decode(token, JWT_PASSPHRASE, ["HS256"])
        conn = mysql.connect(
            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
        cur = conn.cursor()
        cur.execute("SELECT rank_id FROM user WHERE email = %s",
                    (decoded_token["email"],))
        rankid = cur.fetchone()
        if rankid is not None:
            cur.execute("SELECT admin FROM `rank` WHERE id = %s", (rankid[0],))
            return cur.fetchone()[0]
        return False
    except (jwt.exceptions.DecodeError, jwt.exceptions.InvalidAlgorithmError, jwt.exceptions.InvalidSignatureError, jwt.exceptions.ExpiredSignatureError) as e:
        print("Error checking if is admin")
        return False


def is_jwt_same_user(token: str, user_id: str) -> bool:
    try:
        decoded_token = jwt.decode(token, JWT_PASSPHRASE, ["HS256"])
        print(decoded_token)
        print(user_id)
        return decoded_token["id"] == user_id
    except (jwt.exceptions.DecodeError, jwt.exceptions.InvalidAlgorithmError, jwt.exceptions.InvalidSignatureError, jwt.exceptions.ExpiredSignatureError):
        return False


def get_decoded(token: str) -> dict:
    return jwt.decode(token, JWT_PASSPHRASE, ["HS256"])


def user_id_exist(user_id: str) -> bool:
    if len(user_id) == 36:
        conn = mysql.connect(
            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(id) FROM user WHERE id = %s", (user_id,))
        res = cur.fetchone()

        return res[0] == 1
    return False


def delete_user(user_id: str):
    if len(user_id) == 36:
        conn = mysql.connect(
            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
        cur = conn.cursor()
        cur.execute("DELETE FROM user WHERE id = %s", (user_id,))
        conn.commit()

        return True
    return False


def get_user_information(user_id: str):
    if len(user_id) == 36:
        conn = mysql.connect(
            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
        cur = conn.cursor()
        cur.execute(
            "SELECT username, email, created_at, updated_at, is_active, rank_id, avatar FROM user WHERE id = %s", (user_id,))
        data = cur.fetchone()

        if data is None:
            return None
        return {
            "id": user_id,
            "username": data[0],
            "email": data[1],
            "rank": data[5],
            "active": data[4],
            "avatar": data[6],
            "created_at": data[2].strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": data[3].strftime("%Y-%m-%d %H:%M:%S")
        }
    return None


def update_user(user: dict):
    pass

@app.route('/api/user/delete/<user_id>')
def user_delete(user_id: str):
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
            if user_id_exist(user_id) and delete_user(user_id):

                return jsonify({
                    "code": 200,
                    "message": "User has been deleted successfully"
                })
            return jsonify({
                "code": 404,
                "message": "User not found"
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })

@app.route('/api/users')
def get_users():
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
            conn = mysql.connect(
                host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
            cur = conn.cursor()
            cur.execute(
                "SELECT user.id, user.username, user.email, rank.name as rank_name, user.level, user.created_at, user.updated_at FROM user JOIN `rank` ON user.rank_id = rank.id")
            users = cur.fetchall()
            res = [{
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "rank": user[3],
                "level": user[4],
                "created_at": user[5],
                "updated_at": user[6]
            } for user in users]
            return jsonify({
                "code": 200,
                "result": res
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


# @app.route('/api/user', methods=["PATCH"])
# def user_update():
#     try:
#         if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
#             data = request.get_json()
#             if data is not None and ("id" in data and "username" in data and "email" in data and "rank" in data):
#                 conn = mysql.connect(
#                     host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
#                 cur = conn.cursor()
#                 cur.execute("UPDATE user SET username = %s, email = %s, rank_id = %s, updated_at = %s WHERE id = %s", (
#                     data["username"], data["email"], data["rank"], datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data["id"]))
#                 conn.commit()

#                 return jsonify({
#                     "code": 200,
#                     "result": "Successfully updated user"
#                 })
#             return jsonify({
#                 "code": 400,
#                 "error": "Invalid user ID"
#             })
#         return jsonify({
#             "code": 498,
#             "error": "Invalid token"
#         })
#     except:
#         return jsonify({
#             "code": 400,
#             "error": "Bad request"
#         })


@app.route('/api/rank', methods=["PATCH"])
def rank_update():
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
            data = request.get_json()
            if data is not None and ("id" in data and "name" in data):
                conn = mysql.connect(
                    host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                cur = conn.cursor()
                cur.execute("UPDATE `rank` SET name = %s, admin = %s, updated_at = %s WHERE id = %s",
                            (data["name"], data["admin"], datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data["id"]))
                conn.commit()

                return jsonify({
                    "code": 200,
                    "result": "Successfully updated rank"
                })
            return jsonify({
                "code": 400,
                "error": "Invalid rank ID"
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })

@app.route('/api/jwt/decode')
def decode_jwt():
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_valid(request.headers.get("Authorization")):
            return jsonify({
                "code": 200,
                "result": get_decoded(request.headers.get("Authorization"))
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/admin')
def is_admin():
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
            return jsonify({
                "code": 200,
                "message": "Authenticated"
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/session')
def session():
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_valid(request.headers.get("Authorization")):
            return jsonify({
                "code": 200,
                "message": "Authenticated"
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/login', methods=['POST'])
def login():
    try:
        json = request.json

        if "email" in json and "password" in json and (json["email"].strip() != '' and json["password"].strip() != ''):
            conn = mysql.connect(
                host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
            cur = conn.cursor()
            cur.execute("SELECT password FROM user WHERE email = %s",
                        (json["email"],))
            hashed_pwd = cur.fetchone()

            if hashed_pwd := hashed_pwd:
                hashed_pwd = hashed_pwd[0]
                if bcrypt.checkpw(json["password"].encode(), hashed_pwd.encode()):
                    cur.execute("SELECT id, username FROM user WHERE email = %s",
                                (json["email"],))
                    user_data = cur.fetchone()
                    return jsonify({
                        "code": 200,
                        "message": "Success",
                        "jwt": generate_jwt(user_data[0], user_data[1], json["email"])
                    })
            return jsonify({
                "code": 401,
                "message": "Bad credentials"
            })

    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/register', methods=['POST'])
def register():
    try:
        json = request.json
        if "username" in json and "email" in json and "password" in json and (json["username"].strip() != '' and json["email"].strip() != '' and json["password"].strip() != ''):
            conn = mysql.connect(
                host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
            cur = conn.cursor()
            date_format = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cur.execute("INSERT INTO user (id, username, email, password, gdpr, is_active, created_at, updated_at, rank_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (str(
                uuid.uuid4()), json["username"], json["email"], bcrypt.hashpw(json["password"].encode(), bcrypt.gensalt()).decode(), date_format, 1, date_format, date_format, "0"))
            conn.commit()
            cur.execute("SELECT id, username FROM user WHERE email = %s",
                        (json["email"],))
            user_data = cur.fetchone()

            return jsonify({
                "code": 200,
                "message": "Successfully registered",
                "jwt": generate_jwt(user_data[0], user_data[1], json["email"])
            })

        return jsonify({
            "code": 400,
            "message": "Invalid data"
        })

    except Exception as e:
        print(e)
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/delete-rank', methods=["POST"])
def delete_rank():
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
            data = request.get_json()
            conn = mysql.connect(
                host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
            cur = conn.cursor()
            cur.execute("DELETE FROM `rank` WHERE id = %s", (data["id"],))
            conn.commit()

            return jsonify({
                "code": 200,
                "result": "Successfully deleted rank"
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


ENTITY_LIST = (
    "category",
    "rank",
    "user",
    "challenge",
    "quiz"
)

USER_PROPERTIES = [
    "id",
    "username",
    "email",
    "avatar",
    "password"
]


@app.route('/api/delete/<entity>', methods=["POST"])
def crud_delete(entity: str):
    try:
        if entity in ENTITY_LIST:
            if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                body = request.get_json()
                if "id" in body:
                    entity_id = body["id"]
                    conn = mysql.connect(
                        host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                    cur = conn.cursor()
                    cur.execute(
                        f"DELETE FROM `{entity}` WHERE id = %s", (str(entity_id),))
                    conn.commit()
                    return jsonify({
                        "code": 200,
                        "error": f"Successfully deleted {entity}"
                    })
                return jsonify({
                    "code": 400,
                    "error": "Bad request"
                })

            return jsonify({
                "code": 401,
                "error": "Unauthorized"
            })
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })
    except Exception:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/<entity>/<entity_id>')
def crud_read(entity: str, entity_id: str):
    try:
        if entity in ENTITY_LIST:
            conn = mysql.connect(
                host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
            cur = conn.cursor()

            if entity == "category":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM category WHERE id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "name": res[1],
                                "created_at": res[2],
                                "updated_at": res[3]
                            }

                        })
                else:
                    cur.execute("SELECT name FROM category WHERE id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": entity_id,
                                "name": res[0],
                            }

                        })
                return jsonify({
                    "code": 404,
                    "message": "No results found"
                })
            
            elif entity == "challenge":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM challenge WHERE id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "title": res[1],
                                "description": res[2],
                                "exploit": res[3],
                                "category_id": res[4],
                                "image": res[5],
                                "created_at": res[6],
                                "updated_at": res[7]
                            }

                        })
                else:
                    cur.execute("SELECT id, title, description, category_id, image FROM challenge WHERE id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "title": res[1],
                                "description": res[2],
                                "category_id": res[3],
                                "image": res[4]
                            }

                        })
                return jsonify({
                    "code": 404,
                    "message": "No results found"
                })

            elif entity == "rank":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM `rank` WHERE id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "name": res[1],
                                "admin": res[2],
                                "created_at": res[3],
                                "updated_at": res[4]
                            }

                        })
                else:
                    cur.execute("SELECT name FROM `rank` WHERE id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": entity_id,
                                "name": res[0],
                            }
                        })
                return jsonify({
                    "code": 404,
                    "message": "No results found"
                })

            elif entity == "user":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT user.*, `rank`.name AS rank_name FROM user JOIN `rank` ON user.rank_id = `rank`.id WHERE user.id = %s",
                                (entity_id,))
                    if res := cur.fetchone():

                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "username": res[1],
                                "password": res[2],
                                "created_at": res[3],
                                "updated_at": res[4],
                                "rank_id": res[5],
                                "gdpr": res[6],
                                "is_active": res[7],
                                "avatar": res[8],
                                "email": res[9],
                                "level": res[10],
                                "rank_name": res[11],
                            }

                        })
                elif request.headers.get("Authorization", None) is not None and is_jwt_same_user(request.headers.get("Authorization", None), entity_id):
                    cur.execute("SELECT user.id, user.username, user.created_at, user.updated_at, `rank`.name, user.avatar, user.email, user.level FROM user JOIN `rank` ON user.rank_id = `rank`.id WHERE user.id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "username": res[1],
                                "created_at": res[2],
                                "updated_at": res[3],
                                "rank_name": res[4],
                                "avatar": res[5],
                                "email": res[6],
                                "level": res[7],
                            }

                        })
                else:
                    cur.execute("SELECT user.id, user.username, user.created_at, `rank`.name, user.avatar, user.level FROM user JOIN `rank` ON user.rank_id = `rank`.id WHERE user.id = %s",
                                (entity_id,))
                    if res := cur.fetchone():
                        return jsonify({
                            "code": 200,
                            "result": {
                                "id": res[0],
                                "username": res[1],
                                "created_at": res[2],
                                "rank_name": res[3],
                                "avatar": res[4],
                                "level": res[5]
                            }

                        })
                return jsonify({
                    "code": 404,
                    "message": "No results found"
                })
            return jsonify({
                    "code": 400,
                    "message": "Invalid entity"
                })
    except Exception as e:
        print(e)
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/list/<entity>')
def crud_list(entity: str):
    try:
        if entity in ENTITY_LIST:
            conn = mysql.connect(
                host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
            cur = conn.cursor()

            if entity == "rank":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM `rank`")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": rank[0],
                                "name": rank[1],
                                "admin": rank[2],
                                "created_at": rank[3],
                                "updated_at": rank[4]
                            }
                            for rank in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
                else:
                    cur.execute("SELECT id, name FROM `rank`")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": rank[0],
                                "name": rank[1],
                            }
                            for rank in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })

            elif entity == "category":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM category")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "name": category[1],
                                "created_at": category[2],
                                "updated_at": category[3]
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
                    return jsonify({
                        "code": 404,
                        "result": []
                    })
                else:
                    cur.execute("SELECT id, name FROM category")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "name": category[1],
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
            elif entity == "challenge":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM challenge")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "title": category[1],
                                "description": category[2],
                                "exploit": category[3],
                                "category_id": category[4],
                                "image": category[5],
                                "created_at": category[6],
                                "updated_at": category[7]
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
                    return jsonify({
                        "code": 404,
                        "result": []
                    })
                else:
                    cur.execute(
                        "SELECT id, title, description, category_id, image FROM challenge")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "title": category[1],
                                "description": category[2],
                                "category_id": category[3],
                                "image": category[4]
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
            elif entity == "quiz":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute("SELECT * FROM quiz")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "name": category[1],
                                "image": category[2],
                                "created_at": category[3],
                                "updated_at": category[4]
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
                    return jsonify({
                        "code": 404,
                        "result": []
                    })
                else:
                    cur.execute("SELECT id, name, image FROM quiz")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "name": category[1],
                                "image": category[2]
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })

            elif entity == "user":
                if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                    cur.execute(
                        "SELECT id, username, rank_id, email, level, created_at, updated_at FROM user")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "username": category[1],
                                "rank_id": category[2],
                                "email": category[3],
                                "level": category[4],
                                "created_at": category[5],
                                "updated_at": category[6],
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })
                    return jsonify({
                        "code": 404,
                        "result": []
                    })
                else:
                    cur.execute(
                        "SELECT id, username, rank_id, level, created_at FROM user")
                    if res := cur.fetchall():
                        result = [
                            {
                                "id": category[0],
                                "username": category[1],
                                "rank_id": category[2],
                                "level": category[3],
                                "created_at": category[4],
                            }
                            for category in res
                        ]
                        return jsonify({
                            "code": 200,
                            "result": result
                        })

            return jsonify({
                "code": 404,
                "result": []
            })

    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route("/api/new/<entity>", methods=["POST"])
def crud_create(entity: str):
    try:
        if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
            if entity in ENTITY_LIST:
                data = request.get_json()
                conn = mysql.connect(
                    host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                cur = conn.cursor()
                if entity == "rank":
                    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    cur.execute("INSERT INTO `rank` VALUES (%s, %s, %s, %s, %s);", (str(
                        uuid.uuid4()), data["name"], data["admin"], now, now))
                elif entity == "category":
                    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    cur.execute("INSERT INTO category VALUES (%s, %s, %s, %s);", (str(
                        uuid.uuid4()), data["name"], now, now))
                conn.commit()

                return jsonify({
                    "code": 200,
                    "result": f"Successfully created {entity}"
                })
            return jsonify({
                "code": 400,
                "error": "Bad entity"
            })
        return jsonify({
            "code": 498,
            "error": "Invalid token"
        })
    except:
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


@app.route('/api/update/<entity>', methods=["PATCH"])
def crud_update(entity: str):
    try:
        print(generate_jwt("63c1ec6f-5cb3-478e-a7e7-7d9c10abb5ad", "Tester", "yes"))
        if entity in ENTITY_LIST:
            data: dict = request.get_json()
            if request.headers.get("Authorization", None) is not None and is_jwt_admin(request.headers.get("Authorization")):
                if entity == "rank":
                    if data is not None and ("id" in data and "name" in data and "admin" in data):
                        conn = mysql.connect(
                            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                        cur = conn.cursor()
                        cur.execute("UPDATE `rank` SET name = %s, admin = %s, updated_at = %s WHERE id = %s",
                                    (data["name"], data["admin"], datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data["id"]))
                        conn.commit()

                        return jsonify({
                            "code": 200,
                            "result": "Successfully updated rank"
                        })
                    return jsonify({
                        "code": 400,
                        "error": "Invalid rank ID"
                    })
                elif entity == "category":
                    if data is not None and ("id" in data and "name" in data):
                        conn = mysql.connect(
                            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                        cur = conn.cursor()
                        cur.execute("UPDATE category SET name = %s, updated_at = %s WHERE id = %s",
                                    (data["name"], datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data["id"]))
                        conn.commit()

                        return jsonify({
                            "code": 200,
                            "result": "Successfully updated category"
                        })
                    return jsonify({
                        "code": 400,
                        "error": "Invalid category ID"
                    })
                elif entity == "user":
                    if data is not None and ("id" in data and "username" in data and "email" in data and "rank_id" in data):
                        conn = mysql.connect(
                            host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                        cur = conn.cursor()
                        cur.execute("UPDATE user SET username = %s, email = %s, rank_id = %s, updated_at = %s WHERE id = %s",
                                    (data["username"], data["email"], data["rank_id"], datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data["id"]))
                        conn.commit()

                        return jsonify({
                            "code": 200,
                            "result": "Successfully updated user"
                        })
                    return jsonify({
                        "code": 400,
                        "error": "Invalid user ID"
                    })
            else:
                if entity == "user" and data is not None and (len(data) > 1 and "id" in data) and (request.headers.get("Authorization", None) is not None and is_jwt_same_user(request.headers.get("Authorization"), data["id"])):
                    for x in data.keys():
                        if x not in USER_PROPERTIES:
                            return jsonify({
                                "code": 400,
                                "error": "Bad requesttt"
                            })
                    conn = mysql.connect(
                        host=DATABASE_HOST, port=DATABASE_PORT, username=DATABASE_USERNAME, password=DATABASE_PASSWORD, database=DATABASE_NAME)
                    cur = conn.cursor()
                    filtered = tuple(
                        value for key, value in data.items() if key.lower() != "id")
                    cur.execute(f"UPDATE user SET {', '.join(f'{x} = %s' for x in data if x.lower() != 'id')}, updated_at = %s WHERE id = %s",
                                (*filtered, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data["id"]))
                    conn.commit()
                    return jsonify({
                        "code": 200,
                        "error": "Nice"
                    })

            return jsonify({
                "code": 498,
                "error": "Invalid token"
            })
    except Exception as e:
        print(e)
        return jsonify({
            "code": 400,
            "error": "Bad request"
        })


if __name__ == "__main__":
    app.run(host="localhost", port=80, debug=True)
