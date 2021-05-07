const baseUrl = require("./baseUrl.js");
const XMLHttpRequest = require('../example/node_modules/xmlhttprequest').XMLHttpRequest;
const scheduleDataAccessor = require('./scheduleDataAccessor.js');

const users_url = baseUrl + '/users';
const user_url = baseUrl + '/user/';

const POST = 'POST';
const PATCH = 'PATCH';
const GET = 'GET';
const DELETE = 'DELETE';
const FIRST_NAME = 'fName';
const LAST_NAME = 'lName';
const GENDER = 'gender';
const BIRTHDAY = 'birthday';
const PERMISSION = 'permission';
const TAGS = 'tags';
const SALT = 'salt';
const HASH = 'hash';
const NOT_FOUND = 404;

class UserDataAccessor {
    #updateUserAttribute(user_name, attribute_key, new_attribute_value) {
        const url = user_url + user_name;
        const userObj = {};
        userObj[attribute_key] = new_attribute_value;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(PATCH, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(userObj));

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // User not found
        }

        return xmlhttp.responseText;
    }

    createUser(user_name, first_name, last_name, permission, gender, birthday, tags, salt, hash) {
        // Create a user
        const url = users_url;
        const userObj = {
            "userName": user_name,
            "fName": first_name,
            "lName": last_name,
            "permission": permission,
            "gender": gender,
            "birthday": birthday,
            "tags": tags,
            "salt": salt,
            "hash": hash
        };

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(POST, url, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(userObj));

        if (xmlhttp.status != 201) {
            throw new Error("User creation failed!");
        }

        // Create a schedule for the user
        const s = new scheduleDataAccessor();
        s.createSchedule(user_name, []);

        return xmlhttp.responseText;
    }

    getUser(user_name) {
        const url = user_url + user_name;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // User not found
        }

        return xmlhttp.responseText;
    }

    getAllUsers() {
        const url = users_url;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(GET, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 200) {
            throw NOT_FOUND; // User not found
        }

        return xmlhttp.responseText;
    }

    getAllChildren() {
        var users = JSON.parse(this.getAllUsers()).data;
        var children = [];

        users.forEach(user => {
            if (user['permission'] == 'child') {
                children.push(user);
            }
        });

        return children;
    }

    getAllStaff() {
        var users = JSON.parse(this.getAllUsers()).data;
        var staff = [];

        users.forEach(user => {
            if (['lowStaff', 'upStaff', 'sysOverseer'].includes(user['permission'])) {
                staff.push(user);
            }
        });

        return staff;
    }

    // More efficient than the previous two methods if you need children AND staff
    // because it only calls the API once
    getAllChildrenAndStaff() {
        var users = JSON.parse(this.getAllUsers()).data;
        var staff = [];
        var children = [];

        users.forEach(user => {
            if (['lowStaff', 'upStaff', 'sysOverseer'].includes(user['permission'])) {
                staff.push(user);
            } else {
                children.push(user)
            }
        })

        return {
            children: children,
            staff: staff
        };
    }

    getUserTags(user_name) {
        const get_response = JSON.parse(this.getUser(user_name));
        return get_response.data.tags;
    }

    getUserBirthday(user_name) {
        const get_response = JSON.parse(this.getUser(user_name));
        return get_response.data.birthday;
    }

    getUserGender(user_name) {
        const get_response = JSON.parse(this.getUser(user_name));
        return get_response.data.gender;
    }

    deleteUser(user_name) {
        const url = user_url + user_name;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.open(DELETE, url, false);
        xmlhttp.send();

        if (xmlhttp.status != 204) {
            throw NOT_FOUND; // User not found
        }
    }

    updateFirstName(user_name, new_first_name) {
        return this.#updateUserAttribute(user_name, FIRST_NAME, new_first_name);
    }

    updateLastName(user_name, new_last_name) {
        return this.#updateUserAttribute(user_name, LAST_NAME, new_last_name);
    }

    updatePermission(user_name, new_permission) {
        return this.#updateUserAttribute(user_name, PERMISSION, new_permission);
    }

    updateGender(user_name, new_gender) {
        return this.#updateUserAttribute(user_name, GENDER, new_gender);
    }

    updateBirthday(user_name, new_birthday) {
        return this.#updateUserAttribute(user_name, BIRTHDAY, new_birthday);
    }

    addTag(user_name, new_tag) {
        var tags = this.getUserTags(user_name);

        if (tags != null) {
            tags.push(new_tag);
        } else {
            tags = [new_tag];
        }

        return this.updateTags(user_name, tags);
    }

    removeTag(user_name, tag_to_remove) {
        var tags = this.getUserTags(user_name);

        if (tags != null && tags.includes(tag_to_remove)) {
            tags.splice(tags.indexOf(tag_to_remove), 1);
            return this.updateTags(user_name, tags);
        }
        return this.getUser(user_name);
    }

    updateTags(user_name, new_tags) {
        return this.#updateUserAttribute(user_name, TAGS, new_tags);
    }

    updateSalt(user_name, new_salt) {
        return this.#updateUserAttribute(user_name, SALT, new_salt);
    }

    updateHash(user_name, new_hash) {
        return this.#updateUserAttribute(user_name, HASH, new_hash);
    }
}

module.exports = UserDataAccessor;
