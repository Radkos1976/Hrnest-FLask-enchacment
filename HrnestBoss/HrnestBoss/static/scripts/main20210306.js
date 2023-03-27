'use strict'
const staticVMfields = ['full_name', 'emp_id', 'snet'];
var Global_sendet = [];
// viewmodel funtion for timetable records
function TimetableSetViewModel(id, hrnest_id, title, date_from, date_to) {
    var self = this;
    self.id = ko.observable(id);
    self.hrnest_id = ko.observable(hrnest_id);
    self.title = ko.observable(title);
    self.date_from = ko.observable(date_from);
    self.date_to = ko.observable(date_to);
};
// View model for columns DateTime type and array of Selection TOOL
function Table_rows_Selection(data) {
    var self = this;
    self.Type = 'Day';
    self.Date_Value = stringToDate(formatDate(data),'yyyy-mm-dd','-');
    self.Month_name =data.toLocaleString('en', { month: 'short' });
    self.Number_Day = data.getDate();
    self.Week_Day = ko.observable( data.toLocaleString('en', { weekday: 'short' }));
    self.Full_date = formatDate(data);
    self.isoWeek = data.getWeekYear().toString() + data.getWeek().toString() ;
    self.Sel_guid_day = ko.observableArray([]);
    self.bckgr = ko.pureComputed( function () {
        if (self.Week_Day() == 'Sat') {
            return 'LightGrey';
        } else if (self.Week_Day() == 'Sun') {
            return 'LightCoral';
        } else {
            return '';
        }        
    });    
};
// Const Fields and list
function Table_rows_const_fields(data) {
    var self = this;
    self.Type = 'Field';
    self.Date_Value = data;
    self.Month_name = data;
    self.Number_Day = data;
    self.Week_Day = data;
    self.Full_date = data;
    self.isoWeek = data;
    self.Sel_guid_day = ko.observableArray([]);
    self.bckgr = ko.pureComputed(function () {
        return '';
    });
};
// viewmodel function of one row
function EmplTableViewModel(data, date_from, date_to) {
    var self = this;
    // Primary index for row    
    self.guid = data.uid;
    self.emp_id = data.emp_id;
    self.full_name = data.full_name;
    if (data.default_wrkgroup != null) { self.default_wrkgroup = data.default_wrkgroup; }
    self.id = data.id;
    if (data.position != null) { self.position = data.position; }
    if (data.shift_dta != '') { self.shift_dta = data.shift_dta; }
    if (data.wrk_description != '') { self.wrk_description = data.wrk_description; }
    if (data.wrk_group != '') { self.wrk_group = data.wrk_group; }
    if (data.wrk_leader != '') { self.wrk_leader = data.wrk_leader;}
    // Is row Visible in View model?
    self.vi = ko.observable(true);
    if (data.snet != null) { self.snet = data.snet; }
    let tmt = date_from;
    // Iterate existing datatime fields with observables model
    for (tmt = date_from; tmt <= date_to; tmt.setDate(tmt.getDate() + 1)) {
        let tmp;
        let _date = formatDate(tmt);
        if (data[_date] == undefined) { tmp = '' } else { tmp = data[_date] };
        self[_date] = ko.observable(tmp);
        self[_date + 'old'] = tmp;
    };
};
// Convert String to datetime format
function stringToDate(_date,_format,_delimiter){
        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
};
// Convert Date to 'yyyy-mm-dd' string format
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
//****************************************************************
// Main KO ViewModel
var vModel = function (){    
    var self = this;
    self.message = ko.observable(" ");
    self.VisElemnts=ko.observable('false');
    // List of items used in select in table and selection tool   
    self.availableitems=ko.observableArray(['','1','2','1n','n2','nb','SNET','s','z','QC','Szkol','u','LD']);  
    //*************************************************************
    // Main data observables
    // Main array of json formated db view
    self.persDbview = ko.observableArray([]);
    //String of range ALL of date database report
    self.valid_date_from = ko.observable(" ");
    //String of range ALL of date database report
    self.valid_date_to = ko.observable(" ");
    // Date of refresh Main dataset
    self.emp_sta_refr = ko.observable(" ");
    self.days_in_ALL = ko.observableArray([]);
    //Array of fields in ALL column headers
    self.Table_Name_Fields = ko.observableArray([]);
    //Undo values in dataset ALL
    this.undo=function(date, guid) {
        if (date != undefined) {
             
            var exist = self.persDbview.indexOf(
                ko.utils.arrayFirst(self.persDbview(), function (item) {
                    return item.guid == guid;
                }));
            self.persDbview()[exist][date](self.persDbview()[exist][date + 'old']);
        }
    }
    //Get color of selected cells filter in all datasets
    this.bckgr = function (date) {
        if (date != undefined) {
            var exist = ko.utils.arrayFirst(self.Table_Name_Fields(), function (item) {
                return item.Full_date == date;
            });
            return exist.bckgr;
        }
    }
    // Is Cell was selected by multi TOLL?
    self.selected = function (date, guid) {
        if (date != undefined) {
            var exist = ko.utils.arrayFirst(self.Table_Name_Fields(), function (item) {
                return item.Full_date == date & item.Sel_guid_day.indexOf(guid) > -1;
            });
            if (exist) {
                return true
            } else {
                return false
            }
        }
    }
    //Create observable array of binding AlL column with information about selections
    this.Create_presets_for_column_names = function () {
        if (self.valid_date_to() == " " || self.valid_date_from() == " ") {
            console.log('Error: no data Range of Dates not set');
        } else {
            let underlining_array = self.Table_Name_Fields();
            let props = [];
            props.push(...staticVMfields);
            props.forEach(item => {
                underlining_array.push(new Table_rows_const_fields(item))
            })
            props = [];
            let date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
            for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                underlining_array.push(new Table_rows_Selection(tm));
            }
             
            self.Table_Name_Fields.valueHasMutated();
        }
    };
    //Current timetables record
    self.Current_timetable = ko.observable();
    //List of timetables
    self.TimetabList = ko.observableArray([]);
    //Ajax call on refresh main data with Filtering datetime range ?
    self.Frange = ko.observable(true);
    //Run Query on server from modal form
    this.Start_refr = function () {

        $("#dialog-form").modal("hide");
        this.update_ranges();
        this.get_recrdset();
        this.Create_presets_for_column_names();
    }
    //Update avaliable ranges on modal chose dataset and ranges
    this.update_ranges = function () {
        var timId = self.Current_timetable()
        if (self.valid_date_from() != " ") {
            if (stringToDate(timId.date_from(), "yyyy-mm-dd", "-") > stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-")) {
                self.valid_date_from(timId.date_from());
            };
        } else {            
            self.valid_date_from(timId.date_from());
        }
        if (self.valid_date_to() != " ") {
            if (stringToDate(timId.date_to(), "yyyy-mm-dd", "-") < stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-")) {
                self.valid_date_to(timId.date_to());
            };
        } else {
            self.valid_date_to(timId.date_to());
        }
    };
    // Show dialog for chose ranges and timetable ID
    this.get_dat = function () {
        $("#dialog-form").modal("show");
    }
    // Get timetables record
    this.get_timetables = function () {
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
    // Get Main Recordset From AJAX CALL
    this.get_recrdset = function () {
        let Dorefr = true;
        if (self.Count_Changes() > 0) {
            if (!confirm('Are you sure you want to refresh data? \n Some changes are not saved => ' + self.Count_Changes() + ' items...')) {
                Dorefr = false;
            }
        };
        if (Dorefr) {
            if (self.persDbview().length > 0) { self.persDbview.removeAll();}
            $("#dialog-message").dialog({
                modal: true,
            });
            var timId = self.Current_timetable()
            var strA = ''
            if (self.Frange() == true) {
                strA = '&date_from=' + self.valid_date_from() + '&date_to=' + self.valid_date_to();
            }
            $.ajax({
                method: "GET",
                url: "/user?UsersGetALL&UsersTimetable=" + timId.id() + strA ,
                success: function (data) {
                    Global_sendet = data;
                    self.valid_date_from(data.date_from);
                    self.valid_date_to(data.date_to);
                    let d = new Date();
                    let n = d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                    self.emp_sta_refr(n);
                    //create a new instance of Database fields
                    let TMPitems = data.data;
                    self.persDbview.valueWillMutate();
                    let underlining_array = self.persDbview();
                    $.map(TMPitems, function (item) {
                        let date_to = stringToDate(data.date_to, "yyyy-mm-dd", "-");
                        let date_from = stringToDate(data.date_from, "yyyy-mm-dd", "-");
                        underlining_array.push(new EmplTableViewModel(item, date_from, date_to));
                    });
                    TMPitems = '';                    
                    self.persDbview.valueHasMutated();
                    underlining_array = ''; 
                    data = '';
                    $("#load").show();
                    $("#dialog-message").dialog('close');
                }
            });
        }
    };
    //Count Number of changes in Main recordset
    self.Count_Changes = ko.pureComputed(function () {
        let cnt = 0;
        self.persDbview().forEach(item => {
            let date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
            for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                if (item[formatDate(tm)]() != item[formatDate(tm)+'old']) {
                    cnt = cnt + 1;
                }
            }
        });
        return cnt;
    }).extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });

    //************************************************************
    // Multi Selection TOOL
    // Multiselect selection tool options 
    // Presets - list of Avaliable selection MODES
    self.availablemodes = ko.observableArray(['Select single cell', 'Select chosen days in week', 'Copy from another person']);    
    self.bindModes = ko.observable(self.availablemodes()[0]);
    // Prestes for selection mode by 'Select single cell', 'Select chosen days in week' => Value for Replace selected
    self.bindSelect = ko.observable(self.availableitems()[0]); // First preset => first row of list avaliable items used in entire table viewmodel
    // Presets ad Object used in selection tool by weekday
    self.chosenDays = ko.observableArray(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    // Values used in select in multitool
    self.weekday = ko.observableArray([{ WeekDay: 'Mon' }, { WeekDay: 'Tue' }, { WeekDay: 'Wed' }, { WeekDay: 'Thu' }, { WeekDay: 'Fri' }, { WeekDay: 'Sat' }, { WeekDay: 'Sun' }]);
    // Object used in selection tool / copy from another person mode
    self.ListOfPersons = function () {
        let tmarr = [];
        if (self.persDbview != undefined) {
            self.persDbview().forEach(item => {
                tmarr.push(item.full_name);
            });
        }
        return tmarr;
    };
    // Variable of selected prearson in TOOL
    self.CopyFromPerson = ko.observable(self.ListOfPersons()[0]); 
    //Multi selection function and presets
    // Selected fields list (guid + name of field)
    self.Selected_cells = ko.observableArray([]);
    // Turn ON/OFF multiselection tool
    self.multiselect = ko.observable('Disabled');
    this.countSelections = 0;
    // Add remove to array of selected fields
    this.multt_select = function (guid, val_date) {       
            if (self.multiselect() == 'Enabled') {
                var exist = self.Table_Name_Fields.indexOf(
                    ko.utils.arrayFirst(self.Table_Name_Fields(), function (item) {
                        return item.Full_date == val_date;
                    }));
                this.SelectOnEcell(guid, exist, true);
            } else if (this.countSelections > 0) {
                self.Table_Name_Fields().forEach(item => {
                    if (item.Sel_guid_day().length > 0) { item.Sel_guid_day.removeAll(); }
                })
                this.countSelections = 0;
            }
    }
    //Selection Helper metod
    this.SelectOnEcell = function (guid, col_index, Inverse) {
        if (self.Table_Name_Fields()[col_index]['Sel_guid_day'].indexOf(guid) > -1) {
            if (Inverse) {
                self.Table_Name_Fields()[col_index]['Sel_guid_day'].remove(guid);
                this.countSelections=this.countSelections-1
            }
        } else {
            self.Table_Name_Fields()[col_index]['Sel_guid_day'].push(guid);
            this.countSelections = this.countSelections + 1
        }
    }
    this.multi=function() {
        if (self.multiselect()=='Disabled') {
            self.multiselect('Enabled');
        } else {
            self.multiselect('Disabled')
            self.multt_select();
        }       
    };  
    self.Unselect=function() {
        this.multi();
        this.multi();
    };
    self.ReplaceItems = function () {
        if (self.multiselect() != 'Disabled') {
            self.Table_Name_Fields().forEach(items => {
                if (items.Sel_guid_day().length > 0) {
                    items.Sel_guid_day().forEach(gu => {
                        var exist = self.persDbview.indexOf(
                            ko.utils.arrayFirst(self.persDbview(), function (item) {
                                return item.guid == gu;
                            }));
                        self.persDbview()[exist][items.Full_date](self.bindSelect())
                    });
                }
            })
        }        
        this.multi();
        this.multi();
    };
    //************************************************************
    // HTML Vievmodel variables for Table
    // List o avialiable items in fotter / header of table
    //Fotter selected type of set
    self.fottSelected = ko.observable('Week Day');
    //Header selected type of set
    self.headerSelected = ko.observable('Full date')
    // List of prestes for views types.
    self.fott_view=ko.observableArray(['Month name','Number Day','Week Day','Full date']);   
    /// True list of dataset columns used in view table fotter / header of table
    self.table_view_func = ko.pureComputed(function () {
        if (self.valid_date_to() == " " || self.valid_date_from()== " ") {
                return [];
            } else {                    
                let props = [];
                props.push(...staticVMfields);                    
                let date_to=stringToDate(self.valid_date_to(),"yyyy-mm-dd","-");
                for (let tm=stringToDate(self.valid_date_from(),"yyyy-mm-dd","-") ;tm <= date_to;tm.setDate(tm.getDate() + 1)) {
                    props.push(formatDate(tm));
                }              
                return props;}                
        });
    self.Month_Values_fields=ko.pureComputed(function () {
        let listoftxtflds=staticVMfields.join(','); // text fields in view model
        if (self.table_view_func().length === 0)
            return [];
        let props = [];
        let obj = self.table_view_func();
        let max=0;
        let tmp={};
        for (let name in obj) {
          if (obj[name]!=undefined) {
            if (obj[name]!='vi') {
              if (obj[name].indexOf('old')==-1 && obj[name].indexOf('cha')==-1 && obj[name].indexOf('vis')==-1 ) {
                let tm=listoftxtflds.indexOf(obj[name] );
                if (tm==-1) {
                  let dta= new Date(obj[name]);
                  tmp[obj[name]]= dta.toLocaleString('en', { month: 'short' });
                } else {
                  if (obj[name]=='full_name'){
                  tmp[obj[name]]='Month';}
               }
              }
            }
          }
        }
        props.push(tmp);
        return props
        });
    self.day_Values_fields=ko.pureComputed(function () {
        let listoftxtflds=staticVMfields.join(','); // text fields in view model
        if (self.table_view_func().length === 0)
            return [];
        let props = [];
        let obj = self.table_view_func();
        let max=0;
        let tmp={};
        for (let name in obj) {
          if (obj[name]!=undefined) {
            if (obj[name]!='vi') {
              if (obj[name].indexOf('old')==-1 && obj[name].indexOf('cha')==-1 && obj[name].indexOf('vis')==-1 ) {
                let tm=listoftxtflds.indexOf(obj[name] );
                if (tm==-1) {
                  let dta= new Date(obj[name]);
                  tmp[obj[name]]= dta.getDate()
                } else {
                  if (obj[name]=='full_name'){
                  tmp[obj[name]]='Day of the month';}
               }
              }
            }
          }
        }
        props.push(tmp);
        return props
        });
    self.Weekday_Values_fields=ko.pureComputed(function () {
        let listoftxtflds=staticVMfields.join(','); // text fields in view model
        if (self.table_view_func().length === 0)
            return [];
        let props = [];
        let obj = self.table_view_func();
        let max=0;
        let tmp={};
        for (let name in obj) {
          if (obj[name]!=undefined) {
            if (obj[name]!='vi') {
              if (obj[name].indexOf('old')==-1 && obj[name].indexOf('cha')==-1 && obj[name].indexOf('vis')==-1 ) {
                let tm=listoftxtflds.indexOf(obj[name] );
                if (tm==-1) {
                  let dta= new Date(obj[name]);
                  tmp[obj[name]]= dta.toLocaleString('en', {weekday: 'short' });
                } else {
                  if (obj[name]=='full_name') {
                    tmp[obj[name]]='Day of the week'; 
                  }
               }
              }
            }
          }
        }
        props.push(tmp);
        return props;
     });
    //Range of Visibility - saves RAM
    self.itemscOunt = ko.observableArray([10, 20, 30, 40, 50, 100, 200,300,400,500]);
    self.pageSize = ko.observable(20);
    self.pageIndex = ko.observable(0);
    this.previousPage = function () {
        self.pageIndex(self.pageIndex() - 1);
    };
    this.nextPage= function() {
        self.pageIndex(self.pageIndex() + 1);
    } 
    self.maxPageIndex = ko.pureComputed(function () {
        return Math.ceil(self.persDbview().length / self.pageSize()) - 1;
    }).extend({ deferred: true });
    self.pagedRows = ko.pureComputed(function () {        
        let size = self.pageSize();
        let max = self.maxPageIndex();
        if (max>-1 & self.pageIndex() > max) { self.pageIndex(max);}
        let start = self.pageIndex() * size;        
        return self.persDbview.slice(start, start + size);
    }).extend({ deferred: true });
    
     // sorting       
    this.sortKeyB=ko.observable('');
    self.filterArr=ko.observableArray([]);
    this.sortByKeyA=function(a, b) {
        a=a[self.sortKeyUnwrappedA];
        b=b[self.sortKeyUnwrappedA];
        return a === b ? 0 : (a < b ? self.sortOrderNegativeA : self.sortOrderA);
        };
    self.filtered=function(field){
        let k=101;
        for(let i=0 ,ii=self.filterArr().length;i<ii;i++) {
            if(self.filterArr()[i].dta==self.dt()) {
                if (self.filterArr()[i].col==field)
                {
                    k=i;
                    return 'true';
                }
            }
        }
        if (k==101)
        {
            return 'false';
        }
        };

    // Initialize
    this.get_timetables();
    this.get_dat();    
    
    };
//****************************************************************
//Doc ready Run KO
document.addEventListener('DOMContentLoaded', function() {
        ko.options.deferUpdates = true;        
        var viewModel= new vModel;    
        ko.applyBindings(viewModel);        
    });
// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}
