function donate(page) {

  document.onclick = function (e) {
    if (e.target.nodeName === "BUTTON") {

        var basic = e.target.dataset.donationDefault,
            value = e.path[1].childNodes[3].value,
            ga = JSON.parse(e.path[1].dataset.donationGa);

        if (basic && ga) {
            $donate.settings.cid = parseInt(page);
            $donate.ga(ga.category, ga.label).go(basic, value);
        }
    }
  };

}
