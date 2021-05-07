import requests
import socket
import json
import random
import string
from colorama import Fore, Style

URL = f'http://{socket.gethostbyname(socket.gethostname())}'
PASSED = f'{Fore.GREEN}PASSED{Style.RESET_ALL}'

# Generate random 10-letter string to use as a username
def generate_random_username(length=10): 
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(10))

def post_random_user(userName):
    json = {
        "userName": userName,
        "fName": "TEST",
        "lName": "TEST",
        "salt": "TEST",
        "hash": "TEST",
        "permission": "TEST",
        "gender": "TEST",
        "birthday": "TEST",
        "tags": [
        ]
    }

    return requests.post(f'{URL}/users', json=json)

def test_get_all_users_check_status_code_equals_200():
    response = requests.get(f'{URL}/users')
    assert response.status_code == 200
    print(f'Users - GET ALL 200... {PASSED}')

def test_post_and_remove_user():
    userName = generate_random_username()

    response = post_random_user(userName)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['userName'] == userName.lower()
    print(f'Users - POST 201... {PASSED}')

    response = requests.delete(f'{URL}/user/{userName}')
    assert response.status_code == 204

    print(f'User - DELETE 204... {PASSED}')

def test_get_user_check_status_code_equals_200():
    userName = generate_random_username()

    response = post_random_user(userName)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['userName'] == userName.lower()
    
    response = requests.get(f'{URL}/user/{userName}')
    assert response.status_code == 200

    response = requests.delete(f'{URL}/user/{userName}')
    assert response.status_code == 204
    
    print(f'User - GET 200... {PASSED}')

def test_get_user_check_status_code_equals_404():
    response = requests.get(f'{URL}/user/{generate_random_username(length=30)}')
    assert response.status_code == 404
    print(f'User - GET 404... {PASSED}')

def test_delete_user_check_status_code_equals_404():
    response = requests.delete(f'{URL}/user/{generate_random_username(length=30)}')
    assert response.status_code == 404
    print(f'User - DELETE 404... {PASSED}')

def test_patch_user_check_status_code_equals_404():
    response = requests.patch(f'{URL}/user/{generate_random_username(length=30)}')
    assert response.status_code == 404
    print(f'User - PATCH 404... {PASSED}')

def test_patch_user_check_status_code_equals_200():
    userName = generate_random_username()
    response = post_random_user(userName)
    responseJson = response.json()

    assert responseJson['data']['permission'] == "TEST"

    newPerm = 'Test!'
    patchJson = {'permission': newPerm}

    response = requests.patch(f'{URL}/user/{userName}', json=patchJson)
    responseJson = response.json()

    assert response.status_code == 200
    assert responseJson['data']['permission'] == newPerm

    response = requests.delete(f'{URL}/user/{userName}')
    assert response.status_code == 204

    print(f'User - PATCH 200... {PASSED}')

def run_tests():
    print('Running user_db_test................')
    test_get_all_users_check_status_code_equals_200()
    test_post_and_remove_user()
    test_delete_user_check_status_code_equals_404()
    test_get_user_check_status_code_equals_200()
    test_get_user_check_status_code_equals_404()
    test_patch_user_check_status_code_equals_404()
    test_patch_user_check_status_code_equals_200()

run_tests()