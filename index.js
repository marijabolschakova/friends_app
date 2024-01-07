"use strict";

document.addEventListener("DOMContentLoaded", function() {
    fetch(`https://randomuser.me/api/?results=25`)
        .then((response) => response.json())
        .then(({ results }) => getData(results))
        .catch((err) => console.error(err));
});

const friendsContent = document.querySelector(".friends-content");

const getData = function(data) {
    const friendsApp = new FriendsList(data);
    friendsApp.initializeFriendsList();
};

class User {
    constructor(user) {
        this.firstName = user.name.first;
        this.lastName = user.name.last;
        this.picture = user.picture;
        this.age = user.dob.age;
        this.gender = user.gender;
        this.phone = user.phone;
        this.country = user.location.country;
    }
}

class FriendsList {
    constructor(users) {
        this.users = users.map(user => new User(user));

        this.sortedUsers = [...this.users];
    }

    initializeFriendsList() {
        this.createFriendsList();
        this.handleFilters();
    }

    createFriendsList() {
        friendsContent.innerHTML = "";
        let friendsList = "";

        this.sortedUsers.map((user) => {
            friendsList += `<div class="friends-block">
      <p class="friends-block__text-name">${user.firstName} ${user.lastName}</p>
      <img width="150" height="150" class="friends-block__img" src="${user.picture.large}" alt="${user.firstName}" />
      <div class="friends-block__wrap">
        <p class="friends-block__text"><span></span><b>Age:</b></span> ${user.age}</p>
        <p class="friends-block__text"><span></span><b>Gender:</b></span> ${user.gender}</p>
        <p class="friends-block__text"><span></span><b>Phone number:</b></span> ${user.phone}</p>
        <p class="friends-block__text"><span></span><b>Country:</b></span> ${user.country}</p>
      </div>
      </div>`;
        }).join("");

        friendsContent.innerHTML = friendsList;
    }

    handleFilters() {
        document.querySelector(".friends-list__navigation").addEventListener('click', event => {
            const attributeButton = event.target.getAttribute("data-name");

            const dataNameKey = {
                'name_asc': this.sortByNameAsc.bind(this),
                'name_desc': this.sortByNameDesc.bind(this),
                'age_asc': this.sortByAgeAsc.bind(this),
                'age_desc': this.sortByAgeDesc.bind(this),
                'female': this.sortByGenderAsc.bind(this),
                'male': this.sortByGenderDesc.bind(this),
                'search_input-button': this.searchUsers.bind(this),
                'clear': this.clearAllFilters.bind(this),
            }

            if (dataNameKey[attributeButton]) {
                dataNameKey[attributeButton]();
            }

            if (Object.keys(dataNameKey).includes(attributeButton)) {
                this.createFriendsList();
            }
        });
    }

    sortByNameAsc() {
        this.sortedUsers = [...this.sortedUsers].sort((a, b) => a.firstName.localeCompare(b.firstName));
    }

    sortByNameDesc() {
        this.sortedUsers = [...this.sortedUsers].sort((a, b) => b.firstName.localeCompare(a.firstName));
    }

    sortByAgeAsc() {
        this.sortedUsers = [...this.sortedUsers].sort((a, b) => a.age - b.age);
    }

    sortByAgeDesc() {
        this.sortedUsers = [...this.sortedUsers].sort((a, b) => b.age - a.age);
    }

    sortByGenderAsc() {
        this.sortedUsers = [...this.sortedUsers].sort((a, b) => a.gender.localeCompare(b.gender));
    }

    sortByGenderDesc() {
        this.sortedUsers = [...this.sortedUsers].sort((a, b) => b.gender.localeCompare(a.gender));
    }

    searchUsers() {
        const inputValue = document.querySelector(".friends-list__search-input").value;
        this.sortedUsers = this.users.filter((user) => user.firstName.toLowerCase().includes(inputValue.toLowerCase()));

        this.createFriendsList();
    }

    clearAllFilters() {
        let searchInput = document.querySelector(".friends-list__search-input");
        if (searchInput.value.length) {
            searchInput.value = "";
        }

        this.sortedUsers = this.users;
    }
}
