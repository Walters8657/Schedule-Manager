import requests
import socket
import json
import random
import string
from colorama import Fore, Style

URL = f'http://{socket.gethostbyname(socket.gethostname())}'
PASSED = f'{Fore.GREEN}PASSED{Style.RESET_ALL}'

# Generate random 10-letter string to use as a timecard id
def generate_random_string_id(length=10): 
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(10))

def post_test_timecard(id):
    json = {
        "id": id,
        "userName": "someUserName",
        "eventId": "someEventId",
        "timeIn": "someTimeIn",
        "timeOut": "someTimeOut"
    }

    return requests.post(f'{URL}/timecards', json=json)

def test_get_all_timecards_check_status_code_equals_200():
    response = requests.get(f'{URL}/timecards')
    assert response.status_code == 200
    print(f'Timecards - GET ALL 200... {PASSED}')

def test_post_and_remove_timecard():
    id = generate_random_string_id()

    response = post_test_timecard(id)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['id'] == id
    print(f'Timecards - POST 201... {PASSED}')

    response = requests.delete(f'{URL}/timecard/{id}')
    assert response.status_code == 204

    print(f'Timecard - DELETE 204... {PASSED}')

def test_get_timecard_check_status_code_equals_200():
    id = generate_random_string_id()

    response = post_test_timecard(id)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['id'] == id
    
    response = requests.get(f'{URL}/timecard/{id}')
    assert response.status_code == 200

    response = requests.delete(f'{URL}/timecard/{id}')
    assert response.status_code == 204
    
    print(f'Timecard - GET 200... {PASSED}')

def test_get_timecard_check_status_code_equals_404():
    response = requests.get(f'{URL}/timecard/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Timecard - GET 404... {PASSED}')

def test_delete_timecard_check_status_code_equals_404():
    response = requests.delete(f'{URL}/timecard/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Timecard - DELETE 404... {PASSED}')

def test_patch_timecard_check_status_code_equals_404():
    response = requests.patch(f'{URL}/timecard/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Timecard - PATCH 404... {PASSED}')

def test_patch_timecard_check_status_code_equals_200():
    id = generate_random_string_id()
    response = post_test_timecard(id)
    responseJson = response.json()

    assert responseJson['data']['userName'] == 'someUserName'
    assert responseJson['data']['timeOut'] == 'someTimeOut'

    newTimeOut = 'newTimeOut'
    patchJson = {"timeOut": newTimeOut}

    response = requests.patch(f'{URL}/timecard/{id}', json=patchJson)
    responseJson = response.json()

    assert response.status_code == 200
    assert responseJson['data']['timeOut'] == newTimeOut

    response = requests.delete(f'{URL}/timecard/{id}')
    assert response.status_code == 204

    print(f'Timecard - PATCH 200... {PASSED}')

def test_get_timecard_from_user_check_status_code_equals_200():
    print(f'Timecards/Users - GET 200... {PASSED}')

def test_get_timecard_from_user_check_status_code_equals_404():
    response = requests.get(f'{URL}/timecards/users/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Timecards/Users - GET 404... {PASSED}')

def test_get_timecard_from_event_check_status_code_equals_200():
    print(f'Timecards/Events - GET 200... {PASSED}')

def test_get_timecard_from_event_check_status_code_equals_404():
    response = requests.get(f'{URL}/timecards/events/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Timecards/Events - GET 404... {PASSED}')

def run_tests():
    print('Running timecard_db_test................')
    test_get_all_timecards_check_status_code_equals_200()
    test_post_and_remove_timecard()
    test_delete_timecard_check_status_code_equals_404()
    test_get_timecard_check_status_code_equals_200()
    test_get_timecard_check_status_code_equals_404()
    test_get_timecard_from_user_check_status_code_equals_200()
    test_get_timecard_from_user_check_status_code_equals_404()
    test_get_timecard_from_event_check_status_code_equals_200()
    test_get_timecard_from_event_check_status_code_equals_404()
    test_patch_timecard_check_status_code_equals_404()
    test_patch_timecard_check_status_code_equals_200()

run_tests()