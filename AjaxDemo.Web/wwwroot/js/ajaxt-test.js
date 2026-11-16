$(() => {
    $(".btn-dark").on('click', function () {

        $.get('/home/getpeople', function (people) {
            console.log(people[0].firstName);
        });

        console.log('foobar');

    });
})