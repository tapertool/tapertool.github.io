(function(w){
    var doc = w.document;

    function validate(e){
        var re = new RegExp(this.dataset['pattern']);

        if(re.test(this.value)){
            this.classList.remove('is-invalid');
        } else {
            this.classList.add('is-invalid');
        }

    }

    function createRow(date, dose){
        var r = doc.createElement('tr');
        r.innerHTML = '<td>'+ date.toLocaleDateString('sv') +'</td><td>'+ Math.round(dose * 100) / 100 +'</td>';
        return r;
    }

    function calc(ev){
        ev.preventDefault();
        var startdatum = new Date(Date.parse(doc.getElementById('startdatum').value));
        var startdos = parseFloat(doc.getElementById('startdos').value);
        var reduktion = parseFloat(doc.getElementById('reduktion').value) / 100.0;
        var antal_dagar = parseFloat(doc.getElementById('dagar').value);
        var slutdos = parseFloat(doc.getElementById('slutdos').value);

        var resultsElm = doc.getElementById('results');
        resultsElm.innerHTML = '';

        for(var i = 0; i < 3650; i++){
            var dose = startdos * Math.pow(1 - reduktion, i + 1);
            var date = new Date();

            if(dose < slutdos){
                break;
            }

            date.setDate(startdatum.getDate() + antal_dagar * i);

            resultsElm.appendChild(createRow(date, dose));

        }

        return false;
    }

    w.onload = function(){
        [].slice.call(doc.getElementsByTagName('input')).forEach(function(e){
            e.onchange = validate;
        });
        doc.getElementById('berakna').onclick = calc;
    };

})(window);
