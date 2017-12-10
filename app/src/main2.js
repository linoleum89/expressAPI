import './styles/base.scss';

console.info('Tada! It works. Now build something awesome.');

const Promise = require('bluebird');
const request = require('superagent');

const thePromise = new Promise(function(resolve, reject) {
    resolve('promise!!');
  })
  .finally(function() {
    console.log('finally');
  });

thePromise.then((result) => {
    console.log(result);
});


request
.get('/users')
.end((err, res) => {
  // Do something
  console.log(res.body);
});

$.get('/users', (response) => {
  console.log(response);
}, "json");

$('#add').on('click', () => {
  const firstName = prompt('Set first name');
  const lastName = prompt('Set last name');
  const city = prompt('Set city');
  const state = prompt('Set state');

  if (firstName && lastName && city && state) {
    const data = {
      first_name: firstName,
      last_name: lastName,
      city: city,
      state: state
    };

    $.post('/users', data).done((result) => {
      console.log(arguments)
    }).fail(() => {
      alert('Invalid data!');
    });
  }
});