import requests
import socket
import json
import random
import string
from colorama import Fore, Style

URL = f'http://{socket.gethostbyname(socket.gethostname())}'
PASSED = f'{Fore.GREEN}PASSED{Style.RESET_ALL}'

# Generate random 10-letter string to use as an event id
def generate_random_string_id(length=10): 
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(10))

def post_test_event(id):
    json = {
        "id": id,
        "name": "someName",
        "description": "someDescription",
        "category": "someCategory",
        "startTime": "someTime",
        "endTime": "someTime",
        "location": "someLocation"
    }

    return requests.post(f'{URL}/events', json=json)

def test_get_all_events_check_status_code_equals_200():
    response = requests.get(f'{URL}/events')
    assert response.status_code == 200
    print(f'Events - GET ALL 200... {PASSED}')

def test_post_and_remove_event():
    id = generate_random_string_id()

    response = post_test_event(id)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['id'] == id
    print(f'Events - POST 201... {PASSED}')

    response = requests.delete(f'{URL}/event/{id}')
    assert response.status_code == 204

    print(f'Event - DELETE 204... {PASSED}')

def test_get_event_check_status_code_equals_200():
    id = generate_random_string_id()

    response = post_test_event(id)
    response_body = response.json()

    assert response.status_code == 201
    assert response_body['data']['id'] == id
    
    response = requests.get(f'{URL}/event/{id}')
    assert response.status_code == 200

    response = requests.delete(f'{URL}/event/{id}')
    assert response.status_code == 204
    
    print(f'Event - GET 200... {PASSED}')

def test_get_event_check_status_code_equals_404():
    response = requests.get(f'{URL}/event/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Event - GET 404... {PASSED}')

def test_delete_event_check_status_code_equals_404():
    response = requests.delete(f'{URL}/event/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Event - DELETE 404... {PASSED}')

def test_patch_event_check_status_code_equals_404():
    response = requests.patch(f'{URL}/event/{generate_random_string_id(length=30)}')
    assert response.status_code == 404
    print(f'Event - PATCH 404... {PASSED}')

def test_patch_event_check_status_code_equals_200():
    id = generate_random_string_id()
    response = post_test_event(id)
    responseJson = response.json()

    assert responseJson['data']['name'] == 'someName'

    newName = 'newName'
    patchJson = {"name": newName}

    response = requests.patch(f'{URL}/event/{id}', json=patchJson)
    responseJson = response.json()

    assert response.status_code == 200
    assert responseJson['data']['name'] == newName

    response = requests.delete(f'{URL}/event/{id}')
    assert response.status_code == 204

    print(f'Event - PATCH 200... {PASSED}')

def run_tests():
    print('Running event_db_test................')
    test_get_all_events_check_status_code_equals_200()
    test_post_and_remove_event()
    test_delete_event_check_status_code_equals_404()
    test_get_event_check_status_code_equals_200()
    test_get_event_check_status_code_equals_404()
    test_patch_event_check_status_code_equals_404()
    test_patch_event_check_status_code_equals_200()

run_tests()