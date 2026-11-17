$(() => {
    const addModal = new bootstrap.Modal($("#add-modal")[0]);
    const editModal = new bootstrap.Modal($("#edit-modal")[0]);
    refreshPeople();


    $("#add").on('click', function () {
        $("#firstName").val('');
        $("#lastName").val('');
        $("#age").val('');
        addModal.show();
    })

    $("#save").on('click', function () {
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const age = $("#age").val();

        $.post('/home/addperson', {
            firstName: firstName,
            lastName: lastName,
            age: age
        }, function () {
            refreshPeople();
            addModal.hide();
        })
    })

    $("tbody").on('click', ".edit", function () {
        const row = $(this).closest("tr");

        const id = row.data("id");
        const firstName = row.find(".first-name").text();
        const lastName = row.find(".last-name").text();
        const age = row.find(".age").text();

        $("#edit-id").val(id);
        $("#edit-first-name").val(firstName);
        $("#edit-last-name").val(lastName);
        $("#edit-age").val(age);
        editModal.show();
    })

    $("#update").on('click', function () {
        const firstName = $("#edit-first-name").val();
        const lastName = $("#edit-last-name").val();
        const age = $("#edit-age").val();
        const id = $("#edit-id").val();

        $.post('/home/editperson', {
            id,
            firstName,
            lastName,
            age
        }, function () {
            refreshPeople();
            editModal.hide();
        })
    })

    $("tbody").on('click', ".delete", function () {
        const row = $(this).closest("tr");

        const id = row.data("id");
        console.log(id);
        $.post('/home/deleteperson', {
            id
        }, function () {
            refreshPeople();
        })
    })
    //use data-attributes for edit/delete
    function refreshPeople(cb) {
        $("tbody tr:gt(0)").remove();
        $("#spinner-row").show();

        $.get('/home/getpeople', function (people) {
            people.forEach(person => {
                $("tbody").append(`<tr data-id="${person.id}">
                <td class="first-name"">${person.firstName}</td>
                <td class="last-name">${person.lastName}</td>
                <td class="age">${person.age}</td>
                <td>
                        <button class="btn btn-primary btn-lg edit" id="edit">Edit</button>
                        <button class="btn btn-danger btn-lg delete" id="delete">Delete</button>                        
                </td>
                </tr>`)
            })

            if (cb) {
                cb();
            }

            $("#spinner-row").hide();
        })
    }
})