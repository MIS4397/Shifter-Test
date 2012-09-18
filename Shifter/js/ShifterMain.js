
//So I feel like commenting at the moment.

//The below is a self executing wrapper that mimics import statments in other languages.
//The passed in variables represent namespaces that are used in the below code.
;



(function($, Backbone, _ , ScheduleView, Store, ScheduleSimulatorView, ShiftView, ShiftSimulatorView){
    
    //This should be stated as a bug worked on. but if you don't create a shared localstore
    //then you can't update it using the simulator and get new stuff with your collection

    var scheduleStore = new Store("scheduleStore"),
        shiftStore = new Store("shiftStore"),
        scheduleView = new ScheduleView({localStore:scheduleStore}),
        scheduleSimulatorView = new ScheduleSimulatorView({localStore:scheduleStore}),
        shiftSimulatorView = new ShiftSimulatorView({localStore: shiftStore}),
        shiftView = new ShiftView({localStore:shiftStore, scheduleStore:scheduleStore});

    
    //code handles the page change events
    //if something is suppose to happen before a page is either loaded or swapped to do it here.

$(document).bind('pagebeforechange', function(event, data){
    if(typeof(data.toPage) ==="string"){
        
        switch($.mobile.path.parseUrl(data.toPage).hash){
        case "#shiftPage":
        //Warning odd bug.
        //since this is the main page, on first load this is never called.
        //because of which you see nothing if there is data.
        //and because of which you see unformatted data on the "first load"
        //of the page.
            shiftView.fetchData();
            shiftView.render();
            break;
            
       case "#schedulePage":
            scheduleView.fetchData();
            scheduleView.render();
            break;
       case "#simulatorPage":
            break;
            
       default:
            console.log("couldnt find hash");
            break;
        }//URL Switch
    }//if URL
});//beforepagechage handler
        
})(jQuery, Backbone, _ , ScheduleView , Store , ScheduleSimulatorView, ShiftView, ShiftSimulatorView ); //wrapper code