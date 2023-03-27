

const staticVMfields = ['full_name', 'emp_id', 'snet'];
tips = $(".validateTips");

// viewmodel funtion for timetable records
function TimetableSetViewModel(id, hrnest_id, title, date_from, date_to) {
    var self = this;
    self.id = ko.observable(id);
    self.hrnest_id = ko.observable(hrnest_id);
    self.title = ko.observable(title);
    self.date_from = ko.observable(date_from);
    self.date_to = ko.observable(date_to);
};
// viewmodel function of one row
function EmplTableViewModel(data, date_from, date_to) {
    var self = this;
    // Allow multiselect in row
    self.allowsel = ko.observable('Disabled')
    // Tool selection value to replace
    self.valuReplace = ko.observable();
    // Primary index for row    
    self.guid = ko.observable(data.uid);
    self.NumOfChanges = ko.observable(0);
    self.emp_id = ko.observable(data.emp_id);
    self.first_name = ko.observable(data.first_name);
    self.last_name = ko.observable(data.last_name);
    self.full_name = ko.computed(function () {
        return self.last_name() + ' ' + self.first_name()
    });
    self.position = ko.observable(data.position);
    self.wrk_description = ko.observable(data.wrk_description);
    self.wrk_group = ko.observable(data.wrk_description);
    self.wrk_leader = ko.observable(data.wrk_description);
    // Is row Visible in View model?
    self.vi = ko.observable(true);
    self.snet = ko.observable(data.snet);
    let tmt = date_from;
    // Iterate existing datatime fields with observables model
    for (tmt = date_from; tmt <= date_to; tmt.setDate(tmt.getDate() + 1)) {
        let tmp;
        let _date = formatDate(tmt);
        if (data[_date] == undefined) { tmp = ' ' } else { tmp = data[_date] };
        self[_date] = ko.observable(tmp);
        self[_date + 'old'] = tmp;
        self[_date + 'cha'] = ko.computed(function () {
            if (self[_date]() == self[_date + 'old']) {
                return 'opt' + self[_date]();
            } else {
                return 'flash';
            }
        });
        self[_date + 'vis'] = ko.computed(function () {
            if (self[_date]() == self[_date + 'old']) {
                return false;
            } else {
                return true;
            }
        });
        self[_date + 'select'] = ko.observable('false');
        self[_date + 'sel'] = function () {
            if (self.allowsel() == 'Enabled') {
                if (self[_date + 'select']() == 'false') {
                    self[_date + 'select']('true');
                } else {
                    self[_date + 'select']('false');
                }
            } else {
                if (self[_date + 'select']() == 'true') {
                    self[_date + 'select']('false');
                }
            }
        };
        self[_date + 'set'] = function () {
            if (self.allowsel() == 'Enabled' && self[_date + 'select']() == 'true') {
                self[_date](self.valuReplace());
            }
        }
        self[_date + 'bckgr'] = ko.computed(function () {
            if (self[_date + 'select']() == 'true') {
                return 'yellow'
            } else {
                let dta = new Date(_date);
                let tm = dta.toLocaleString('en', { weekday: 'short' });
                if (tm == 'Sat') {
                    return 'LightGrey';
                } else if (tm == 'Sun') {
                    return 'LightCoral';
                } else {
                    return '';
                }
            }
        })
        self[_date + 'undo'] = function () {
            if (self[_date]() != self[_date + 'old']) {
                self[_date](self[_date + 'old']);
            }
        };

    };
};
// Show Tips on form
function updateTips(t) {
    tips
        .text(t)
        .addClass("ui-state-highlight");
    setTimeout(function () {
        tips.removeClass("ui-state-highlight", 1500);
    }, 500);
};
// viewmodel ko.js function an helpers  
function EmplQueryViewModel(data) {
    var self = this;
    self.guid = ko.observable(data.guid);
    self.emp_id = ko.observable(data.emp_id);
    self.full_name = ko.observable(data.full_name);
    self.vi = ko.observable(true);
    self[data.valid_date] = ko.observable(data.state);
    self[data.valid_date + 'oldstate'] = self[data.valid_date];

    self.change = ko.computed(function () {
        if (self[data.valid_date]() == self[data.valid_date + 'oldstate']()) {
            return 'opt' + self[data.valid_date];
        } else {
            return 'flash';
        }
    });
};
// Convert String to dattime format
function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
};
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
var vModel = function (table_set) {
    var self = this;
    self.message = ko.observable(" ");
    //Current timetables record
    self.Current_timetable = ko.observable();
    
    //List of timetables
    self.TimetabList = ko.observableArray([]);
    self.Frange = ko.observable(true);
    self.VisElemnts = ko.observable('false');
    
    // List of items used in select    
    self.availableitems = ko.observableArray(['1', '2', '1n', 'n2', 'nb', 'SNET', 's', 'z', 'QC', 'Szkol', 'u', 'LD']);
    self.availablemodes = ko.observableArray(['Select single cell', 'Select chosen days in week', 'Copy from another person']);
    // Object used in selection tool by weekday
    self.chosenDays = ko.observableArray(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    self.weekday = ko.observableArray([{ WeekDay: 'Mon' }, { WeekDay: 'Tue' }, { WeekDay: 'Wed' }, { WeekDay: 'Thu' }, { WeekDay: 'Fri' }, { WeekDay: 'Sat' }, { WeekDay: 'Sun' }]);

    // Object used in selection tool / copy from another person
    self.ListOfPersons = function () {
        let tmarr = [];
        if (self.persDbview != undefined) {
            self.persDbview().forEach(item => {
                tmarr.push(item.full_name);
            });
        }
        return tmarr;
    };
    self.CopyFromPerson = ko.observable(self.ListOfPersons()[0]);

    // main data observables
    self.persDbview = ko.observableArray([]);// array of json formated db view
    self.valid_date_from = ko.observable(" "); //range of date database report
    self.valid_date_to = ko.observable(" "); //range of date database report

    // multiselect    
    self.bindSelect = ko.observable(self.availableitems()[0]);
    self.bindModes = ko.observable(self.availablemodes()[0]);
    self.multiselect = ko.observable('Disabled');

    this.multi = function () {
        if (self.multiselect() == 'Disabled') {
            self.multiselect('Enabled');
        } else {
            self.multiselect('Disabled')
        }
        self.Set_multiInBind();
    }; 
    self.Set_multiInBind = function () {
        self.persDbview().forEach(item => {
            item.allowsel(self.multiselect());
            if (self.multiselect() == 'Disabled') {
                let date_to = self.valid_date_to();
                for (let tm = self.valid_date_from(); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                    item[formatDate(tm) + 'sel']();
                }
            }
        });
    }
    self.Unselect = function () {
        this.multi();
        this.multi();
    };
    self.ReplaceItems = function () {
        self.persDbview().forEach(item => {
            item.valuReplace(self.bindSelect());
            if (self.multiselect() != 'Disabled') {
                let date_to = self.valid_date_to();
                for (let tm = self.valid_date_from(); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                    item[formatDate(tm) + 'set']();
                }
            }
        });
        this.multi();
        this.multi();
    };
    //
    //Main recordset
    self.emp_sta_refr = ko.observable(" "); // refresh date of dataset
    this.Start_refr = function () {
       
        $("#dialog-form").modal("hide"); 
        this.update_ranges();
        this.get_recrdset();
    }
    this.update_ranges = function () { 
        var timId = self.Current_timetable()
        if (self.valid_date_from() != " ") {            
            if (stringToDate(timId.date_from(), "yyyy-mm-dd", "-") < self.valid_date_from()) {
                self.valid_date_from(stringToDate(timId.date_from(), "yyyy-mm-dd", "-"));
            };
        } else {
            self.valid_date_from(stringToDate(timId.date_from(), "yyyy-mm-dd", "-"));
        }
        if (self.valid_date_to() != " ") {
            if (stringToDate(timId.date_to(), "yyyy-mm-dd", "-") > self.valid_date_to()) {
                self.valid_date_to(stringToDate(timId.date_to(), "yyyy-mm-dd", "-"));
            };
        } else {
            self.valid_date_to(stringToDate(timId.date_to(), "yyyy-mm-dd", "-"));
        }  
    };    
    // Get timetables record
    this.get_timetables = function(){
        $.ajax({
            method: "GET",
            url: "/timetableGetALL",
            success: function (data) {
                self.TimetabList($.map(data.data, function (item) {                    
                    return new TimetableSetViewModel(item.id, item.hrnest_id, item.title, item.date_from, item.date_to);
                }));             
            }
        });
    }
    //Open modal form to chose date_from and date_to 
    this.get_dat = function() {
        $("#dialog-form").modal("show"); 
    }
    // Get Ajax content an apply data to ko bindings
    this.get_recrdset = function() {
        let Dorefr = true;
        if (self.Count_Changes() > 0) {
            if (!confirm('Are you sure you want to refresh data? \n Some changes are not saved => ' + self.Count_Changes() + ' items...')) {
                Dorefr = false;
            }
        };
        if (Dorefr) {
            self.message("Establish Connection")
            $("#dialog-message").dialog({
                modal: true,
            });
            var timId = self.Current_timetable()
            var strA=''
            if (self.Frange()==true) {
                strA = '&valid_from=' + formatDate(self.valid_date_from()) + '&valid_to=' + formatDate(self.valid_date_to());
            }
            $.ajax({
                method: "GET",
                url: "/user?UsersGetALL&UsersTimetable=" + timId.id() & strA ,
                success: function (data, textStatus, xhr) {
                    updateTips("Get data via internet")
                    if (xhr.status == 200) {
                        let d = new Date();
                        let n = d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                        self.emp_sta_refr(n);
                        self.Set_multiInBind();
                        //create a new instance of Database fields
                        updateTips("Converting data")                        
                        let underlining_array = self.persDbview();
                        updateTips("Apply data to view model")                        
                        $.map(data.data, function (item) {
                            let date_to = stringToDate(data.date_from, 'yyyy-mm-dd', '-');
                            let date_from = stringToDate(data.date_to, 'yyyy-mm-dd', '-');
                            underlining_array.push(new EmplTableViewModel(item, date_from, date_to));
                        });
                        ko.tasks.runEarly();
                        self.persDbview.valueHasMutated();
                        $("#load").show();
                        $("#dialog-message").dialog('close');
                    } else {
                        $("#dialog-message").dialog('close');

                        self.message('Err code : ' + xhr.status + ' => ' + textStatus)
                        $("#dialog-message").dialog({
                            modal: true,
                            buttons: {
                                "Close": function () {
                                    $(this).dialog("close");
                                    get_dat();
                                }
                            }
                        });
                        updateTips('Raising error')
                    }

                }
            });
        }
    };

    // Cont changes in dataset
    self.Count_Changes = ko.computed(function () {
        let cnt = 0;
        self.persDbview().forEach(item => {
            let date_to = self.valid_date_to();
            for (let tm = self.valid_date_from(); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                if (item[formatDate(tm) + 'cha']() == 'flash') {
                    cnt = cnt + 1;
                }
            }
        });
        return cnt;
    });


    // List o avialiable items in fotter / header of table
    self.fottSelected = ko.observable('Week Day');
    self.headerSelected = ko.observable('Full date')
    self.fott_view = ko.observableArray(['Month name', 'Number Day', 'Week Day', 'Full date']);

    /// True list of dataset columns used in view table fotter / header of table
    self.table_view_func = ko.computed(function () {
        if (self.valid_date_to() == " " || self.valid_date_from() == " ") {
            return [];
        } else {
            let props = [];
            props.push(...staticVMfields);
            let date_to = self.valid_date_to();
            for (let tm = self.valid_date_from(); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                props.push(formatDate(tm));
            }
            return props;
        }
    });
    self.Month_Values_fields = ko.computed(function () {
        let listoftxtflds = staticVMfields.join(','); // text fields in view model
        if (self.table_view_func().length === 0)
            return [];
        let props = [];
        let obj = self.table_view_func();
        let max = 0;
        let tmp = {};
        for (let name in obj) {
            if (obj[name] != undefined) {
                if (obj[name] != 'vi') {
                    if (obj[name].indexOf('old') == -1 && obj[name].indexOf('cha') == -1 && obj[name].indexOf('vis') == -1) {
                        let tm = listoftxtflds.indexOf(obj[name]);
                        if (tm == -1) {
                            let dta = new Date(obj[name]);
                            tmp[obj[name]] = dta.toLocaleString('en', { month: 'short' });
                        } else {
                            if (obj[name] == 'full_name') {
                                tmp[obj[name]] = 'Month';
                            }
                        }
                    }
                }
            }
        }
        props.push(tmp);
        return props
    });
    self.day_Values_fields = ko.computed(function () {
        let listoftxtflds = staticVMfields.join(','); // text fields in view model
        if (self.table_view_func().length === 0)
            return [];
        let props = [];
        let obj = self.table_view_func();
        let max = 0;
        let tmp = {};
        for (let name in obj) {
            if (obj[name] != undefined) {
                if (obj[name] != 'vi') {
                    if (obj[name].indexOf('old') == -1 && obj[name].indexOf('cha') == -1 && obj[name].indexOf('vis') == -1) {
                        let tm = listoftxtflds.indexOf(obj[name]);
                        if (tm == -1) {
                            let dta = new Date(obj[name]);
                            tmp[obj[name]] = dta.getDate()
                        } else {
                            if (obj[name] == 'full_name') {
                                tmp[obj[name]] = 'Day of the month';
                            }
                        }
                    }
                }
            }
        }
        props.push(tmp);
        return props
    });
    self.Weekday_Values_fields = ko.computed(function () {
        let listoftxtflds = staticVMfields.join(','); // text fields in view model
        if (self.table_view_func().length === 0)
            return [];
        let props = [];
        let obj = self.table_view_func();
        let max = 0;
        let tmp = {};
        for (let name in obj) {
            if (obj[name] != undefined) {
                if (obj[name] != 'vi') {
                    if (obj[name].indexOf('old') == -1 && obj[name].indexOf('cha') == -1 && obj[name].indexOf('vis') == -1) {
                        let tm = listoftxtflds.indexOf(obj[name]);
                        if (tm == -1) {
                            let dta = new Date(obj[name]);
                            tmp[obj[name]] = dta.toLocaleString('en', { weekday: 'short' });
                        } else {
                            if (obj[name] == 'full_name') {
                                tmp[obj[name]] = 'Day of the week';
                            }
                        }
                    }
                }
            }
        }
        props.push(tmp);
        return props;
    });

    // sorting       
    this.sortKeyB = ko.observable('');
    self.filterArr = ko.observableArray([]);
    this.sortByKeyA = function (a, b) {
        a = a[self.sortKeyUnwrappedA];
        b = b[self.sortKeyUnwrappedA];
        return a === b ? 0 : (a < b ? self.sortOrderNegativeA : self.sortOrderA);
    };
    self.filtered = function (field) {
        let k = 101;
        for (let i = 0, ii = self.filterArr().length; i < ii; i++) {
            if (self.filterArr()[i].dta == self.dt()) {
                if (self.filterArr()[i].col == field) {
                    k = i;
                    return 'true';
                }
            }
        }
        if (k == 101) {
            return 'false';
        }
    };
    // Initialize    
    this.get_timetables();
    
};
var viewModel;
document.addEventListener('DOMContentLoaded', function () {
    // set instance o viwe Model
    ko.options.deferUpdates = true;
    viewModel = new vModel;
    ko.applyBindings(viewModel);

    viewModel.get_dat();
});

