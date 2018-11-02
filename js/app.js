
var app = new Vue({
    el: '#app',
    data: {
        chosenPreset: null,
        form: {
            startDate: '',
            orgDose: '',
            unit: '',
            reduction: '',
            holdDays: '',
            quitBelow: '',
        },
        form_controls: [
            [
                {
                    label: 'Startdatum:',
                    type: 'date',
                    name: 'startDate',
                    errors: [],
                },
                {
                    label: 'Nuvarande dos:',
                    type: 'text',
                    name: 'orgDose'
                },
                {
                    label: 'Mängdenhet:',
                    type: 'select',
                    name: 'unit',
                    options: [
                        {label: 'mg', value:'mg'},
                        {label: 'ml', value:'ml'},
                        {label: 'st', value:'st'},
                    ]
                },
            ],
            [
                {
                    label: 'Minskning i procent:',
                    type: 'text',
                    name: 'reduction'
                },
                {
                    label: 'Dagar per steg:',
                    type: 'text',
                    name: 'holdDays',
                },
                {
                    label: 'Sluta när dosen är under:',
                    type: 'text',
                    name: 'quitBelow'
                },
            ]
        ],
        presets:[
            {name: 'Diazepam', unit: 'mg', doses: [2, 5, 10]},
            {name: 'Duloxetin', unit: 'mg', doses: [30, 60]},
            {name: 'Escitalopram', unit: 'mg', doses: [5, 10, 15, 20]},
            {name: 'Gabapentin', unit: 'mg', doses: [100, 300, 400]},
            {name: 'Imovane', unit: 'mg', doses: [5, 7.5]},
            {name: 'Oxascand', unit: 'mg', doses: [5, 10, 15, 25]},
            {name: 'Pregabalin', unit: 'mg', doses: [50, 100, 200, 300]},
            {name: 'Sertralin', unit: 'mg', doses: [25, 50, 100]},
            {name: 'Venlafaxin', unit: 'mg', doses: [37.5, 75, 150]},
            {name: 'Zolpidem', unit: 'mg', doses: [5, 10]}
        ]
    },
    filters:{
        formatDate: function(d){
            return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        },
        rounded: function(v){
            return Math.round(v * 100) / 100;
        }
    },
    computed:{
        presetList: function(){
            var result = [];
            var reductionRates = [5, 10];

            this.presets.forEach(function(p){
                p.doses.forEach(function(d){
                    reductionRates.forEach(function(rr){
                        result.push({ name: p.name, unit: p.unit, dose: d, reduction: rr });
                    });
                });
            });

            return result;
        },
        result: function(){
            var res = [];
            var startDate = new Date(this.form['startDate']);
            var orgDose = new Number(this.form['orgDose']);
            var unit = new Number(this.form['unit']);
            var reduction = new Number(this.form['reduction']);
            var holdDays = new Number(this.form['holdDays']);
            var quitBelow = new Number(this.form['quitBelow']);

            if(!isNaN(startDate) && orgDose > 0 && unit != null && reduction > 0 && holdDays > 0 && quitBelow > 0){
                var currentDose = orgDose;
                var currentDate = new Date(startDate);
                var step = 1;

                while(currentDose > quitBelow){
                    currentDose = orgDose * Math.pow((1.0 - reduction / 100), step);
                    step = step + 1;
    
                    res.push({dose: currentDose, date: currentDate});

                    var tempDate = new Date(currentDate);
                    tempDate.setDate(tempDate.getDate() + holdDays);
                    currentDate = tempDate;
                }
            }

            return res;
        }
    },
    methods:{
        getControlByName: function(name){
            for(var rowIndex = 0; rowIndex < this.form_controls.length; rowIndex++){
                var row = this.form_controls[rowIndex];

                for(var ctrlIndex = 0; ctrlIndex < row.length; ctrlIndex++){
                    if(row[ctrlIndex].name == name){
                        return row[ctrlIndex];
                    }
                }
            }

            return null;
        },
        formValChanged: function(e){
            var ctrl = this.getControlByName(e.target.name);
            var self = this;
            var errors = [];

            if(ctrl.validators){
                ctrl.validators.forEach(function(validator){
                    errors.push(self[validator](e, ctrl));
                });
            }

            ctrl.errors = errors;
        },
        testValidator: function(){
            return "not valid";
        },
        presetSelect: function(){
            console.log("asdas");
            this.form['unit'] = this.chosenPreset.unit;
            this.form['reduction'] = this.chosenPreset.reduction;
            this.form['orgDose'] = this.chosenPreset.dose;
            this.form['holdDays'] = 28;
            this.form['quitBelow'] = this.chosenPreset.dose / 100;
        }
    }
})