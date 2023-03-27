'use strict'

// viewmodel funtion for timetable records
function TimetableSetViewModel(id, hrnest_id, title, date_from, date_to, Type, Present) {
    const self = this;
    self.id = ko.observable(id);
    self.hrnest_id = ko.observable(hrnest_id);
    self.title = ko.observable(title);
    self.date_from = ko.observable(date_from);
    self.date_to = ko.observable(date_to);
    self.Type = ko.observable(Type);
    self.Present = ko.observable( Present );
    self.Checked = ko.observable( false );
};
// viewmodel for changes in recordset
function pers_day(data) {
    const self = this
    self.id = data.id;
    self.emp_id = data.emp_id;
    self.timetable_id = data.timetable_id;
    self.guid = data.guid;
    self.full_name = data.full_name;
    self.date = data.date;
    self.type_id = data.value;
    self.emp_err = data.emp_err
    if ( data.emp_type > 1 ) {
        self.emp_type = data.emp_type
    }
}
// Work Group record
function work_Group(data) {
    const self = this
    self.id = ko.observable(data.id);
    self.name = ko.observable(data.name);
    self.description = ko.observable(data.description);
    self.leader = ko.observable(data.leader);
}
//Request type record
function request_type(item) {
    const self = this;
    self.id = ko.observable(item.id);
    self.name = ko.observable(item.name);
    self.description = ko.observable(item.description);
    self.emp_type = ko.observable(item.emp_type);
    self.type_source = ko.observable(item.type_source);
    self.iswholeday = ko.observable(item.iswholeday);
    self.req_type_id = ko.observable(item.req_type_id);
    self.time_from = ko.observable(item.time_from);
    self.time_to = ko.observable(item.time_to);
    self.enumerable = ko.observable(item.enumerable);
    self.info = ko.observable(item.info);
}
function request_Data ( data )
{
    const self = this;
    self.attr = ko.observable( data.attr ? data.attr : 'Not_modified' );
    self.emp_id = ko.observable( data.emp_id );
    self.userId = ko.observable( data.userId );
    self.number = ko.observable( data.number );
    self.date_From = ko.observable( data.date_From ? data.date_From : formatDate(data.dateFrom)  );
    self.date_To = ko.observable( data.date_To ? data.date_To : formatDate(data.dateTo));
    self.description = ko.observable( data.description );

}
// Viewmodel for request
function request_Person(data) {
    const self = this;
    self.userId = ko.observable(data.userId);
    self.emp_id = ko.observable(data.emp_id);
    self.dateFrom = ko.observable(stringToDate(formatDate(data.dateFrom), 'yyyy-mm-dd', '-'));
    self.dateTo = ko.observable(stringToDate(formatDate(data.dateTo), 'yyyy-mm-dd', '-'));
    self.isWholeDay = ko.observable(data.isWholeDay);
    self.number = ko.observable(data.number);
    self.status = ko.observable(data.status)
    self.title = ko.observable(data.title);
    self.typeId = ko.observable(data.typeId);    
}
// Viewmodel function for pearsons
function PearsonSetViewmodel(default_wrkgroup, emp_id, first_name, id, last_name, position, snet, uid, wrk_description, wrk_group, wrk_leader, table_wrkgroup) {
    const self = this;
    // allowed atributes on edit 'Not_modified','Modified','Added','Deleted
    self.attr = ko.observable('Not_modified');
    self.inView = ko.observable( false ).extend({ deferred: true });
    self.default_wrkgroup = ko.observable(default_wrkgroup);
    self.emp_id = ko.observable(emp_id);
    self.Name = ko.observable( last_name + ' ' + first_name );    
    self.first_name = ko.observable(first_name);
    self.Id = ko.observable(id);
    self.last_name = ko.observable(last_name);
    self.position = ko.observable(position);
    self.snet = ko.observable(snet);
    self.uid = ko.observable(uid);
    self.wrk_description = ko.observable(wrk_description);
    self.wrk_group = ko.observable(wrk_group);
    self.wrk_leader = ko.observable(wrk_leader); 
    self.table_wrkgroup = ko.observable(table_wrkgroup);
    self.Selected = ko.observable(false);
    if (Len_Text_Fields.last_name < last_name.length) { Len_Text_Fields.last_name = last_name.length; }
    if (Len_Text_Fields.first_name < first_name.length) { Len_Text_Fields.first_name = first_name.length; }    
    if (Len_Text_Fields.wrk_group < wrk_group.length) { Len_Text_Fields.wrk_group = wrk_group.length; }
    if (Len_Text_Fields.snet < snet.length) { Len_Text_Fields.snet = snet.length; }
    if (Len_Text_Fields.position < position.length) { Len_Text_Fields.position = position.length; }
    if (Len_Text_Fields.wrk_description < wrk_description.length) { Len_Text_Fields.wrk_description = wrk_description.length; }
    if (Len_Text_Fields.work_leader < wrk_leader.length) { Len_Text_Fields.work_leader = wrk_leader.length; }
};
// View model for columns DateTime type and array of Selection TOOL
function Table_rows_Selection(data) {
    const self = this;
    self.Type = 'Day';
    self.inView = ko.observable(false).extend({ deferred: true });
    self.w = ko.observable( 65 ).extend({ deferred: true });;
    self.Date_Value = stringToDate(formatDate(data),'yyyy-mm-dd','-');
    self.Month_name =data.toLocaleString('en', { month: 'short' });
    self.Number_Day = Len_two_Dig(data.getDate().toString());
    self.Week_Day =  data.toLocaleString('en', { weekday: 'short' });
    self.Full_date = formatDate(data);
    self.isoWeek = data.getWeekYear().toString() + Len_two_Dig(data.getWeek().toString()) ;
    self.Sel_guid_day = ko.observableArray( [] ).extend( { deferred: true } );
    self.h_color = ko.pureComputed(function ()
    {
        if ( self.Full_date === Now_Date() ) {
            return 'rgb(192, 0, 0, 1)'
        }
        else if ( self.Week_Day === 'Sat' ) {
            return 'rgb(211, 211, 211, 1)'
        }
        else if ( self.Week_Day === 'Sun' ) {
            return 'rgb( 255, 255, 255, 1)';
        }
        else {
            return '';
        }
        
    } ).extend( { deferred: true } );
    self.bckgr = ko.pureComputed(function ()
    {
        if ( self.Week_Day === 'Sat' ) {
            return 'rgb(211, 211, 211, 1)'
        } else if ( self.Week_Day === 'Sun' ) {
            return 'rgb( 255, 255, 255, 1)';
        } else {
            return '';
        }
    } ).extend( { deferred: true } );
    self.f_color = ko.pureComputed(function ()
    {
        if ( self.Week_Day === 'Sun' ) {
            return 'Black'
        }
        return 'White'
    } ).extend( { deferred: true } );
};
// Const Fields and list
function Table_rows_const_fields(data) {
    const self = this;
    self.inView = ko.observable( false ).extend({ deferred: true });
    self.Type = data === 'full_name' ? 'Main' : data === 'snet' || data === 'position' ? 'Field' : 'Workgroup'  ;
    self.w = ko.observable(Len_Text_Fields[data]*12.5).extend({ deferred: true });;
    self.Date_Value = data;
    self.Month_name = data;
    self.Number_Day = data;
    self.Week_Day = data;
    self.Full_date = data;
    self.isoWeek = data;
    self.Sel_guid_day = ko.observableArray( [] ).extend( { deferred: true } );
    self.h_color = ko.computed(function ()
    {
        return 'Grey'
    } ).extend( { deferred: true } );
    self.bckgr = ko.pureComputed(function () {
        return '';
    } ).extend( { deferred: true } );
    self.f_color = ko.pureComputed(function ()
    {      
        return 'White'
    }).extend( { deferred: true } );
};
// Calculation F1/F2 for all Timetables in date range
function FN_Timetable(data) {
    const self = this;
    self.date = ko.observable(data.date);
    self.S1 = ko.observable(data.S1);
    self.S2 = ko.observable(data.S2);
}
// All potentially errors in F1/F2 (duplicates error in timetable's on one range dates)
function Duplicates_pers(data) {
    const self = this;
    self.user_id = ko.observable(data.user_id);
    self.Cnt = ko.observable(data.Cnt);
    self.Tmtbl = ko.observableArray(data.Tmtbl);
    self.User_record = ko.observable(data.User_record);
}
// viewmodel function of one row
function EmplTableViewModel(data, date_from, date_to) {
    const self = this;
    // Primary index for row
    self.inView = ko.observable( false ).extend({ deferred: true });
    //If person dont belongs to hrnest person source / external DB emp
    self.guid = data.uid === null ? data.id : data.uid;
    self.emp_id = data.emp_id;
    self.full_name = data.full_name;
    self.default_wrkgroup = data.default_wrkgroup;
    self.id = data.id;
    self.position = ko.observable(data.position);
    self.positionold = data.position;     
    //self.wrk_description = ko.observable(data.wrk_description);
    //self.wrk_descriptionold = data.wrk_description;
    self.changes_counter = data.changes_counter;
    //self.table_wrkgroupold = viewModel.Work_groupByID(data.table_wrkgroup);
    //self.table_wrkgroup = ko.observable(viewModel.Work_groupByID(data.table_wrkgroup));
    self.wrk_group = data.wrk_group; 
    //self.work_leader = ko.observable(data.wrk_leader);
    //self.work_leaderold = data.wrk_leader;
    self.timetable_id = data.timetable_id;
    // Get info about static info fields max length
    if (Len_Text_Fields.wrk_group < data.wrk_group.length) { Len_Text_Fields.wrk_group = data.wrk_group.length; }     
    if (Len_Text_Fields.snet < data.snet.length) { Len_Text_Fields.snet = data.snet.length; }
    if (Len_Text_Fields.position < data.position.length) { Len_Text_Fields.position = data.position.length; }
    if (Len_Text_Fields.wrk_description < data.wrk_description.length) { Len_Text_Fields.wrk_description = data.wrk_description.length; }
    if (Len_Text_Fields.work_leader < data.wrk_leader.length) { Len_Text_Fields.work_leader = data.wrk_leader.length; }
    // Is row Visible in View model?
    self.vi = ko.observable(true);
    self.snet = ko.observable(data.snet);
    self.snetold = data.snet;  
    
    let tmt = date_from;
    // Iterate existing datatime fields with observables model
    for (tmt = date_from; tmt <= date_to; tmt.setDate(tmt.getDate() + 1)) {
        let tmp = '';
        const _date = formatDate(tmt);
        if ( data[ _date ] ) {
            tmp = data[ _date ][ 'value' ]
        };
        self[ _date + 'req' ] = ko.observable( false );
        self[_date] = ko.observable(tmp).extend({ deferred: true });
        self[_date + 'old'] = tmp;
        if ( tmp !== '') {
            self[_date + 'err'] = data[_date]['err'];
        } else {
            self[_date + 'err'] = { endDif: 0, startDif: 0, timeDif: 0 };
        }
    };
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Source https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function isValidDate ( d )
{
    return d instanceof Date && !isNaN( d );
}

// Source: http://stackoverflow.com/questions/497790
const dates = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                NaN
        );
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
        );
    },
    inRange: function (d, start, end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
        );
    }
}
function DaysBetween(StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
}
// Convert String to datetime format
function stringToDate(_date,_format,_delimiter){
        const formatLowerCase=_format.toLowerCase();
        const formatItems=formatLowerCase.split(_delimiter);
        const dateItems=_date.split(_delimiter);
        const monthIndex=formatItems.indexOf("mm");
        const dayIndex=formatItems.indexOf("dd");
        const yearIndex=formatItems.indexOf("yyyy");
        let month=parseInt(dateItems[monthIndex]);
        month-=1;
        const formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
};
function Now_Date() {
    const d = new Date()
    return formatDate(d)
}
// Convert Date to 'yyyy-mm-dd' string format
function formatDate(date) {
    const d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    return [year, Len_two_Dig(month), Len_two_Dig(day)].join('-');
}
function Len_two_Dig(val) {
    if (val.length < 2) {
        val = '0' + val;
    }
    return val;
}
function Date_toHTML_Week(date) {
    const tmpDat = stringToDate(date, "yyyy-mm-dd", "-");
    return tmpDat.getWeekYear().toString() + '-W' + Len_two_Dig(tmpDat.getWeek().toString())
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function HtmlWeekToISO(data) {
    return data.substr(0, 4) + data.substr(data.length - 2);
}
function ISOWeekTohtml(data) {
    return data.substr(0, 4) +'-W' + data.substr(data.length - 2);
}
function getStart_isoWeek(data) {
    return getDateOfISOWeek(data.substr(data.length - 2), data.substr(0,4));
}
function getDateOfISOWeek(w, y) {
    const simple = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}
//Convert HH:MM format to minutes
function strTimeToMinutes(_str) {
    let tmp=0;
    if (_str !== '' & _str!== undefined ) {
        tmp = parseInt(_str.substring(0, 2)) * 60 + parseInt(_str.substring(3))
    }
    return tmp
}
function intMinutesTostrTime(_int) {
    return Len_two_Dig(Math.floor(_int / 60).toString()) + ':' + Len_two_Dig((_int % 60).toString())
}
// Helper function to modyfing propeteries value valid_date to name of propert width state
function Set_fields(obj) {
    const new_obj = {
        id: obj.id             
    };
    new_obj[obj.valid_date] = obj.state;
    return new_obj
};
// Push data from 'database records oreinted' json to table view array of propreteries and create default view table
function pushToArray(arr, obj) {
    const index = arr.findIndex((item) => item.id === obj.id);
    if (index > -1) {
        arr[index][obj.date + 'old'] = obj.type_id;
    } else {
        arr.push(Set_fields(obj))
    }
};
// Start modyfing to datatable view
function Transl_data(data) {
    const Dtaset = [];
    data.forEach((item) => {
        pushToArray(Dtaset, item);
    });
    return Dtaset;
};
function openNav() {
    document.getElementById("menuside").style.width = "250px";
    $("#menuside").menu({
        select: function (e, ui) {
            //console.log("SELECT", ui.item);
            const choise = typeof (ui.item.context.outerText) !== 'undefined' ? ui.item.context.outerText : ui.item.context.innerText;
            if (choise.indexOf('Close') > -1) {
                closeNav()
            }
            else if (choise.indexOf('Active Persons') > -1) {
                viewModel.OpenMenuAllPers();
                closeNav();
            }
            else if (choise.indexOf('Add / Remove Persons List') > -1) {
                viewModel.OpenMenuAddPers();
                closeNav();
            }
            else if (choise.indexOf('Save Changes') > -1) {
                viewModel.Save_Changes_RST();
            }
            else if (choise.indexOf('Get Persons List from HRNEST') > -1) {
                viewModel.check_Dataset();
                closeNav();
            }
            else if (choise.indexOf('Refresh Dataset') > -1) {
                viewModel.get_recrdset();
                closeNav();
            }
            else if (choise.indexOf('Change Edited Timetable') > -1) {
                viewModel.get_dat();
                closeNav();
            }
            else if (choise.indexOf('Turn On/Off Selection Tool') > -1) {
                viewModel.multi();
            }
            else if (choise.indexOf('Turn On/Off summary shifts') > -1) {
                viewModel.ShiftSumm(!viewModel.ShiftSumm());
            }
            else if (choise.indexOf('Show Duplicated Persons') > -1) {
                $("#replaced-form").modal("show");
                closeNav();
            }
            else if (choise.indexOf('Timetable WWW for Edit') > -1) {
                OpenWindow('https://hrnest.io/WorkTime/TimeTable/EditTimeTable/' + viewModel.Current_timetable().hrnest_id());
                closeNav();
            }
            else if (choise.indexOf('Timetable WWW for View') > -1) {
                OpenWindow('https://hrnest.io/WorkTime/TimeTable/Details/' + viewModel.Current_timetable().hrnest_id());
                closeNav();
            }            
        }
    });
    $("#menuside").css({ left: 0, top: 0 });
    $("#menuside").position({
        my: "left top",
        at: "left-1 top+35"
    } );
    $( "#down" ).position( {
        my: "bottom",
        at: "left-1 "
    } );

    
    $("#menuside").show().focus();
}
function closeNav() {
    document.getElementById("menuside").style.width = "0";
    $("#menuside").hide();
}
function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
function width() {
    return window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
        || 0;
}
function height() {
    return window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight
        || 0;
}
function ParityWeek(week) {
    return (parseInt(week.substr(week.length - 1)) % 2 === 0)
}
// Show / hide modal progress
async function showLoader() {    
    $("#dialog-message").dialog({
        dialogClass: 'no-close',
        modal: true,
    });    
};
function hideLoader () {
    $("#dialog-message").dialog('close');    
};
function clickHandlerThead () {
    $("#menu").hide();
};
function clickHandlerTheadP() {
    $("#menuP").hide();
};
function clickHandlerBodyP() {
    $("#PersMnu").hide();
};
function clickMenuChanges() {
    $("#MenuChanges").hide();
}
function clickHandlerBody() {
    $("#menuitem").hide();
};
function clickHandlerAddPers() {
    $("#selepers").hide();
};
// Pages in View model
async function NextPage() {    
    await showLoader();
    setTimeout(async function () { viewModel.nextPage(); }, 10);   
}
async function PreviousPage() {
    await showLoader();
    setTimeout(async function () { viewModel.previousPage(); }, 10);    
}
let Len_Text_Fields = { full_name: 5, emp_id: 5, snet: 0, position: 0, default_wrkgroup: 0, wrk_group: 0, wrk_description: 5, work_leader: 5, last_name: 1, first_name: 1, table_wrkgroup: 5, changes_counter: 5 };
function OpenWindow(data) {
    window.open(data, '_blank');
}
//****************************************************************
// Main KO ViewModel
const vModel = function () {
    const self = this;
    self.lastTimeExchange = ko.observable( Now_Date())
    self.OnScroll = ko.observable( true )
    self.windowSize = ko.observable().extend( { deferred: true } );    
    self.scrollTopS = ko.observable( 0 ).extend( { deferred: true } );
    self.scrollTopE = ko.observable( 40 ).extend( { deferred: true } );    
    self.scrollLeftE = ko.observable( 0 ).extend( { deferred: true } );
    self.scrollLeftS = ko.observable( 40 ).extend( { deferred: true } );
    self.refrTabCount = ko.observable( 0 );
    self.actingOnThingsR = ko.observable( false );
    self.dataExchange = ko.observable(false);
    self.dataExchangeCount = ko.observable(0);
    self.licenses = ko.observable(0);
    self.limitchanges = ko.observable( 0 );
    self.DaysOff =  ko.observableArray([])
    self.personMode = ko.observable('none');
    //String of range ALL of date database report
    self.valid_date_from = ko.observable(" ");
    //String of range ALL of date database report
    self.valid_date_to = ko.observable(" ");
    // Is credentials is enough for modify data in www Hrnest ?
    self.credentials = ko.observable(true);
    // manage http/xhr call via socketIO transactons by this computer
    self.transaction = ko.observable('').extend({ deferred: true });
    self.last_updt = ko.observable('').extend({ deferred: true });
    self.trans_list = ko.pureComputed(function () {
        if ( self.transaction().length > 0) {
            const d = new Date();
            const n = d.getMinutes();
            if (n - self.last_updt > 10) {
                self.transaction('')
            }
        }
    } )
    self.visOpt = ko.observable( false )
    self.chVisOpt = function ()
    {
        self.visOpt( !self.visOpt())
    }
    // Time for Transactions observablearray
    self.set_Updt_time = function () {
        const d = new Date();
        const n = d.getMinutes();
        self.last_updt(n);
    }
    // Check if selected id User exist in timetable
    self.check_idExist = function (id) {
        const fnd = self.persDbview.indexOf(ko.utils.arrayFirst(self.persDbview(), function (item) {
            return item.id === id;
        }))
        return fnd
    }
    self.actingOnThingsT = ko.observable(false);
    // Update after socketIo Signal
    self.updateSelectedComp = function (data) {
        const Modyfications = Transl_data(data);
        // get modified records
        const result_key = Modyfications.map((a) => a.id);
        self.get_recordset_One(result_key.toString());        
    }
    // types of hidable columns
    this.hidableColumnTypes = 'Workgroup,Field';
    self.message = ko.observable(" ").extend({ deferred: true });
    self.txt = ko.observable(" ").extend({ deferred: true });
    //Show pearson info fields
    self.ShowInfoFields = ko.observable(false);
    this.Info = function () {
        self.ShowInfoFields(!self.ShowInfoFields());
        //setTimeout(async function () {
        //    $(window).scroll();
        //}, 100);
    };
    // Header Info are turning off for column
    this.isVisInfo = function (data) {
        if (!self.ShowInfoFields()) {
            if (this.hidableColumnTypes.indexOf(data.Type) > -1) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };
    // list of static fields in viewmodel table
    self.staticVMfields = ko.observableArray(['full_name', 'emp_id', 'changes_counter', 'snet', 'position', 'default_wrkgroup', 'wrk_group']).extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });;
    self.VisElemnts = ko.observable('false');
    //*************************************************************
    // AddModify Persons dialog
    // Rows vivible in view
    self.LimitPerson_Name_Fields = ko.observable('').extend({ deferred: true });
    // List of selected persons in persons edit view
    self.SelectedPersonsPER = ko.observableArray([]).extend({ deferred: true });
    self.actingOnThingsP = ko.observable(false).extend({ deferred: true });
    this.IsSelectedPER = function (data) {
        if (self.message() !== 'Busy') {
            if ( self.SelectedPersonsPER().indexOf( '_' + data.Id() + '_' ) > -1 || data.uid() === self.CurrRow()) {
                return 'rowselected';
            } else {
                return false
            }
        }
    }
    // Select pers
    this.SelectPER = function (data) {
        if (self.SelectedPersonsPER().indexOf('_' + data.Id() + '_') > -1) {
            self.SelectedPersonsPER(self.SelectedPersonsPER().replace('_' + data.Id() + '_',''));
        } else {
            self.SelectedPersonsPER(self.SelectedPersonsPER() + '_' + data.Id() + '_');
        }
    }
    // fill array of fields with css information
    self.setColumnPers = function () {
        self.LimitPerson_Name_Fields([
            { name: 'attr', w: ko.observable(Len_Text_Fields['attr'] * 12.5).extend({ deferred: true }), type: ko.observable('edit') },
            { name: 'Id', w: ko.observable(Len_Text_Fields['id'] * 12.5).extend({ deferred: true }), type: ko.observable('non_edit') },
            { name: 'last_name', w: ko.observable(Len_Text_Fields['last_name'] * 12.5).extend({ deferred: true }), type: ko.observable('only_inernal') },
            { name: 'first_name', w: ko.observable(Len_Text_Fields['first_name'] * 12.5).extend({ deferred: true }), type: ko.observable('only_inernal') },
            { name: 'emp_id', w: ko.observable(Len_Text_Fields['emp_id'] * 12.5).extend({ deferred: true }), type: ko.observable('non_edit') },
            { name: 'position', w: ko.observable(Len_Text_Fields['position'] * 12.5).extend({ deferred: true }), type: ko.observable('edit') },
            { name: 'snet', w: ko.observable(Len_Text_Fields['snet'] * 12.5).extend({ deferred: true }), type: ko.observable('edit') },
            { name: 'default_wrkgroup', w: ko.observable(Len_Text_Fields['default_wrkgroup'] * 12.5).extend({ deferred: true }), type: ko.observable('only_inernal') },
            { name: 'wrk_group', w: ko.observable(Len_Text_Fields['wrk_group'] * 12.5).extend({ deferred: true }), type: ko.observable('only_inernal') }])
    };
    self.widthLimitPerson_Name_Fields = ko.computed( function ()
    {
        if ( self.LimitPerson_Name_Fields().length > 0 ) {
            const returned = self.LimitPerson_Name_Fields().reduce(
                ( acc, bval ) => { return acc + (isNaN( bval.w ) ? 40 : bval.w) } , 0
            )
            return returned
        }
        return 0
    })
    self.AvaliableEditPersView = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } });
    // Block modify records of persons
    self.BlockModify = function () {        
        const _ext = self.EditableExternal();
        const arr_id = self.SelectedPersonsPER().split('__');
        arr_id.forEach( ( item ) =>
        {
            const cn = ko.utils.arrayFilter( self.personsALL(), function ( tm )
            {
                return tm.Id() === parseInt( item.replace( '_', '' ) );
            } );
            const cnt1 = ko.utils.arrayFilter( self.personsALL_mod(), function ( itm )
            {
                return itm.Id === parseInt( item.replace( '_', '' ) );
            } );
            if ( cnt1.length === 0 ) {
                self.personsALL_mod.push( ko.toJS( cn[0] ) );
            }
            self.AvaliableEditPersView().forEach( item => {
                if ( ( !cn[ 0 ].uid() === '' ) || ( cn[ 0 ].uid() !== '' & _ext.indexOf( item.field() ) > -1 ) ) {
                    cn[ 0 ] ['attr'] ('Modified')
                    cn[ 0 ][ item.field() ]( item.Modvalue() )                                   
                }
            } )            
        } )        
    }
    self.EditableExternal = ko.pureComputed(function () {
        const cn = ko.utils.arrayFilter(self.LimitPerson_Name_Fields(), function (tm) {
            return tm.type() === 'edit' & tm.name !== 'attr';
        });
        return cn.map(({ name }) => name).toString()
    }).extend({ deferred: true });
    self.EditableALL = ko.pureComputed(function () {
        const cn = ko.utils.arrayFilter(self.LimitPerson_Name_Fields(), function (tm) {
            return (tm.type() === 'edit' || tm.type() === 'only_inernal') & tm.name!=='attr' ;
        });
        return cn.map(({ name }) => name).toString()
    }).extend({ deferred: true });
    // List of Avaliable fields for edit from selected persons
    self.AvaliableEditPers = ko.computed(function () {   
        let list_flds = '';
        const _all = self.EditableALL();
        const _ext = self.EditableExternal();
        if ( self.SelectedPersonsPER().length > 0) {
            const arr_id = self.SelectedPersonsPER().split('__');
            const tmp_arr = arr_id.reduce((res,item) => {
                const cn = ko.utils.arrayFilter(self.personsALL(), function (tm) {
                    return tm.Id() === parseInt(item.replace('_', ''));
                } );                
                for (let itm in cn[0]) {
                    if (_all.indexOf(itm) > -1) {
                        if ( ( !cn[ 0 ].uid() === '' ) || ( cn[ 0 ].uid() !== '' & _ext.indexOf( itm ) > -1 ) ) {
                            if ( list_flds.indexOf( '_' + itm + '_' ) === -1 ) {
                                list_flds = list_flds + '_' + itm + '_';
                                //flds.push( itm ) 
                                res.push( itm)
                            }
                        }
                    }
                }
                return res
            },[] )
            self.AvaliableEditPersView( tmp_arr.map( ( item ) => ( {
                field: ko.observable( item ),
                Modvalue: ko.observable( '' ),
            } ) ) );
            return tmp_arr
        }        
        return []
    }).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // Set icon class for value
    this.Icon_enumerate = function (data) {
        //'Not_modified', 'Modified', 'Added', 'Deleted
        if (data === 'Not_modified') {
            return 'ui-icon-blank'
        } else if (data === 'Modified') {
            return 'ui-icon-refresh'
        } else if (data === 'Added') {
            return 'ui-icon-circle-plus'
        } else if (data === 'Deleted') {
            return 'ui-icon-circle-minus'
        }
        return 'ui-icon ui-icon-blank';
    }
    // is fields is enable for editing ?
    this.Is_enable = function (data,row) {
        if (data() === 'edit') {
            return true
        } else if (data() === 'non_edit') {
            return false
        } else if (!row.uid() & data() === 'only_inernal') {
            return true
        }
        return false
    }
    // Remove field from block edit form
    self.removeField = function() {
        self.AvaliableEditPersView.remove(this);
    }
    // Mark selected persons as for delete record state
    self.markPerDEL = function (data) {
        if ( self.SelectedPersonsPER().length > 0) {
            const arr_id = self.SelectedPersonsPER().split('__');
            arr_id.forEach((item) => {
                const cnt = ko.utils.arrayFilter(self.personsALL(), function (itm) {
                    return itm.Id() === parseInt(item.replace('_',''));
                });                
                cnt[0].attr('Deleted');                
            })
            self.SelectedPersonsPER('');
        }
    }

    // Collect changes in Modify presons View
    self.list_of_Info_ChangePER = ko.pureComputed( function ()
    {
        if ( self.message() !== 'Busy' ) {
            const cnt = self.personsALL_mod().map( function ( item )                 
                {
                    const cnt1 = ko.utils.arrayFilter( self.personsALL(), function ( itm )
                    {
                        return itm.Id() === item.Id;
                    } );
                    return {
                        id: item.Id,
                        position: cnt1[0][ 'position' ](),
                        snet: cnt1[ 0 ][ 'snet' ]()
                    }
                } );            
            return cnt
        }
        return []
    } ).extend( { rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } } );

    //Save changes for persons

    self.SaveChangesPer = function ()
    {
        if ( self.list_of_Info_ChangePER().length > 0 ) {
            const trans = generateUUID();
            self.transaction( self.transaction() + 'Trans:' + trans )
            this.AjaxSendMessage( { users: JSON.stringify( self.list_of_Info_ChangePER() ) }, '/user?ModUser' + "&Transaction=" + trans, 'POST' );
            self.personsALL().filter( item => item.attr !== 'Modified' ).forEach( item => item.attr( 'Not_modified' ) )
            self.personsALL().filter( item => item.Selected === true ).forEach( item => item.Selected( false ) )
            self.SelectedPersonsPER([])
            self.personsALL_mod.removeAll()
            self.personsALL.valueHasMutated()
        }
    }

    // Undo changes in selected row
    this.UndoPers = function ( data )
    {
        const cnt = ko.utils.arrayFilter( self.personsALL(), function ( itm )
        {
            return itm.Id() === data.Id();
        } );
        const cnt1 = ko.utils.arrayFilter( self.personsALL_mod(), function ( itm )
        {
            return itm.Id === data.Id();
        } );
        if ( cnt1.length > 0 ) {
            for ( let item in cnt1[ 0 ] ) {
                cnt[ 0 ][ item ]( cnt1[ 0 ][ item ] );
            }
        }
        cnt[ 0 ].attr( 'Not_modified' );
    }
    //show dialog to add records and mark it as added state
    self.markPerADD = function(data) {

    }
    // List of items used in select in table and selection tool   
    self.availableitems = ko.pureComputed(function () {    
        return self.RequestTypesMenu().map((item) => item.name)
    }).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } });
    self.availableitemsWWW = ko.pureComputed(function () {        
        return self.RequestTypesMenu().filter(item => item.name() !== 'u').map((item) => item.name)
    }).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } });
    //*************************************************************
    // Draft enhace
    // Set Data_type => Timetable or Draft for chose timetable dialog
    self.TMPData_Type = ko.observable('Timetable');
    self.TMPCreateDraft = ko.observable(false);
    //Create Timetables by rules in Namings Settings Tab
    self.NamingSettings = ko.observable(false);
    // Set Data_type => for global view
    self.Data_Type = ko.observable('Timetable');
    // Enable addNew Draft
    self.AddNewDraft = ko.observable(false);
    self.Number_of_weeks = ko.observable(4);
    self.New_Name_of_Draft = ko.observable('');
    self.Name_of_Created_Draft = ko.observable('');
    // Date Ranges for New Timetable created fro Draft
    self.FDdateDraft = ko.observable('');
    self.TDdateDraft = ko.observable('');
    self.Count_daysinDraft = function () {
        if ( self.valid_date_to() !== " " & self.valid_date_from() !== " " ) {
            return DaysBetween( stringToDate( self.valid_date_from(), "yyyy-mm-dd", "-" ), stringToDate( self.valid_date_to(), "yyyy-mm-dd", "-" ) )
        }
        return 0
    };
    self.StartWeek = ko.observable(1);
    self.weeksInDraft = ko.observableArray([])
    self.updateDrft = ko.computed( function ()
    {
        if ( self.valid_date_to() !== " " & self.valid_date_from() !== " " ) {
            self.weeksInDraft( Array.from( [ ...Array( Math.ceil( viewModel.Count_daysinDraft() / 7) ).keys() ].map( x => ++x )));
        }
    })
    this.CreateTimetable = function ()
    {
        self.actingOnThingsP( true )
        const Fdate = self.FDdateDraft();
        const Tdate = self.TDdateDraft();
        self.getOffs( Fdate, Tdate ).then( resp =>
        {
            const TMPitems = resp.DaysOff;
            //self.persDuplicatesALL.valueWillMutate();
            self.DaysOff( TMPitems );
            const timetableName = self.Name_of_Created_Draft()
            const StartWeek = self.StartWeek();           
            
            const DatesTable = ko.toJS( self.LimitTable_Name_Fields() );
            const daysInDraft = self.Count_daysinDraft();
            const DaysinNewTimetable = DaysBetween( stringToDate( Fdate, "yyyy-mm-dd", "-" ), stringToDate( Tdate, "yyyy-mm-dd", "-" ) ) + 1;
            const New_days = []
            for ( let tm = stringToDate( Fdate, "yyyy-mm-dd", "-" ); tm <= stringToDate( Tdate, "yyyy-mm-dd", "-" ); tm.setDate( tm.getDate() + 1 ) ) {
                New_days.push( formatDate( tm ) );
            }
            const allpers = ko.toJS( self.persDbview() ).map( ( item ) =>
            {
                let sufx = [];
                let prefx = []
                if ( self.NamingSettings() ) {
                    sufx = self.Sufix().filter( it => it.name !== 'Chose Function' ).map( ( it ) =>
                    {
                        it.nam = self.getFunc( ko.toJS( it ), ko.toJS( item ) );
                        return it.nam
                    } );
                    prefx = self.Prefix().filter( it => it.name !== 'Chose Function' ).map( ( it ) =>
                    {
                        it.nam = self.getFunc( ko.toJS( it ), ko.toJS( item ) );
                        return it.nam
                    } );
                }
                item.Timetable = prefx.join( '' ) + timetableName + sufx.join( '' );
                return item
            } ).sort( function ( left, right )
            {
                return left[ 'Timetable' ] === right[ 'Timetable' ] ? 0
                    : left[ 'Timetable' ] < right[ 'Timetable' ] ? -1 : 1;
            } );
            const IsoStartWeek = '1979' + Len_two_Dig( StartWeek.toString() )
            const Week_dayStart = stringToDate( Fdate, 'yyyy-mm-dd', '-' ).toLocaleString( 'en', { weekday: 'short' } )
            const FirstDayDraft = DatesTable.filter( item =>
                item.isoWeek === IsoStartWeek & item.Week_Day === Week_dayStart
            )
            const TimetablesParsed = []
            let items = [];
            let presentTimetable = allpers[ 0 ].Timetable
            allpers.forEach( item =>
            {
                let counter = 0
                if ( presentTimetable !== item.Timetable ) {
                    TimetablesParsed.push(
                        {
                            model: {
                                title: presentTimetable,
                                description: presentTimetable,
                                dateFrom: Fdate,
                                dateTo: Tdate,
                                mode: "Equivalent",
                                timezone: "UTC",
                                items: items
                            }
                        }
                    );
                    presentTimetable = item.Timetable
                    items = [];
                }
                let present_day = parseInt( FirstDayDraft[ 0 ].Number_Day ) + self.InfoFields() - 1
                do {
                    if ( self.DaysOff().indexOf( New_days[ counter ] ) === -1 ) {
                        const tmrange = self.Get_Work_Hours_By_Type_id( self.enum_RequestType( self.Check_Modified_Fields_For_request( stringToDate( New_days[ counter ], 'yyyy-mm-dd', '-' ), item.id ) ), item[ formatDate( DatesTable[ present_day ].Date_Value ) ] )
                        let brkmin = 0;
                        if ( tmrange.startTime ) {
                            const time_offset_hours = new Date( New_days[ counter ] ).getTimezoneOffset() / 60 * -1
                            const time_offset_str = `${ time_offset_hours >= 0 ? '+' : '' }${ Len_two_Dig( Math.floor( time_offset_hours ).toString() ) }:${ Len_two_Dig( Math.floor( ( time_offset_hours - Math.floor( time_offset_hours ) ) * 60 ).toString() ) }`
                            if ( strTimeToMinutes( tmrange.endTime ) - strTimeToMinutes( tmrange.startTime ) > 6 ) {
                                brkmin = 15;
                            }
                            items.push( {
                                userId: item.guid,
                                timeFrom: New_days[ counter ] + "T" + tmrange.startTime + time_offset_str,
                                timeTo: New_days[ counter ] + "T" + tmrange.endTime + time_offset_str,
                                comment: '',
                                breakMinutes: brkmin,
                                commentOnly: false,
                            } );
                        }
                    }
                    present_day += 1;
                    if ( present_day - self.InfoFields() >= daysInDraft ) {
                        present_day = self.InfoFields() - 1;
                    }
                    counter += 1;
                } while ( counter < DaysinNewTimetable );
            } )
            TimetablesParsed.push(
                {
                    model: {
                        title: presentTimetable,
                        description: presentTimetable,
                        dateFrom: Fdate,
                        dateTo: Tdate,
                        mode: "Equivalent",
                        timezone: "UTC",
                        items: items
                    }
                }
            );
            TimetablesParsed.forEach( item =>
            {
                const tm = this.AjaxSendMessage( { Timetables: JSON.stringify( item ) }, '/CreateTimetable', 'POST' )
            } )
            self.actingOnThingsP( false )
        } )
        //this.get_AllRequest()     
        
        
    }    
    self.getFunc = function (func, item) {
        if (func.name !== 'Value' & (func.value1 === 'table_wrkgroup' || func.value2 === 'table_wrkgroup')) {
            func.value1 = func.value1 === 'table_wrkgroup' ? 'table_wrkgroup.name' : func.value1
            func.value2 = func.value2 === 'table_wrkgroup' ? 'table_wrkgroup.name' : func.value2
        }
        switch (func.name) {
            case 'Value':
                return func.value1
            case 'IfExist':
                if (ko.isObservable(item[func.value1]) && ko.isObservable(item[func.value2])) {
                    return ko.toJS(item[func.value1]() === '' ? item[func.value1]() : item[func.value2]())
                } else if (ko.isObservable(item[func.value1]))
                    return ko.toJS(item[func.value1]() === '' ? item[func.value1]() : item[func.value2])
                else if (ko.isObservable(item[func.value2])) {
                    return ko.toJS(item[func.value1] ==='' ? item[func.value1] : item[func.value2]())
                }
                return ko.toJS(item[func.value1] === '' ? item[func.value1] : item[func.value2])
            case 'Left':
                if (ko.isObservable(item[func.value1])) {
                    return item[func.value1]().substring(0, parseInt(func.value2))
                }
                return item[func.value1].substring(0, parseInt(func.value2))
            case 'Right':
                if (ko.isObservable(item[func.value1])) {
                    return item[func.value1]().substring(parseInt(func.value2)*-1)
                }
                return item[func.value1].substring(parseInt(func.value2)*-1)
        }
        return ''
    }
    //All requrired inputs arre filled ? show Button to save Timetables in WWW 
    self.allInputEnered = ko.observable(false);
    // Calculate fields of date ranges 
    self.DatesInFormCreateNEW = ko.computed(function () {        
        if ( ( self.FDdateDraft() !== '' || self.FDdateDraft() !== 'NaN-NaN-NaN' ) & ( self.TDdateDraft() === '' ) || self.TDdateDraft() === 'NaN-NaN-NaN' ) {
            const FDat = stringToDate( self.FDdateDraft(), "yyyy-mm-dd", "-" );
            if ( FDat.getDate() === 1 ) {
                self.TDdateDraft( formatDate( new Date( FDat.getFullYear(), FDat.getMonth() + 1, 0 ) ) );
            } else {
                if ( self.valid_date_to() !== " " & self.valid_date_from() !== " " ) {
                    self.TDdateDraft( formatDate( addDays( FDat, self.Count_daysinDraft() ) ) );
                }
            }
        } else if ( ( self.FDdateDraft() === '' || self.FDdateDraft() === 'NaN-NaN-NaN' ) & ( self.TDdateDraft() !== '' || self.TDdateDraft() !== 'NaN-NaN-NaN' ) ) {
            const TDat = stringToDate( self.TDdateDraft(), "yyyy-mm-dd", "-" );
            if ( TDat.getDate() === new Date( TDat.getFullYear(), TDat.getMonth() + 1, 0 ).getDate() ) {
                self.FDdateDraft( formatDate( new Date( TDat.getFullYear(), TDat.getMonth(), 1 ) ) );
            } else {
                if ( self.valid_date_to() !== " " & self.valid_date_from() !== " " ) {
                    self.FDdateDraft( formatDate( addDays( TDat, ( self.Count_daysinDraft() * -1 ) ) ) );
                }
            }
        } else if ( ( self.FDdateDraft() !== '' || self.FDdateDraft() !== 'NaN-NaN-NaN' ) & ( self.TDdateDraft() !== '' || self.TDdateDraft() !== 'NaN-NaN-NaN' ) ) {
            if ( self.Name_of_Created_Draft() ) {
                if ( self.NamingSettings() ) {
                    if ( self.calculateTablesNames().length > 0 ) {
                        self.allInputEnered( true );
                    }
                } else {
                    self.allInputEnered( true );
                }
            }
            const TDat = stringToDate( self.TDdateDraft(), "yyyy-mm-dd", "-" );
            const FDat = stringToDate( self.FDdateDraft(), "yyyy-mm-dd", "-" );
            if ( FDat > TDat ) {
                if ( FDat.getDate() === 1 ) {
                    self.TDdateDraft( formatDate( new Date( FDat.getFullYear(), FDat.getMonth() + 1, 0 ) ) );
                } else {
                    if ( self.valid_date_to() !== " " & self.valid_date_from() !== " " ) {
                        self.TDdateDraft( formatDate( addDays( FDat, self.Count_daysinDraft() ) ) );
                    }
                }
            }
            
        } else {
            self.allInputEnered( false )
        }
        if ( self.allInputEnered() === true ) {
            viewModel.get_AllRequest()
        }
        if ( self.Data_Type() !== 'Timetable' & self.valid_date_to() !== " " & self.valid_date_from() !== " " ) {            
            self.weeksInDraft( Array.from( [ ...Array( Math.ceil( self.Count_daysinDraft() / 7) ).keys() ].map( x => ++x ) ));
        }
    })
    self.NamingFunctions = ko.observableArray([
        {
            name: 'Chose Function',
            description: 'Please chose Function or value',
            type:'function',
            value1: 'Empty',
            value2: 'Empty'
        }, {
            name: 'Value',
            description: 'Set value',
            type: 'Value',
            value1: 'Empty',
            value2: 'Empty'
        }, {
            name: 'IfExist',
            description: 'Check if Field are not EMPTY<br />True => get value1 : False => get value2 ',
            type: 'function',
            value1: 'Empty',
            value2: 'Empty'
        }, {
            name: 'Left',
            description: 'Get string from left<br />value1: String, value2: Number of signs ',
            type: 'txtfunction',
            value1: 'Empty',
            value2: 'Empty',
        }, {
            name: 'Right',
            description: 'Get string from right<br />value1: String, value2: Number of signs ',
            type: 'txtfunction',
            value1: 'Empty',
            value2: 'Empty'
        },
    ]);
    self.NamesFunctions = ko.computed(function () {
        return self.NamingFunctions().map((item) => item.name);
    })
    self.clearselectedRow = function (data, event) {
        if (data.id === self.selectedRow().id & data.field === self.selectedRow().field) {
            self.selectedRow('');
        }
    };
    self.selectedRow = ko.observable('');
    self.isRowSelected = function (data) {
        if ( self.selectedRow() !== '' ) {
            return data.id === self.selectedRow().id & data.field === self.selectedRow().field;
        } 
        return false        
    };
    self.Prefix = ko.observableArray([]);
    // Fill Sufix with IfExist => (table_wrkgroup, wrk_group)
    self.Sufix = ko.observableArray([
        {
            name: 'IfExist',
            description: 'Check if Field are not EMPTY <br />True => get value1 : False => get value2 ',
            type: 'function',
            value1: 'table_wrkgroup',
            value2: 'wrk_group'
        }
    ]);
    self.namingsTable = ko.computed(function () {
        const tmp = [];
        let ITM = 0;
        if (self.Prefix().length > self.Sufix().length) {
            const maxITM = self.Sufix().length;
            self.Prefix().forEach((item) => {
                if (ITM < maxITM) {
                    tmp.push({
                        id:ITM,
                        Prefix: item,
                        Sufix: self.Sufix()[ITM]
                    })
                } else {
                    if (ITM === maxITM) {
                        tmp.push({
                            id: ITM,
                            Prefix: item,
                            Sufix: {
                                name: 'AddNEW',                                
                                description: 'Add new item',
                                type: 'function',
                                value1: 'val',
                                value2: 'int'
                            }
                        })
                    } else {
                        tmp.push({
                            id: ITM,
                            Prefix: item
                        })
                    }
                }
                ITM += 1;
            })
            tmp.push({
                id: ITM,
                Prefix: {
                    name: 'AddNEW',                    
                    description: 'Add new item',
                    type: 'function',
                    value1: 'val',
                    value2: 'int'
                }            

            })
        } else if (self.Prefix().length < self.Sufix().length) {
            const maxITM = self.Prefix().length;
            self.Sufix().forEach((item) => {
                if (ITM < maxITM) {
                    tmp.push({
                        id: ITM,
                        Prefix: self.Prefix()[ITM],
                        Sufix: item
                    })
                } else {
                    if (ITM === maxITM) {
                        tmp.push({
                            id: ITM,
                            Prefix: {
                                name: 'AddNEW',                                
                                description: 'Add new item',
                                type: 'function',
                                value1: 'val',
                                value2: 'int'
                            },
                            Sufix: item
                        })
                    } else {
                        tmp.push({
                            id: ITM,
                            Sufix: item
                        })
                    }
                }
                ITM += 1;
            })
            tmp.push({
                id: ITM,
                Sufix: {
                    name: 'AddNEW',                    
                    description: 'Add new item',
                    type: 'function',
                    value1: 'val',
                    value2: 'int'
                }                
            })
        } else {
            if ( self.Sufix().length > 0 ) {
                self.Sufix().forEach( ( item ) =>
                {
                    tmp.push( {
                        id: ITM,
                        Prefix: self.Prefix()[ ITM ],
                        Sufix: item
                    } )
                    ITM += 1;
                } )
            }
            tmp.push({                
                Prefix: {
                    name: 'AddNEW',                    
                    description: 'Add new item',
                    type: 'function',
                    value1: 'val',
                    value2: 'int'
                },
                Sufix: {
                    name: 'AddNEW',                   
                    description: 'Add new item',
                    type: 'function',
                    value1: 'val',
                    value2: 'int'
                }
            })            
        }
        return tmp
    }).extend({ deferred: true })
    self.updateTypeFlds = function (id, type) {        
        let tmp;
        if (type === 'Prefix') {
            tmp = self.Prefix()[id];
        } else if (type === 'Sufix') {
            tmp = self.Sufix()[id];
        }
        if (tmp) {           
            self.NamingFunctions().forEach((item) => {
                if (item.name === tmp.name) {
                    if (type === 'Prefix') {
                        {
                            setTimeout(async function () {
                                viewModel.Prefix.valueWillMutate();
                                viewModel.Prefix()[id]['type'] = item.type;
                                viewModel.Prefix()[id]['value1'] = item.value1;
                                viewModel.Prefix()[id]['value2'] = item.value2;
                                viewModel.Prefix()[id]['description'] = item.description;
                                viewModel.Prefix.valueHasMutated();
                            }, 100)
                        }
                    } else if (type === 'Sufix') {
                        {
                            setTimeout(async function () {
                                viewModel.Sufix.valueWillMutate();
                                viewModel.Sufix()[id]['type'] = item.type;
                                viewModel.Sufix()[id]['value1'] = item.value1;
                                viewModel.Sufix()[id]['value2'] = item.value2;
                                viewModel.Sufix()[id]['description'] = item.description;
                                viewModel.Sufix.valueHasMutated();
                            }, 100)
                        }
                    }
                }
            });
        }
    }
    self.updateFlds = function (id, type) {
        let tmp;
        if (type === 'Prefix') {
            tmp = self.Prefix()[id];
        } else if (type === 'Sufix') {
            tmp = self.Sufix()[id];
        }
        if (tmp) {
            self.NamingFunctions().forEach((item) => {
                if (item.name === tmp.name) {
                    if (type === 'Prefix') {
                        {
                            setTimeout(async function () {                                
                                viewModel.Prefix.valueHasMutated();
                            }, 100)
                        }
                    } else if (type === 'Sufix') {
                        {
                            setTimeout(async function () {                               
                                viewModel.Sufix.valueHasMutated();
                            }, 100)
                        }
                    }
                }
            });
        }
    }
    self.removeNamingFieldP = function () {
        self.Prefix.remove(this.Prefix);
    };
    self.addNamingFieldP = function () {
        self.Prefix.push(ko.toJS(self.NamingFunctions()[0]));
    };
    self.removeNamingFieldS = function () {
        self.Sufix.remove(this.Sufix);
    };
    self.addNamingFieldS = function () {
        self.Sufix.push(ko.toJS(self.NamingFunctions()[0]));
    };   
    //*************************************************************
    // Main data observables
    // Main array of json formated db view
    self.persDbview = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    self.personsALL = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // ALl Workgroups
    self.workGroups = ko.observableArray([]).extend({ deferred: true });

    // Get work_group by id
    self.Work_groupByID = function (id) {
        if (!id) {
            id = -100;
        }        
        return self.workGroups()[self.workGroups().indexOf(ko.utils.arrayFirst(self.workGroups(), function (itm) {
            return itm.id() ===id;
        }))];
                 
        //return { name: tm[0].name(), id: tm[0].id() }
    }
    // Time unit options
    self.TimeUnit = ko.observableArray(['Full date', 'ISO week']);
    // Selected time Unit
    self.SelectedTimeUnit = ko.observable('day');
    //String of range ALL of date database report
    self.valid_date_from = ko.observable(" ");
    //String of range ALL of date database report
    self.valid_date_to = ko.observable(" ");
    // Date of refresh Main dataset
    self.emp_sta_refr = ko.observable(" ");
    self.days_in_ALL = ko.observableArray([]);
    // Credentials settings
    self.password = ko.observable('');
    self.name = ko.observable('');
    self.passSet = ko.observable(false);
    //Array of fields in ALL column headers
    self.Table_Name_Fields = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    //Undo values in dataset ALL
    this.undo = function (date, id) {
        if ( date !== undefined & self.message() !== 'Busy') {
            const exist = self.persDbview.indexOf(
                ko.utils.arrayFirst(self.persDbview(), function (item) {
                    return item.id === id;
                }));
            self.persDbview()[exist][date](self.persDbview()[exist][date + 'old']);
        }
    }
    self.ListOfFieds = ko.computed(function () {
        const tmp = ko.utils.arrayFilter(self.Table_Name_Fields(), function (itm) {
            return itm.Type !== 'Day';
        })
        return tmp.map((item) => item.Date_Value).concat(['Empty']);
    })
    //Is pearsons calulation time for type of status code have errors 
    this.alert_time = function (data) {
        return data.timeDif > 0 || Math.abs(data.startDif) || Math.abs(data.endDif)
    }
    // Text for Tip in diferences time button
    this.TxtAlert = function (data, exist, id, symbol) {
        let tmpTxt = ''
        if (data) {
            if (self.Data_Type() === 'Timetable') {
                let isinfo = false;
                if (data.timeDif !== 0) {
                    tmpTxt = 'Work Time diference: ' + data.timeDif * -1 + ' min, ' + '\n';
                    isinfo = true;
                }
                if (Math.abs(data.startDif) !== 0) {
                    tmpTxt = tmpTxt + 'Start Time diference: ' + data.startDif * -1 + ' min, ' + '\n';
                    isinfo = true;
                }
                if (Math.abs(data.endDif) !== 0) {
                    tmpTxt = tmpTxt + 'End Time diference: ' + data.endDif * -1 + ' min, ' + '\n';
                    isinfo = true;
                }
                if (isinfo) {
                    const tq = self.Get_Work_Hours_By_Type_id(self.enum_RequestType(this.Check_request(exist, id)), symbol)
                    if (tq.startTime !== undefined & tq.endTime !== undefined) {
                        tmpTxt = tmpTxt + 'Planned working time :\n   ' + tq.startTime + ' => ' + tq.endTime + ' \n';
                        tmpTxt = tmpTxt + 'Present time on WWW  :\n   ' + intMinutesTostrTime(strTimeToMinutes(tq.startTime) + (parseInt(data.startDif) * -1)) + ' => ' + intMinutesTostrTime(strTimeToMinutes(tq.endTime) + (parseInt(data.endDif) * -1)) + ' \n'
                    }
                }
            }
        }
        return tmpTxt
    }
    // Checki is diferences => used in ko.computed function for sum of changes
    self.Check_Diferences = function (data) {
        let isinfo = false;
        if (data) {
            if (self.Data_Type() === 'Timetable') {
                if (data.timeDif || Math.abs(data.startDif) || Math.abs(data.endDif)) {
                    isinfo = true;
                }
            }
        }
        return isinfo
    }
    // Update requests in personDbview
    self.updateRequests = ko.computed( function ()
    {        
        if ( self.persDbview().length > 0 && self.Requests().length > 0 && self.message() !== 'Busy')
            ko.utils.arrayForEach( self.Requests(), function ( item )
            {
                const cnt = ko.utils.arrayFilter( self.persDbview(), function ( itm )
                {
                    return itm.guid === item.userId();
                } );
                if ( cnt.length > 0 ) {
                    const date_to = item.dateTo() <= stringToDate( self.valid_date_to(), "yyyy-mm-dd", "-" ) ? item.dateTo() : stringToDate( self.valid_date_to(), "yyyy-mm-dd", "-" );
                    const date_from = formatDate( item.dateFrom() > stringToDate( self.valid_date_from(), "yyyy-mm-dd", "-" ) ? item.dateFrom() : stringToDate( self.valid_date_from(), "yyyy-mm-dd", "-" ) )
                    for ( let tm = stringToDate( date_from, "yyyy-mm-dd", "-"  ); tm <= date_to; tm.setDate( tm.getDate() + 1 ) ) {
                        if ( item.typeId() < 1000 && ( item.title() !== "Overtime" && item.title() !== "Home Office" ) ) {
                            if ( cnt[ 0 ][ formatDate( tm ) + 'req' ]() !== undefined ) {
                                cnt[ 0 ][ formatDate( tm ) + 'req' ]( true )
                            }                            
                        }
                    }
                }
            })
    } ).extend( { rateLimit: { timeout: 700, method: "notifyWhenChangesStop" } } );
    // Get Start and End date by emp_type
    self.Get_Work_Hours_By_Type_id = function (req_type_id, symbol) {
        let tmp = ''
        if ( req_type_id === '' ) {
            req_type_id = 1;
        }
        const cnt = ko.utils.arrayFilter(self.RequestTimetable(), function (itm) {
            if (ko.isObservable(symbol)) {
                return itm.emp_type() === req_type_id & itm.name() === symbol();
            }
            return itm.emp_type() === req_type_id & itm.name() === symbol;
        });
        if ( cnt.length > 0) {
            tmp = {
                startTime: cnt[0].time_from(),
                endTime: cnt[0].time_to()
            }
        }
        return tmp
    };
    // Get request type_id if exist in array
    self.enum_RequestType = function (dta) {
        let tmp = ''
        if ( dta.length > 0) {
            dta.forEach(item => {
                const cnt = ko.utils.arrayFilter(self.RequestTypesInfo(), function (itm) {
                    return itm.req_type_id() === item.typeId();
                });
                // only enumerable from array
                if ( cnt.length > 0 ) {
                    if ( cnt[ 0 ].req_type_id() >= 1000 ) {
                        tmp = parseInt( cnt[ 0 ].emp_type() );
                    }
                }
            })
        }
        return tmp
    }
    self.calculateTablesNames = ko.computed(function () {
        if (self.message() !== 'Busy') {
            const timetableName = self.Name_of_Created_Draft()
            const allpers = self.persDbview().map((item) => {                
                let sufx = [];
                let prefx = []
                if (self.NamingSettings()) {
                    sufx = self.Sufix().filter(it => it.name !== 'Chose Function').map((it) => {
                        it.nam = self.getFunc(ko.toJS(it), ko.toJS(item));
                        return it.nam
                    });
                    prefx = self.Prefix().filter(it => it.name !== 'Chose Function').map((it) => {
                        it.nam = self.getFunc(ko.toJS(it), ko.toJS(item));
                        return it.nam
                    });
                }
                return prefx.join('') + timetableName +sufx.join('') ;
            })
            return allpers.filter(onlyUnique).sort(function (left, right) {
                return left === right ? 0
                    : left < right ? -1 : 1;
            })
        }
        return []
    })
    // Calculate Style of table cell
    this.CalcStyle = function ( exist, id, visible )
    {        
        if ( visible ) {
            const tmp = {};
            const tq = this.enum_RequestTypesInfo( this.Check_request( exist, id, true ) );
            if ( self.Table_Name_Fields()[ this.Column_Offset( exist ) ][ 'Full_date' ] === Now_Date() ) {
                tmp.borderColor = 'rgb( 192, 0, 0 )'  //'white rgb( 192, 0, 0 )'
                tmp.borderWidth = 'thin medium'
            }
            if ( this.selected( exist, id ) ) {
                if ( tq.length > 0 ) {                   
                    tmp.background = 'linear-gradient( 110deg,  rgb(253, 205, 59,0.4) 60%, rgb(255, 237, 75,0.5) 60%)' + ',' + tq;
                } else {
                    tmp.background = 'linear-gradient( 110deg,  rgb(253, 205, 59,0.4) 60%, rgb(255, 237, 75,0.5) 60%)';
                }
            } else {
                if ( tq.length > 0 ) {
                    tmp.background = tq;
                } else {
                    tmp.background = '';
                }
            }
            tmp.backgroundColor = this.bckgr( exist );
            return tmp;
        }
        return {}
    }
    // Calculate title if request exist
    this.CalcTitle = function ( exist, id, visible )
    {        
        if ( visible ) {
            return this.enum_requestInfoDescr( this.Check_request( exist, id, ) );
        }
        return ''
    }
    //Get color of selected cells filter in all datasets
    this.bckgr = function (date) {
        if (date !== undefined & self.message() !== 'Busy') {
            const _date = this.Column_Offset(date);
            if (_date < self.Table_Name_Fields().length) {
                if (self.Table_Name_Fields()[_date]['inView']) {
                    const tmp = self.Table_Name_Fields()[_date]['bckgr'];
                    return tmp ? tmp : null;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    // calculate group of columns for borders of types
    self.colgroup_set = function ( date )
    {       
        if ( date !== undefined & self.message() !== 'Busy' ) {
            const _date = this.Column_Offset( date );
            if ( _date < self.Table_Name_Fields().length ) {
                if ( self.Table_Name_Fields()[ _date ][ 'inView' ] ) {
                    const tmp = self.Table_Name_Fields()[ _date ][ 'h_color' ];
                    return tmp ? ' 3px solid ' + tmp : null;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    
    this.h_color = function ( date )
    {
        if ( date !== undefined & self.message() !== 'Busy' ) {
            const _date = this.Column_Offset( date );
            if ( _date < self.Table_Name_Fields().length ) {
                if ( self.Table_Name_Fields()[ _date ][ 'inView' ] ) {
                    const tmp = self.Table_Name_Fields()[ _date ][ 'h_color' ];
                    return tmp ? tmp : null;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    this.f_color = function ( date )
    {
        if ( date !== undefined & self.message() !== 'Busy' ) {
            const _date = this.Column_Offset( date );
            if ( _date < self.Table_Name_Fields().length ) {
                if ( self.Table_Name_Fields()[ _date ][ 'inView' ] ) {
                    const tmp = self.Table_Name_Fields()[ _date ][ 'f_color' ];
                    return tmp ? tmp : null;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    // Is Cell was selected by multi TOLL?
    this.selected = function (exist, id) {
        if (exist !== undefined & self.message() !== 'Busy') {
            const _exist = this.Column_Offset( exist );            
            if ( _exist < self.Table_Name_Fields().length ) {                
                if (self.Table_Name_Fields()[_exist]['inView']) {
                    if ( self.Table_Name_Fields()[ _exist ][ 'Sel_guid_day' ].indexOf( '_' + id + '_' ) > -1 ) {
                        return true;
                    } else {
                        return false ;
                    }
                }
                else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    //Create observable array of binding AlL column with information about selections
    this.Create_presets_for_column_names = function () {
        if (self.valid_date_to() === " " || self.valid_date_from() === " ") {
            console.log('Error: no data Range of Dates not set');
        } else {
            //if (self.Table_Name_Fields() > 0) { self.Table_Name_Fields.removeAll(); }
            self.Table_Name_Fields.valueWillMutate();
            const underlining_array = self.Table_Name_Fields();
            let page = 0;
            let fields = 0;
            let Start_pos = 0;
            let month = '';
            let countMonth = 0;
            let First_Week = '';
            let counter = 0;
            if ( self.Table_Name_Fields().length > 0) {
                underlining_array.splice(0, underlining_array.length);
            };
            const props = [];
            props.push(...self.staticVMfields());
            props.forEach((item) => {
                underlining_array.push(new Table_rows_const_fields(item));
                fields = fields + 1;
            })
            self.InfoFields(fields);
            //if (self.ColumnPages().length > 0) { self.ColumnPages.removeAll(); }
            //self.ColumnPages.valueWillMutate();
            const array_of_col = self.ColumnPages();
            if ( self.ColumnPages().length > 0) {
                array_of_col.splice(0, array_of_col.length);
            };            
            const date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
            for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                underlining_array.push(new Table_rows_Selection(tm));
                if (Start_pos === 0) {
                    Start_pos = counter;
                    First_Week = 'START';
                }
                if (month !== tm.toLocaleString('en', { month: 'short' })) {
                    month = tm.toLocaleString('en', { month: 'short' });
                    countMonth = countMonth + 1;
                }
                if (countMonth > 1) {
                    const day = tm.getDay();
                    const _week = parseInt(tm.getWeekYear().toString() + Len_two_Dig(tm.getWeek().toString()));
                    let offset = 0;
                    if (!day) {
                        offset = 8;
                    } else {
                        offset = day + 1;
                    }
                    array_of_col.push({
                        number: page,
                        name: First_Week + ' => ' + _week.toString(),
                        start: Start_pos + fields,
                        End: counter + (8 - offset) + fields + 2
                    });
                    page = page + 1;
                    countMonth = 0;
                    First_Week = _week.toString();
                    Start_pos = counter + (8 - offset) - 5;
                }
                counter = counter + 1;
            }
            array_of_col.push({
                number: page,
                name: First_Week + ' => END',
                start: Start_pos + fields,
                End: counter + fields + 1
            });
            self.Table_Name_Fields.valueHasMutated();
            self.ColumnPages.valueHasMutated();
        }
    };

    //Current timetables record used in ViewModel
    self.Current_timetable = ko.observable();
    self.Current_timetable_items = ko.observableArray( [] )
    self.Current_multiTimetables = ko.observable( false );

    //Current Multitab computed methods
    this.CurrentselectedItemsHrnestId = ko.pureComputed( function ()
    {
        const str = self.Current_timetable_items()
            .map( function ( item )
            {
                return item.hrnest_id();
            } )
            .join( "," )

        return str;
    }, this );

    this.CurrentselectedItemsId = ko.pureComputed( function ()
    {
        const str = self.Current_timetable_items()
            .map( function ( item )
            {
                return item.id();
            } )
            .join( "," )

        return str;
    }, this );
    
    this.CurrentselectedItemsStr = ko.pureComputed( function ()
    {
        const str = self.Current_timetable_items()
            .map( function ( item )
            {
                return item.title();
            } )
            .join( ", " )

        return str || "-- No timetables selected --";
    }, this );

    //Update /check ranges in ViewModel
    this.update_ranges = function () {
        self.txt(' => Check Date Ranges');
        const timId = self.Current_timetable();
        if (self.Frange()) {
            if (self.valid_date_from() !== " ") {
                if (!(stringToDate(timId.date_from(), "yyyy-mm-dd", "-") <= stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-") & stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-") <= stringToDate(timId.date_to(), "yyyy-mm-dd", "-"))) {
                    self.valid_date_from(timId.date_from());
                };
            } else {
                self.valid_date_from(timId.date_from());
            };
            if (self.valid_date_to() !== " ") {
                if (!(stringToDate(timId.date_from(), "yyyy-mm-dd", "-") <= stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-") & stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-") <= stringToDate(timId.date_to(), "yyyy-mm-dd", "-"))) {
                    self.valid_date_to(timId.date_to());
                };
            } else {
                self.valid_date_to(timId.date_to());
            };
            if (self.valid_date_from() !== " " & self.valid_date_to() !== " ") {
                if (stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-") > stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-")) {
                    const tmp = new Date(stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"));
                    tmp.setDate(tmp.getDate() + 30);
                    self.valid_date_to(formatDate(tmp));
                }
            }
        } else {
            self.valid_date_from(timId.date_from());
            self.valid_date_to(timId.date_to());
        }
        self.txt('');
    };
    //************************************************************
    // Modify users info fields
    self.personsALL_mod = ko.observableArray([]);    
    //Selected for edit user
    self.selectedUser = ko.observable('');
    self.isUserSelected = function (data) {
        if ( self.selectedUser() !== '') {
            return data.id === self.selectedUser().id & data.field === self.selectedUser().field;
        } else {
            return false
        }
    };
    self.clearUser = function (data, event) {
        if (data.id === self.selectedUser().id & data.field === self.selectedUser().field) {
            self.selectedUser('');
        }
    };
    self.removeID = function (id) {
        self.persDbview.remove(function (item) {
            return item.id === id;
        });
    }
    self.selectedUserPER = ko.observable('');
    self.oldvalPER = ko.observable('');
    self.newvalPER = ko.observable('');
    self.onchange = ko.observable(false);
    self.selectedUserPER.subscribe(function (newValue) {
        if ( newValue !== '') {
            if ( self.oldvalPER() !== '') {
                if (self.oldvalPER().id !== newValue.id()) {
                    self.oldvalPER(ko.toJS(newValue));              
                } 
            } else {
                self.oldvalPER(ko.toJS(newValue));               
            }
            self.newvalPER(ko.toJS(newValue));
        } else if (!self.onchange()) {
            self.oldvalPER('');
        }        
        if ( self.oldvalPER() !== '' & newValue === '' & self.onchange()) {
            self.onchange(false);
            const dta = self.oldvalPER()['data'];
            if (dta.attr === 'Not_modified') {
                const cnt = ko.utils.arrayFilter(self.personsALL(), function (itm) {
                    return itm.Id() === self.oldvalPER().id;
                });                
                if (cnt[0][self.oldvalPER().field]() !== dta[self.oldvalPER().field]) {
                    self.personsALL_mod.push(dta);
                    cnt[0].attr('Modified');                    
                }
            } else if (dta.attr === 'Modified') {
                const cnt = ko.utils.arrayFilter(self.personsALL_mod(), function (itm) {
                    return itm.Id === self.oldvalPER().id;
                });
                setTimeout( async function ()
                {
                    viewModel.personsALL.valueHasMutated();
                    scrollTbl.scroll()
                }, 10);
                               
                if (cnt[0][self.oldvalPER().field] === dta[self.oldvalPER().field] || self.newvalPER()['data'][self.oldvalPER().field] === dta[self.oldvalPER().field]) {
                    // compare all fields                    
                    let fnd = true;
                    for (let propt in self.newvalPER()['data']) {                       
                        if (self.newvalPER()['data'][propt] !== cnt[0][propt]) {
                            if (propt !== 'attr' & propt !== self.oldvalPER().field) {
                                fnd = false;
                                break;
                            }                            
                        }
                    }
                    if ( fnd ) {
                        const cnt1 = ko.utils.arrayFilter(self.personsALL(), function (itm) {
                            return itm.Id() === self.oldvalPER().id;
                        });
                        cnt1[0].attr('Not_modified');
                        self.personsALL_mod.remove(cnt1[0]);
                    }                    
                }               
            }
            self.oldvalPER('');
        } else {
            self.onchange(false);
        }
    });
    self.selPer = function (data) {
        self.selectedUserPER(data);
    }
    self.isUserSelectedPER = function (data) {
        if ( self.selectedUserPER() !== '') {
            return data.id === self.selectedUserPER().id & data.field === self.selectedUserPER().field;
        } else {
            return false
        }
    };
    self.clearUserPER = function (data, event) {
        if (data.id === self.selectedUserPER().id & data.field === self.selectedUserPER().field) {
            self.onchange(true);
            self.selectedUserPER('');
        }                     
    };    
    //************************************************************
    // Manage requests

    // Add Modify Delete Enumerable request
    self.request_user = ko.observableArray( [] );


    //************************************************************
    // Manage requests
    // Request of Users
    self.Requests = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // Array of enumerable types request info
    self.RequestTypesInfo = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // Array of enumerable types request
    self.RequestEnumerable = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // Array of requests visible in menu on www
    self.RequestTypesMenu = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // Array of all timetable requests in all emp_types requests
    self.RequestTimetable = ko.observableArray([]).extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    // Check if person have request in selected day
    this.Check_request = function (exist, id, approved = false) {
        const tmpmess = [];
        if (exist !== undefined & self.message() !== 'Busy') {
            exist = this.Column_Offset(exist);
            if (exist < self.Table_Name_Fields().length) {
                if (self.Table_Name_Fields()[exist]['inView']) {
                    ko.utils.arrayForEach(self.Requests(), function (item) {
                        if ( item.emp_id() === id ) {
                            const tmda = self.Table_Name_Fields()[ exist ][ 'Date_Value' ];
                            if ( ( approved & ( item.status().indexOf( 'Approved' ) > -1 || item.title() === "Overtime" || item.title() === "Home Office" || item.status() === 'AddBYwww'  )) || !approved ) {
                                if ( dates.inRange( tmda, item.dateFrom(), item.dateTo() ) ) {
                                    tmpmess.push( item );
                                }
                            }
                        }
                    })
                }
            }
        }
        return tmpmess
    }
    // Get styles from reqests
    this.enum_RequestTypesInfo = function (dta) {
        let tmp = ''
        if ( dta.length > 0) {
            dta.forEach((item) => {
                const cnt = ko.utils.arrayFilter(self.RequestTypesInfo(), function (itm) {
                    return itm.req_type_id() === item.typeId();
                });
                if ( cnt.length > 0) {
                    if (cnt[0].info() !== undefined) {
                        tmp = tmp + ',' + cnt[0].info();
                    }
                }
            })
        }
        return tmp.substring(1)
    }
    // Get description from request
    this.enum_requestInfoDescr = function (dta) {
        let tmp = ''
        if ( dta.length > 0) {
            dta.forEach((item) => {
                tmp = tmp + 'Status:' + item.status() + ' Title:' + item.title() + '\n' + '           DateFrom:' + formatDate(item.dateFrom()) + ' DateTo:' + formatDate(item.dateTo()) + '\n';
            });
        }
        return tmp
    }
    //Request enum from range dates in selected timetable
    self.RequestTimetableEnum = ko.observableArray([]);
    // Request Modification table
    self.Request_Mod = ko.observableArray( [] );

    // Compact requests and send into server
    this.compactRequests = function () {
        this.get_AllEnumerbleRequest();
        const tmp = self.Sort_Request_Mod();        
        let last_id;
        let last_day;
        let last_typeId;
        let counter = 0;
        let MaxSize = tmp().length - 1;
        let chk = false;
        tmp().forEach((itm) => {
            last_id = itm.emp_id;
            last_day = stringToDate(itm.dateTo, "yyyy-mm-dd", "-");
            last_typeId = itm.typeId;
            do {
                chk = false;
                if (counter < MaxSize) {
                    if (self.Request_Mod()[counter + 1]['emp_id'] === last_id) {
                        if (parseInt((stringToDate(self.Request_Mod()[counter + 1]['dateTo'], "yyyy-mm-dd", "-") - last_day) / (1000 * 60 * 60 * 24)) === 1) {
                            if (tmp()[0]['typeId'] === last_typeId) {
                                chk = true;
                                itm.dateTo = self.Request_Mod()[counter + 1]['dateTo'];
                                MaxSize = MaxSize - 1;
                                last_day = stringToDate(self.Request_Mod()[counter + 1]['dateTo'], "yyyy-mm-dd", "-");
                                tmp.splice(counter + 1, 1);
                            }
                        }
                    }
                }
            } while (chk);
            counter = counter + 1;
        })
        const trans = generateUUID();
        // FIX: Dont save guid in self transaction table 
        //if (self.Count_Changes() == 0) { self.transaction(self.transaction() + 'Trans:' + trans) }
        self.txt(' => Calulate request ...');               
        
        const tm=this.AjaxSendMessage({ Request_users: JSON.stringify(tmp()) }, '/request?' + "&Transaction=" + trans, 'PUT');
        //console.log(underlining_array)  

        setTimeout(async function () {
            viewModel.get_AllRequest(true);
            viewModel.get_recrdset(false);
        },tmp().length * 100 + 3000);
    }

    // Check existence and return array of enumerable requests in person id and date range
    this.Check_enumerable_Request = function (id, Dfrom, Dto) {
        const tmpmess = [];
        ko.utils.arrayForEach(self.RequestTimetableEnum(), function (item) {
            if (item.emp_id() === id) {
                if (dates.inRange(Dfrom, item.dateFrom(), item.dateTo()) || dates.inRange(Dto, item.dateFrom(), item.dateTo())) {
                    tmpmess.push(item);
                }
            }
        })
        return tmpmess
    }

    // Sort Modyfication recquest Table by dateFrom and emp_id
    self.Sort_Request_Mod = function () {
        
        return self.Request_Mod.sort(function (l, r) {
            return l.emp_id === r.emp_id ? l.dateFrom === r.dateFrom ? 0 : l.dateFrom > r.dateFrom ? 1 : -1 : l.emp_id > r.emp_id ? 1 : -1
        });       
    };

    //************************************************************
    // Function for Modal Request Edit by selected user
    self.reqDF = ko.observable(formatDate( addDays( new Date(), -365 ) ) );
    self.reqDT = ko.observable( formatDate( addDays( new Date(), 365 ) ) );
    self.userFrmRequests = ko.observableArray( [] );
    self.userFrmRequests_mod = ko.observableArray( [] );

    // only twoi types are avaliable non_edit and edit becouse uid field dont exist
    self.LimituserFrmRequests_Name_Fields = ko.observableArray( [] )
    self.selectedREQ = ko.observable('');
    self.oldvalREQ = ko.observable('');
    self.newvalREQ = ko.observable('');
    self.onchangeREQ = ko.observable( false );
    self.persAttr = ko.computed( function ()
    {
        if ( self.personsALL().length > 0 ) {
            return ko.utils.arrayFilter( self.personsALL(), function ( itm )
            {
                return itm.uid() === self.CurrRow()
            } )[0];
        }
        return null
    } )
    self.AddedItems = ko.computed( function ()
    {
        const tmp = ko.utils.arrayFilter( self.userFrmRequests(), function ( item )
        {
            return item.attr() === 'Added'
        })
        if ( tmp ) {
            let maxv = 0
            tmp.forEach( itm => {
                if ( itm.number() > maxv ) {
                    maxv = itm.number()
                }
            } )
            return maxv + 1
        } else {
            return 1
        }

    } )
    self.removeRequest = function (numb)
    {
        const cnt = ko.utils.arrayFilter( self.userFrmRequests(), function ( itm )
        {
            return itm.number() === numb;
        } )
        if ( cnt.length > 0 ) {
            cnt[ 0 ].attr( 'Deleted')
        }
    }
    self.addRequest = function ()
    {
        const item = {
            number: self.AddedItems(),
            attr: 'Added',
            userId: self.CurrRow(),
            emp_id: self.persAttr().Id(),
            date_From: Now_Date(),
            date_To: Now_Date(),            
            description: self.RequestOnlyEnumerable()[0],
        }
        self.userFrmRequests.push( new request_Data( item ))
    }
    self.selectedREQ.subscribe(function (newValue) {
        if ( newValue !== '') {
            if ( self.oldvalREQ() !== '') {
                if ( self.oldvalREQ().number !== newValue.number()) {
                    self.oldvalREQ(ko.toJS(newValue));
                } 
            } else {
                self.oldvalREQ(ko.toJS(newValue));
            }
            self.newvalREQ(ko.toJS(newValue));
        } else if (!self.onchangeREQ()) {
            self.oldvalREQ('');
        }        
        if ( self.oldvalREQ() !== '' & newValue === '' & self.onchangeREQ()) {
            self.onchangeREQ(false);
            const dta = self.oldvalREQ()['data'];
            if (dta.attr === 'Not_modified') {
                const cnt = ko.utils.arrayFilter( self.userFrmRequests(), function (itm) {
                    return itm.number() === self.oldvalREQ().number;
                });                
                if ( cnt[ 0 ][ self.oldvalREQ().field ]() !== dta[ self.oldvalREQ().field]) {
                    self.userFrmRequests_mod.push(dta);
                    cnt[0].attr('Modified');                    
                }
            } else if (dta.attr === 'Modified') {
                const cnt = ko.utils.arrayFilter( self.userFrmRequests_mod(), function (itm) {
                    return itm.number() === self.oldvalREQ().number;
                });
                setTimeout( async function ()
                {
                    viewModel.userFrmRequests.valueHasMutated();                    
                }, 10);
                               
                if (cnt[0][self.oldvalREQ().field] === dta[self.oldvalREQ().field] || self.newvalREQ()['data'][self.oldvalREQ().field] === dta[self.oldvalREQ().field]) {
                    // compare all fields                    
                    let fnd = true;
                    for (let propt in self.newvalREQ()['data']) {                       
                        if (self.newvalREQ()['data'][propt] !== cnt[0][propt]) {
                            if (propt !== 'attr' & propt !== self.oldvalREQ().field) {
                                fnd = false;
                                break;
                            }                            
                        }
                    }
                    if ( fnd ) {
                        const cnt1 = ko.utils.arrayFilter( self.userFrmRequests(), function (itm) {
                            return itm.number() === self.oldvalREQ().number;
                        });
                        cnt1[0].attr('Not_modified');
                        self.userFrmRequests_mod.remove(cnt1[0]);
                    }                    
                }               
            }
            self.oldvalREQ('');
        } else {
            self.onchangeREQ(false);
        }
    } ); 
    
    self.selReq = function ( data )
    {
        self.selectedREQ( data );
        return true
    }
    self.isSelectedREQ = function ( data )
    {
        if ( self.selectedREQ() !== '' ) {
            return data.number === self.selectedREQ().number & data.field === self.selectedREQ().field;
        } else {
            return false
        }
    };
    self.clearREQ = function ( data, event )
    {
        if ( data.number === self.selectedREQ().number & data.field === self.selectedREQ().field ) {
            self.onchangeREQ( true );
            self.selectedREQ( '' );
        }
    };
    self.NullBodyHR = ko.pureComputed( function ()
    {
        //return Math.round(window.innerHeight * 0.82) - (typeof (self.pagedRows) != 'undefined' ? self.pagedRows.length * 12 : 0)
        let tmp;
        const pag = self.userFrmRequests().length;
        const wnd = $( "#AddModifyNonStandardTime" ).height();
        if ( pag === 0 ) {
            tmp = wnd * 0.83;
        } else {
            if ( ( wnd * 0.83 ) - ( pag * 35 + 130 ) > 0 ) {
                tmp = ( Math.round( wnd * 0.83 ) - ( pag * 35 + 130 ) );
            } else {
                tmp = 0;
            }
        }
        return tmp;
    } ).extend( { deferred: true } );

    self.RequestEnumAdd = ko.computed( function ()
    {
        return ko.utils.arrayFilter( self.userFrmRequests(), function ( itm )
        {
            return itm.attr() === "Added";
        } ).map( function(item) {
            return {
                number: null,
                userId: item.userId(),
                emp_id: item.emp_id(),
                isWholeDay: true,
                status: "AddBYwww",
                title: item.description().description(),
                dateFrom: item.date_From(),
                dateTo: item.date_To(),
                typeId: item.description().req_type_id(),
            }
        } )
        
    } )
    self.RequestEnumMod = ko.computed( function ()
    {
        return ko.utils.arrayFilter( self.userFrmRequests(), function ( itm )
        {
            return itm.attr() === 'Modified';
        } ).map( function ( item )
        {
            const tmp = ko.utils.arrayFilter( viewModel.userFrmRequests_mod(), function ( itm )
            {
                return itm.number === item.number()
            } )
            return {
                number: item.number(),
                userId: item.userId(),
                emp_id: item.emp_id(),
                isWholeDay: true,
                status: "AddBYwww",
                title: item.description().description(),
                old_dateFrom: tmp[ 0 ].date_From,
                old_dateTo: tmp[ 0 ].date_To,
                dateFrom: item.date_From(),
                dateTo: item.date_To(),
                typeId: item.description().req_type_id(),
            }
        } )

    } )
    
    self.RequestEnumDel = ko.computed( function ()
    {
        return ko.utils.arrayFilter( self.userFrmRequests(), function ( itm )
        {
            return itm.attr() === 'Deleted';
        } ).map( function ( item )
        {
            return {
                number: item.number(),
                userId: item.userId(),
                emp_id: item.emp_id(),
                isWholeDay: true,
                status: "AddBYwww",
                title: item.description().description(),
                dateFrom: item.date_From(),
                dateTo: item.date_To(),
                typeId: item.description().req_type_id(),
            }
        } )

    } )

    self.requestRange = ko.computed( function ()
    {
        if ( self.RequestEnumDel().length > 0 || self.RequestEnumMod().length || self.RequestEnumAdd().length ) {
            return [
                self.RequestEnumMod().map( ( { dateFrom, dateTo, old_dateFrom, old_dateTo} ) => (
                    {
                        dateFrom: stringToDate( dateFrom, 'yyyy-mm-dd', '-' ) < stringToDate( old_dateFrom, 'yyyy-mm-dd', '-' ) ? stringToDate( dateFrom, 'yyyy-mm-dd', '-' ) : stringToDate( old_dateFrom, 'yyyy-mm-dd', '-' ) ,
                        dateTo: stringToDate( dateTo, 'yyyy-mm-dd', '-' ) > stringToDate( old_dateTo, 'yyyy-mm-dd', '-' ) ? stringToDate( dateTo, 'yyyy-mm-dd', '-' ) : stringToDate( old_dateTo, 'yyyy-mm-dd', '-' )
                    } ) ).reduce( function ( prev, current )
                    {
                        return {
                            dateFrom: ( prev.dateFrom && prev.dateFrom < current.dateFrom ) ? prev.dateFrom : current.dateFrom,
                            dateTo: ( prev.dateTo && prev.dateTo > current.dateTo ) ? prev.dateTo : current.dateTo,
                        }
                    }, {} ),
                self.RequestEnumAdd().map( ( {dateFrom, dateTo }) => (
                    {
                        dateFrom: stringToDate( dateFrom, 'yyyy-mm-dd', '-' ),
                        dateTo: stringToDate( dateTo, 'yyyy-mm-dd', '-' )
                    } ) ).reduce( function ( prev, current )
                    {
                        return {
                            dateFrom: ( prev.dateFrom && prev.dateFrom < current.dateFrom ) ? prev.dateFrom : current.dateFrom,
                            dateTo: ( prev.dateTo && prev.dateTo > current.dateTo ) ? prev.dateTo : current.dateTo,
                        }
                    }, {} ),
                self.RequestEnumDel().map( ( { dateFrom, dateTo } ) => (
                    {
                        dateFrom: stringToDate( dateFrom, 'yyyy-mm-dd', '-' ),
                        dateTo: stringToDate( dateTo, 'yyyy-mm-dd', '-' )
                    } ) ).reduce( function ( prev, current )
                    {
                        return {
                            dateFrom: ( prev.dateFrom && prev.dateFrom < current.dateFrom ) ? prev.dateFrom : current.dateFrom,
                            dateTo: ( prev.dateTo && prev.dateTo > current.dateTo ) ? prev.dateTo : current.dateTo,
                        }
                    }, {} ),
            ].filter(
                element => element.dateFrom !== undefined && element.dateTo !== undefined
             ).reduce( function ( prev, current )
            {
                return {
                    dateFrom: ( prev.dateFrom && prev.dateFrom < current.dateFrom ) ? prev.dateFrom : current.dateFrom,
                    dateTo: ( prev.dateTo && prev.dateTo > current.dateTo ) ? prev.dateTo : current.dateTo,
                }
             }, {} )
        } else {
            return null
        }
    })

    self.SaveChangesREQ = function ()
    {
        self.actingOnThingsR( true );
        const trans = generateUUID();
        self.transaction( self.transaction() + 'Trans:' + trans )
        const timId = self.Current_timetable();                
        setTimeout( async function ()
        {
            socket.emit( 'Check_Range', {
                Dataset: 'Range', dateFrom: formatDate( self.requestRange().dateFrom ), dateTo: formatDate(self.requestRange().dateTo),Trans: trans, type:'Enumerable'
            } );
        }, 20 );        
    }    
    self.SaveREQ = function()
    {        
        if ( self.RequestEnumDel().length > 0 ) {
            const result =this.AjaxSendMessage( { Request_users: JSON.stringify( self.RequestEnumDel() ) }, '/request', 'DELETE' );
        }

        if ( self.RequestEnumMod().length > 0 ) {
            const result =this.AjaxSendMessage( { Request_users: JSON.stringify( self.RequestEnumMod() ) }, '/request', 'POST' );
        }

        if ( self.RequestEnumAdd().length > 0 ) {
            const result =this.AjaxSendMessage( { Request_users: JSON.stringify( self.RequestEnumAdd() ) }, '/request', 'PUT' );
        }
        setTimeout( async function ()
        {
            self.get_UserEnumerbleRequest();
            self.actingOnThingsR( false );
        }, 1000 );

    }
    this.UndoReq = function ( data )
    {
        if ( data.attr() === "Added" ) {
            self.userFrmRequests.remove(data)
        } else {
            const cnt = ko.utils.arrayFilter( self.userFrmRequests(), function ( itm )
            {
                return itm.number() === data.number();
            } );
            const cnt1 = ko.utils.arrayFilter( self.userFrmRequests_mod(), function ( itm )
            {
                return itm.number === data.number();
            } );
            if ( cnt1.length > 0 ) {
                for ( let item in cnt1[ 0 ] ) {
                    cnt[ 0 ][ item ]( cnt1[ 0 ][ item ] );
                }
            }
            cnt[ 0 ].attr( 'Not_modified' );
        }        
    }

    //************************************************************
    // Function for Modal select Timetable
    self.setOptionTimeCond = function (option, item) {
        if (typeof item !== 'undefined') {
            if (self.TMPData_Type() === 'Timetable') {
                ko.applyBindingsToNode(option, {
                    css: 'NodeTMT' + item.Present(), attr: {
                        'title': item.Type() + '\n' + 'Timetable Date Range' + '\n' + 'Date From: ' + item.date_from() + ' <=> Date To: ' + item.date_to()
                    }
                }, item);
            } else {
                ko.applyBindingsToNode(option, {
                    css: 'NodeTMT' + item.Present(), attr: {
                        'title': item.Type() + '\n' + 'Draft Date Range' + '\n' + 'Numer of weeks: ' + DaysBetween(stringToDate(item.date_from(), 'yyyy-mm-dd', '-'), stringToDate(item.date_to(), 'yyyy-mm-dd', '-'))/7
                    }
                }, item);
            }
        }
    }
    //Enable multi timetables mode
    self.multiTimetables = ko.observable( false );
    //Copy of String of range ALL of date database report
    self.tmpvalid_date_from = ko.observable(" ");
    //Copy of String of range ALL of date database report
    self.tmpvalid_date_to = ko.observable(" ");
    //Copy of selected Timetable
    self.tmpCurrent_timetable = ko.observable();
    //List of timetables
    self.TimetabList = ko.observableArray([]);
    //Ajax call on refresh main data with Filtering datetime range ?
    self.Frange = ko.observable( false );    
    //Apply selected timetable and start refresh
    this.tmpStart_refr = function ()
    {
        if ( ( self.multiTimetables() && self.selectedItemsStr() !== '-- No timetables selected --' ) || !self.multiTimetables() ) {
            self.actingOnThingsP( true );
            if ( !self.TMPCreateDraft() ) {
                setTimeout( function () { $( "#dialog-form" ).modal( "hide" ); }, 50 );
            }
            self.allInputEnered( false )
            self.dataExchangeCount();
            self.dataExchange( false );
            const vfrom = self.SelectedTimeUnit() === 'ISO week' ? formatDate( getStart_isoWeek( self.tmpvalid_date_from() ) ) : self.tmpvalid_date_from();
            const vto = self.SelectedTimeUnit() === 'ISO week' ? formatDate( addDays( getStart_isoWeek( self.tmpvalid_date_to() ), 6 ) ) : self.tmpvalid_date_to();
            self.valid_date_to( vto );
            self.valid_date_from( vfrom );
            self.Current_multiTimetables( self.multiTimetables() )
            if ( self.Data_Type() === 'Timetable' && self.Current_multiTimetables ) {
                self.Current_timetable_items( self.selectedItems() )
                self.Current_timetable( self.selectedItems()[ 0 ] )
            } else {
                self.Current_timetable( self.tmpCurrent_timetable() );
            }
            self.Current_timetable( self.tmpCurrent_timetable() );
            self.Data_Type( self.TMPData_Type() );
            setTimeout( function ()
            {
                viewModel.check_Dataset();
            }, 200 );

            self.ReplaceMetods( [ 'Replace Selected Value', 'Copy Values From Person' ] );
            // this.Start_refr();
        } else {
            !alert( "Please Select Timetable!" );
        }
    }
    //Update avaliable ranges on modal chose dataset and ranges
    self.tmpupdate_ranges = function () {
        const timId = self.tmpCurrent_timetable()
        if (self.tmpvalid_date_from() !== " ") {
            if (self.tmpvalid_date_from().indexOf("-W") === -1) {
                if (self.SelectedTimeUnit() === 'ISO week') {
                    self.tmpvalid_date_from(Date_toHTML_Week(self.tmpvalid_date_from()));
                }
            } else {
                if (self.SelectedTimeUnit() !== 'ISO week') {
                    self.tmpvalid_date_from(formatDate(getStart_isoWeek(self.tmpvalid_date_from())));
                }
            }
        }
        if (self.tmpvalid_date_to() !== " ") {
            if (self.tmpvalid_date_to().indexOf("-W") === -1) {
                if (self.SelectedTimeUnit() === 'ISO week') {
                    self.tmpvalid_date_to(Date_toHTML_Week(self.tmpvalid_date_to()));
                }
            } else {
                if (self.SelectedTimeUnit() !== 'ISO week') {
                    self.tmpvalid_date_to(formatDate(getStart_isoWeek(self.tmpvalid_date_to())));
                }
            }
        }
        if (self.SelectedTimeUnit() === 'ISO week') {
            if (self.tmpvalid_date_from() !== " ") {
                if (!(getStart_isoWeek(timId.date_from()) <= getStart_isoWeek(self.tmpvalid_date_from()) & getStart_isoWeek(self.tmpvalid_date_from()) <= getStart_isoWeek(timId.date_to()))) {
                    self.tmpvalid_date_from(Date_toHTML_Week(timId.date_from()));
                };
            } else {
                self.tmpvalid_date_from(Date_toHTML_Week(timId.date_from()));
            };
            if (self.tmpvalid_date_to() !== " ") {
                if (!(getStart_isoWeek(timId.date_from()) <= getStart_isoWeek(self.tmpvalid_date_to()) & getStart_isoWeek(self.tmpvalid_date_to()) <= getStart_isoWeek(timId.date_to()))) {
                    self.tmpvalid_date_to(Date_toHTML_Week(timId.date_to()));
                };
            } else {
                self.tmpvalid_date_to(Date_toHTML_Week(timId.date_to()));
            };
            if (self.tmpvalid_date_from() !== " " & self.tmpvalid_date_to() !== " ") {
                if (getStart_isoWeek(self.tmpvalid_date_from()) > getStart_isoWeek(self.tmpvalid_date_to())) {
                    const tmp = new Date(getStart_isoWeek(self.tmpvalid_date_from()));
                    tmp.setDate(tmp.getDate() + 30);
                    self.tmpvalid_date_to(Date_toHTML_Week(formatDate(tmp)));
                }
            }
        } else {
            if (self.tmpvalid_date_from() !== " ") {
                if (!(stringToDate(timId.date_from(), "yyyy-mm-dd", "-") <= stringToDate(self.tmpvalid_date_from(), "yyyy-mm-dd", "-") & stringToDate(self.tmpvalid_date_from(), "yyyy-mm-dd", "-") <= stringToDate(timId.date_to(), "yyyy-mm-dd", "-"))) {
                    self.tmpvalid_date_from(timId.date_from());
                };
            } else {
                self.tmpvalid_date_from(timId.date_from());
            };
            if (self.tmpvalid_date_to() !== " ") {
                if (!(stringToDate(timId.date_from(), "yyyy-mm-dd", "-") <= stringToDate(self.tmpvalid_date_to(), "yyyy-mm-dd", "-") & stringToDate(self.tmpvalid_date_to(), "yyyy-mm-dd", "-") <= stringToDate(timId.date_to(), "yyyy-mm-dd", "-"))) {
                    self.tmpvalid_date_to(timId.date_to());
                };
            } else {
                self.tmpvalid_date_to(timId.date_to());
            };
            if (self.tmpvalid_date_from() !== " " & self.tmpvalid_date_to() !== " ") {
                if (stringToDate(self.tmpvalid_date_from(), "yyyy-mm-dd", "-") > stringToDate(self.tmpvalid_date_to(), "yyyy-mm-dd", "-")) {
                    const tmp = new Date(stringToDate(self.tmpvalid_date_from(), "yyyy-mm-dd", "-"));
                    tmp.setDate(tmp.getDate() + 30);
                    self.tmpvalid_date_to(formatDate(tmp));
                }
            }
        }
    };
    // Filter timetables if range of dates are selected
    self.filterTimetableList = ko.computed( function ()
    {
        if ( self.Frange() && !( self.multiTimetables() && self.tempSelection().length > 0 ) ) {
            const rec_date_from = stringToDate( self.tmpvalid_date_from(), 'yyyy-mm-dd', '-' )
            const rec_date_to = stringToDate( self.tmpvalid_date_to(), 'yyyy-mm-dd', '-' )
            if ( isValidDate( rec_date_from ) & isValidDate( rec_date_to ) ) {
                if ( rec_date_from <= rec_date_to ) {
                    const dataset = self.TimetabList().filter( item => (
                        stringToDate( item.date_from(), 'yyyy-mm-dd', '-' ) <= rec_date_from && stringToDate( item.date_to(), 'yyyy-mm-dd', '-' ) >= rec_date_to
                    ) ).map( item => item )
                    return dataset
                } else {
                    self.tmpupdate_ranges();
                    return self.TimetabList()
                }
            }
        }
        if ( self.multiTimetables() && self.tempSelection().length > 0 ) {
            const dataset = self.TimetabList().filter( item => (
                item.date_from() === self.tempSelection()[ 0 ].date_from() && item.date_to() === self.tempSelection()[ 0 ].date_to()
            ) ).map( item => item )
            self.tmpCurrent_timetable( self.tempSelection()[ 0 ])
            return dataset
        }
        return self.TimetabList()
    } ).extend( { rateLimit: { timeout: 2000, method: "notifyWhenChangesStop" } } ).extend( { deferred: true } );
    // Show dialog for chose ranges and timetable ID
    this.get_dat = function () {
        let Dorefr = true;
        if (self.Count_Changes()) {
            if (!confirm('Are you sure you want to refresh data? \n Some changes are not saved => ' + self.Count_Changes() + ' items...')) {
                Dorefr = false;
            }
        };
        if ( Dorefr ) {
            self.multiTimetables( false )
            self.selectedItems.removeAll()
            this.get_RequestTypes();
            this.get_RequestTypesInfo();
            this.get_RequestEnumerable();
            this.get_timetables();
            this.get_licenses();
            this.get_limitChanges();
            //this.UsersGetALL();
            $("#tabs").tabs();           
            $("#dialog-form").modal("show");
        }
    }
    //************************************************************
    // Multi Timetable check box
    //************************************************************

    this.selectedItems = ko.observableArray();

    /* Includes only the checked items */
    self.tempSelection = ko.pureComputed( function ()
    {
        return self.TimetabList().filter( function ( item )
        {
            return item.Checked();
        } );
    }, this );
    
    /* Builds a comma separated string of selected items */
    this.selectedItemsStr = ko.pureComputed( function ()
    {
        const str = this.selectedItems()
            .map( function ( item )
            {
                return item.title();
            } )
            .join( ", " )

        return str || "-- No timetables selected --";
    }, this );

    /* Determines whether the selectable options are displayed. */
    this.optionsShown = ko.observable( false );

    this.optionsShown.subscribe( function ()
    {
        this.updateSelections();
    }, this );    

    this.toggleOptions = function ()
    {
        this.optionsShown( !this.optionsShown() );
    };

    this.confirmSelection = function ()
    {
        this.selectedItems( this.tempSelection() );
        this.closeOptions();
    };

    this.closeOptions = function ()
    {
        this.optionsShown( false );
    }

    this.updateSelections = function ()
    {
        const selection = self.selectedItems();
        self.filterTimetableList().forEach( function ( item )
        {
            item.Checked( ~selection.indexOf( item ) );
        } );
    }

    //************************************************************
    //All AJAX Call metods in one place
    //************************************************************
    //Run Query on server from modal form
    this.Open_PSW = function () {
        $("#login-form").modal("show");
    }
    this.Close_PSW = function () {
        setTimeout(function () { $("#login-form").modal("hide"); }, 200);
    }
    this.Save_PSW = function () {
        self.passSet(true);
        self.Save_Changes_RST()
    }
    this.Close_Dupl = function () {
        setTimeout(function () { $("#replaced-form").modal("hide"); }, 200);
    }
    this.Close_Refr = function () {
        setTimeout(function () { $("#dialog-form").modal("hide"); }, 200);
    }
    this.Start_refr = function (clearAll = true) {        
       
        if (clearAll) {
            this.update_ranges();
            self.message('Busy');
        }        
        this.get_recrdset(clearAll);
        this.get_AllRequest(clearAll);
  
        //self.ListOfPersons();
        //this.Create_presets_for_column_names();
    }
    // Get timetables record
    this.get_timetables = function ()
    {
        let quer = '/timetableGetALL';
        if ( self.TMPData_Type() === 'Timetable' ) {
            setTimeout( async function ()
            {
                socket.emit( 'Check Integrity', {
                    Dataset: 'All',
                    AllowChanges: 'True'
                } );
            }, 1500 );
        } else {
            quer = '/draftsGetALL'
        }
        self.actingOnThingsP( true );
        $.ajax( {
            method: "GET",
            url: quer,
            success: function ( data )
            {
                if ( typeof data.data !== 'undefined' ) {
                    //self.TimetabList.valueWillMutate();
                    const underlining_array = self.TimetabList();
                    if ( self.TimetabList().length > 0 ) { underlining_array.splice( 0, underlining_array.length ); }
                    $.map( data.data, function ( item )
                    {
                        underlining_array.push( new TimetableSetViewModel( item.id, item.hrnest_id, item.title, item.date_from, item.date_to, item.Type, item.Present ) );
                    } );
                    self.TimetabList.valueHasMutated();
                }
                //self.Current_timetable(self.TimetabList(0));
                self.actingOnThingsP( false );
            },
            error: function ( xhr, status, error )
            {
                const errorMessage = xhr.status + ': ' + xhr.statusText + ': ' + status + ': ' + error;
                alert( "Error on Connection: " + errorMessage );
                self.actingOnThingsP( false );
            }
        } );
    }
    this.get_workgroups = function ( refrall = true )
    {
        let quer = '/GroupsGetALL';
        self.actingOnThingsP( refrall );
        return $.ajax( {
            method: "GET",
            url: quer,
            success: function ( data )
            {
                if ( typeof data.data !== 'undefined' ) {
                    const underlining_array = self.workGroups();
                    if ( self.workGroups().length > 0 ) {
                        data.data.forEach( ( item ) =>
                        {
                            const dta = ko.utils.arrayFilter( self.workGroups(), function ( itm )
                            {
                                return itm.id() === item.id
                            } );
                            if ( dta.length === 0 ) {
                                self.workGroups.push( new work_Group( item ) );
                            }
                        } )
                    } else {
                        //self.workGroups.valueWillMutate();
                        $.map( data.data, function ( item )
                        {
                            underlining_array.push( new work_Group( item ) );
                        } );
                        // push empty dataset
                        underlining_array.push( {
                            id: ko.observable( -100 ),
                            name: ko.observable( '' ),
                            description: ko.observable( '' ),
                            leader: ko.observable( '' )
                        } )
                        self.workGroups.valueHasMutated();
                    }
                }
                //self.Current_timetable(self.TimetabList(0));
                self.actingOnThingsP( false );
                return 'Done';
            },
            error: function ( xhr, status, error )
            {
                const errorMessage = xhr.status + ': ' + xhr.statusText + ': ' + status + ': ' + error;
                alert( "Error on Connection: " + errorMessage );
                self.actingOnThingsP( refrall );
            }
        } );
        
    }
    // Get All Requests from selected Timetable
    this.get_AllRequest = function ( clearAll = true )
    {
        this.get_RequestTimetableTypes( clearAll );
        if ( ( self.Data_Type() !== 'Timetable' && self.allInputEnered() === true && ( self.FDdateDraft() !== '' || self.FDdateDraft() !== 'NaN-NaN-NaN' ) & ( self.TDdateDraft() !== '' || self.TDdateDraft() !== 'NaN-NaN-NaN' ) ) || self.Data_Type() === 'Timetable' ) {
            const timId = self.Current_multiTimetables() ? self.CurrentselectedItemsId() : self.Current_timetable().id();
            $.ajax( {
                method: "GET",
                url: "/request?&date_from=" + ( self.Data_Type() !== "Timetable" ? self.FDdateDraft() : self.valid_date_from() ) + "&date_to=" + ( self.Data_Type() !== "Timetable" ? self.TDdateDraft() : self.valid_date_to() ) + "&type=" + ( self.Data_Type() !== "Timetable" ? "enum" : "all&TimetableID=" + timId ),
                success: function ( data )
                {
                    self.txt( ' => Get Requests from server' );
                    if ( typeof ( data ) !== 'undefined' ) {
                        if ( data.data.length > 0 ) {
                            let changed = false;
                            const arr_dates = 'dateFrom,dateTo'
                            const underlining_array = self.Requests();
                            const TMPitems = data.data;
                            if ( clearAll || self.Requests().length === 0 ) {
                                //self.Requests.valueWillMutate();
                                if ( self.Requests().length > 0 ) { underlining_array.splice( 0, underlining_array.length ); }
                                $.map( TMPitems, function ( item )
                                {
                                    underlining_array.push( new request_Person( item ) );
                                } );
                                self.Requests.valueHasMutated();
                            } else {
                                data.data.forEach( ( item ) =>
                                {
                                    const dta = ko.utils.arrayFilter( self.Requests(), function ( itm )
                                    {
                                        return itm.number() === item.number
                                    } );
                                    if ( dta.length === 0 ) {
                                        self.Requests.push( new request_Person( item ) );
                                    } else {
                                        let chk = false
                                        for ( let itm in item ) {
                                            if ( !chk ) {
                                                let date1 = item[ itm ];
                                                let date2 = '';
                                                if ( ko.isObservable( dta[ 0 ][ itm ] ) ) {
                                                    date2 = dta[ 0 ][ itm ]();
                                                    if ( arr_dates.indexOf( itm ) > -1 ) {
                                                        //console.log(formatDate(dates.convert(item[itm])) + ' <=> ' + formatDate(dta[0][itm]()))
                                                        date1 = formatDate( dates.convert( item[ itm ] ) );
                                                        date2 = formatDate( dta[ 0 ][ itm ]() );
                                                    }
                                                } else {
                                                    date2 = dta[ 0 ][ itm ];
                                                    if ( arr_dates.indexOf( itm ) > -1 ) {
                                                        //console.log(formatDate(dates.convert(item[itm])) + ' <=> ' + formatDate(dta[0][itm]))
                                                        date1 = formatDate( dates.convert( item[ itm ] ) );
                                                        date2 = formatDate( dta[ 0 ][ itm ] );
                                                    }
                                                }
                                                if ( date1 !== date2 ) {
                                                    chk = true;
                                                }
                                            }
                                        }
                                        if ( chk ) {
                                            dta[ 0 ] = item;
                                            changed = true;
                                        }
                                    }
                                } );
                                self.Requests().forEach( ( item ) =>
                                {
                                    const dta = ko.utils.arrayFilter( data.data, function ( itm )
                                    {
                                        return itm.number === item.number()
                                    } );
                                    if ( dta.length === 0 ) {
                                        self.Requests.remove( item );
                                        changed = true;
                                    }
                                } )
                                if ( changed ) {
                                    self.Requests.valueHasMutated();
                                }
                            }

                        } else {
                            //self.Requests.valueWillMutate();
                            const underlining_array = self.Requests();
                            if ( self.Requests().length > 0 ) { underlining_array.splice( 0, underlining_array.length ); }
                            self.Requests.valueHasMutated();
                        }
                    }
                }
            } );
        }
    }

    // Get enuberable request for User
    this.get_UserEnumerbleRequest = function ()
    {
        Len_Text_Fields = { attr: 1, number: 2, dateFrom: 3, dateTo: 3, description:9, full_name: 0, emp_id: 5, snet: 1, position: 1, default_wrkgroup: 0, wrk_group: 0, wrk_description: 5, work_leader: 5, table_wrkgroup: 5, changes_counter: 5 };
        $.ajax( {
            method: "GET",
            url: `/request?&date_from=${ self.reqDF() }&date_to=${ self.reqDT()}&type=enum&uid=${self.CurrRow()}`,
            success: function ( data )
            {
                self.txt( ' => Get Enumerable Requests from server' );
                if ( typeof ( data ) !== 'undefined' ) {
                    if ( data.data.length > 0 ) {
                        //self.RequestTimetableEnum.valueWillMutate();
                        const underlining_array = self.userFrmRequests();
                        const TMPitems = data.data;
                        if ( self.userFrmRequests().length > 0 ) { underlining_array.splice( 0, underlining_array.length ); }
                        $.map( TMPitems, function ( item )
                        {
                            item.description = ko.utils.arrayFirst( self.RequestOnlyEnumerable(), function ( itm )
                            {
                                return itm.req_type_id() === item.typeId
                            } )
                            underlining_array.push( new request_Data( item ) );
                        } );
                        self.userFrmRequests.valueHasMutated();
                    } else {
                        //self.RequestTimetableEnum.valueWillMutate();
                        const underlining_array = self.userFrmRequests();
                        if ( self.userFrmRequests().length > 0 ) { underlining_array.splice( 0, underlining_array.length ); }
                        self.userFrmRequests.valueHasMutated();
                    }
                }
            }
        } );
    }

    // Get Enumerable Requests from selected Timetable
    this.get_AllEnumerbleRequest = function () {
        const timId = self.Current_multiTimetables() ? self.CurrentselectedItemsId() : self.Current_timetable().id();
        $.ajax({
            method: "GET",
            url: "/request?&date_from=" + self.valid_date_from() + "&date_to=" + self.valid_date_to() + "&type=enum&TimetableID=" + timId,
            success: function (data) {
                self.txt(' => Get Enumerable Requests from server');
                if (typeof (data) !== 'undefined') {
                    if ( data.data.length > 0) {
                        //self.RequestTimetableEnum.valueWillMutate();
                        const underlining_array = self.RequestTimetableEnum();
                        const TMPitems = data.data;
                        if ( self.RequestTimetableEnum().length > 0) { underlining_array.splice(0, underlining_array.length); }
                        $.map( TMPitems, function ( item )
                        {                          
                            underlining_array.push( new request_Person(item));
                        });                        
                        self.RequestTimetableEnum.valueHasMutated();
                    } else {
                        //self.RequestTimetableEnum.valueWillMutate();
                        const underlining_array = self.RequestTimetableEnum();
                        if ( self.RequestTimetableEnum().length > 0) { underlining_array.splice(0, underlining_array.length); }
                        self.RequestTimetableEnum.valueHasMutated();                      
                    }
                }
            }
        });
    }

    this.get_licenses = function () {
        $.ajax({
            method: "GET",
            url: "/getlicenses",
            success: function (data) {
                self.txt(' => Get active licenses info');                
                    self.licenses(data.licenses);                
            }
        });
    }
    this.save_licenses = function () {
        const tmp = "/savelicenses?license=" + self.licenses()
        $.ajax({
            method: "GET",
            url: tmp 
        });
    }
    this.get_limitChanges = function () {
        $.ajax({
            method: "GET",
            url: "/getlimitchanges",
            success: function (data) {
                self.txt(' => Get active limit of changes info');
                self.limitchanges(data.limitchanges);
            }
        });
    }
    this.save_limitChanges = function () {
        const tmp = "/savelimitchanges?limitchanges=" + self.limitchanges()
        $.ajax({
            method: "GET",
            url: tmp
        });
    }
    // Get Request of selection menu
    this.get_RequestTypes = function () {
        $.ajax({
            method: "GET",
            url: "/request?&Request_types=onWWW",
            success: function (data) {
                self.txt(' => Get RequestsTypes visible on wwwMenu from server');
                if ( data.data.length > 0) {
                    //self.RequestTypesMenu.valueWillMutate();
                    const underlining_array = self.RequestTypesMenu();
                    const TMPitems = data.data;
                    if ( self.RequestTypesMenu().length > 0) { underlining_array.splice(0, underlining_array.length); }
                    $.map(TMPitems, function (item) {
                        underlining_array.push(new request_type(item));
                    });
                    // add records for persons request 'u' 
                    const tmpitem = {
                        name: 'u',
                        description: 'Not Rejected Request from persons',
                        emp_type: 0,
                        type_source: 'request',
                        iswholeday: true,
                        req_type_id: null,
                        time_from: null,
                        time_to: null,
                        enumerable: null,
                        info: null
                    }
                    underlining_array.push(new request_type(tmpitem));
                    self.RequestTypesMenu.valueHasMutated();
                }
            }
        });
    }
    // Get All timetable types request
    this.get_RequestTimetableTypes = function (show_wait=true) {
        self.actingOnThingsT(show_wait);
        $.ajax({
            method: "GET",
            url: "/request?&Request_types=timetable",
            success: function (data) {
                self.txt(' => Get All TimetableRequestsTypes');
                if (data.data.length > 0) {
                    if (show_wait) {
                        //self.RequestTimetable.valueWillMutate();
                        const underlining_array = self.RequestTimetable();
                        const TMPitems = data.data;
                        if ( self.RequestTimetable().length > 0) { underlining_array.splice(0, underlining_array.length); }
                        $.map(TMPitems, function (item) {
                            underlining_array.push(new request_type(item));
                        });                       
                        self.RequestTimetable.valueHasMutated();
                    } else {
                        data.data.forEach((item) => {
                            const dta = ko.utils.arrayFilter(self.RequestTimetable(), function (itm) {
                                return itm.id() === item.id
                            });
                            if (dta.length === 0) {
                                self.RequestTimetable.push(new request_type(item));
                            } else {
                                for (let it in item) {
                                    if (item[it] !== dta[0][it]()) {
                                        dta[0][it](item[it])
                                    }
                                }
                            }
                        })
                        self.RequestTimetable().forEach((item) => {
                            const dta = ko.utils.arrayFilter(data.data, function (itm) {
                                return itm.id === item.id()
                            });
                            if (dta.length === 0) {
                                self.RequestTimetable.remove(item[0]);
                            }
                        })
                    }                    
                    data = '';
                    self.actingOnThingsT(false);
                }
            }
        });
    }
    // Get information Styling Request
    this.get_RequestTypesInfo = function () {
        self.actingOnThingsT(true);
        $.ajax({
            method: "GET",
            url: "/request?&Request_types=info",
            success: function (data) {
                self.txt(' => Get Styling RequestsTypes ');
                if ( data.data.length > 0) {
                    //self.RequestTypesInfo.valueWillMutate();
                    const underlining_array = self.RequestTypesInfo();
                    const TMPitems = data.data;
                    if ( self.RequestTypesInfo().length > 0) { underlining_array.splice(0, underlining_array.length); }
                    $.map(TMPitems, function (item) {
                        underlining_array.push(new request_type(item));
                    });                    
                    self.RequestTypesInfo.valueHasMutated();
                    self.actingOnThingsT(false);
                }
            }
        });
    }
    // Get Only Enumerable Request
    this.get_OnlyRequestEnumerable = function ()
    {
        self.actingOnThingsT( true );
        $.ajax( {
            method: "GET",
            url: "/request?&Request_types=enum",
            success: function ( data )
            {
                self.txt( ' => Get Enumerable RequestsTypes ' );
                if ( data.data.length > 0 ) {
                    //self.RequestEnumerable.valueWillMutate();
                    const underlining_array = self.RequestOnlyEnumerable();
                    const TMPitems = data.data;
                    if ( self.RequestEnumerable().length > 0 ) { underlining_array.splice( 0, underlining_array.length ); }
                    
                    $.map( TMPitems, function ( item )
                    {
                        underlining_array.push( new request_type( item ) );
                    } );
                    self.RequestOnlyEnumerable.valueHasMutated();
                    self.actingOnThingsT( false );
                }
            }
        } );
    }
    // Get Enumerable Request
    this.get_RequestEnumerable = function () {
        self.actingOnThingsT(true);
        $.ajax({
            method: "GET",
            url: "/request?&Request_types=enum",
            success: function (data) {
                self.txt(' => Get Enumerable RequestsTypes ');
                if ( data.data.length > 0) {
                    //self.RequestEnumerable.valueWillMutate();
                    const underlining_array = self.RequestEnumerable();
                    const TMPitems = data.data;
                    if ( self.RequestEnumerable().length > 0) { underlining_array.splice(0, underlining_array.length); }
                    underlining_array.push({
                        description: ko.observable("Normal Time"),
                        emp_type: ko.observable(1),
                        enumerable: ko.observable(true),
                        id: ko.observable(null),
                        info: ko.observable(null),
                        iswholeday: ko.observable(true),
                        name: ko.observable(null),
                        req_type_id: ko.observable(0),
                        time_from: ko.observable(null),
                        time_to: ko.observable(null),
                        type_source: ko.observable("request")
                    });
                    $.map(TMPitems, function (item) {
                        underlining_array.push(new request_type(item));
                    });                    
                    self.RequestEnumerable.valueHasMutated();
                    self.actingOnThingsT(false);
                }
            }
        });
    }
    // Dataset in progress ?
    self.check_Dataset_progress = ko.observable(false);
    //Send information About refresh recordset vs WWW
    self.check_Dataset = function (show_msg=true) {
        self.actingOnThingsT(show_msg);
        this.Notify_ErrInShift_sumHIDE();
        
        self.check_Dataset_progress(true);
        this.update_ranges();
        if ( self.Data_Type() === 'Timetable' )
        {
            const trans = generateUUID();
            self.transaction( self.transaction() + 'Trans:' + trans )
            const timId = self.Current_timetable();
            setTimeout( async function ()
            {
                socket.emit( 'Get_Requests', {
                    Dataset: 'Range', dateFrom: timId.date_from(), dateTo: timId.date_to(), ID: self.Current_multiTimetables() ? self.CurrentselectedItemsHrnestId() : timId.hrnest_id(), Trans: trans
                } );
            }, 20 );
        }        
        self.refrTabCount( 0 );
        if ( show_msg ) {
            self.message( 'Busy' );
            if ( self.persDbview().length > 0 ) {
                //self.persDbview.valueWillMutate();
                const underlining_array = self.persDbview();
                underlining_array.splice( 0, underlining_array.length );
                self.persDbview.valueHasMutated();
            }
            this.Create_presets_for_column_names();
            self.txt( ' => Checking dataset in WWW ...' );
            $( "#dialog-message" ).dialog( {
                dialogClass: 'no-close',
                modal: true,
            } );
        }
        
        if ( self.Data_Type() !== 'Timetable' ) {
            this.get_workgroups( true );
            self.check_Dataset_progress( false );
            this.Start_refr( true );
        }
    }
    // Delete selected Draw
    this.DeleteSelectedDraft = function () {
        const tmp = [];
        tmp.push({
            id: self.tmpCurrent_timetable().id(),
        })        
        this.AjaxSendMessage({
            Draft: JSON.stringify(tmp),
            Send: 'ok'
        }, '/timetable?DelDraft', 'DELETE');
        //setTimeout(function () {
            viewModel.get_timetables();
        //}, 2000);
    }
    //Create New Draw
    this.CreateNewDraft = function () {
        const tmp = [];
        tmp.push({
            title: self.New_Name_of_Draft(), weeks: self.Number_of_weeks(),
        })
        this.AjaxSendMessage({
            Draft: JSON.stringify(tmp),
            Send:'ok'
        }, '/timetable?AddDraft', 'POST');
        //setTimeout(function () {
            viewModel.AddNewDraft(false);
        //}, 2000);
    }
    this.Check_credentials = function () {
        const result = this.AjaxSendMessage({
            login: self.name(),
            password: self.password()
        }, '/CheckIsValidCredentials', 'POST');
        if (result.data) {
            this.Close_PSW()
            this.save_WWW();
        } else {
            $.notify("Credentials to this Timetable is invalid", "warn", {
                position: "bottom center",
                autoHide: true,
                autoHideDelay: 3000,
            });
        }
    }
    // Save changes in WWW by socket Call
    this.save_WWW = function () {

        if (self.Data_Type() === 'Timetable') {
            if ((self.passSet() & !self.credentials()) || self.credentials()) {
                if ( self.Prep_rec_socket().length > 0 ) {
                    const trans = generateUUID();
                    self.transaction(self.transaction() + 'Trans:' + trans)
                    const timId = self.Current_timetable();
                    if (timId.hrnest_id() !== null) {
                        if (self.savigType() === 'Calc_mode') {
                            const va = ko.toJS(self.CalcModeEditedPers());
                            if (!self.credentials()) {
                                //dialog.dialog("open");
                                setTimeout(async function () {
                                    socket.emit('Save_data_on_WWW', {
                                        persons: va, TimetableID: timId.hrnest_id(), Trans: trans, psw: viewModel.password(), login: viewModel.name(), dateFrom: timId.date_from(), dateTo: timId.date_to()
                                    });
                                },0)
                            } else {
                                setTimeout(async function () {
                                    socket.emit('Save_data_on_WWW', {
                                        persons: va, TimetableID: timId.hrnest_id(), Trans: trans, dateFrom: timId.date_from(), dateTo: timId.date_to()
                                    });
                                },0)
                            }                            
                            self.savigType('');                            
                        } else {
                            const va = ko.toJS(self.Prep_rec_socket());
                            if (!self.credentials()) {
                                //dialog.dialog("open");
                                setTimeout(async function () {
                                    socket.emit('Save_data_on_WWW', {
                                        persons: va, TimetableID: timId.hrnest_id(), Trans: trans, psw: viewModel.password(), login: viewModel.name(), dateFrom: timId.date_from(), dateTo: timId.date_to()
                                    });
                                },0)
                            } else {
                                setTimeout(async function () {
                                    socket.emit('Save_data_on_WWW', {
                                        persons: va, TimetableID: timId.hrnest_id(), Trans: trans, dateFrom: timId.date_from(), dateTo: timId.date_to()
                                    });
                                },0)
                            }
                            
                        }                        
                    }
                }
                self.passSet(false);
                setTimeout(async function () {
                    viewModel.CalcModeEditedPers.removeAll();
                    $("#dialog-message").dialog('close');
                }, self.CalcModeEditedPers().length * 50 + 3000);
            }
        } else { self.passSet(false);}
    }
    // Get Main Recordset From AJAX CALL
    this.persDbview_push_dataset = function (data, clearAll=true) {
        self.txt( ' => Recalculate data from server' );        
        if (typeof (data) !== 'undefined') {            
            if (self.persDbview().length === 0) {
                clearAll = true;
            }
            if (clearAll) {
                self.message('Busy');
                Len_Text_Fields = { full_name: 0, emp_id: 5, snet: 1, position: 1, default_wrkgroup: 0, wrk_group: 0, wrk_description: 5, work_leader: 5, table_wrkgroup: 5, changes_counter: 5};
            }            
            //if (self.persDbview().length > 0) { self.persDbview.removeAll(); }
            self.valid_date_from(data.date_from);
            self.valid_date_to(data.date_to);
            const d = new Date();
            const n = d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            self.emp_sta_refr(n);
            //create a new instance of Database fields
            const TMPitems = data.data;
            self.txt(' => Apply View Model');
            if (clearAll) {                
                if ( self.persDbview().length > 0 ) {
                   // underlining_array.splice( 0, underlining_array.length );
                    self.persDbview.removeAll();
                }
                self.persDbview.valueWillMutate();
                const underlining_array = self.persDbview();
                TMPitems.map(async (item) => {
                    const date_to = stringToDate(data.date_to, "yyyy-mm-dd", "-");
                    const date_from = stringToDate(data.date_from, "yyyy-mm-dd", "-");
                    underlining_array.push(new EmplTableViewModel(item, date_from, date_to));
                });               
                self.persDbview.valueHasMutated();
                ko.utils.arrayForEach(self.Table_Name_Fields(), function (dta) {
                    if (Len_Text_Fields[dta.Month_name] !== undefined) {
                        dta.w(12.5 * Len_Text_Fields[dta.Month_name])
                    }
                } )                
            } else {
                let changed = false;
                data.data.forEach((item) => {
                    let dta = ko.utils.arrayFilter(self.persDbview(), function (itm) {
                        return itm.id === item.id
                    });
                    if (dta.length === 0) {
                        const date_to = stringToDate(data.date_to, "yyyy-mm-dd", "-");
                        const date_from = stringToDate(data.date_from, "yyyy-mm-dd", "-");
                        self.persDbview.push(new EmplTableViewModel(item, date_from, date_to));
                        changed = true;
                    } else {
                        let chk = false
                        const date_to = stringToDate(data.date_to, "yyyy-mm-dd", "-");
                        const date_from = stringToDate(data.date_from, "yyyy-mm-dd", "-");
                        const it = new EmplTableViewModel(item, date_from, date_to);
                        for (let itm in it) {
                            if (ko.isObservable(dta[0][itm])) {
                                if (itm.indexOf('old') !== -1 & itm.indexOf('inView') & itm.indexOf('vi')) {
                                    if (typeof dta[0][itm + 'old'] === 'undefinied') {
                                        if (it[itm] !== dta[0][itm]()) {
                                            dta[0][itm](it[itm]);
                                            changed = true;
                                        }
                                    } else {
                                        // check values for non saved data
                                        if (dta[0][itm + 'old'] !== dta[0][itm]()) {
                                            if (it[itm] !== dta[itm + 'old']) {
                                                dta[0][itm + 'old'] = it[itm]
                                                changed = true;
                                            }
                                        } else {
                                            if (item[itm] !== dta[0][itm]()) {
                                                dta[0][itm](it[itm]);
                                                dta[0][itm + 'old'] = it[itm];
                                                changed = true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (itm.indexOf('old') !== -1 & itm.indexOf('inView') & itm.indexOf('vi')) {
                                    if (typeof dta[0][itm + 'old'] === 'undefinied') {
                                        if (item[itm] !== dta[0][itm]) {
                                            dta[0][itm] = it[itm];
                                            changed = true;
                                        }
                                    } else {
                                        // check values for non saved data
                                        if (dta[itm + 'old'] !== dta[0][itm]) {
                                            if (item[itm] !== dta[0][itm + 'old']) {
                                                dta[0][itm + 'old'] = item[itm]
                                                changed = true;
                                            }
                                        } else {
                                            if (item[itm] !== dta[itm]) {
                                                dta[0][itm] = it[itm];
                                                dta[0][itm + 'old'] = it[itm];
                                                changed = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (chk) {                            
                            dta = item;
                        }
                    }
                })                
                self.persDbview().forEach((item) => {
                    const dta = ko.utils.arrayFilter(data.data, function (itm) {
                        return itm.id === item.id
                    });
                    if (dta.length === 0) {
                        self.persDbview.remove(item());
                        changed = false;
                    }
                })
                if (changed) {                    
                    self.persDbview.valueHasMutated();
                }
            }               
            
            
            viewModel.message( ' ' );                
            viewModel.actingOnThingsT( false );
            viewModel.actingOnThingsP( false );
            $( "#dialog-message" ).dialog( 'close' );          
            
        } else {
            self.persDbview.removeAll();
            if (!self.TMPCreateDraft()) {
                self.OpenMenuAddPers();
            }           
            viewModel.message( ' ' );                
            viewModel.actingOnThingsT( false );
            viewModel.actingOnThingsP( false );
            $( "#dialog-message" ).dialog( 'close' );                     
            
        }
        $("#load").show();
        self.txt('');

    };
    // Ajax Call for data about persons time in timetable
    this.get_recrdset = function (clearAll=true) {
        let Dorefr = true;
        if (self.Count_Changes() & clearAll) {
            if (!confirm('Are you sure you want to refresh data? \n Some changes are not saved => ' + self.Count_Changes() + ' items...')) {
                Dorefr = false;
            }
        };
        if (Dorefr) {
            self.actingOnThingsT(clearAll);            
            self.txt(' => Establish Connection ...');
            if (self.persDbview().length === 0) {
                clearAll = true;
            }
            if (clearAll) {
                $("#dialog-message").dialog({
                    dialogClass: 'no-close',
                    modal: true,
                });
                self.message('Busy');
            }
            this.get_FN_byTimetableID(clearAll);
            this.get_ERR_Duplicates_PersbyTimetable(clearAll);
            this.get_ERR_Duplicates_PersbyTimetableALL(clearAll);
            const timId = self.Current_multiTimetables() ? self.CurrentselectedItemsId() : self.Current_timetable().id();
            let strA = ''
            if (self.Frange()) {
                strA = '&date_from=' + self.valid_date_from() + '&date_to=' + self.valid_date_to();
            }
            const promise = $.ajax({
                method: "GET",
                url: "/user?UsersGetALL&UsersTimetable=" + timId + strA,
                success: function (data) {
                   return data
                },
                error: function (xhr, status, error) {
                    const errorMessage = xhr.status + ': ' + xhr.statusText;
                    alert("Error on Connection: " + errorMessage);
                    self.actingOnThingsT(false);
                }
               
            } );
            promise.done( function ( data )
            {
                viewModel.persDbview_push_dataset( data, clearAll );               
                self.actingOnThingsT( false );

                const scrollTb = document.querySelector( "#table-scroll" );
                const lenModel = viewModel.pagedRows().length                
                viewModel.scrollTopE( parseInt( ( ( scrollTb.scrollTop + scrollTb.clientHeight ) / scrollTb.scrollHeight ) * lenModel ) )
                viewModel.scrollTopS( parseInt( ( scrollTb.scrollTop / scrollTb.scrollHeight ) * lenModel ) )                
                const pag = viewModel.LimitTable_Name_Fields().length;
                //const vlenModel = ( pag - 1 * 55 + 100 )
                viewModel.scrollLeftE( parseInt( ( ( scrollTb.scrollLeft + scrollTb.clientWidth ) / scrollTb.scrollWidth ) * pag ) )
                viewModel.scrollLeftS( parseInt( ( scrollTb.scrollLeft / scrollTb.scrollWidth ) * pag ) )
                self.multiselect( self.Data_Type() === 'Timetable' & !self.Current_multiTimetables() ? 'Disabled' : 'Enabled' );
            })

        }
    };
    // Get calulated FN by present Timetable
    this.get_FN_byTimetableID = function (clearAll=true) {
        const timId = self.Current_timetable();
        let qry=''
        if (timId.hrnest_id()) {
            qry = "/timetableFNcalc?TimetableID=" + timId.hrnest_id();
        } else {
            qry = "/timetableFNcalc?ID=" + timId.id();
        }
        $.ajax({
            method: "GET",
            url: qry,
            success: function (data) {
                const TMPitems = data.data;
                //self.FnOfallwww.valueWillMutate();
                const underlining_array = self.FnOfallwww();
                self.txt(' => Apply FN Model');
                if ( self.FnOfallwww().length > 0 ) { underlining_array.splice(0, underlining_array.length); }
                TMPitems.forEach((item) => {                   
                    underlining_array.push(new FN_Timetable(item));
                });
                self.FnOfallwww.valueHasMutated();
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.status + ': ' + xhr.statusText;
                alert("Error on Connection: " + errorMessage);
            }
        });        
    }
    // Get duplicates  persons in www in present Timetable
    this.get_ERR_Duplicates_PersbyTimetable = function (clearAll = true){
        const timId = self.Current_timetable();
        let qry = ''
        if (timId.hrnest_id()) {
            qry = "/timePersDuplicates?TimetableID=" + timId.hrnest_id();
        } else {
            qry = "/timePersDuplicates?ID=" + timId.id();
        }
        $.ajax({
            method: "GET",
            url: qry,
            success: function (data) {
                const TMPitems = data.data;
                //self.persDuplicates.valueWillMutate();
                const underlining_array = self.persDuplicates();
                self.txt(' => Apply duplicates persons Model');
                if ( self.persDuplicates().length > 0 ) { underlining_array.splice(0, underlining_array.length); }
                TMPitems.forEach((item) => {
                    underlining_array.push(new Duplicates_pers(item));
                });
                self.persDuplicates.valueHasMutated();
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.status + ': ' + xhr.statusText;
                alert("Error on Connection: " + errorMessage);
            }
        });       
    }
    // Get duplicates  persons in www in present all Timetables
    this.get_ERR_Duplicates_PersbyTimetableALL = function (clearAll = true) {
        const timId = self.Current_timetable();
        let qry = ''
        if (timId.hrnest_id()) {
            qry = "/timePersDuplicates?ALL_Duplicates&TimetableID=" + timId.hrnest_id();
        } else {
            qry = "/timePersDuplicates?ALL_Duplicates&ID=" + timId.id();
        }
        $.ajax({
            method: "GET",
            url: qry,
            success: function (data) {
                const TMPitems = data.data;
                //self.persDuplicatesALL.valueWillMutate();
                const underlining_array = self.persDuplicatesALL();
                self.txt(' => Apply duplicates persons Model');
                if ( self.persDuplicatesALL().length > 0 ) { underlining_array.splice(0, underlining_array.length); }
                TMPitems.forEach((item) => {
                    underlining_array.push(new Duplicates_pers(item));
                });                  
                self.persDuplicatesALL.valueHasMutated();
                viewModel.Notify_ErrInShift_sum();
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.status + ': ' + xhr.statusText;
                alert("Error on Connection: " + errorMessage);
            }
        });
    }
    // Get recordset from active timetable by users_id in (id's) clause and update View Model
    self.get_recordset_One = function (id) {
        const timId = self.Current_multiTimetables() ? self.CurrentselectedItemsId() : self.Current_timetable().id();
        let strA = ''
        if (self.Frange()) {
            strA = '&date_from=' + self.valid_date_from() + '&date_to=' + self.valid_date_to();
        }
        $.ajax({
            method: "GET",
            url: "/user?UsersTimetable=" + timId + strA + "&id=" + id,
            success: function (data) {
                if (typeof (data) !== 'undefined') {
                    const Modyfications = data.data;
                    Modyfications.forEach((dat) => {
                        ko.utils.arrayForEach(self.persDbview(), function (item) {
                            if (item.id === dat.id) {
                                const date_to = stringToDate(data.date_to, "yyyy-mm-dd", "-");
                                const date_from = stringToDate(data.date_from, "yyyy-mm-dd", "-");
                                // Manage changes after modify records or recordset changes by another user
                                const tmprec = new EmplTableViewModel(dat, date_from, date_to)
                                for (let rec in item) {
                                    if (ko.isObservable(item[rec])) {
                                        if (tmprec[rec] !== item[rec]() & rec.indexOf('old') === -1) {
                                            // do if record have 'old' copy
                                            if (typeof (item[rec + 'old']) !== 'undefined') {
                                                // If changes are made on this browswer and old value is avaliable in this viewmodel
                                                if (item[rec + 'old'] !== item[rec]() & self.availableitems().indexOf(item[rec]()) > -1) {
                                                    tmprec[rec] = item[rec]();
                                                }
                                            }
                                        }
                                    } else {
                                        if (tmprec[rec] !== item[rec] & rec.indexOf('old') === -1) {
                                            // do if record have 'old' copy
                                            if (typeof (item[rec + 'old']) !== 'undefined') {
                                                // If changes are made on this browswer and old value is avaliable in this viewmodel
                                                if (item[rec + 'old'] !== item[rec] & self.availableitems().indexOf(item[rec]) > -1) {
                                                    tmprec[rec] = item[rec];
                                                }
                                            }
                                        }
                                    }
                                }
                                self.persDbview.replace(item, tmprec);
                            }
                        })
                    })
                    //ko.tasks.runEarly();
                    //self.persDbview.valueHasMutated();
                    data = '';
                }
            }
        });
    }
    // Get Users in DB /parameter is workgroup ID if null all persons loaded
    this.UsersGetALL = function (dat) {
        let tmp = '';
        if (dat) {
            tmp = '&work_group=' + dat;
        }
        self.actingOnThingsP(true);
        self.actingOnThings(true);
        $.ajax({
            method: "GET",
            url: "/user?UsersGetALL" + tmp,
            success: function (data) {                
                Len_Text_Fields = {attr:1, id: 1, full_name: 0, emp_id: 5, snet: 0, wrk_leader: 0, position: 0, default_wrkgroup: 5, wrk_group: 0, wrk_description: 5, work_leader: 5, last_name: 1, first_name: 1, table_wrkgroup: 5, changes_counter: 5};
                if ( self.personsALL_mod().length > 0 ) {
                    self.personsALL_mod.removeAll()
                }               
                //self.personsALL.valueWillMutate();
                const underlining_array = self.personsALL();
                if ( self.personsALL().length > 0 ) { underlining_array.splice(0, underlining_array.length); }
                $.map(data.data, function (item) {
                    underlining_array.push(new PearsonSetViewmodel(item.default_wrkgroup, item.emp_id, item.first_name, item.id, item.last_name, item.position, item.snet, item.uid, item.wrk_description, item.wrk_group, item.wrk_leader, item.table_wrkgroup));
                });
                self.personsALL.valueHasMutated();                
                self.setColumnPers();
                self.FillLists();
                self.actingOnThingsP(false);
                self.actingOnThings( false );                
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.status + ': ' + xhr.statusText + ': ' + status + ': ' + error;
                alert("Error on Connection: " + errorMessage);
                self.actingOnThingsP(false);
                self.actingOnThings(false);
            }
        });
    }

    self.getOffs = function (dateFrom,dateTo)
    {
        return $.ajax( {
            method: "GET",
            url: `/daysoff?dateFrom=${ dateFrom }&dateTo=${dateTo}`,           
        } );
    }
    // Universal Ajax Call function
    this.AjaxSendMessage = function (dat, url, message) {
        let tmpres = '';
         return $.ajax({
            method: message,
            contentType: 'application/x-www-form-urlencoded',
            data: dat,
            url: url,
            success: function (data) {
                tmpres = data.data;
                return tmpres
            },
            error: function (xhr, status, error) {
                const errorMessage = xhr.status + ': ' + xhr.statusText + ': ' + status + ': ' + error;
                alert("Error on Connection: " + errorMessage);
                tmpres = errorMessage;
                return tmpres
            }
         });
       
    }
    //************************************************************
    //Savings Timetable recordset
    //Count Number of changes in Main recordset
    //Type of saving dataset => must be set when changing calculation mode
    self.savigType = ko.observable('');    
    self.changes_annotTypeEnum = ko.observableArray(['Not Notify', 'Notify person once', 'Notify every changed data']);
    self.Presentchanges_annotType = ko.observable(self.changes_annotTypeEnum()[0]);
    self.CalcModeEditedPers = ko.observableArray([]);
    self.NotifyChanges = ko.computed(function () {
        const returned = [];
        if ( self.Data_Type() !== 'Draft' ) {
            if ( self.Presentchanges_annotType() !== 'Not Notify' ) {
                if ( self.Count_Changes() > 0 ) {
                    self.persDbview().forEach( item =>
                    {
                        let cnt = 0;
                        const date_to = stringToDate( self.valid_date_to(), "yyyy-mm-dd", "-" );
                        for ( let tm = stringToDate( self.valid_date_from(), "yyyy-mm-dd", "-" ); tm <= date_to; tm.setDate( tm.getDate() + 1 ) ) {
                            if ( typeof item[ formatDate( tm ) ] !== 'undefined' ) {
                                if ( item[ formatDate( tm ) ]() !== item[ formatDate( tm ) + 'old' ] ) {
                                    cnt = cnt + 1;
                                }
                            }
                        }
                        if ( cnt ) {
                            if ( self.Presentchanges_annotType() === 'Notify person once' ) {
                                cnt = 1;
                            }
                            const datset = {
                                id: item.id,
                                emp_id: item.emp_id,
                                guid: item.guid,
                                add_counter: cnt,
                                changes_after_Update: item.changes_counter + cnt
                            }
                            returned.push( datset );
                        }
                    } )
                }
            }
        }
        return returned
    })
    self.SendIncrCounterPers = function () {
        const curTBL = self.Current_timetable();
        const trans = generateUUID();
        let notify=0
        self.transaction(self.transaction() + 'Trans:' + trans)
        // check if the limit is exceeded
        self.NotifyChanges().forEach((item) => {
            if (item.changes_after_Update > self.limitchanges()) {
                notify += 1;
            }
        })
        if (!notify) {
            const result = this.AjaxSendMessage({ users: JSON.stringify(self.NotifyChanges()) }, '/IncerasePersonChanges?TimetableID=' + curTBL.id(), 'POST');
            setTimeout(function () { viewModel.Presentchanges_annotType('Not Notify') }, 500);
        } else {
            alert("Some persons (" + notify +") modification are over limit !! Unable to save recordset");
        }                
    }
    self.Count_Changes = ko.pureComputed(function () {
        let cnt = 0;
        if ( self.message() !== 'Busy' & self.persDbview().length > 0 ) {
            self.persDbview().forEach((item) => {
                if (item['position']() !== item['positionold']) {
                    cnt = cnt + 1;
                }
                if (item['snet']() !== item['snetold']) {
                    cnt = cnt + 1;
                }
                const date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");                
                for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                    if (typeof item[formatDate(tm)] !== 'undefined') {
                        if (item[formatDate(tm)]() !== item[formatDate(tm) + 'old'] || self.Check_Diferences(item[formatDate(tm) + 'err'])) {
                            cnt = cnt + 1;
                        }
                    }
                }
            });
        };
        return cnt;
    } ).extend( { rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } } );
    self.timetablesModified = ko.observableArray( [] );
    // Self dataset of changes in Main Dataset
    self.List_of_Changes = ko.pureComputed(function () {
        const cnt = [];
        if (self.message() !== 'Busy') {
            self.persDbview().forEach((item) => {
                const date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
                for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                    if ( ( item[ formatDate( tm ) ]() !== item[ formatDate( tm ) + 'old' ] || self.Check_Diferences( item[ formatDate( tm ) + 'err' ] ) ) & item[ formatDate( tm ) ]() !== '') {
                        const enum_type = self.enum_RequestType( self.Check_Modified_Fields_For_request( tm, item.id ) )
                        if ( self.timetablesModified().indexOf( item.timetable_id ) === -1 ) {
                            self.timetablesModified().push( item.timetable_id)
                        }
                        const data = {
                            id: item.id,
                            emp_id: item.emp_id,
                            timetable_id: item.timetable_id,
                            guid: item.guid,
                            full_name: item.full_name,
                            date: formatDate(tm),
                            value: item[ formatDate( tm ) ](),
                            emp_type: enum_type,
                            emp_err: "{ 'timeDif': 0, 'startDif': 0, 'endDif': 0 }",
                        };                       
                        
                        cnt.push(new pers_day(data));
                    }
                }
            });
        };
        return cnt;
    } ).extend( { rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } } );
    

    self.List_of_Deleted = ko.pureComputed(function () {
        const cnt = [];
        if (self.message() !== 'Busy') {
            self.persDbview().forEach((item) => {
                const date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
                for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                    if ( ( item[ formatDate( tm ) ]() !== item[ formatDate( tm ) + 'old' ] || self.Check_Diferences( item[ formatDate( tm ) + 'err' ] ) ) & item[ formatDate( tm ) ]() === '' ) {
                        if ( self.timetablesModified().indexOf( item.timetable_id ) === -1 ) {
                            self.timetablesModified().push( item.timetable_id )
                        }
                        const data = {
                            id: item.id,
                            emp_id: item.emp_id,
                            guid: item.guid,
                            timetable_id: item.timetable_id,
                            full_name: item.full_name,
                            date: formatDate(tm),
                            value: item[ formatDate( tm ) ](),
                            emp_type:0,
                            emp_err: "{ 'timeDif': 0, 'startDif': 0, 'endDif': 0 }",
                        };
                        cnt.push(new pers_day(data));
                    }
                }
            });
        };
        return cnt;
    }).extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
    self.list_of_Info_Change = ko.pureComputed(function () {        
        if (self.message() !== 'Busy') {
            const cnt = self.persDbview().filter(item => item['position']() !== item['positionold'] || item['snet']() !== item['snetold']).map((item) => ({
                id: item.id,
                position: item['position'](),
                snet: item['snet']()
            } ) );
            return cnt
        }
        return []
    }).extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
    // Save Changes in DB
    self.Save_Changes_RST = function () {
        let notify = 0;        
        self.NotifyChanges().forEach((item) => {
            if (item.changes_after_Update > self.limitchanges()) {
                notify += 1;
            }
        })
        if ( !notify ) {
            self.txt( ' => Saving changes in server ...' );
        $( "#dialog-message" ).dialog( {
            dialogClass: 'no-close',
            modal: true,
        } );
            if ((self.passSet() & !self.credentials()) || self.credentials()) {
                self.SendIncrCounterPers();
                if ( self.savigType() === 'Calc_mode' ) {
                    //this.save_WWW();               
                } else {
                    if ( self.List_of_Changes().length > 0 || self.List_of_Deleted().length > 0 ) {
                        //this.save_WWW();
                    }
                    if ( self.List_of_Changes().length > 0 ) {
                        self.timetablesModified().forEach( itm =>
                        {
                            const curTBL = itm;
                            self.set_Updt_time();
                            const underlining_array = self.List_of_Changes().filter( item => item.timetable_id === itm ).map( ( item ) => item );
                            if ( underlining_array.length > 0 ) {
                                const trans = generateUUID();
                                self.transaction( self.transaction() + 'Trans:' + trans )
                                this.AjaxSendMessage( { users: JSON.stringify( underlining_array ) }, '/userstimetable?TimetableID=' + curTBL + "&Transaction=" + trans, 'POST' );
                            }
                        } )
                    }
                    if ( self.List_of_Deleted().length > 0 ) {
                        self.timetablesModified().forEach( itm =>
                        {
                            const curTBL = itm;
                            self.set_Updt_time();
                            const underlining_array = self.List_of_Deleted().filter( item => item.timetable_id === itm ).map( ( item ) => item );
                            if ( underlining_array.length > 0 ) {
                                const trans = generateUUID();
                                self.transaction( self.transaction() + 'Trans:' + trans )
                                this.AjaxSendMessage( { users: JSON.stringify( underlining_array ) }, '/userstimetable?TimetableID=' + curTBL + "&Transaction=" + trans, 'DELETE' );
                            }
                        } )
                    }
                }
                if ( self.List_of_Changes().length > 0 || self.List_of_Deleted() > 0 ) {
                    setTimeout( async function ()
                    {
                        self.timetablesModified.removeAll()
                        await viewModel.UpdateChanges();                     
                        
                        
                    }, 2000 );
                }
            } else {
                if ( self.List_of_Changes().length > 0 || self.List_of_Deleted() > 0 ) {
                    this.Open_PSW();
                }
            }
        }
        if ( self.list_of_Info_Change().length > 0 ) {
            const trans = generateUUID();
            self.transaction(self.transaction() + 'Trans:' + trans)
            this.AjaxSendMessage({ users: JSON.stringify(self.list_of_Info_Change()) }, '/user?ModUser' + "&Transaction=" + trans, 'POST');
        }
        if (notify) {           
            alert("Some persons (" + notify + ") modification are over limit !! Unable to save recordset");
        }
    }
    // Update Changes in View on slow DB / network => updated dataset visible before socket IO emmit signal for refresh
    self.UpdateChanges = async function () {
        //get only id of person changed
        const Modyfications = Transl_data(self.List_of_Changes());
        Modyfications.forEach((dat) => {
            ko.utils.arrayForEach(self.persDbview(), function (item) {
                if (item.id === dat.id) {
                    let dt = item;
                    //get records
                    for (let propName in item) {
                        // get changes in propeteries
                        if (propName.indexOf('old') > -1) {
                            if (item[propName] !== item[propName.replace('old', '')]) {
                                dt[propName] = item[propName.replace('old', '')]();
                            }
                        }
                    }
                    self.persDbview.replace(item, dt);
                }
            })
        })
        // disabled for data flow  => ko.tasks.runEarly();
        self.persDbview.valueHasMutated();
    }
    // Prepare recordset for save in WWW socket worker - visible records with not empty guid fied
    self.Prep_rec_socket = ko.pureComputed(function () {
        const cnt = []
        if (self.message() !== 'Busy') {
            self.persDbview().forEach((item) => {
                const date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
                for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                    if (item.guid !== '') {
                        let chkErr = false;
                        if ( item[ formatDate( tm ) + 'err' ] !== '') {
                            if ( item[ formatDate( tm ) + 'err' ].endDif !== 0 || item[ formatDate( tm ) + 'err' ].startDif !== 0) {
                                chkErr = true;
                            }
                        }
                        if (item[formatDate(tm)]() !== item[formatDate(tm) + 'old'] || chkErr) {
                            const tmrange = self.Get_Work_Hours_By_Type_id(self.enum_RequestType(self.Check_Modified_Fields_For_request(tm, item.id)), item[formatDate(tm)]);
                            const data = {
                                guid: item.guid,
                                date: formatDate(tm),
                                startTime: tmrange.startTime,
                                endTime: tmrange.endTime
                            };
                            cnt.push(data);
                        }
                    }
                }
            });
        }
        return cnt;
    }).extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
    // Check value of enumerable request in time range
    self.Check_Modified_Fields_For_request = function (dta, id) {
        const tmpmess = [];
        if (dta !== undefined & self.message() !== 'Busy') {
            ko.utils.arrayForEach(self.Requests(), function (item) {
                if (item.emp_id() === id) {
                    if (dates.inRange(dta, item.dateFrom(), item.dateTo())) {
                        tmpmess.push(item);
                    }
                }
            })
        }
        return tmpmess
    }
    //************************************************************
    // Shift calculation functions
    self.ShiftSumm = ko.observable(true);
    // Request Shift info Array from all Timetables in range dates of selected Timetable 
    self.FnOfallwww = ko.observableArray([]);
    // Duplicate persons in selected range Dates exist in this timetable
    self.persDuplicates = ko.observableArray([]);
    // Duplicate persons in selected range Dates exist in ALL timetables
    self.persDuplicatesALL = ko.observableArray([]);
    // Selected Duplicated Person in front 
    self.selected_duplicated_person = ko.observableArray([]);
    // Selected timetable for open in another window
    self.selected_duplicated_timetable = ko.observable();
    // Duplicates list of presons form in front
    self.ListOfDuplicatedPersons = ko.pureComputed(function () {           
        return self.persDuplicatesALL().map((item) => ({
            user_id: item.user_id(),
            name: item.User_record()['last_name'] + ' ' + item.User_record()['first_name'],
            Tmtbl: item.Tmtbl(),
            Cnt: item.Cnt()
        }))
    })
    // Get Timetable Information about selected persons of duplicates error
    self.ListOfSelected_timetables_duplicates = ko.pureComputed(function () {
        const tmp = [];
        if (self.selected_duplicated_person()) {
            self.selected_duplicated_person().Tmtbl.forEach((item) => {
                const cnt = ko.utils.arrayFilter(self.TimetabList(), function (itm) {
                    return itm.id() === item
                });
                tmp.push({
                    Present: cnt[0].Present(),
                    Type: cnt[0].Type(),
                    date_from: cnt[0].date_from(),
                    date_to: cnt[0].date_to(),
                    hrnest_id: cnt[0].hrnest_id(),
                    id: cnt[0].id(),
                    title: cnt[0].title()
                });
            })
        }
        return tmp
    })
    self.NotifyErrMsg = ko.observable(true);
    self.NotifyErr = function () {
        if (self.ShiftSumm()) {
            this.Notify_ErrInShift_sum();
        } else {
            this.Notify_ErrInShift_sumHIDE();
        }
    }
    this.Notify_ErrInShift_sumHIDE = function () {
        self.NotifyErrMsg(false);
        $('.notifyjs-wrapper').trigger('notify-hide');
    }    
    this.Notify_ErrInShift_sum = function () {
        if ( self.persDuplicatesALL().length > 0 & self.ShiftSumm() & !self.NotifyErrMsg() ) {
            self.NotifyErrMsg(true);
            const h5 = $("<h5/>").append("Some Persons In Timetable Range of Dates are Duplicated !")
            $.notify({
                title: h5,
                button: 'Show'
            }, {
                style: 'foo',
                globalPosition: 'top left',
                autoHide: false,                
                clickToHide: false
            });
            
        }
    }
    this.Notify_Exchange_HIDE = function () {        
        $('.notifyjs-wrapper').trigger('notify-hide');
    }
    this.Notify_Exchange_SHOW = function () {
        const h5 = $("<h5/>").append("Data exchange with Hrnest Site is ON")
            $.notify({
                title: h5,
                
            }, {
                style: 'exchange',
                globalPosition: 'top center',
                autoHide: false,
                clickToHide: false
            });        
    }

    // Return Shift Info Function to site
    this.Shift_Info = function (date) {
        let txt = ''
        if ( date !== undefined & self.message() !== 'Busy' & self.ShiftSumm()) {
            date = this.Column_Offset(date);
            if (date < self.Table_Name_Fields().length) {
                if (self.Table_Name_Fields()[date]['Type'] === 'Day') {                   
                    const FNvar = this.get_FN_WWW_byDay( date )
                    const licenses1 = self.licenses() - FNvar.S1
                    const marked_class1 = licenses1 < 0 ? '<mark class="Lred">' : licenses1 > 0 ? '<mark class="Lgreen">' : '<mark class="Lneutral">'
                    const licenses2 = self.licenses() - FNvar.S2
                    const marked_class2 = licenses2 < 0 ? '<mark class="Lred">' : licenses2 > 0 ? '<mark class="Lgreen">' : '<mark class="Lneutral">'
                    txt = '<br\>' + marked_class1 + ' S1:' + FNvar.S1 + '<br\></mark>' + marked_class2 + ' S2:' + FNvar.S2 + '<br\></mark>';
                }
            }
        }
        return txt
    }
    // Get values from WWW by day
    this.get_FN_WWW_byDay = function (date) {
        let S1 = 0;
        let S2 = 0;
        const dt = self.Table_Name_Fields()[date]['Full_date'];
        if ( date !== undefined & self.message() !== 'Busy') {
            S1 = parseInt(self.Count_ShiftA(date));
            S2 = parseInt(self.Count_ShiftB(date));
            if (self.Table_Name_Fields()[date]['Type'] === 'Day') {
                const cnt = ko.utils.arrayFilter(self.FnOfallwww(), function (itm) {
                    return itm.date() === dt
                });
                if ( cnt.length > 0 ) {
                    if (typeof cnt[0].S1() !== 'undefined') {
                        S1 = S1 + parseInt(cnt[0].S1());
                    }
                    if (typeof cnt[0].S1() !== 'undefined') {
                        S2 = S2 + parseInt(cnt[0].S2());
                    }
                }
            }
            return {
                S1: S1,
                S2: S2
            }
        } else {
            return null
        }        
    }    
    //Count persons on shiftsA
    self.Count_ShiftA = function (date) {
        const ShiftA = ',SNET,s,1,1n,n2,';
        let props = 0;
        let propsOld = 0;
        if (date !== undefined & self.message() !== 'Busy') {
            if (self.Table_Name_Fields()[date]['Type'] === 'Day') {
                const cnt = ko.utils.arrayFilter(self.persDbview(), function (itm) {
                    return itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() !== itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] & ShiftA.indexOf( `,${ itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() },` ) > -1 & itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() !== ''
                });
                props = cnt.length;
            }
            if (self.Table_Name_Fields()[date]['Type'] === 'Day') {
                const cnt1 = ko.utils.arrayFilter(self.persDbview(), function (itm) {
                    return itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() !== itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] & ShiftA.indexOf( `,${ itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] },` ) > -1 & itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] !== ''
                });
                propsOld = cnt1.length;
            }
            return props - propsOld;
        } else {
            return null;
        }
    };
    //Count persons on shiftsB
    self.Count_ShiftB = function (date) {
        const ShiftB = ',SNET,s,2,n2,1n,';
        let props = 0;
        let propsOld = 0;
        if (date !== undefined & self.message() !== 'Busy') {
            if (self.Table_Name_Fields()[date]['Type'] === 'Day') {
                const cnt = ko.utils.arrayFilter(self.persDbview(), function (itm) {
                    return itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() !== itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] & ShiftB.indexOf( `,${ itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() },` ) > -1 & itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() !== ''
                });
                props = cnt.length;
            }
            if (self.Table_Name_Fields()[date]['Type'] === 'Day') {
                const cnt1 = ko.utils.arrayFilter(self.persDbview(), function (itm) {
                    return itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] ]() !== itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] & ShiftB.indexOf( `,${ itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] },` ) > -1 & itm[ self.Table_Name_Fields()[ date ][ 'Full_date' ] + 'old' ] !== ''
                });
                propsOld = cnt1.length;
            }
            return props-propsOld;
        } else {
            return null;
        }
    };
    self.CheckLimitLicences = ko.computed(function () {
        let err = 0
        let count = 0;
        let S1 = 0;
        let S2 = 0;
        if (self.message() !== 'Busy') {
            self.Table_Name_Fields().forEach((item) => {
                if (item['Type'] === 'Day') {
                    const dt = self.Table_Name_Fields()[count]['Full_date'];
                    S1 = self.Count_ShiftA(count);
                    S2 = self.Count_ShiftB(count);
                    const cnt = ko.utils.arrayFilter(self.FnOfallwww(), function (itm) {
                        return itm.date() === dt
                    });
                    if (typeof S1 !== 'undefined') {
                        S1 = parseInt(S1);
                    } else {
                        S1 = 0;
                    }
                    if (typeof S2 !== 'undefined') {
                        S2 = parseInt(S2);
                    } else {
                        S2 = 0;
                    }
                    if (cnt.length > 0) {
                        if (typeof cnt[0].S1() !== 'undefined') {
                            S1 = S1 + parseInt(cnt[0].S1());
                        }
                        if (typeof cnt[0].S1() !== 'undefined') {
                            S2 = S2 + parseInt(cnt[0].S2());
                        }
                    }
                    if (S1 > self.licenses()) {
                        err += 1;
                    }
                    if (S2 > self.licenses()) {
                        err += 1;
                    }
                }
                count += 1;
            })
        }
        return err
    });
    //************************************************************
    // Multi Selection TOOL
    // Multiselect selection tool options 
    // Pin/UnPin Menu
    self.Multiselect_pin = ko.observable(false);
    self.Change_Pin = function () {
        if (self.Multiselect_pin()) {
            self.Multiselect_pin(false)
        } else {
            self.Multiselect_pin(true)
        }
    }
    // Presets - list of Avaliable selection MODES
    self.availablemodes = ko.observableArray(['Select single cell', 'Select chosen days in week']);
    self.bindModes = ko.observable(self.availablemodes()[0]);
    // List of avaliable replace metods
    self.ReplaceMetods = ko.observableArray(self.Data_Type() === ['Replace Selected Value', 'Copy Values From Person']);
    self.SelectedReplaceMetod = ko.observable(self.ReplaceMetods()[0]);
    // Prestes for selection mode by 'Select single cell', 'Select chosen days in week' => Value for Replace selected
    self.bindSelect = ko.observable(self.availableitems()[0]); // First preset => first row of list avaliable items used in entire table viewmodel
    // Presets ad Object used in selection tool by weekday
    self.chosenDays = ko.observableArray(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    // Values used in select in multitool
    self.weekday = ko.observableArray([{ WeekDay: 'Mon' }, { WeekDay: 'Tue' }, { WeekDay: 'Wed' }, { WeekDay: 'Thu' }, { WeekDay: 'Fri' }, { WeekDay: 'Sat' }, { WeekDay: 'Sun' }]);
    // Inverse selected Days
    this.Inverse_days = function () {
        const tmp = self.chosenDays().toString()
        self.chosenDays.removeAll()
        self.chosenDays(self.weekday().filter(item => tmp.indexOf(item.WeekDay) === -1).map((item) => item.WeekDay));
    }
    // Object used in selection tool / copy from another person mode
    self.ListOfPersons = function ()
    {
        let tmarr = [];
        let no = 0;
        if ( self.persDbview !== undefined ) {
            self.persDbview().forEach( ( item ) =>
            {
                tmarr.push( {
                    full_name: item.full_name,
                    No: no
                } );
                no = no + 1;
            } );
        }
        return tmarr;
    };
    // Enable all rows selection
    self.SelectedAllrows = ko.observable(false);
    // Enable selections by all columns from header
    self.SelectedAllcolumns = ko.observable(true);
    self.ColumnsSel = ko.observableArray(['On Visible Page', 'On All Pages']);
    self.AllColumnsSelection = ko.observable(this.ColumnsSel()[0]);
    // All rows selection strategy
    self.AllRowsStrategy = ko.observableArray(['All', 'Only even weeks', 'Just odd weeks']);
    // Selected Strategy for allRows metod
    self.SelectedAllRowsStrategy = ko.observable(self.AllRowsStrategy()[0]);
    // All rows selection limit range dates
    self.AllRowsRange = ko.observable(true);
    self.AllRowsTimeUnit = ko.observable(self.TimeUnit()[0]);
    self.AllRows_To = ko.observable(' ');
    self.AllRows_From = ko.observable(' ');
    // Variable of selected prearson in TOOL
    self.CopyFromPerson = ko.observable(self.ListOfPersons()[0]);
    // Selected enumerable Request
    self.selectedEnumerable = ko.observable( self.RequestEnumerable()[ 0 ] );
    self.RequestOnlyEnumerable = ko.observableArray( [] );
    //Multi selection function and presets
    // Selected fields list (guid + name of field)
    self.Selected_cells = ko.observableArray([]);
    // Turn ON/OFF multiselection tool
    self.multiselect = ko.observable( self.Data_Type() === 'Timetable' || !self.Current_multiTimetables() ? 'Disabled': 'Enabled').extend({ rateLimit: { timeout: 10, method: "notifyWhenChangesStop" } });
    // Selected cells counter
    self.countSelections = ko.observable(0);
    //Select All rows in selected column
    this.Column_selection = async function (exist) {
        if (self.SelectedAllcolumns()) {
            if (self.multiselect() === 'Enabled') {
                if (self.AllColumnsSelection() === 'On Visible Page') {
                    self.pagedRows().forEach((item) => {
                        this.multt_select(item.id, exist);
                    });
                }
                else if (self.AllColumnsSelection() === 'On All Pages') {
                    self.persDbview().forEach((item) => {
                        this.multt_select(item.id, exist);
                    });
                }
            }
        }
    };
    // Add remove to array of selected fields
    this.multt_select = async function (id, exist) {
        if (self.multiselect() === 'Enabled') {
            exist = this.Column_Offset(exist);
            if (self.bindModes() === 'Select single cell') {
                if (self.Table_Name_Fields()[exist]["Type"] === "Day") {
                    await this.SelectOnEcell(id, exist, true);
                } else if (self.SelectedAllrows() & self.Table_Name_Fields()[exist]["Type"] === "Main") {
                    await this.SelectRow(id);
                }
            } else if (self.bindModes() === 'Select chosen days in week') {
                if (self.Table_Name_Fields()[exist]["Type"] === "Day") {
                    await this.SelectWeek(id, exist);
                } else if (self.SelectedAllrows() & self.Table_Name_Fields()[exist]["Type"] === "Main") {
                    await this.SelectRow(id);
                }
            }
        } else if ( self.countSelections() > 0 ) {
            self.Table_Name_Fields().forEach((item) => {
                if ( item.Sel_guid_day().length > 0 ) {
                    item.Sel_guid_day.removeAll();
                }
            })
            self.countSelections(0);
        }
    }
    // Calculate offset of visibility columns
    this.Column_Offset = function (exist) {
        if (self.Table_Name_Fields()[exist]["Type"] === "Day" & self.columnindex() > 0) {
            return exist + self.selectedColumns().start - 1 - self.InfoFields();
        } else {
            return exist;
        }
    }
    // Select row by Row selection strategy
    this.SelectRow = async function (id) {
        let week = '';
        let ind = 0
        self.Table_Name_Fields().forEach((items) => {
            if (items.Type === 'Day') {
                if (this.IsSeltionInRange(items.Date_Value)) {
                    if (self.bindModes() === 'Select chosen days in week') {
                        if (week !== items.isoWeek) {
                            week = items.isoWeek;
                            if (self.SelectedAllRowsStrategy() === 'Only even weeks') {
                                if (ParityWeek(week)) {
                                    this.SelectWeek(id, ind);
                                }
                            } else if (self.SelectedAllRowsStrategy() === 'Just odd weeks') {
                                if (!ParityWeek(week)) {
                                    this.SelectWeek(id, ind);
                                }
                            } else {
                                this.SelectWeek(id, ind);
                            }
                        }
                    } else {
                        week = items.isoWeek;
                        if (self.SelectedAllRowsStrategy() === 'Only even weeks') {
                            if (ParityWeek(week)) {
                                this.SelectOnEcell(id, ind, true);
                            }
                        } else if (self.SelectedAllRowsStrategy() === 'Just odd weeks') {
                            if (!ParityWeek(week)) {
                                this.SelectOnEcell(id, ind, true);
                            }
                        } else {
                            this.SelectOnEcell(id, ind, true);
                        }
                    }
                }
            }
            ind = ind + 1
        });
    }
    // Select of week method
    this.SelectWeek = async function (id, exist) {
        if (self.Table_Name_Fields()[exist]["Type"] === "Day") {
            const tmp = self.chosenDays().toString()
            const week = self.Table_Name_Fields()[exist]["isoWeek"];
            const day = self.Table_Name_Fields()[exist]["Date_Value"].getDay();
            let offset = 0;
            if (day === 0) {
                offset = 7;
            } else {
                offset = day;
            }
            for (let i = 1; i < 8; i++) {
                if (tmp.indexOf(self.Table_Name_Fields()[exist - offset + i]["Type"] === "Day")) {
                    if (tmp.indexOf(self.Table_Name_Fields()[exist - offset + i]["Week_Day"]) > -1 & self.Table_Name_Fields()[exist - offset + i]["isoWeek"] === week) {
                        await this.SelectOnEcell(id, exist - offset + i, true);
                    }
                }
            }
        }
    }
    //Selection Helper metod => Select one cell
    this.SelectOnEcell = async function (id, col_index, Inverse) {
        if (self.Table_Name_Fields()[col_index]['Sel_guid_day'].indexOf('_' + id + '_') > -1) {
            if (Inverse) {
                self.Table_Name_Fields()[col_index]['Sel_guid_day'].remove('_' + id + '_');
                self.countSelections(self.countSelections() - 1)
            }
        } else {
            const exist = self.persDbview.indexOf(
                ko.utils.arrayFirst(self.persDbview(), function (item) {
                    return item.id === id
                }));
            if (self.persDbview()[exist][self.Table_Name_Fields()[col_index]['Full_date']]() !== 'u') {
                self.Table_Name_Fields()[col_index]['Sel_guid_day'].push('_' + id + '_');
                self.countSelections(self.countSelections() + 1)
            }
        }
    }
    // Enable disable multi tool
    this.multi = async function () {
        if (self.multiselect() === 'Disabled') {
            self.multiselect('Enabled');
        } else {
            self.multiselect('Disabled')
            await self.multt_select();
        }
    };
    // Unselect all selected cells
    self.Unselect = function () {
        this.multi();
        this.multi();
    };
    // Replace selected by value
    self.ReplaceItems = function () {
        if (self.multiselect() !== 'Disabled') {
            const tmbModPers = [];            
            self.Table_Name_Fields().forEach((items) => {
                if ( items.Sel_guid_day().length > 0 & items.Type === 'Day' ) {
                    items.Sel_guid_day().forEach((gu) => {
                        const exist = self.persDbview.indexOf(
                            ko.utils.arrayFirst(self.persDbview(), function (item) {
                                return item.id === parseInt(gu.replaceAll('_', ''))
                            }));
                        if (self.SelectedReplaceMetod() === 'Replace Selected Value') {
                            if (self.persDbview()[exist]['guid'] !== '') {
                                if (self.bindSelect() !== 'u') {
                                    self.persDbview()[exist][items.Full_date](self.bindSelect());
                                }
                            } else {
                                self.persDbview()[exist][items.Full_date](self.bindSelect());
                            }                                                       
                        } else if (self.SelectedReplaceMetod() === 'Copy Values From Person') {
                            if (self.persDbview()[exist]['guid'] !== '') {
                                if (self.persDbview()[self.CopyFromPerson().No][items.Full_date]() !== 'u') {
                                    self.persDbview()[exist][items.Full_date](self.persDbview()[self.CopyFromPerson().No][items.Full_date]());
                                }
                            } else {
                                self.persDbview()[exist][items.Full_date](self.persDbview()[self.CopyFromPerson().No][items.Full_date]());
                            }                           
                        } else if (self.SelectedReplaceMetod() === 'Change Time Calculation mode') {
                            const tmpSelection = self.selectedEnumerable();
                            if (tmpSelection) {
                                self.Request_Mod.push({
                                    dateFrom: items.Full_date,
                                    dateTo: items.Full_date,
                                    emp_id: self.persDbview()[exist]['id'],
                                    isWholeDay: true,
                                    number: null,
                                    status: "AddBYwww",
                                    title: tmpSelection.description(),
                                    typeId: tmpSelection.req_type_id(),
                                    userId: self.persDbview()[exist]['guid']
                                });
                                if (self.persDbview()[exist][items.Full_date]() !== '') {
                                    const tmrange = self.Get_Work_Hours_By_Type_id(tmpSelection.emp_type(), self.persDbview()[exist][items.Full_date]);
                                    self.CalcModeEditedPers.push({
                                        guid: self.persDbview()[exist]['guid'],
                                        date: formatDate(items.Full_date),
                                        startTime: tmrange.startTime,
                                        endTime: tmrange.endTime
                                    })

                                }
                            }
                        }
                    });
                }
            })
            // Compact enumerable requests
            if (self.SelectedReplaceMetod() === 'Change Time Calculation mode') {
                self.savigType('Calc_mode');
                $("#dialog-message").dialog('open');
                self.Save_Changes_RST();
                self.compactRequests();                                
            }
        }
        this.multi();
        this.multi();
    };
    // Check if selectiion is in visible range
    this.IsSeltionInRange = function (date) {
        let tmp = true;
        if (self.AllRowsRange()) {
            if (self.AllRows_From().length > 3 & self.AllRows_To().length > 3) {
                if (self.AllRowsTimeUnit() !== 'Full date' & self.AllRows_From().indexOf("-W") > -1 & self.AllRows_To().indexOf("-W") > -1) {
                    tmp = (parseInt(HtmlWeekToISO(self.AllRows_From())) <= parseInt(date.getWeekYear().toString() + Len_two_Dig(date.getWeek().toString())) & parseInt(date.getWeekYear().toString() + Len_two_Dig(date.getWeek().toString())) <= parseInt(HtmlWeekToISO(self.AllRows_To())))
                } else {
                    tmp = (stringToDate(self.AllRows_From(), 'yyyy-mm-dd', '-') <= date & date <= stringToDate(self.AllRows_To(), 'yyyy-mm-dd', '-'))
                }
            }
        }
        return tmp
    }
    //************************************************************
    // HTML Viewmodel variables for Table     
    //Fotter selected type of set
    self.fottSelected = ko.observable('Week_Day');
    //Header selected type of set
    self.headerSelected = ko.observable('Full_date');
    // List of prestes for views types.
    self.fott_view = ko.observableArray(['isoWeek', 'Month_name', 'Number_Day', 'Week_Day', 'Full_date']);
    // Pure computed for Design when changing From Timetable Mode to Draft
    self.compute_fields = ko.computed(function () {
        if (self.Data_Type() === 'Timetable') {
            self.fott_view(['isoWeek', 'Month_name', 'Number_Day', 'Week_Day', 'Full_date'])
            self.fottSelected('Week_Day');
            self.headerSelected('Full_date');
            self.AllRowsRange(true);
            self.SelectedAllrows(false);
        } else {
            self.credentials(true);
            self.fott_view(['Number_Day', 'Week_Day'])
            self.fottSelected('Week_Day');
            self.headerSelected('Number_Day');
            self.AllRowsRange(false);
            self.SelectedAllrows(true);
        }
        return self.Data_Type();
    })
    /// True list of dataset columns used in view table fotter / header of table
    self.table_view_func = ko.pureComputed(function () {
        if (self.valid_date_to() === " " || self.valid_date_from() === " ") {
            return [];
        } else {
            const props = [];
            props.push(...self.staticVMfields());
            const date_to = stringToDate(self.valid_date_to(), "yyyy-mm-dd", "-");
            for (let tm = stringToDate(self.valid_date_from(), "yyyy-mm-dd", "-"); tm <= date_to; tm.setDate(tm.getDate() + 1)) {
                props.push(formatDate(tm));
            }
            return props;
        }
    }).extend({ rateLimit: { timeout: 1000, method: "notifyWhenChangesStop" } }).extend({ deferred: true });
    //****************************************************
    //Range of Visibility rows => saves RAM
    // Dataset in paged view
    self.itemscOunt = ko.observableArray([10, 20, 30, 40, 50, 100, 200, 300, 400, 500]);
    self.maxPageIndex = ko.pureComputed(function () {
        return Math.ceil(self.FilteredSet().length / self.pageSize()) - 1;
    }).extend({ deferred: true });
    self.pageSize = ko.observable(100).extend({ deferred: true });
    self.pageIndex = ko.observable(0);
    self.previousPage = function () {
        self.pageIndex(self.pageIndex() - 1);
    };
    self.nextPage = function () {
        self.pageIndex(self.pageIndex() + 1);
    }
    self.pagedRows = ko.pureComputed(function () {
        //ko.tasks.runEarly();        
        self.txt(' => Change range of data');
        const size = self.pageSize();
        const max = self.maxPageIndex();
        if (max > -1 & self.pageIndex() > max) { self.pageIndex(max); }
        const start = self.pageIndex() * size;
        setTimeout(async function () {
        //    $(window).scroll();
            await hideLoader();
        }, 20);

        return self.FilteredSet().slice(start, start + size);

    } ).extend( { rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } } );

    //self.visibility = ko.pureComputed( function ()
    //{
    //   self.pagedRows().forEach( ( item, nmber ) =>
    //    {
    //        if ( nmber >= self.scrollTopS() && nmber <= self.scrollTopE() ) {
    //            item.inView( true )
    //        } else {
    //            item.inView( false )
    //        }
    //    } )
    //    self.pagedRows.valueHasMutated();
    //}
    //)

    //****************************************************
    // Limit columns => saves RAM
    //Array of limited columns in data Range
    self.InfoFields = ko.observable(1);
    self.ColumnPages = ko.observableArray([]).extend({ deferred: true });
    self.selectedColumns = ko.observable({ number: 0 });
    self.columnindex = ko.pureComputed(function () {
        if (self.selectedColumns() !== undefined) {
            return self.selectedColumns().number;
        } else {
            return 0;
        }
    }).extend({ deferred: true });   
    //Array of limited columns
    self.LimitTable_Name_Fields = ko.pureComputed(function () {
        if ( self.ColumnPages().length > 0 ) {

            self.txt(' => Change range of data');
            const tmparr = [];
            const max = self.ColumnPages().length;
            if (max > -1 & self.columnindex() > max) { self.columnindex(max); }
            const start = self.selectedColumns().start - 1;
            const size = self.selectedColumns().End - 1;

            tmparr.push(...self.Table_Name_Fields.slice(0, self.InfoFields()));
            tmparr.push(...self.Table_Name_Fields.slice(start, size));
            if (self.AllRowsTimeUnit() === 'Full date' & self.AllRowsRange()) {
                self.AllRows_From(self.Table_Name_Fields()[start]['Full_date']);
                self.AllRows_To(self.Table_Name_Fields()[size - 1]['Full_date']);
            }
            if (self.AllRowsTimeUnit() === 'ISO week' & self.AllRowsRange()) {
                self.AllRows_From(ISOWeekTohtml(self.Table_Name_Fields()[start]['isoWeek']));
                self.AllRows_To(ISOWeekTohtml(self.Table_Name_Fields()[size - 1]['isoWeek']));
            }

            setTimeout(async function () {
            //   $(window).scroll();
                await hideLoader();
            //
            }, 20);

            //return self.Table_Name_Fields.slice(start, start + size);
            //return ko.utils.extend(self.Table_Name_Fields.slice(0, self.InfoFields()),(self.Table_Name_Fields.slice(start, size)));
            return tmparr
        } else { return self.Table_Name_Fields.slice(0, 0); }
    }).extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });
    
    //****************************************************
    // MenuItem
    // Thead and Fotter Table Menu
    self.clickHandlerThead = function (data) {
        $("#menu").hide();
    };
    self.clickHandlerTheadP = function (data) {
        $("#menuP").hide();
    };
    self.clickHandlerBodyP = function (data) {
        $("#PersMnu").hide();  
    };
    self.showMenuChanges = function (event) {
        if (self.Data_Type() === 'Timetable') {
            $("#MenuChanges").menu({
                select: function (e, ui) {
                    //console.log("SELECT", ui.item);
                    const choise = typeof (ui.item.context.outerText) !== 'undefined' ? ui.item.context.outerText : ui.item.context.innerText;
                    if (choise.indexOf('Cancel') > -1) {
                        clickMenuChanges();
                    }
                    else if (choise.indexOf('Not Notify') > -1) {
                        viewModel.Presentchanges_annotType('Not Notify');
                        viewModel.Presentchanges_annotType.valueHasMutated()
                        clickMenuChanges();
                        viewModel.Save_Changes_RST()
                    }
                    else if (choise.indexOf('Notify person once') > -1) {
                        viewModel.Presentchanges_annotType('Notify person once');
                        viewModel.Presentchanges_annotType.valueHasMutated()
                        clickMenuChanges();
                        //viewModel.SendIncrCounterPers();
                        viewModel.Save_Changes_RST();
                    }
                    else if (choise.indexOf('Notify every changed data') > -1) {
                        viewModel.Presentchanges_annotType('Notify every changed data');
                        viewModel.Presentchanges_annotType.valueHasMutated()
                        clickMenuChanges();
                        //viewModel.SendIncrCounterPers();
                        viewModel.Save_Changes_RST()
                    }
                }
            });
            $("#MenuChanges").css({
                left: 0, top: 0,
                'z-index': 65535
            });
            $("#MenuChanges").position({
                my: "left top",
                of: event
            });
            $("#MenuChanges").show().focus();

            $('input.ui-state-focus').click(function (e) {
                e.stopPropagation();
                $(this).focus()
            })
        } else {
            self.Presentchanges_annotType('Not Notify');
            self.Presentchanges_annotType.valueHasMutated()            
            self.Save_Changes_RST()
        }
    }
    self.OpenMenuBodyP = function (data) {
        $("#PersMnu").menu({
            select: function (e, ui) {
                //console.log("SELECT", ui.item);
                const choise = typeof (ui.item.context.outerText) !== 'undefined' ? ui.item.context.outerText : ui.item.context.innerText;
                if (choise.indexOf('Close') > -1) {
                    viewModel.clickHandlerBodyP( data );
                    viewModel.CurrRow( '' );
                }
                else if (choise.indexOf('Delete Selected Persons') > -1) {
                    viewModel.markPerDEL(data);
                    viewModel.clickHandlerBodyP(data);
                }
                else if (choise.indexOf('Add New Person') > -1) {
                    viewModel.markPerADD();
                    viewModel.clickHandlerBodyP(data);
                }
                else if (choise.indexOf('Edit Selected Persons') > -1) {
                    viewModel.EditBlockAllPers();
                    viewModel.clickHandlerBodyP(data);
                }
                else if ( choise.indexOf( 'Add / Modify Custom Time' ) > -1 ) {
                    viewModel.EditCustomTimePers();
                    viewModel.clickHandlerBodyP( data );
                }
            }
        });
        $("#PersMnu").css({
            left: 0, top: 0,
            'z-index': 65535
        });
        $("#PersMnu").position({
            my: "left top",
            of: data
        });
        $("#PersMnu").show().focus();

        $('input.ui-state-focus').click(function (e) {
            e.stopPropagation();
            $(this).focus()
        })
    }
    self.OpenMenuTheadP = function (data) {
        $("#menuP").menu({
            select: function (e, ui) {
                //console.log("SELECT", ui.item);
                const choise = typeof (ui.item.context.outerText) !== 'undefined' ? ui.item.context.outerText : ui.item.context.innerText;
                if (choise.indexOf('Close') > -1) {
                    viewModel.clickHandlerTheadP(data);
                }
                else if (choise.indexOf('Clear All Filters') > -1) {
                    viewModel.remALLP();
                    viewModel.clickHandlerTheadP(data);
                }
                else if (choise.indexOf('Clear Selected Filter') > -1) {
                    viewModel.remCurrP();
                    viewModel.clickHandlerTheadP(data);
                }
                else if (choise.indexOf('Apply Selected Filter') > -1) {
                    viewModel.AppfilP();
                    viewModel.clickHandlerTheadP(data);
                }
                else if (choise.indexOf('Sort Ascending') > -1) {
                    viewModel.SortAscP(self.CurrentFieldAttrP());
                    viewModel.clickHandlerTheadP(data);
                }
                else if (choise.indexOf('Sort Descending') > -1) {
                    viewModel.SortDescP(self.CurrentFieldAttrP());
                    viewModel.clickHandlerTheadP(data);
                }

            }
        });
        $("#menuP").css({
            left: 0, top: 0,
            'z-index': 65535});
        $("#menuP").position({
            my: "left top",
            of: data
        });
        $("#menuP").show().focus();

        $('input.ui-state-focus').click(function (e) {
            e.stopPropagation();
            $(this).focus()
        })
    }
    self.OpenMenuThead = function (data) {
        $("#menu").menu({
            select: function (e, ui) {
                //console.log("SELECT", ui.item);
                const choise = typeof (ui.item.context.outerText) !== 'undefined' ? ui.item.context.outerText : ui.item.context.innerText;
                if (choise.indexOf('Close') > -1) {
                    viewModel.clickHandlerThead(data);
                }
                else if (choise.indexOf('Clear All Filters') > -1) {
                    viewModel.remALL();
                    viewModel.clickHandlerThead(data);
                }
                else if (choise.indexOf('Clear Selected Filter') > -1) {
                    viewModel.remCurr();
                    viewModel.clickHandlerThead(data);
                }
                else if (choise.indexOf('Apply Selected Filter') > -1) {
                    viewModel.Appfil();
                    viewModel.clickHandlerThead(data);
                }
                else if (choise.indexOf('Sort Ascending') > -1) {
                    viewModel.SortAsc(self.CurrentFieldAttr());
                    viewModel.clickHandlerThead(data);
                }
                else if (choise.indexOf('Sort Descending') > -1) {
                    viewModel.SortDesc(self.CurrentFieldAttr());
                    viewModel.clickHandlerThead(data);
                }

            }
        });
        $("#menu").css({ left: 0, top: 0 });
        $("#menu").position({
            my: "left top",
            of: data
        });
        $("#menu").show().focus();

        $('input.ui-state-focus').click(function (e) {
            e.stopPropagation();
            $(this).focus()
        })
    }
    self.OpenMenuClick = function (HtmlElement, data) {
        if (data.Type !== 'Day') {
            self.CurrFilter('');
            self.CurrentFieldAttr(data.Date_Value)
            for (let i = 0, ii = self.filterArr().length; i < ii; i++) {
                if (self.filterArr()[i].col === data.Date_Value) {
                    self.CurrFilter(self.filterArr()[i].val);
                }
            }
            self.OpenMenuThead(HtmlElement);
        }
    }
    // Body Table Menu
    self.clickHandlerBody = function (data) {
        $("#menuitem").hide();
    };
    self.OpenMenuBody = function (data) {
        //console.log(data);
        $("#menuitem").menu({
            select: function (e, ui) {
                //console.log("SELECT", ui.item);
                const choise = typeof (ui.item.context.outerText) !== 'undefined' ? ui.item.context.outerText : ui.item.context.innerText;
                if (choise.indexOf('Close') > -1) {
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Add / Remove Persons List') > -1) {
                    viewModel.OpenMenuAddPers();
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Save Changes') > -1) {
                    viewModel.Save_Changes_RST();
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Get Persons List from HRNEST') > -1) {
                    viewModel.check_Dataset();
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Refresh Dataset') > -1) {
                    viewModel.get_recrdset();
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Change Edited Timetable') > -1) {
                    viewModel.get_dat();
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Modify for selected person') > -1) {
                    //console.log(self.CurrRow())
                    viewModel.clickHandlerBody(data);
                }
                else if (choise.indexOf('Turn On/Off Selection Tool') > -1) {
                    viewModel.multi();
                    viewModel.clickHandlerBody(data);
                }
            }
        });
        $("#menuitem").css({ left: 0, top: 0 });
        $("#menuitem").position({
            my: "left top",
            of: data
        });
        $("#menuitem").show().focus();

        $('input.ui-state-focus').click(function (e) {
            e.stopPropagation();
            $(this).focus()
        })
    }
    self.OpenMenuBodyClick = function (HtmlElement, data) {
        if (data.Type !== 'Day') {
            self.CurrFilter('');
            self.CurrentFieldAttr(data.Date_Value)
            for (let i = 0, ii = self.filterArr().length; i < ii; i++) {
                if (self.filterArr()[i].col === data.Date_Value) {
                    self.CurrFilter(self.filterArr()[i].val);
                }
            }
            self.OpenMenuThead(HtmlElement);
        }
    };
    self.openTabSettings = function (data) {
        const selected = $("#tabs").tabs("option", "selected");
        $("#tabs").tabs("option", "selected", selected + 1);
    }
    // Block edit timetable fields
    self.EditBlockAllPers = function () {
        if ( self.SelectedPersonsPER().length > 0 ) {
            const wWidth = $(window).width();
            const wHeight = $(window).height();
            const dWidth = wWidth * 0.3;
            const dHeight = ( wHeight * 0.5 ) * ( self.AvaliableEditPersView().length/3) ;
            const dialog = $("#BlockModify").dialog({
                dialogClass: 'no-close',
                autoOpen: false,
                title: 'List of Selected Persons Editable Fields',
                height: dHeight,
                width: dWidth,
                modal: true,
                buttons:
                {
                    "Modify Selected": function ()
                    {
                        self.BlockModify();
                        dialog.dialog( "close" );
                    },
                    Close: function () {                                              
                        dialog.dialog( "close" );
                        self.CurrRow( '' );
                    }
                }
            });
            dialog.dialog("open");
        }
    }
    // Add modify remove enumerable Request
    self.EditCustomTimePers = function ()
    {        
        this.get_OnlyRequestEnumerable();
        self.LimituserFrmRequests_Name_Fields([
            { name: 'attr', w: ko.observable( Len_Text_Fields[ 'attr' ] * 12.5 ).extend( { deferred: true } ), type: ko.observable( 'edit' ) },
            { name: 'number', w: ko.observable( Len_Text_Fields[ 'number' ] * 12.5 ).extend( { deferred: true } ), type: ko.observable( 'non_edit' ) },
            { name: 'date_From', w: ko.observable( Len_Text_Fields[ 'dateFrom' ] * 12.5 ).extend( { deferred: true } ), type: ko.observable( 'edit' ) },
            { name: 'date_To', w: ko.observable( Len_Text_Fields[ 'dateTo' ] * 12.5 ).extend( { deferred: true } ), type: ko.observable( 'edit' ) },
            { name: 'description', w: ko.observable( Len_Text_Fields[ 'description' ] * 12.5 ).extend( { deferred: true } ), type: ko.observable( 'edit' ) },
        ])
        const wWidth = $( window ).width();
        const wHeight = $( window ).height();
        const docWidth = window.screen.width
        const dWidth = ( wWidth * 0.6 > 600 ? 600 : wWidth * 0.6 );
        const dHeight = wHeight * 0.7;
        const dialog = $( "#AddModifyNonStandardTime" ).dialog( {
            dialogClass: 'no-close',
            autoOpen: false,
            title: 'Add / Modify / Delete Request',
            height: dHeight,
            width: dWidth,
            modal: true,
            buttons:
            {
                "Save Changes": function () { self.SaveChangesREQ() },
                Close: function ()
                {
                    dialog.dialog( "close" );
                    self.CurrRow( '' );
                }
            }
        } );        
        dialog.dialog( "open" );
        this.get_UserEnumerbleRequest();
    }
    // Add modify remove persons from all timetables
    self.OpenMenuAllPers = function () {        
        this.UsersGetALL();
        const wWidth = $(window).width();
        const wHeight = $( window ).height();
        const docWidth = window.screen.width
        const dWidth = (wWidth * 0.8 > 1380 ? 1380 : wWidth * 0.8);
        const dHeight = wHeight * 0.9;
        const dialog = $("#AddModPerson").dialog({
            dialogClass: 'no-close',
            autoOpen: false,
            title:'List of All Persons',
            height: dHeight,
            width: dWidth,
            modal: true,
            buttons:
            {
                "Save Changes": function () { self.SaveChangesPer() },
                Close: function () {
                    self.personMode('none');
                    if ( self.personsALL_mod().length > 0 ) {
                        self.personsALL_mod.removeAll()
                    }                   
                    self.personsALL.removeAll();
                    self.userList1.removeAll();
                    self.userList2.removeAll();
                    dialog.dialog("close");
                }
            }
        });
        self.personMode('All');
        dialog.dialog("open");        
    }
    // Add/Remove persns menu
    self.clickHandlerAddPers = function (data) {
        $("#selepers").hide();
    };
    self.OpenMenuAddPers = function (data) {        
        this.UsersGetALL();
        //$("#dialog-form.selepers").modal("show")
        const dialog = $("#dialog-form.selepers").dialog({
            dialogClass: 'no-close',
            autoOpen: false,
            height: 610,
            width: 720,
            modal: true,
            buttons:
            {
                "Save Changes": function () { self.TimetableChanges() },
                Close: function () {
                    self.personMode('none');
                    if ( self.personsALL_mod().length > 0 ) {
                        self.personsALL_mod.removeAll()
                    }                    
                    self.personsALL.removeAll();
                    self.userList1.removeAll();
                    self.userList2.removeAll();
                    dialog.dialog("close");
                }
            }
        });
        self.personMode('Timetable')
        dialog.dialog("open");
    }
    //****************************************************
    // Filtering Main Table
    // Observable for filtering fields by value
    self.filterArr = ko.observableArray([]);
    self.filterArrP = ko.observableArray([]);
    
    // Observable => current field selected by Context menu
    self.CurrentFieldAttr = ko.observable('').extend({ deferred: true });;
    self.CurrentFieldAttrP = ko.observable('').extend({ deferred: true });;
    // Observable => filter value of selected field
    self.CurrFilter = ko.observable('').extend({ deferred: true });
    self.CurrRow = ko.observable( '' ).extend( { deferred: true } );
    
    self.CurrFilterP = ko.observable('').extend({ deferred: true });
    self.CurrRowP = ko.observable('').extend({ deferred: true });
    // Is Filter on field are active ?
    self.filtered = function (field) {
        let k = 101;
        for (let i = 0, ii = self.filterArr().length; i < ii; i++) {
            if (self.filterArr()[i].col === field) {
                k = i;
                return 'true';
            }
        }
        if (k === 101) {
            return 'false';
        }
    };
    self.filteredP = function (field) {
        let k = 101;
        for (let i = 0, ii = self.filterArrP().length; i < ii; i++) {
            if (self.filterArrP()[i].col === field) {
                k = i;
                return 'true';
            }
        }
        if (k === 101) {
            return 'false';
        }
    };    
    self.remCurrP = function () {
        let k = 101;
        const d = self.CurrentFieldAttrP();
        for (let i = 0, ii = viewModel.filterArrP().length; i < ii; i++) {
            if (self.filterArrP()[i].col === d) {
                k = i
            }
        }
        if (k !== 101) {
            self.filterArrP.splice(k, 1);
        }
        //this.filterData();
    }
    self.remALLP = function () {
        self.filterArrP.removeAll()
    }
    // Apply selected filter on field
    self.AppfilP = function () {
        const d = self.CurrentFieldAttrP();
        const c = self.CurrFilterP();
        let k = 101;
        if (c === '') {
            self.remCurrP();
        } else {
            for (let i = 0, ii = self.filterArrP().length; i < ii; i++) {
                if (self.filterArrP()[i].col === d) {
                    self.filterArrP()[i].val = c;
                    k = i;
                }
            }
            if (k === 101) {
                let va = {
                    col: d,
                    val: c
                }
                self.filterArrP.push(va);
            }
            self.filterArrP.valueHasMutated();
            //this.filterData();
        }
    }
    // Pure Computed function for return Filtered Dataset
    self.FilteredSetP = ko.pureComputed(function () {
        const FilteredSet = [];
        if (self.personMode() === 'All') {
            let item,
                found;
            //self.txt(' => Filtering Data');            
            for (let j = 0, jj = self.personsALL().length; j < jj; j++) {
                found = true;
                item = self.SortedArrayP()[j];
                if ( self.filterArrP().length > 0 ) {
                    for (let i = 0, ii = self.filterArrP().length; i < ii; i++) {
                        if (ko.isObservable(item[self.filterArrP()[i].col])) {
                            found = (item[self.filterArrP()[i].col]().toString().toLowerCase().indexOf(self.filterArrP()[i].val.toLowerCase()) !== -1) ? true : false;
                        } else {
                            found = (item[self.filterArrP()[i].col].toString().toLowerCase().indexOf(self.filterArrP()[i].val.toLowerCase()) !== -1) ? true : false;
                        }
                        if (!found) { break; }
                    }
                }
                if (found) {
                    FilteredSet.push(item);
                }
            }
        }
        return FilteredSet;
    }).extend({ throttle: 200 });

    self.remCurr = function () {
        let k = 101;
        const d = self.CurrentFieldAttr();
        for (let i = 0, ii = viewModel.filterArr().length; i < ii; i++) {
            if (self.filterArr()[i].col === d) {
                k = i
            }
        }
        if (k !== 101) {
            self.filterArr.splice(k, 1);
        }
        //this.filterData();
    }
    self.remALL = function () {
        self.filterArr.removeAll()
    }
    // Apply selected filter on field
    self.Appfil = function () {
        const d = self.CurrentFieldAttr();
        const c = self.CurrFilter();
        let k = 101;
        if (c === "") {
            self.remCurr();
        } else {
            for (let i = 0, ii = self.filterArr().length; i < ii; i++) {
                if (self.filterArr()[i].col === d) {
                    self.filterArr()[i].val = c;
                    k = i;
                }
            }
            if (k === 101) {
                let va = {
                    col: d,
                    val: c
                }
                self.filterArr.push(va);
            }
            self.filterArr.valueHasMutated();
            //this.filterData();
        }
    }
    // Pure Computed function for return Filtered Dataset
    self.FilteredSet = ko.pureComputed(function () {
        let item,
            found;
        //self.txt(' => Filtering Data');
        let FilteredSet = [];
        for (let j = 0, jj = self.persDbview().length; j < jj; j++) {
            found = true;
            item = self.SortedArray()[j];
            if ( self.filterArr().length > 0 ) {
                for (let i = 0, ii = self.filterArr().length; i < ii; i++) {
                    if (ko.isObservable(item[self.filterArr()[i].col])) {
                        found = (item[self.filterArr()[i].col]().toString().toLowerCase().indexOf(self.filterArr()[i].val.toLowerCase()) !== -1) ? true : false;
                    } else {
                        found = (item[self.filterArr()[i].col].toString().toLowerCase().indexOf(self.filterArr()[i].val.toLowerCase()) !== -1) ? true : false;
                    }                    
                    if (!found) { break; }
                }
            }
            if (found) {
                FilteredSet.push(item);
            }
        }
        return FilteredSet;
    }).extend({ throttle: 200 });
    //****************************************************
    // Sorting Main Table
    // observable for sorting direction
    self.ActiveSortKey = ko.observable(1).extend({ deferred: true });
    self.ActiveSortKeyP = ko.observable(1).extend({ deferred: true });
    // observable for name of sort field
    self.sortKey = ko.observable('full_name').extend({ deferred: true });
    self.sortKeyP = ko.observable('last_name').extend({ deferred: true });
    self.SortDescP = function (data) {
        self.ActiveSortKeyP(-1);
        self.sortKey(data);
        //self.SortedArray.valueHasMutated();
    };
    self.SortAscP = function (data) {
        self.ActiveSortKeyP(1);
        self.sortKeyP(data);
        //self.SortedArray.valueHasMutated();
    };
    // Pure computed function for sorting dataset
    self.SortedArrayP = ko.pureComputed(function () {
        //self.txt(' => Sorting Data');
        if (self.personMode() === 'All') {
            let _observable = false;
            if (self.personsALL().length > 0) {
                _observable = ko.isObservable(self.personsALL()[0][self.sortKeyP()]);
            }
            return self.personsALL.sorted(function (left, right) {
                if (self.ActiveSortKeyP() === 1) {
                    if (_observable) {
                        return left[self.sortKeyP()]() === right[self.sortKeyP()]() ? 0
                            : left[self.sortKeyP()]() < right[self.sortKeyP()]() ? -1
                                : 1;
                    } else {
                        return left[self.sortKeyP()] === right[self.sortKeyP()] ? 0
                            : left[self.sortKeyP()] < right[self.sortKeyP()] ? -1
                                : 1;
                    }
                } else {
                    if (_observable) {
                        return left[self.sortKeyP()]() === right[self.sortKeyP()]() ? 0
                            : left[self.sortKeyP()]() < right[self.sortKeyP()]() ? 1
                                : -1;
                    } else {
                        return left[self.sortKeyP()] === right[self.sortKeyP()] ? 0
                            : left[self.sortKeyP()] < right[self.sortKeyP()] ? 1
                                : -1;
                    }
                }
            });
        }
        return [];
    }).extend({ throttle: 50 });


    self.SortDesc = function (data) {
        self.ActiveSortKey(-1);
        self.sortKey(data);
        //self.SortedArray.valueHasMutated();
    };
    self.SortAsc = function (data) {
        self.ActiveSortKey(1);
        self.sortKey(data);
        //self.SortedArray.valueHasMutated();
    };
    // Pure computed function for sorting dataset
    self.SortedArray = ko.pureComputed(function () {
        //self.txt(' => Sorting Data');
        let _observable = false;
        if ( self.persDbview().length > 0 ) {
            _observable = ko.isObservable(self.persDbview()[0][self.sortKey()]);
        }
        return self.persDbview.sorted(function (left, right) {
            if (self.ActiveSortKey() === 1) {
                if (_observable) {
                    return left[self.sortKey()]() === right[self.sortKey()]() ? 0
                        : left[self.sortKey()]() < right[self.sortKey()]() ? -1
                            : 1;
                } else {
                    return left[self.sortKey()] === right[self.sortKey()] ? 0
                        : left[self.sortKey()] < right[self.sortKey()] ? -1
                            : 1;
                }
            } else {
                if (_observable) {
                    return left[self.sortKey()]() === right[self.sortKey()]() ? 0
                        : left[self.sortKey()]() < right[self.sortKey()]() ? 1
                            : -1;
                } else {
                    return left[self.sortKey()] === right[self.sortKey()] ? 0
                        : left[self.sortKey()] < right[self.sortKey()] ? 1
                            : -1;
                }
            }
        });
    }).extend({ throttle: 50 });
    //****************************************************
    // Function for too small recordset in view
    // helper function for calculations size of empty body th (in filtered data or last pages) prevent resize of rows   
    self.NullBodyH = ko.pureComputed(function () {
        //return Math.round(window.innerHeight * 0.82) - (typeof (self.pagedRows) != 'undefined' ? self.pagedRows.length * 12 : 0)
        let tmp;
        const pag = self.pagedRows().length;
        const wnd = self.windowSize();
        if (pag === 0) {
            tmp = 0;
        } else {
            if ((wnd.height * 0.83) - (pag * 35 + 130) > 0) {
                tmp = (Math.round(wnd.height * 0.83) - (pag * 35 + 130));
            } else {
                tmp = 0;
            }
        }
        return tmp;
    }).extend({ deferred: true });
    //helper function for empty body th in personsview => prevent resize rows
    self.NullBodyHP = ko.pureComputed(function () {
        //return Math.round(window.innerHeight * 0.82) - (typeof (self.pagedRows) != 'undefined' ? self.pagedRows.length * 12 : 0)
        let tmp;
        const pag = self.FilteredSetP().length;
        const wnd = $("#AddModPerson").height();
        if (pag === 0) {
            tmp = 0;
        } else {
            if ((wnd * 0.83) - (pag * 35 + 130) > 0) {
                tmp = (Math.round(wnd * 0.83) - (pag * 35 + 130));
            } else {
                tmp = 0;
            }
        }
        return tmp;
    }).extend({ deferred: true });
    // helper function for calculation size of emty body tr (when the number of days is too small ) prevent resize of kolumns
    self.NullBodyV = ko.pureComputed(function () {
        let tmp;
        const pag = self.LimitTable_Name_Fields().length;
        const wnd = self.windowSize();
        if (pag === 0) {
            tmp = 0;
        } else {
            if (wnd.width - ((pag - 1 * 55 + 100) > 0)) {
                tmp = (Math.round(wnd.width) - (pag - 1 * 55 + 100));
            } else {
                tmp = 0;
            }
        }
        return tmp;
    }).extend({ deferred: true });
    //****************************************************
    // Submenu for selection Add/Remove of persons in Timetable
    //Get List of changes
    self.TimetableChanges = function () {
        const Del = [];
        const Add = [];
        self.userList1().forEach((dat) => {
            // Get list of pearson not existed in self.personsALL() and add it
            let find = false;
            ko.utils.arrayForEach(self.persDbview(), function (item) {
                if (item.id === dat.Id()) {
                    find = true;
                }
            })
            if (!find) {
                // add to recordset Timetable by id
                Add.push({ id: dat.Id() });
            }
        });
        self.userList2().forEach((dat) => {
            // Get list of pearson not existed in self.personsALL() and add it            
            ko.utils.arrayForEach(self.persDbview(), function (item) {
                if (item.id === dat.Id()) {
                    Del.push({ id: dat.Id() });
                }
            })
        });
        const curTBL = self.Current_timetable()
        //console.log(JSON.stringify(Add));
        //console.log(JSON.stringify(Del));
        self.set_Updt_time()
        if ( Add.length > 0 ) { self.transaction(self.transaction() + this.AjaxSendMessage({ users: JSON.stringify(Add) }, '/userstimetable?TimetableID=' + curTBL.id(), 'POST')); }
        if ( Del.length > 0 ) { self.transaction(self.transaction() + this.AjaxSendMessage({ users: JSON.stringify(Del) }, '/userstimetable?TimetableID=' + curTBL.id(), 'DELETE')); }
        setTimeout(async function () {
            viewModel.get_recrdset(false);
        }, 500);

    }
    // List of persons active in Tmetable
    self.userList1 = ko.observableArray([]).extend({ deferred: true });;
    // List of persons not present in Selected Timetable
    self.userList2 = ko.observableArray([]).extend({ deferred: true });;
    self.actingOnThings = ko.observable(false);
    self.canSort = ko.observable(true);
    // Formating fields as disable when belongs to Hrnest source
    self.setOptionDisable = function (option, item) {
        ko.applyBindingsToNode(option, { disable: item.id !== '' }, item);
    }
    // Fill lists of pearsons in menu item form / parameter data work_group ID
    self.FillLists = function () {        
        // Find persons in Timetable by ID {this.personsALL}
        if ( self.personsALL().length > 0 ) {
            self.userList1.removeAll();
            self.userList2.removeAll();
            self.personsALL().forEach((dat) => {
                let find = false
                ko.utils.arrayForEach(self.persDbview(), function (item) {
                    if (item.id === dat.Id()) {
                        self.userList1().push(dat);
                        find = true
                    }
                });
                if (!find) {
                    self.userList2().push(dat);
                }
            });
            // If list op persons in tmetable exist select first element
            if ( self.userList1().length > 0 ) {
                self.userList1()[0].Selected(true);
            } else {
                if ( self.userList2().length > 0 ) {
                    self.userList2()[0].Selected(true);
                }
            }
            self.userList1.valueHasMutated();
            self.userList2.valueHasMutated();
        }
    };
    // filter atributes in add/remove persons from timetable
    self.enableFilter1 = ko.observable(false);
    self.enableFilter2 = ko.observable(false);
    self.Filter1 = ko.observable({
        id: ko.observable(-100),
        name: ko.observable(''),
        description: ko.observable(''),
        leader: ko.observable('')
    });
    self.Filter2 = ko.observable({
        id: ko.observable(-100),
        name: ko.observable(''),
        description: ko.observable(''),
        leader: ko.observable('')
    });
    self.Filtered2 = ko.computed(function () {        
        if ( self.enableFilter2() && self.userList2().length>0 ) {
            const Tmpfil = self.Filter2();
            ko.utils.arrayForEach( self.userList2(), function ( item )
            {
                if ( ko.isObservable( item[ 'default_wrkgroup' ] ) ) {
                    item[ 'inView' ]( item[ 'default_wrkgroup' ]() === Tmpfil.id() ? true : false);
                } else {
                    item[ 'inView' ]( item[ 'default_wrkgroup' ] === Tmpfil.id() ? true : false );
                }
                item[ 'Selected' ]( false )
            })
        } else {
            ko.utils.arrayForEach( self.userList2(), function ( item )
            {
                item ['inView'](true);
            })
        }       
    });
    self.Filtered1 = ko.computed( function ()
    {
        if ( self.enableFilter1() && self.userList1().length > 0 ) {
            const Tmpfil = self.Filter1();
            ko.utils.arrayForEach( self.userList1(), function ( item )
            {
                if ( ko.isObservable( item[ 'default_wrkgroup' ] ) ) {
                    item[ 'inView' ]( item[ 'default_wrkgroup' ]() === Tmpfil.id() ? true : false );
                } else {
                    item[ 'inView' ]( item[ 'default_wrkgroup' ] === Tmpfil.id() ? true : false );
                }
                item[ 'Selected' ]( false )
            } )
        } else {
            ko.utils.arrayForEach( self.userList1(), function ( item )
            {
                item[ 'inView' ]( true );
            } )
        }
    });
    self.multiSortableOptions = {
        revert: 10,
        tolerance: "pointer",
        distance: 20,
        stop: function () {
            if (self.$selected) {
                self.$selected.fadeIn(10);
            }
        },
        helper: function (event, $item) {
            // probably a better way to pass these around than in id attributes, but it works
            const dbId = $item.parent().attr('id').split('_')[1],
                itemId = $item.attr('id').split('_')[1],
                db = viewModel['userList' + dbId];
            // If you grab an unhighlighted item to drag, then deselect (unhighlight) everything else
            if (!$item.hasClass('selected')) {
                ko.utils.arrayForEach(db(), function (item) {
                    //needs to be like this for string coercion
                    item.Selected(item.Id === itemId);
                });
            }
            // Create a helper object with all currently selected items
            let $selected = $item.parent().find('.selected');
            let $helper;
            if ($selected.size() > 1) {
                $helper = $('<li class="item selected">You have ' + $selected.size() + ' items selected.</li>');
                $selected.fadeOut(10);
                $selected.removeClass('selected');
            } else {
                $helper = $selected;
            }
            self.$selected = $selected;

            return $helper;
        }
    };
    self.moveTheseTo = function (items, from, to, atPosition) {
        self.actingOnThings(true);
        const copyFunction = function () {
            let newArgs = [atPosition, 0].concat(items);
            ko.utils.arrayForEach(to, function (item) {
                item.Selected(false);
            });
            ko.utils.arrayForEach(items, function (item) {
                from.remove(item);
            });
            to.splice.apply(to, newArgs);
            self.actingOnThings(false);
        }
        if (items.length > 300) {
            setTimeout(copyFunction, 100);
        } else {
            copyFunction();
        }
    };
    self.selectAllItemsIn = function (list) {
        ko.utils.arrayForEach( list(), function ( item )
        {
            if ( item[ 'inView' ]() ) {
                item.Selected( true );
            }            
        });
    };
    self.moveAllFunction = function (from, to) {
        return function () {
            const items = ko.utils.arrayFilter(from(), function (item) {
                return item.Selected();
            });
            self.moveTheseTo(items, from, to, to.length);
        };
    };
    self.beforeMove = function (args, event, ui) {
        if (
            args.sourceParent === args.targetParent
            && args.targetPosition === args.sourcePosition
        ) {
            self.$selected.fadeIn(500);
            return;
        }
        event.cancelDrop = true;
    };
    self.afterMove = function (args, event, ui) {
        const items = ko.utils.arrayFilter(args.sourceParent, function (item) {
            return item.Selected();
        });
        self.moveTheseTo(items, args.sourceParent, args.targetParent, args.targetIndex);
        args.item.Selected(true);
    };
    self.selectProcedure = function (array, $data, event) {
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
            $data.Selected(true);
            ko.utils.arrayForEach(array, function (item) {
                if (item !== $data) {
                    item.Selected(false);
                }
            });
        } else if (event.shiftKey && !event.ctrlKey && self._lastSelectedIndex > -1) {
            const myIndex = array.indexOf($data);
            if (myIndex > self._lastSelectedIndex) {
                for (let i = self._lastSelectedIndex; i <= myIndex; i++) {
                    array[i].Selected(array[i].inView());
                }
            } else if (myIndex < self._lastSelectedIndex) {
                for (let i = myIndex; i <= self._lastSelectedIndex; i++) {                   
                        array[i].Selected(array[i].inView());
                }
            }

        } else if (event.ctrlKey && !event.shiftKey) {
            $data.Selected(!$data.Selected());
        }
        self._lastSelectedIndex = array.indexOf($data);
    };
    //****************************************************
    // Initialize     
    this.get_dat();
};

    //****************************************************
    // ko.bindingHandlers for HTML View
    //Menu item for elements on header and fotter Table
ko.bindingHandlers.contMenuP = {
    init: function (element, valueAccessor, allBindings, viewModell) {
        const options = valueAccessor();
        $(element).contextmenu(function (data) {            
                setTimeout(async function () {
                    viewModel.CurrFilterP('');
                    viewModel.CurrentFieldAttrP( options.name )
                    ko.utils.arrayForEach( viewModel.filterArrP(), function ( item )
                    {
                        if ( item.col === options.name ) {
                            viewModel.CurrFilterP( item.val );
                        }
                    } )
                    viewModel.OpenMenuTheadP(data);
                }, 0);            
            data.preventDefault();
            return false;
        });
    }
};
ko.bindingHandlers.contMenu = {
    init: function (element, valueAccessor, allBindings, viewModell) {
        const options = valueAccessor();
        $(element).contextmenu(function (data) {
            if (options.Type !== 'Day') {
                setTimeout(async function () {
                    viewModel.CurrFilter('');
                    viewModel.CurrentFieldAttr( options.Date_Value )
                    ko.utils.arrayForEach( viewModel.filterArr(), function ( item )
                    {
                        if ( item.col === options.Date_Value ) {
                            viewModel.CurrFilter(item.val)
                        }
                    })                   
                    viewModel.OpenMenuThead(data);
                }, 0);
            }
            data.preventDefault();
            return false;
        });
    }
};

ko.bindingHandlers.conPersBody = {
    init: function (element, valueAccessor, allBindings, viewModell) {
        const options = valueAccessor();
        $(element).contextmenu(function (data) {
            setTimeout(async function () {
                viewModel.CurrRow(options.uid())
                viewModel.OpenMenuBodyP(data);                
            }, 0);
            data.preventDefault();
            return false;
        });
    }
};
// Binding for context Menu on Table Body
ko.bindingHandlers.contMenuBody = {
    init: function (element, valueAccessor, allBindings, viewModell) {
        const options = valueAccessor();
        $(element).contextmenu(function (data) {
            setTimeout(async function () {
                viewModel.CurrRow(options.guid)
                viewModel.OpenMenuBody(data);
            }, 0);
            data.preventDefault();
            return false;
        });
    }
};
// Set resizible columns for not 'Day' type
ko.bindingHandlers.resizable = {
    init: function (element, valueAccessor) {
        const options = valueAccessor();
        if (options.Type !== 'Day') {
            $(element).resizable({
                resize: function (event, ui) {
                    options.w(ui.size.width);
                }
            });
        }
    }
};

// Visibility of horizontal
ko.bindingHandlers.hinview = {
    update: function ( element, valueAccessor, allBindings, vm, bindingContext )
    {
        const start = bindingContext.$root.scrollLeftS();
        const end = bindingContext.$root.scrollLeftE();
        const scroll = bindingContext.$root.OnScroll();
        const $data = valueAccessor();
        const nmber = bindingContext.$index();
        const set_var = nmber >= start && nmber <= end + 6
        if ( scroll === true && set_var === true && set_var !== $data.inView() ) {
            $data.inView( set_var )
        } else if ( scroll === false && set_var !== $data.inView() ) {
            $data.inView( set_var )
        }
    }
}

// Visibility of vertical
ko.bindingHandlers.vinview = {
    update: function ( element, valueAccessor, allBindings, vm, bindingContext )
    {
        const start = bindingContext.$root.scrollTopS();
        const end = bindingContext.$root.scrollTopE();
        const scroll = bindingContext.$root.OnScroll();
        const $data = valueAccessor();
        const nmber = bindingContext.$index();
        const set_var = nmber >= start - 5 && nmber <= end + 5
        if ( scroll === true && set_var === true && set_var !== $data.inView() ) {
            $data.inView( set_var )
        } else if ( scroll === false && set_var !== $data.inView() ) {
            $data.inView( set_var )
        }
    }
}

// Set visibility of DOM elemets
ko.bindingHandlers.inview = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        const $data = valueAccessor();
        $(element).bind('inview', function (e, isInView, visiblePartX, visiblePartY) {
            setTimeout(async () => {
                if ($data.inView() !== isInView) {
                    $data.inView(isInView);
                }
            }, 0);
        });
    }
};
// Bindings for resize window
ko.bindingHandlers.winsize = {
    init: function (element, valueAccessor) {
        const vax = valueAccessor();
        vax({ width: width(), height: height() });
    }
}

//control visibility, give element focus, and select the contents (in order)
ko.bindingHandlers.visibleAndSelect = {
    update: function (element, valueAccessor) {
        ko.bindingHandlers.visible.update(element, valueAccessor);
        if (valueAccessor()) {
            setTimeout(function () {
                $(element).find("input").focus().select();
            }, 0); //new tasks are not in DOM yet
        }
    }
};



function run_scroll() {
    viewModel.windowSize( { width: width(), height: height() } );
    const scrollTb = document.querySelector( "#table-scroll" );
    const lenModel = viewModel.pagedRows().length    
    viewModel.scrollTopE( parseInt( ( ( scrollTb.scrollTop + scrollTb.clientHeight ) / scrollTb.scrollHeight ) * lenModel ) )
    viewModel.scrollTopS( parseInt( ( scrollTb.scrollTop / scrollTb.scrollHeight ) * lenModel ) )    
    const pag = viewModel.LimitTable_Name_Fields().length;
    //const vlenModel = ( pag - 1 * 55 + 100 )
    viewModel.scrollLeftE( parseInt( ( ( scrollTb.scrollLeft + scrollTb.clientWidth ) / scrollTb.scrollWidth ) * pag ) )
    viewModel.scrollLeftS( parseInt( ( scrollTb.scrollLeft / scrollTb.scrollWidth ) * pag ) )
    //setTimeout(() => {
    //    $(window).scroll();
    //}, 0);
};

window.addEventListener( 'resize', run_scroll );

function onScrollHandler (params)
{
    const { onStart, onStop, timeout = 500 } = params
    let timer = null

    return ( event ) =>
    {
        if ( timer ) {
            clearTimeout( timer )
        } else {
            onStart && onStart( event )
        }
        timer = setTimeout( () =>
        {
            timer = null
            onStop && onStop( event )
        }, timeout )
    }
}
//window.addEventListener('click', clickHandlerThead);
//**
// * author Remy Sharp
//* url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
// 
// Some elements addet by me (triger for vertical visibility)
//(function ($) {
//    async function getViewportHeight() {
//        //let height = window.innerHeight; // Safari, Opera
//        let width = window.innerWidth;
//        let mode = document.compatMode;
//
//        if ((mode || !$.support.boxModel)) { // IE, Gecko
//            //height = (mode === 'CSS1Compat') ?
//            //    document.documentElement.clientHeight : // Standards
//            //    document.body.clientHeight; // Quirks
//            width = (mode === 'CSS1Compat') ?
//                document.documentElement.clientWidth : // Standards
//                document.body.clientWidth; // Quirks
//        }
//        return { height, width };
//    }
//    $(window).scroll(async function () {
//        let vpH = await getViewportHeight(),
//            //scrolltop = (document.documentElement.scrollTop ?
//            //    document.documentElement.scrollTop :
//            //    document.body.scrollTop),
//            scrollLeft = (document.documentElement.scrollLeft ?
//                document.documentElement.scrollLeft :
//                document.body.scrollLeft),
//            elems = [];
//        // naughty, but this is how it knows which elements to check for
//        $.each($.cache, async function () {
//            if (this.events && this.events.inview) {
//                elems.push(this.handle.elem);
//            }
//        });
//        if ( elems.length > 0 ) {
//            $(elems).each(async function () {
//                let $el = $(this),
//                    //top = $el.offset().top,
//                    left = $el.offset().left,
//                    //height = $el.height(),
//                    width = $el.width(),
//                    inview = $el.data( 'inview' ) || false;
//
//                //if (scrolltop > (top + height) || scrolltop + vpH.height < top || scrollLeft + vpH.width < (left) || scrollLeft > (left + width)) {
//                if (scrollLeft + vpH.width < (left) || scrollLeft > (left + width)) {
//                    if (inview) {
//                        $el.data('inview', false);
//                        $el.trigger('inview', [false]);
//                    }
//                //} else if (scrolltop < (top + height) & (scrollLeft < (left + width))) {
//               } else if (scrollLeft < (left + width)) {
//                    if (!inview) {
//                        $el.data('inview', true);
//                        $el.trigger('inview', [true]);
//                    }
//                }
//            });
//        }
//    });
//
//    // kick the event to pick up any elements already in view.
//    // note however, this only works if the plugin is included after the elements are bound to 'inview'
//    $(function () {
//        $(window).scroll();
//    });
//})(jQuery);

//****************************************************************
//DoCument ready Run KO
let viewModel;
let socket;
// Event on Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    let namespace = ''
    // Initialize Socket connetion
    socket = io(namespace);
    setTimeout(async function () {
        socket.on('connect', function () {
            socket.emit('my_event', { data: 'Connected to the SocketServer...' });
        })
    }, 10);
    // Set Notify component
    $.notify.addStyle('happyblue', {
        html: "<div><span data-notify-text/></div>",
        classes: {
            base: {
                "white-space": "nowrap",
                "background-color": "lightblue",
                "padding": "5px"
            },
            superblue: {
                "color": "white",
                "background-color": "blue"
            }
        }
    });
    ko.options.deferUpdates = true;
    viewModel = new vModel;    
    ko.applyBindings( viewModel );
    
    $("#tabs").tabs({
        activate: function (event, ui) {
            const selected = ui.newTab.index();
            // Set Data_type => Timetable or Draft
            if (selected === 0) {
                viewModel.TMPData_Type('Timetable');
                viewModel.get_timetables();
            } else {
                viewModel.TMPData_Type('Draft');
                viewModel.get_timetables();
            }
            viewModel.TMPCreateDraft(selected === 2);
        }
    });
    // Event for proper working ko.bindingshandler.inView
    const scrollTbl = document.querySelector( "#table-scroll" );    
    scrollTbl.addEventListener( "scroll", onScrollHandler( {
        onStart: ( event ) =>
        {
            viewModel.OnScroll( true )
            const lenModel = viewModel.pagedRows().length
            viewModel.scrollTopE( parseInt( ( ( scrollTbl.scrollTop + scrollTbl.clientHeight ) / scrollTbl.scrollHeight ) * lenModel ) )
            viewModel.scrollTopS( parseInt( ( scrollTbl.scrollTop / scrollTbl.scrollHeight ) * lenModel ) )
            const pag = viewModel.LimitTable_Name_Fields().length;
            //const vlenModel = ( pag - 1 * 55 + 100 )
            viewModel.scrollLeftE( parseInt( ( ( scrollTbl.scrollLeft + scrollTbl.clientWidth ) / scrollTbl.scrollWidth ) * pag ) )
            viewModel.scrollLeftS( parseInt( ( scrollTbl.scrollLeft / scrollTbl.scrollWidth ) * pag ) )
        },
        onStop: ( event ) =>
        {
            viewModel.OnScroll(false)
            const lenModel = viewModel.pagedRows().length            
            viewModel.scrollTopE( parseInt( ( ( scrollTbl.scrollTop + scrollTbl.clientHeight ) / scrollTbl.scrollHeight ) * lenModel ) )
            viewModel.scrollTopS( parseInt( ( scrollTbl.scrollTop / scrollTbl.scrollHeight ) * lenModel ) )            
            const pag = viewModel.LimitTable_Name_Fields().length;
            //const vlenModel = ( pag - 1 * 55 + 100 )
            viewModel.scrollLeftE( parseInt( ( ( scrollTbl.scrollLeft + scrollTbl.clientWidth ) / scrollTbl.scrollWidth ) * pag ) )
            viewModel.scrollLeftS( parseInt( ( scrollTbl.scrollLeft / scrollTbl.scrollWidth ) * pag ) )
            //$( window ).scroll();


        }
    }, { passive: true } ));

    
    //add a new style 'foo'
    $.notify.addStyle('foo', {
        html:
            "<div>" +
            "<div class='clearfix'>" +
            "<div class='title' data-notify-html='title'/>" +
            "<div class='buttons'>" +
            "<button class='no'>Cancel</button>" +
            "<button class='yes' data-notify-text='button'></button>" +
            "</div>" +
            "</div>" +
            "</div>"
    });
    $.notify.addStyle('exchange', {
        html:
            "<div>" +
            "<div class='clearfix'>" +
            "<div class='title' data-notify-html='title'/>" +           
            "</div>" +
            "</div>"
    });
    //listen for click events from this style
    $(document).on('click', '.notifyjs-foo-base .no', function () {
        viewModel.NotifyErrMsg(false);
        //programmatically trigger propogating hide event
        $(this).trigger('notify-hide');
    });
    $(document).on('click', '.notifyjs-foo-base .yes', function () {
        //show button text
        $("#replaced-form").modal("show");
        //hide notification
        $(this).trigger('notify-hide');
    });
    //************************************************************
    // Socket IO events methods
    socket.on( "disconnect", ( reason ) =>
    {
        if ( reason === "io server disconnect" ) {
            // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
        }
        // else the socket will automatically try to reconnect
    } );
    socket.on('checkTimetable_List', function (msg) {
        if (msg.data !== 'No changes') {
            viewModel.get_timetables();
        }
    });
    socket.on('UsersTimetableDelete', function (data) {
        //Signal for delete some persons from timetable
    } );
    socket.on( 'DataRangeExchange', function ( msg )
    {
        if ( viewModel.Current_timetable() !== undefined ) {
            if ( viewModel.transaction().indexOf( msg.data.guid ) > -1 && msg.data.type === 'Enumerable' ) {
                if ( msg.data.DataExchange === 'Ended' ) {
                    viewModel.SaveREQ()
                } else if ( msg.data.DataExchange === 'Work' ) {
                    $.notify( `Check Timetables in Range ${ msg.data.dateFrom } to ${ msg.data.dateTo } Progress => ${ msg.data.percent }%`, "info", { position: "bottom right" } );
                }                
            }
        }
    } )
    socket.on( 'Integrity Persons in Timetable', function ( msg )
    {
        if ( viewModel.Current_timetable() !== undefined ) {
            if ( msg.data.Check === 'Changes Done' || msg.data.Check === 'No changes' || msg.data.Check === 'Ready' ) {
                const curTBL = viewModel.Current_multiTimetables() ? viewModel.CurrentselectedItemsId() : viewModel.Current_timetable().id();
                if ( curTBL !== undefined ) {
                    if ( ( !viewModel.Current_multiTimetables() && parseInt( msg.data.TimetableID ) === curTBL ) || ( viewModel.Current_multiTimetables() && curTBL.indexOf( msg.data.TimetableID ) > -1 ) && viewModel.transaction().indexOf( msg.data.guid ) > -1 ) {

                        if ( !viewModel.Current_multiTimetables() && ( msg.data.Check === 'Changes Done' || msg.data.Check === 'No changes' ) ) {
                            viewModel.get_workgroups( false );
                            viewModel.check_Dataset_progress( false );
                            viewModel.Start_refr( false );
                        } else {
                            if ( msg.data.Check === 'Changes Done' || msg.data.Check === 'No changes' ) {
                                viewModel.refrTabCount( viewModel.refrTabCount() + 1 )
                                if ( curTBL.split( ',' ).length === viewModel.refrTabCount() ) {
                                    viewModel.get_workgroups( false );
                                    viewModel.check_Dataset_progress( false );
                                    viewModel.Start_refr( false );
                                }
                            }
                        }
                    } else {
                        if ( msg.data.Check === 'Changes Done' ) {
                            // check date ranges of present timetable and emited ID
                            const cnt = ko.utils.arrayFilter( viewModel.TimetabList(), function ( itm )
                            {
                                return itm.id() === parseInt( msg.data.TimetableID )
                            } );
                            if ( cnt.length > 0 ) {
                                const _curTBL = viewModel.Current_timetable();
                                const cntFrom = stringToDate( cnt[ 0 ].date_from(), "yyyy-mm-dd", "-" );
                                const cntTo = stringToDate( cnt[ 0 ].date_to(), "yyyy-mm-dd", "-" );
                                if ( dates.inRange( stringToDate( _curTBL.date_from(), "yyyy-mm-dd", "-" ), cntFrom, cntTo ) || dates.inRange( stringToDate( _curTBL.date_to(), "yyyy-mm-dd", "-" ), cntFrom, cntTo ) ) {
                                    viewModel.get_FN_byTimetableID();
                                    viewModel.get_ERR_Duplicates_PersbyTimetable();
                                    viewModel.get_ERR_Duplicates_PersbyTimetableALL();
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    socket.on('UsersTimetableModified', function (msg) {
        //new transaction on recordset check if data are modified in present
        const curTBL = viewModel.Current_timetable();
        if ( curTBL !== undefined) {
            if (!viewModel.check_Dataset_progress()) {
                if (parseInt(msg.data.TimetableID) === curTBL.id()) {
                    if (viewModel.message !== 'Busy') {
                        viewModel.updateSelectedComp( msg.data.users );                        
                        setTimeout( async function ()
                        {
                            if ( viewModel.Data_Type() !== 'Timetable' ) {
                                viewModel.get_FN_byTimetableID();
                                viewModel.get_ERR_Duplicates_PersbyTimetable();
                                viewModel.get_ERR_Duplicates_PersbyTimetableALL();

                            }
                            const usr = new Set(msg.data.users.map((a) => a.full_name));
                            if (viewModel.transaction().indexOf(msg.data.guid) < 0) {
                                $.notify("Changes made by another user refreshed on this page => " + Array.from(usr).join('; '), "info", {
                                    position: "bottom right",
                                    autoHide: true,
                                    autoHideDelay: 2000,
                                });
                            } else {
                                hideLoader();
                                $.notify("Your Changes Successfully saved on server => " + Array.from(usr).join('; '), "info", {
                                    position: "bottom right",
                                    autoHide: true,
                                    autoHideDelay: 2000,
                                });
                            }
                        }, 0);
                    }
                }
            }
        }
    });
    socket.on('UserDel', function (msg) {
        msg.data.user.forEach((item) => {
            // delete user after signal if exist in timetable
            if (typeof item.id !== 'undefined') {
                if (viewModel.check_idExist(item.id) > -1) {
                    viewModel.removeID(item.id);
                }
            }
        })
    });
    socket.on('UserMod', function (msg) {
        msg.data.user.forEach((item) => {
            if (typeof item.id !== 'undefined') {
                if (viewModel.check_idExist(item.id) > -1) {
                    viewModel.get_recordset_One(item.id);
                }
            }
        })
    } );
    socket.on( 'SaveOnHRNEST', function ( msg )
    {
        if ( viewModel.Current_timetable() !== undefined ) {
            const curTBL = viewModel.Current_multiTimetables() ? viewModel.CurrentselectedItemsHrnestId() : viewModel.Current_timetable().hrnest_id();
            if ( typeof curTBL !== 'undefined' ) {
                if ( ( !viewModel.Current_multiTimetables() && parseInt( msg.data.TimetableID ) === curTBL ) || ( viewModel.Current_multiTimetables() && curTBL.indexOf( msg.data.TimetableID ) > -1 ) ) {
                    if ( msg.data.DataExchange === 'Started' ) {
                        if ( !viewModel.dataExchange() ) {
                            viewModel.Notify_Exchange_SHOW()
                            viewModel.dataExchange( true );
                        }
                        $.notify( `Saving data on Hrnest => ${ msg.data.Percentage }% Changed ${ msg.data.Changed } Of ${ msg.data.AllSet } `, "info", { position: "right bottom" } );
                    } else {
                        viewModel.Notify_Exchange_HIDE()
                        viewModel.dataExchange( false );
                        $.notify( `End Saving data on Hrnest => ${ msg.data.Percentage }% Changed ${ msg.data.Changed } Of ${ msg.data.AllSet } `, "success", { position: "right bottom" } );
                        //const timId = viewModel.Current_timetable();                        
                        //socket.emit( 'Check_Range', {
                        //    Dataset: 'Range', dateFrom: timId.date_from(), dateTo: timId.date_to(), Trans: '', type: 'After Save'
                        //} );
                        //viewModel.get_AllRequest( true );
                        //viewModel.get_FN_byTimetableID();
                        //viewModel.get_ERR_Duplicates_PersbyTimetable();
                        //viewModel.get_ERR_Duplicates_PersbyTimetableALL();
                    }
                };
            }
        }
    } );
    setInterval( function ()
    {
        if ( viewModel.dataExchangeCount() > 0 && Math.round( ( Now_Date() - viewModel.lastTimeExchange() ) / 60000 ) > 3 ) {
            viewModel.dataExchangeCount( 0 );
            viewModel.Notify_Exchange_HIDE();
            viewModel.dataExchange( false );
        }
    }, 36000 );
    socket.on('DataExchange', function (msg) {
        const curTBL = viewModel.Current_timetable();
        const DTo = stringToDate(msg.data.dateTo, "yyyy-mm-dd", "-");
        const DFr = stringToDate(msg.data.dateFrom, "yyyy-mm-dd", "-");
        if (typeof curTBL !== 'undefined') {
            if ('date_from' in curTBL) {
                if (dates.inRange(stringToDate(curTBL.date_from(), "yyyy-mm-dd", "-"), DFr, DTo) || dates.inRange(stringToDate(curTBL.date_to(), "yyyy-mm-dd", "-"), DFr, DTo)) {
                    if (msg.data.DataExchange === 'Started') {
                        viewModel.dataExchangeCount(viewModel.dataExchangeCount() + 1);
                        if (!viewModel.dataExchange()) {
                            viewModel.Notify_Exchange_SHOW()
                            viewModel.dataExchange(true);                            
                        }
                    } else {
                        if ( viewModel.dataExchangeCount() > 0 ) {
                            viewModel.lastTimeExchange( Now_Date())
                            viewModel.dataExchangeCount( viewModel.dataExchangeCount() - 1 );
                            if ( viewModel.dataExchangeCount() === 0 ) {
                                viewModel.Notify_Exchange_HIDE()
                                viewModel.dataExchange( false );
                            }
                        } else {                        
                            viewModel.Notify_Exchange_HIDE()
                            viewModel.dataExchange(false);
                        }
                    }
                };
            }
        }
    });
    socket.on('AccesToTimetable', function (msg) {
        // Signal about credentials in www => check if is informations are sendet about present timetableID
        const curTBL = viewModel.Current_timetable();
        if ( curTBL !== undefined) {
            if ( curTBL.hrnest_id() !== undefined) {
                if (msg.data.hrnest_id === curTBL.hrnest_id()) {
                    viewModel.credentials(msg.data.credentials);
                    setTimeout(async function () {
                        if (viewModel.transaction().indexOf(msg.data.guid) > 0) {
                            if (msg.data.credentials) {
                                $.notify("Authentication in the server is Correct", "success", { position: "bottom right" });
                            } else {
                                $.notify("Before saving data on the web , \n you will need to enter the correct for this Timetable Credentials (user_name and password) ", "warn", {
                                    position: "bottom right",
                                    autoHide: false,
                                    clickToHide: false
                                });
                                $.notify("Authentication on the server is insufficient for saving Timetable data on the Hrnest website", "warn", {
                                    position: "bottom right",
                                    autoHide: false,
                                    clickToHide: false
                                });
                            }
                        }
                        viewModel.get_AllRequest(false);
                    }, 0);
                }
            }
        }
    });
});
// widget to disable error from jquery ui about focussable
$.widget("ui.dialog", $.ui.dialog, {
    _allowInteraction: function (event) {
        return true;
    }
});
//****************************************************************
// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript
// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
};
// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
    const date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
};
