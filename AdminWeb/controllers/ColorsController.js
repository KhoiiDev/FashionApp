
const translate = require('google-translate-api');
const controller = {
    getColors: async (req, res) => {

        translate('Xin chào', { to: 'en' }).then(res => {
            console.log(res.text); // Output: "Hello"
        }).catch(err => {
            console.error(err);
        });
    },
}

module.exports = controller;