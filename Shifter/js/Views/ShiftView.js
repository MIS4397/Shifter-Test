var ShiftView = (function($, Backbone, _, ShiftCollection , Store){
    
    
    //Represents each individual shift item within the view
    //and handles the functionality of each item. 
    var ShiftItemView = Backbone.View.extend({
        tagName: "li",   //ShiftItemView isn't attached to anything so will use this to create a html element
       className:"shiftItem",
       events:{
           "click li": "acceptShift"
       },
       initialize: function(){
           _.bindAll(this, 'render', 'unrender', 'remove', 'acceptShift');
           if(typeof(this.model) === 'undefined'){
               throw new Error("Model must be defined in ShiftItemView");
           }
           
           //This... just is bad. But is a "quick fix" to enable what we want to do
           this.scheduleStore = this.options.scheduleStore;
           //if i'm not mistaken remove is a event that backbone propagates.
           this.model.bind("remove", this.unrender);
       },
       render:function(){
           //Eventually want to hook this up to templates. But _ 's template engine doesn't work well. 
           var html = [],
               start = this.model.get('startTime'),
               end = this.model.get('endTime');
           html.push("<li>");
           html.push(this.model.id + " <br />");
           html.push((start.getMonth() + 1) + " / " + start.getDate() + " / "  + start.getFullYear() + " <br />");
           html.push(start.getHours() +":" + start.getMinutes() + " - "  + end.getHours() +":" + end.getMinutes() + " <br />");
           html.push("</li>");
           this.$el.append(html.join(""));
           return this; //here for chainabe calls
       },
       unrender: function(){
            this.$el.remove();
       },
       remove: function(){
           this.model.destroy(); //Heyo! a new test~
       },
       acceptShift: function(){
           console.log("pressed accept Shift" + this.model.get('startTime'));
           this.scheduleStore.create(this.model);
           this.remove();
           
           //bring up dialog
           
           //send a delete message to localSTorage
       }
    });
    
    
    return Backbone.View.extend({
        el: "#shiftList", //this should be the element that the view is "attached" to
        initialize:function(){
            _.bindAll(this, 'render', 'appendNewShift'); //precaution to make sure that all of the view's this points to the view.
            //If collection isn't passed in create a new one]
            //options is needed to access anything that was passed in via an object
            if(!this.options.collection){
                this.collection = new ShiftCollection([],{localStorage: this.options.localStore});
            }
            
            //Another "quick fix" solution that is going to bite me in the ass.
            //Send in the schedule store so we can "update" the store with the shift that will be removed form here.
            this.scheduleStore = this.options.scheduleStore;
            console.log("in shift store, schedule store is "+this.scheduleStore);
            console.log(this.scheduleStore);
            
            this.firstLoad = true;
        },
        fetchData: function(){
            this.collection.fetch();
        },
        render: function(){     //Clears the html and then redoes it.
            //clears the page
            this.unrender();
            
            //render existing collection
            _.each(this.collection.models, function(shift){
                this.appendNewShift(shift);
            }, this); //beaware need to send in this or else this inside the callback will be off.
           
           //This is here because listview('refresh') dosen't ike to be called on first pass
           //so the first time this gets called we do nothing.
           if(this.firstLoad){
               this.firstLoad = false;
           }else{
               this.$el.listview('refresh');    //tells jquery mobile to refresh the page
           }
        },
        unrender: function(){
            this.$el.empty();
        },
        //appendNewShift is trigged by the collection's add event and handles the html update
        appendNewShift: function(shift){
            var itemView = new ShiftItemView({model:shift, scheduleStore:this.scheduleStore});
            this.$el.append(itemView.render().el);
        }
    });
})($, Backbone, _ , ShiftCollection , Store ); //wrapper function