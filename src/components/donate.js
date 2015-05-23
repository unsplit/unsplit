var $donate = {
        settings: {
            freeamount: 1,
            url: 'https://donate.shelter.org.uk/b?',
            cid: 1
        },
        go: function (init, input) {
            var amount = parseInt(input, 10) * 100,
                url = this.settings.url + "cid=" + this.settings.cid + "&freeamount=" + this.settings.freeamount + "&amount=";

            if (input === "" || parseInt(input, 10) <= 0) {
              window.location.href = url + init * 100;
            } else {
              window.location.href = url + amount;
            }
             return this;
        },
        ga: function (category, label, value) {

            //ga('send', 'event', category, 'click', label, value);
            console.log("send", "event", category, "click", label, value);
            return this;
        }
};
