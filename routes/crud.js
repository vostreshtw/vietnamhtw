const display = require("#display");
const form = require("#form");
const dishUserInput = require("#dishUserInput");
const preisUserInput = require("#preisUserInput");
const message = require("#message");
const router = express.Router();
message.hide();

const displayMessage = (flag, msg) => {
    if (flag) {
        message.removeClass('alert-danger');
        message.addClass('alert-success');
        message.html(msg);
        message.show();

    } else {
        message.removeClass('alert-success');
        message.addClass('alert-danger');
        message.html(msg);
        message.show();
    }
}

const getdishes = () => {
    fetch('/getdishes', {
        method: "get"
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        displayDishes(data);
    });
}

getdishes();

const resetDishesInput = () => {
    dishUserInput.val('');
    preisUserInput.val('');
}

const editDish = (dish, dishID, editID) => {
    let editBtn = $(`#${editID}`);
    editBtn.click(() => {
        fetch(`/${dish._id}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                Name: dishUserInput.val(),
                preis: preisUserInput.val()
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.ok == 1) {
                let dishName = $(`#${dishID}`);
                dishName.html(data.value.Name);

                let dishPreis = $(`#${dish.preis}`);
                dishPreis.html(data.value.preis);
                resetDishesInput();

            }
        });
    });
}

const deleteDish = (dish, listItemID, deleteID) => {
    let deleteBtn = $(`#${deleteID}`);
    deleteBtn.click(() => {
        fetch(`/${dish._id}`, {
            method: "delete"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.ok == 1) {
                $
                    (`#${listItemID}`).remove();
            }

        });
    })
}







const buildIDS = (dish) => {
    return {
        editID: "edit_" + dish._id,
        deleteID: "delete_" + dish._id,
        listItemID: "listItem_" + dish._id,
        dishID: "dish_" + dish._id
    }
}


const buildTemplate = (dish, ids) => {
    return `<li class = "list-group-item" id ="${ids.listItemID}"> 
                    

                    <h4 class = "btn" id = "${ids.dishID}"> ${dish.Name} </h4>  
                    <h4 class = "btn" id = "${dish.preis}"> ${dish.preis} </h4>  
                
                    <button type="button" class="btn btn-secondary" id="${ids.editID}">Edit</button>
                    <button type="button" class="btn btn-danger" id="${ids.deleteID}">Delete</button>
                    
                    </li>`;
}

const displayDishes = (data) => {
    data.forEach((dish) => {
        let ids = buildIDS(dish);
        display.append(buildTemplate(dish, ids));
        editDish(dish, ids.dishID, ids.editID);
        deleteDish(dish, ids.listItemID, ids.deleteID);

    });
}

form.submit((e) => {
    e.preventDefault();
    fetch('/', {
        method: 'post',
        body: JSON.stringify({
            Name: dishUserInput.val(),
            preis: preisUserInput.val()
        }),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (!data.error) {
            if (data.result.ok == 1 && data.result.n == 1) {
                let ids = buildIDS(data.document);
                display.append(buildTemplate(data.document, ids));
                editDish(data.document, ids.dishID, ids.editID);
                deleteDish(data.document, ids.listItemID, ids.deleteID);
                displayMessage(true, data.msg);

            }
        } else {

            displayMessage(false, data.error.message);
            resetDishesInput();
        }


    });
});