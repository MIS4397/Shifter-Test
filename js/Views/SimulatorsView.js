var ScheduleSimulatorView = (function( Backbone,_ ,  Store, Shift){
    return Backbone.View.extend({
        el:"#scheduleSimulatorPanel",
        events:{
            "click button#generateSchedule" : "generateSchedule",
            "click button#killScheduleStore" : "killStore"
        },
        initialize:function(){
            _.bindAll(this, 'generateSchedule', 'killStore');
            
            if(!this.options.localStore){
                throw new Error("a localStore must be provided to ScheduleSimulatorView ");
            }
            this.localStore = this.options.localStore;
            
        },
        generateSchedule: function(){
            this.killStore();
            
            var currentTime = new Date(),
                startHour = 7,
                endHour = 15,
                startTime,
                endTime;
            
            for(count = 10; count > 0; --count){
                startTime = new Date();
                startTime.setDate(currentTime.getDate()+count);
                startTime.setHours(startHour);
                endTime = new Date();
                endTime.setDate(startTime.getDate());
                endTime.setHours(endHour);
                this.localStore.create(new Shift({startTime:startTime, endTime:endTime}));
            }
        },
        killStore: function(){
            //This raised a massive issues. probably good to explain this
            //takes the localstorage and returns an array with each object in it
            //then for each object found we are destorying them.
            //Old code didn't do this via the local store, and did it directly with localstorage
            //which caused the issue. 
            
            this.localStore.killStore();
            _.each(this.localStore.findAll(), function(record){
                this.localStore.destroy(record);
            }, this);
        }
    });
})(Backbone, _ , Store, Shift ); //wrapper function


//Blah this is bad design. But for now i'm keeping it this way.
//But really this is just copy pasted code from above. Really should make it to where
//we throw in the el during creation.

var ShiftSimulatorView = (function( Backbone,_ ,  Store, Shift){
    return Backbone.View.extend({
        el:"#shiftSimulatorPanel",
        events:{
            "click button#generateShifts" : "generateShifts",
            "click button#killShiftStore" : "killStore"
        },
        initialize:function(){
            _.bindAll(this, 'generateShifts' ,'killStore');
            
            if(!this.options.localStore){
                throw new Error("a localStore must be provided to ScheduleSimulatorView ");
            }
            this.localStore = this.options.localStore;
            
        },
        generateShifts: function(){
            this.killStore();
            
            var currentTime = new Date(),
                startHour = 7,
                endHour = 15,
                startTime,
                endTime;
            
            for(count = 10; count > 0; --count){
                startTime = new Date();
                startTime.setDate(currentTime.getDate()+count);
                startTime.setHours(startHour);
                endTime = new Date();
                endTime.setDate(startTime.getDate());
                endTime.setHours(endHour);
                this.localStore.create(new Shift({startTime:startTime, endTime:endTime}));
            }
        },
        killStore: function(){
            //This raised a massive issues. probably good to explain this
            //takes the localstorage and returns an array with each object in it
            //then for each object found we are destorying them.
            //Old code didn't do this via the local store, and did it directly with localstorage
            //which caused the issue. 
            
            this.localStore.killStore();
            _.each(this.localStore.findAll(), function(record){
                this.localStore.destroy(record);
            }, this);
        }
    });
})(Backbone, _ , Store, Shift ); //wrapper function


