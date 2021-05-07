import requests
import socket
import json
import random
import string
from colorama import Fore, Style

URL = f'http://{socket.gethostbyname(socket.gethostname())}'
PASSED = f'{Fore.GREEN}PASSED{Style.RESET_ALL}'

# Generate random 10-letter string to use as a schedule userName
def generate_random_username(length=10): 
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(10))

def post_test_schedule(userName):
    json = {
        "userName": userName,
        "events": [
        ]
    }

    return requests.post(f'{URL}/schedules', json=json)

def test_get_all_schedules_check_status_code_equals_200():
    response = requests.get(f'{URL}/schedules')
    assert response.status_code == 200
    print(f'Schedules - GET ALL 200... {PASSED}')

def test_post_and_remove_schedule():
    userName = generate_random_username().lower()

    response = post_test_schedule(userName)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['userName'] == userName
    print(f'Schedules - POST 201... {PASSED}')

    response = requests.delete(f'{URL}/schedule/{userName}')
    assert response.status_code == 204

    print(f'Schedule - DELETE 204... {PASSED}')

def test_get_schedule_check_status_code_equals_200():
    userName = generate_random_username().lower()

    response = post_test_schedule(userName)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['userName'] == userName
    
    response = requests.get(f'{URL}/schedule/{userName}')
    assert response.status_code == 200

    response = requests.delete(f'{URL}/schedule/{userName}')
    assert response.status_code == 204
    
    print(f'Schedule - GET 200... {PASSED}')

def test_get_schedule_check_status_code_equals_404():
    response = requests.get(f'{URL}/schedule/{generate_random_username(length=30)}')
    assert response.status_code == 404
    print(f'Schedule - GET 404... {PASSED}')

def test_delete_schedule_check_status_code_equals_404():
    response = requests.delete(f'{URL}/schedule/{generate_random_username(length=30)}')
    assert response.status_code == 404
    print(f'Schedule - DELETE 404... {PASSED}')

def test_patch_schedule_check_status_code_equals_404():
    response = requests.patch(f'{URL}/schedule/{generate_random_username(length=30)}')
    assert response.status_code == 404
    print(f'Schedule - PATCH 404... {PASSED}')

def test_patch_schedule_check_status_code_equals_200():
    id = generate_random_username()
    response = post_test_schedule(id)
    responseJson = response.json()

    assert responseJson['data']['events'] == None

    newEvents = ['event1', 'event2!']
    patchJson = {"events": newEvents}

    response = requests.patch(f'{URL}/schedule/{id}', json=patchJson)
    responseJson = response.json()

    assert response.status_code == 200
    assert responseJson['data']['events'] == newEvents

    response = requests.delete(f'{URL}/schedule/{id}')
    assert response.status_code == 204

    print(f'Schedule - PATCH 200... {PASSED}')

def run_tests():
    print('Running schedule_db_test................')
    test_get_all_schedules_check_status_code_equals_200()
    test_post_and_remove_schedule()
    test_delete_schedule_check_status_code_equals_404()
    test_get_schedule_check_status_code_equals_200()
    test_get_schedule_check_status_code_equals_404()
    test_patch_schedule_check_status_code_equals_404()
    test_patch_schedule_check_status_code_equals_200()

run_tests()